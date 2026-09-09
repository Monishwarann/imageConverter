import React from 'react';
import { UniversalUploadZone } from '../components/UniversalUploadZone';
import { ConversionQueue } from '../components/ConversionQueue';
import { BatchControls } from '../components/BatchControls';
import type { FileItem, ConversionMode } from '../types';
import { ScanText, Sparkles } from 'lucide-react';

interface OcrToolPageProps {
  queue: FileItem[];
  selectedIds: string[];
  isProcessing: boolean;
  mode: ConversionMode;
  onFilesAdded: (files: FileItem[]) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: (select: boolean) => void;
  onConvertAll: () => void;
  onConvertSelected: () => void;
  onDownloadAllZip: () => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  onApplyFormatToAll: (format: string) => void;
  onUpdateOutputFormat: (id: string, format: string) => void;
  onRemoveItem: (id: string) => void;
  onRetryItem: (id: string) => void;
  onOpenPreview: (item: FileItem) => void;
  onOpenSettings: (item: FileItem) => void;
  onDownloadItem: (item: FileItem) => void;
}

export const OcrToolPage: React.FC<OcrToolPageProps> = (props) => {
  const ocrQueue = props.queue.filter((q) => q.category === 'ocr');

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <ScanText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI OCR Document Converter</h2>
            <p className="text-xs text-slate-400">Extract editable text from scanned PDFs & images into TXT, DOCX or Searchable PDF.</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-purple-300 bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-800/40">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Multi-lingual Tesseract.js Worker</span>
        </div>
      </div>

      <UniversalUploadZone onFilesAdded={props.onFilesAdded} activeCategory="ocr" />

      {ocrQueue.length > 0 && (
        <>
          <BatchControls
            files={ocrQueue}
            selectedIds={props.selectedIds}
            onSelectAll={props.onSelectAll}
            onConvertAll={props.onConvertAll}
            onConvertSelected={props.onConvertSelected}
            onDownloadAllZip={props.onDownloadAllZip}
            onClearCompleted={props.onClearCompleted}
            onClearAll={props.onClearAll}
            onApplyFormatToAll={props.onApplyFormatToAll}
            isProcessing={props.isProcessing}
            mode={props.mode}
          />

          <ConversionQueue
            files={ocrQueue}
            selectedIds={props.selectedIds}
            onToggleSelect={props.onToggleSelect}
            onUpdateOutputFormat={props.onUpdateOutputFormat}
            onRemoveItem={props.onRemoveItem}
            onRetryItem={props.onRetryItem}
            onOpenPreview={props.onOpenPreview}
            onOpenSettings={props.onOpenSettings}
            onDownloadItem={props.onDownloadItem}
          />
        </>
      )}
    </div>
  );
};
