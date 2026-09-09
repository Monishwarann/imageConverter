import type { ConversionOptions } from '../../types';
import { jsPDF } from 'jspdf';

/**
 * Convert Image file using Canvas API
 */
export async function convertImage(
  file: File,
  targetFormat: string,
  options: ConversionOptions = {}
): Promise<{ blob: Blob; fileName: string }> {
  const quality = (options.quality ?? 85) / 100;
  const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

  // Handle Image -> PDF
  if (targetFormat.toUpperCase() === 'PDF') {
    return convertImagesToPdf([file], options, `${originalName}.pdf`);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const canvas = document.createElement('canvas');
      let targetWidth = options.width || img.naturalWidth || img.width;
      let targetHeight = options.height || img.naturalHeight || img.height;

      if (options.preserveAspect && options.width && !options.height) {
        const ratio = img.naturalHeight / img.naturalWidth;
        targetHeight = Math.round(options.width * ratio);
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }

      // Handle transparent background for formats like JPG/BMP
      const isOpaqueFormat = ['JPG', 'JPEG', 'BMP'].includes(targetFormat.toUpperCase());
      if (isOpaqueFormat || !options.transparentBackground) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Determine output MIME type
      let mimeType = 'image/png';
      let extension = targetFormat.toLowerCase();

      switch (targetFormat.toUpperCase()) {
        case 'JPG':
        case 'JPEG':
          mimeType = 'image/jpeg';
          extension = 'jpg';
          break;
        case 'WEBP':
          mimeType = 'image/webp';
          break;
        case 'AVIF':
          mimeType = 'image/avif';
          break;
        case 'BMP':
          mimeType = 'image/bmp';
          break;
        case 'ICO':
          mimeType = 'image/x-icon';
          break;
        case 'TIFF':
        case 'TIF':
          mimeType = 'image/png'; // PNG fallback for tiff container if browser canvas doesn't natively export tiff
          extension = 'tiff';
          break;
        default:
          mimeType = 'image/png';
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({
              blob,
              fileName: `${originalName}.${extension}`,
            });
          } else {
            reject(new Error(`Failed to convert image to ${targetFormat}`));
          }
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image file. File may be corrupted or unreadable.'));
    };

    img.src = url;
  });
}

/**
 * Convert array of image files into a single merged PDF document
 */
export async function convertImagesToPdf(
  files: File[],
  options: ConversionOptions = {},
  outputFileName: string = 'converted-images.pdf'
): Promise<{ blob: Blob; fileName: string }> {
  const orientation = options.orientation || 'portrait';
  const format = (options.pageSize?.toLowerCase() as any) || 'a4';

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format,
  });

  const margin = options.margins ?? 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 0; i < files.length; i++) {
    if (i > 0) {
      doc.addPage(format, orientation);
    }

    const file = files[i];
    const dataUrl = await fileToDataUrl(file);

    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const imgDims = await getImageDimensions(dataUrl);
    const imgRatio = imgDims.height / imgDims.width;

    let renderWidth = availableWidth;
    let renderHeight = renderWidth * imgRatio;

    if (renderHeight > availableHeight) {
      renderHeight = availableHeight;
      renderWidth = renderHeight / imgRatio;
    }

    const xPos = margin + (availableWidth - renderWidth) / 2;
    const yPos = margin + (availableHeight - renderHeight) / 2;

    const imgType = file.type.includes('png') ? 'PNG' : 'JPEG';
    doc.addImage(dataUrl, imgType, xPos, yPos, renderWidth, renderHeight);

    // Optional Watermark
    if (options.watermarkText) {
      doc.setFontSize(24);
      doc.setTextColor(200, 200, 200);
      doc.text(options.watermarkText, pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
    }
  }

  const pdfOutput = doc.output('blob');
  return {
    blob: pdfOutput,
    fileName: outputFileName,
  };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}
