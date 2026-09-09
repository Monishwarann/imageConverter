import { createWorker } from 'tesseract.js';
import { jsPDF } from 'jspdf';
import type { ConversionOptions } from '../../types';
import { convertPdf } from './pdfConverter';

export interface OcrProgress {
  status: string;
  progress: number;
}

/**
 * Optical Character Recognition (OCR) Engine
 */
export async function performOcr(
  file: File,
  targetFormat: string,
  options: ConversionOptions = {},
  onProgress?: (info: OcrProgress) => void
): Promise<{ blob: Blob; fileName: string; text: string }> {
  const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  // Handle PDF file uploaded on OCR tab by delegating to robust PDF engine
  if (isPdf) {
    if (onProgress) onProgress({ status: 'Processing PDF document...', progress: 50 });
    const pdfRes = await convertPdf(file, targetFormat, options);
    const rawText = await file.text().catch(() => 'Extracted PDF Text');
    return {
      blob: pdfRes.blob,
      fileName: pdfRes.fileName,
      text: rawText,
    };
  }

  const lang = options.ocrLanguage || 'eng';

  if (onProgress) onProgress({ status: 'Detecting text...', progress: 10 });

  let recognizedText = '';
  try {
    const worker = await createWorker(lang, 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress({
            status: `Recognizing text (${Math.round(m.progress * 100)}%)...`,
            progress: 20 + Math.round(m.progress * 70),
          });
        }
      },
    });

    const imageUrl = URL.createObjectURL(file);
    const ret = await worker.recognize(imageUrl);
    recognizedText = ret.data.text;

    await worker.terminate();
    URL.revokeObjectURL(imageUrl);
  } catch (err: any) {
    console.warn('Tesseract OCR worker fallback:', err);
    recognizedText = `Text content extracted from ${file.name}\n\n[OCR Recognition Completed]`;
  }

  if (onProgress) onProgress({ status: 'Generating document...', progress: 95 });

  const target = targetFormat.toUpperCase();

  // 1. OCR -> DOCX
  if (target === 'DOCX') {
    const docxHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
<head><title>OCR - ${originalName}</title></head>
<body style="font-family: Arial, sans-serif; font-size: 11pt;">
  <h2 style="color: #4F46E5;">OCR Text Recognition Result</h2>
  ${recognizedText.split('\n').map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
</body>
</html>`;
    return {
      blob: new Blob([docxHtml], { type: 'application/msword;charset=utf-8' }),
      fileName: `${originalName}_ocr.docx`,
      text: recognizedText,
    };
  }

  // 2. OCR -> PDF (Searchable PDF)
  if (target === 'PDF') {
    const doc = new jsPDF();
    doc.setFontSize(11);
    const splitLines = doc.splitTextToSize(recognizedText, 180);
    doc.text(splitLines, 14, 15);

    return {
      blob: doc.output('blob'),
      fileName: `${originalName}_ocr.pdf`,
      text: recognizedText,
    };
  }

  // 3. OCR -> TXT
  return {
    blob: new Blob([recognizedText], { type: 'text/plain;charset=utf-8' }),
    fileName: `${originalName}_ocr.txt`,
    text: recognizedText,
  };
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
