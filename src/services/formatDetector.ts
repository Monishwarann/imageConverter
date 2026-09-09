import type { FormatCategory } from '../types';

export interface DetectionResult {
  format: string;
  category: FormatCategory;
  mimeType: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Magic Bytes Signatures database
 */
const MAGIC_SIGNATURES: { signature: number[]; mask?: number[]; format: string; category: FormatCategory; mime: string }[] = [
  // Images
  { signature: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], format: 'PNG', category: 'image', mime: 'image/png' },
  { signature: [0xFF, 0xD8, 0xFF], format: 'JPG', category: 'image', mime: 'image/jpeg' },
  { signature: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], format: 'GIF', category: 'image', mime: 'image/gif' },
  { signature: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], format: 'GIF', category: 'image', mime: 'image/gif' },
  { signature: [0x42, 0x4D], format: 'BMP', category: 'image', mime: 'image/bmp' },
  { signature: [0x49, 0x49, 0x2A, 0x00], format: 'TIFF', category: 'image', mime: 'image/tiff' },
  { signature: [0x4D, 0x4D, 0x00, 0x2A], format: 'TIFF', category: 'image', mime: 'image/tiff' },
  { signature: [0x00, 0x00, 0x01, 0x00], format: 'ICO', category: 'image', mime: 'image/x-icon' },
  { signature: [0x52, 0x49, 0x46, 0x46], format: 'WEBP', category: 'image', mime: 'image/webp' },
  
  // Documents & Archives
  { signature: [0x25, 0x50, 0x44, 0x46], format: 'PDF', category: 'pdf', mime: 'application/pdf' },
  { signature: [0x50, 0x4B, 0x03, 0x04], format: 'ZIP', category: 'archive', mime: 'application/zip' },
  { signature: [0x1F, 0x8B, 0x08], format: 'GZ', category: 'archive', mime: 'application/gzip' },
  { signature: [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C], format: '7Z', category: 'archive', mime: 'application/x-7z-compressed' },
  { signature: [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07], format: 'RAR', category: 'archive', mime: 'application/vnd.rar' },
  
  // Font Files
  { signature: [0x00, 0x01, 0x00, 0x00], format: 'TTF', category: 'font', mime: 'font/ttf' },
  { signature: [0x4F, 0x54, 0x54, 0x4F], format: 'OTF', category: 'font', mime: 'font/otf' },
  { signature: [0x77, 0x4F, 0x46, 0x46], format: 'WOFF', category: 'font', mime: 'font/woff' },
  { signature: [0x77, 0x4F, 0x46, 0x32], format: 'WOFF2', category: 'font', mime: 'font/woff2' },
];

/**
 * Extension map for fallback
 */
