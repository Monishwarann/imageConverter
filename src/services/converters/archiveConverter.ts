import JSZip from 'jszip';
import type { ConversionOptions } from '../../types';

export interface ExtractedFile {
  name: string;
  blob: Blob;
  size: number;
}

/**
 * Archive Utility Service (Create ZIP, Extract ZIP, Folder structure output)
 */
export async function createZipArchive(
  files: { blob: Blob; fileName: string; category?: string }[],
  options: ConversionOptions = {},
  zipName: string = 'converted-files.zip'
): Promise<{ blob: Blob; fileName: string }> {
  const zip = new JSZip();

  for (const item of files) {
    if (options.preserveStructure && item.category) {
      const folderName = getFolderForCategory(item.category);
      zip.folder(folderName)?.file(item.fileName, item.blob);
    } else {
      zip.file(item.fileName, item.blob);
    }
  }

  const zipContent = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: options.zipCompressionLevel || 6 },
  });

  return {
    blob: zipContent,
    fileName: zipName,
  };
}

/**
 * Safely extract files from an uploaded ZIP archive
 */
export async function extractZipArchive(
  file: File
): Promise<ExtractedFile[]> {
  const zip = new JSZip();
  const buffer = await file.arrayBuffer();

  const loadedZip = await zip.loadAsync(buffer);
  const extractedFiles: ExtractedFile[] = [];

  let totalExtractedSize = 0;
  const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB security limit for client browser

  for (const filename of Object.keys(loadedZip.files)) {
    const zipEntry = loadedZip.files[filename];

    // Security Check: Path Traversal Protection
    if (filename.includes('..') || filename.startsWith('/') || filename.startsWith('\\')) {
      console.warn(`Blocked suspicious zip entry path: ${filename}`);
      continue;
    }

    if (!zipEntry.dir) {
      const blob = await zipEntry.async('blob');
      totalExtractedSize += blob.size;

      // Security Check: Zip Bomb Protection
      if (totalExtractedSize > MAX_TOTAL_SIZE) {
        throw new Error('Extraction halted: Exceeded maximum allowed uncompressed archive size (Zip bomb protection).');
      }

      extractedFiles.push({
        name: filename.split('/').pop() || filename,
        blob,
        size: blob.size,
      });
    }
  }

  return extractedFiles;
}

function getFolderForCategory(category: string): string {
  switch (category) {
    case 'image':
      return 'images';
    case 'document':
    case 'pdf':
      return 'documents';
    case 'spreadsheet':
      return 'spreadsheets';
    case 'presentation':
      return 'presentations';
    case 'text_data':
      return 'data';
    case 'font':
      return 'fonts';
    case 'subtitle':
      return 'subtitles';
    default:
      return 'files';
  }
}
