import type { FileItem } from '../types';
import { convertImage } from './converters/imageConverter';
import { convertPdf } from './converters/pdfConverter';
import { convertSpreadsheet } from './converters/spreadsheetConverter';
import { convertTextData } from './converters/textDataConverter';
import { convertSubtitle } from './converters/subtitleConverter';
import { convertFont } from './converters/fontConverter';
import { performOcr } from './converters/ocrEngine';
import { saveToHistory } from './historyStorage';

/**
 * Universal Conversion Execution Router
 */
export async function executeFileConversion(
  item: FileItem,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; fileName: string; size: number }> {
  const { file, selectedOutputFormat, category, customOptions } = item;

  if (onProgress) onProgress(20);

  let result: { blob: Blob; fileName: string };

  try {
    // 1. OCR Category
    if (category === 'ocr') {
      result = await performOcr(file, selectedOutputFormat, customOptions, (p) => {
        if (onProgress) onProgress(p.progress);
      });
    }
    // 2. Image Category / Vector Graphics
    else if (category === 'image' || category === 'vector') {
      result = await convertImage(file, selectedOutputFormat, customOptions);
      if (onProgress) onProgress(90);
    }
    // 3. PDF Category
    else if (category === 'pdf') {
      result = await convertPdf(file, selectedOutputFormat, customOptions);
      if (onProgress) onProgress(90);
    }
    // 4. Spreadsheet Category
    else if (category === 'spreadsheet') {
      result = await convertSpreadsheet(file, selectedOutputFormat, customOptions);
      if (onProgress) onProgress(90);
    }
    // 5. Text & Data Category / Documents
    else if (category === 'text_data' || category === 'document') {
      result = await convertTextData(file, selectedOutputFormat, customOptions);
      if (onProgress) onProgress(90);
    }
    // 6. Subtitles
    else if (category === 'subtitle') {
      result = await convertSubtitle(file, selectedOutputFormat, customOptions);
      if (onProgress) onProgress(90);
    }
    // 7. Fonts
    else if (category === 'font') {
      result = await convertFont(file, selectedOutputFormat, customOptions);
      if (onProgress) onProgress(90);
    }
    // Fallback: Text Data Engine
    else {
      result = await convertTextData(file, selectedOutputFormat, customOptions);
      if (onProgress) onProgress(90);
    }

    if (onProgress) onProgress(100);

    // Record conversion entry in history
    saveToHistory({
      originalName: file.name,
      convertedName: result.fileName,
      inputFormat: item.detectedFormat,
      outputFormat: selectedOutputFormat,
      originalSize: file.size,
      convertedSize: result.blob.size,
      status: 'completed',
    });

    return {
      blob: result.blob,
      fileName: result.fileName,
      size: result.blob.size,
    };
  } catch (error: any) {
    saveToHistory({
      originalName: file.name,
      convertedName: `${file.name}.${selectedOutputFormat.toLowerCase()}`,
      inputFormat: item.detectedFormat,
      outputFormat: selectedOutputFormat,
      originalSize: file.size,
      convertedSize: 0,
      status: 'failed',
    });

    throw new Error(error.message || `Failed to convert ${file.name} to ${selectedOutputFormat}`);
  }
}