const EXTENSION_MAP: Record<string, { format: string; category: FormatCategory; mime: string }> = {
  // Images
  jpg: { format: 'JPG', category: 'image', mime: 'image/jpeg' },
  jpeg: { format: 'JPG', category: 'image', mime: 'image/jpeg' },
  png: { format: 'PNG', category: 'image', mime: 'image/png' },
  webp: { format: 'WEBP', category: 'image', mime: 'image/webp' },
  gif: { format: 'GIF', category: 'image', mime: 'image/gif' },
  bmp: { format: 'BMP', category: 'image', mime: 'image/bmp' },
  tiff: { format: 'TIFF', category: 'image', mime: 'image/tiff' },
  tif: { format: 'TIFF', category: 'image', mime: 'image/tiff' },
  ico: { format: 'ICO', category: 'image', mime: 'image/x-icon' },
  avif: { format: 'AVIF', category: 'image', mime: 'image/avif' },
  heic: { format: 'HEIC', category: 'image', mime: 'image/heic' },

  // Vector
  svg: { format: 'SVG', category: 'vector', mime: 'image/svg+xml' },
  eps: { format: 'EPS', category: 'vector', mime: 'application/postscript' },
  ai: { format: 'AI', category: 'vector', mime: 'application/illustrator' },

  // Documents
  pdf: { format: 'PDF', category: 'pdf', mime: 'application/pdf' },
  docx: { format: 'DOCX', category: 'document', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  doc: { format: 'DOC', category: 'document', mime: 'application/msword' },
  rtf: { format: 'RTF', category: 'document', mime: 'application/rtf' },
  
  // Spreadsheets
  xlsx: { format: 'XLSX', category: 'spreadsheet', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  xls: { format: 'XLS', category: 'spreadsheet', mime: 'application/vnd.ms-excel' },
  csv: { format: 'CSV', category: 'spreadsheet', mime: 'text/csv' },
  tsv: { format: 'TSV', category: 'spreadsheet', mime: 'text/tab-separated-values' },
  ods: { format: 'ODS', category: 'spreadsheet', mime: 'application/vnd.oasis.opendocument.spreadsheet' },

  // Presentations
  pptx: { format: 'PPTX', category: 'presentation', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  ppt: { format: 'PPT', category: 'presentation', mime: 'application/vnd.ms-powerpoint' },
  odp: { format: 'ODP', category: 'presentation', mime: 'application/vnd.oasis.opendocument.presentation' },

  // Text & Data
  txt: { format: 'TXT', category: 'text_data', mime: 'text/plain' },
  md: { format: 'MD', category: 'text_data', mime: 'text/markdown' },
  markdown: { format: 'MD', category: 'text_data', mime: 'text/markdown' },
  html: { format: 'HTML', category: 'text_data', mime: 'text/html' },
  htm: { format: 'HTML', category: 'text_data', mime: 'text/html' },
  json: { format: 'JSON', category: 'text_data', mime: 'application/json' },
  xml: { format: 'XML', category: 'text_data', mime: 'application/xml' },
  yaml: { format: 'YAML', category: 'text_data', mime: 'application/x-yaml' },
  yml: { format: 'YAML', category: 'text_data', mime: 'application/x-yaml' },

  // Subtitles
  srt: { format: 'SRT', category: 'subtitle', mime: 'text/plain' },
  vtt: { format: 'VTT', category: 'subtitle', mime: 'text/vtt' },
  ass: { format: 'ASS', category: 'subtitle', mime: 'text/x-ass' },
  ssa: { format: 'SSA', category: 'subtitle', mime: 'text/x-ssa' },

  // E-books
  epub: { format: 'EPUB', category: 'ebook', mime: 'application/epub+zip' },
  mobi: { format: 'MOBI', category: 'ebook', mime: 'application/x-mobipocket-ebook' },
  azw3: { format: 'AZW3', category: 'ebook', mime: 'application/vnd.amazon.mobi8-ebook' },

  // Archives
  zip: { format: 'ZIP', category: 'archive', mime: 'application/zip' },
  tar: { format: 'TAR', category: 'archive', mime: 'application/x-tar' },
  gz: { format: 'GZ', category: 'archive', mime: 'application/gzip' },
  '7z': { format: '7Z', category: 'archive', mime: 'application/x-7z-compressed' },

  // Fonts
  ttf: { format: 'TTF', category: 'font', mime: 'font/ttf' },
  otf: { format: 'OTF', category: 'font', mime: 'font/otf' },
  woff: { format: 'WOFF', category: 'font', mime: 'font/woff' },
  woff2: { format: 'WOFF2', category: 'font', mime: 'font/woff2' },
};

/**
 * Detect file type using Magic Bytes, MIME, and Extension analysis
 */
export async function detectFileType(file: File): Promise<DetectionResult> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const extInfo = EXTENSION_MAP[ext];

  try {
    const slice = file.slice(0, 32);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // 1. Check Magic Bytes
    for (const item of MAGIC_SIGNATURES) {
      let match = true;
      for (let i = 0; i < item.signature.length; i++) {
        if (bytes[i] !== item.signature[i]) {
          match = false;
          break;
        }
      }
      if (match) {
        // Disambiguate ZIP vs DOCX/XLSX/PPTX/EPUB
        if (item.format === 'ZIP') {
          if (ext === 'docx') return { format: 'DOCX', category: 'document', mimeType: EXTENSION_MAP.docx.mime, confidence: 'high' };
          if (ext === 'xlsx') return { format: 'XLSX', category: 'spreadsheet', mimeType: EXTENSION_MAP.xlsx.mime, confidence: 'high' };
          if (ext === 'pptx') return { format: 'PPTX', category: 'presentation', mimeType: EXTENSION_MAP.pptx.mime, confidence: 'high' };
          if (ext === 'epub') return { format: 'EPUB', category: 'ebook', mimeType: EXTENSION_MAP.epub.mime, confidence: 'high' };
        }
        return {
          format: item.format,
          category: item.category,
          mimeType: item.mime,
          confidence: 'high',
        };
      }
    }

    // 2. Text / SVG / Subtitle signature check
    if (bytes.length > 0) {
      const textHeader = new TextDecoder().decode(bytes.slice(0, 100)).trim().toLowerCase();
      if (textHeader.startsWith('<svg') || textHeader.includes('<svg')) {
        return { format: 'SVG', category: 'vector', mimeType: 'image/svg+xml', confidence: 'high' };
      }
      if (textHeader.startsWith('webvtt')) {
        return { format: 'VTT', category: 'subtitle', mimeType: 'text/vtt', confidence: 'high' };
      }
      if (textHeader.startsWith('{\\rtf')) {
        return { format: 'RTF', category: 'document', mimeType: 'application/rtf', confidence: 'high' };
      }
      if (textHeader.startsWith('<?xml') || textHeader.startsWith('<')) {
        return { format: 'XML', category: 'text_data', mimeType: 'application/xml', confidence: 'high' };
      }
      if (textHeader.startsWith('{') || textHeader.startsWith('[')) {
        return { format: 'JSON', category: 'text_data', mimeType: 'application/json', confidence: 'high' };
      }
    }
  } catch (e) {
    console.warn('Magic byte inspection failed, falling back to extension:', e);
  }

  // 3. Fallback to extension map
  if (extInfo) {
    return {
      format: extInfo.format,
      category: extInfo.category,
      mimeType: extInfo.mime,
      confidence: 'medium',
    };
  }

  // 4. Default Unknown Text or Binary
  return {
    format: ext.toUpperCase() || 'BIN',
    category: 'universal',
    mimeType: file.type || 'application/octet-stream',
    confidence: 'low',
  };
}
