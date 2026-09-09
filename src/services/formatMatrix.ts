export interface FormatRule {
  inputFormat: string;
  allowedOutputs: string[];
  description: string;
  requiresOcr?: boolean;
}

/**
 * Programmatic Format Matrix defining technically supported conversions
 */
export const FORMAT_MATRIX: Record<string, string[]> = {
  // Image Formats
  JPG: ['PNG', 'WEBP', 'AVIF', 'BMP', 'TIFF', 'ICO', 'PDF'],
  JPEG: ['PNG', 'WEBP', 'AVIF', 'BMP', 'TIFF', 'ICO', 'PDF'],
  PNG: ['JPG', 'WEBP', 'AVIF', 'BMP', 'TIFF', 'ICO', 'PDF'],
  WEBP: ['PNG', 'JPG', 'AVIF', 'BMP', 'TIFF', 'ICO', 'PDF'],
  GIF: ['PNG', 'JPG', 'WEBP', 'BMP', 'PDF'],
  BMP: ['PNG', 'JPG', 'WEBP', 'AVIF', 'PDF'],
  TIFF: ['PNG', 'JPG', 'WEBP', 'PDF'],
  ICO: ['PNG', 'JPG', 'WEBP', 'BMP'],
  AVIF: ['PNG', 'JPG', 'WEBP', 'PDF'],
  HEIC: ['PNG', 'JPG', 'WEBP', 'PDF'],

  // Vector Graphics
  SVG: ['PNG', 'JPG', 'WEBP', 'PDF', 'TIFF'],
  EPS: ['SVG', 'PNG', 'PDF'],
  AI: ['PDF', 'SVG', 'PNG'],

  // PDF
  PDF: ['DOCX', 'TXT', 'HTML', 'JPG', 'PNG', 'WEBP', 'TIFF', 'SVG', 'PDF_MERGE', 'PDF_SPLIT', 'PDF_COMPRESS', 'PDF_WATERMARK'],

  // Document Formats
  DOCX: ['PDF', 'TXT', 'HTML', 'RTF'],
  DOC: ['DOCX', 'PDF', 'TXT', 'HTML'],
  RTF: ['DOCX', 'PDF', 'TXT', 'HTML'],

  // Presentation Formats
  PPTX: ['PDF', 'JPG', 'PNG', 'WEBP', 'SVG'],
  PPT: ['PPTX', 'PDF', 'JPG', 'PNG'],
  ODP: ['PPTX', 'PDF'],

  // Spreadsheet Formats
  XLSX: ['CSV', 'TSV', 'PDF', 'ODS', 'JSON'],
  XLS: ['XLSX', 'CSV', 'PDF'],
  CSV: ['XLSX', 'PDF', 'JSON', 'TSV'],
  TSV: ['XLSX', 'CSV', 'JSON'],
  ODS: ['XLSX', 'CSV', 'PDF'],

  // Text & Markdown
  TXT: ['PDF', 'DOCX', 'HTML', 'MD'],
  MD: ['HTML', 'PDF', 'DOCX', 'TXT'],
  MARKDOWN: ['HTML', 'PDF', 'DOCX', 'TXT'],
  HTML: ['PDF', 'TXT', 'DOCX', 'PNG', 'JPG'],
  HTM: ['PDF', 'TXT', 'DOCX', 'PNG', 'JPG'],

  // Data Formats
  JSON: ['CSV', 'XML', 'YAML', 'TXT', 'FORMAT_PRETTY', 'MINIFY'],
  XML: ['JSON', 'CSV', 'TXT', 'FORMAT_PRETTY', 'MINIFY'],
  YAML: ['JSON', 'XML', 'TXT'],
  YML: ['JSON', 'XML', 'TXT'],

  // Subtitles
  SRT: ['VTT', 'ASS', 'SSA', 'TXT'],
  VTT: ['SRT', 'ASS', 'TXT'],
  ASS: ['SRT', 'VTT', 'TXT'],
  SSA: ['SRT', 'VTT', 'TXT'],

  // Font Formats
  TTF: ['WOFF', 'WOFF2', 'OTF'],
  OTF: ['WOFF', 'WOFF2', 'TTF'],
  WOFF: ['TTF', 'WOFF2'],
  WOFF2: ['TTF', 'WOFF'],

  // E-Book Formats
  EPUB: ['PDF', 'TXT', 'HTML', 'DOCX'],
  MOBI: ['EPUB', 'TXT', 'PDF'],
  AZW3: ['EPUB', 'PDF', 'TXT'],

  // Archives
  ZIP: ['EXTRACT_ZIP', 'REPACK_ZIP'],
  TAR: ['EXTRACT_TAR', 'ZIP'],
  GZ: ['EXTRACT_GZ', 'ZIP'],
  '7Z': ['EXTRACT_7Z', 'ZIP'],
  RAR: ['EXTRACT_RAR', 'ZIP'],
};

/**
 * Get list of valid supported output formats for any given input format
 */
export function getSupportedOutputFormats(inputFormat: string): string[] {
  const normalized = inputFormat.toUpperCase();
  return FORMAT_MATRIX[normalized] || ['PDF', 'TXT'];
}

/**
 * Validate if a conversion path is technically supported
 */
export function isConversionSupported(inputFormat: string, outputFormat: string): boolean {
  const supported = getSupportedOutputFormats(inputFormat);
  return supported.includes(outputFormat.toUpperCase());
}
