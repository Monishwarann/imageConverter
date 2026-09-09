export type FormatCategory = 
  | 'universal'
  | 'image'
  | 'pdf'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'vector'
  | 'text_data'
  | 'ebook'
  | 'archive'
  | 'font'
  | 'subtitle'
  | 'ocr'
  | 'history'
  | 'settings';

export type ConversionMode = 'single' | 'multi' | 'batch' | 'merge';

export type FileStatus = 'queued' | 'validating' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  detectedFormat: string;
  mimeType: string;
  category: FormatCategory;
  selectedOutputFormat: string;
  availableOutputs: string[];
  status: FileStatus;
  progress: number;
  convertedBlob?: Blob;
  convertedUrl?: string;
  convertedName?: string;
  convertedSize?: number;
  error?: string;
  previewUrl?: string;
  customOptions?: ConversionOptions;
}

export interface ConversionOptions {
  // Image options
  quality?: number; // 1-100
  width?: number;
  height?: number;
  preserveAspect?: boolean;
  dpi?: number;
  transparentBackground?: boolean;
  
  // PDF options
  pageSize?: 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal' | 'Fit';
  orientation?: 'portrait' | 'landscape';
  margins?: number; // in mm
  watermarkText?: string;
  watermarkColor?: string;
  addPageNumbers?: boolean;
  pdfCompress?: boolean;
  
  // Spreadsheet options
  sheetIndex?: number;
  hasHeaders?: boolean;
  csvDelimiter?: ',' | ';' | '\t' | '|';
  
  // Text & Data options
  indentation?: number;
  minify?: boolean;
  
  // Subtitle options
  timeOffset?: number; // in seconds
  
  // OCR options
  ocrLanguage?: 'eng' | 'spa' | 'fra' | 'deu' | 'chi_sim' | 'jpn';
  
  // Presentation options
  slideRange?: string; // e.g. "1-5, 8"
  
  // Archive options
  preserveStructure?: boolean;
  zipCompressionLevel?: number;
}

export interface ConversionHistoryItem {
  id: string;
  timestamp: number;
  originalName: string;
  convertedName: string;
  inputFormat: string;
  outputFormat: string;
  originalSize: number;
  convertedSize: number;
  status: 'completed' | 'failed';
  downloadUrl?: string;
}

export interface BatchStats {
  totalFiles: number;
  completed: number;
  failed: number;
  skipped: number;
  originalTotalSize: number;
  convertedTotalSize: number;
  savedBytes: number;
}
