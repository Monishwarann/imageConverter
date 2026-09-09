import React from 'react';
import { UniversalUploadZone } from '../components/UniversalUploadZone';
import { ConversionQueue } from '../components/ConversionQueue';
import { BatchControls } from '../components/BatchControls';
import type { FileItem, ConversionMode } from '../types';
import { Code2, CheckCircle2 } from 'lucide-react';

interface TextDataToolPageProps {
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

export const TextDataToolPage: React.FC<TextDataToolPageProps> = (props) => {
  const textQueue = props.queue.filter((q) => q.category === 'text_data' || q.category === 'document');

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Text & Data Developer Suite</h2>
            <p className="text-xs text-slate-400">JSON, XML, YAML, Markdown & HTML formatting, minification, validation & cross conversion.</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
          <CheckCircle2 className="w-4 h-4" />
          <span>Safe DOMPurify Sanitized</span>
        </div>
      </div>

      <UniversalUploadZone onFilesAdded={props.onFilesAdded} activeCategory="text_data" />

      {textQueue.length > 0 && (
        <>
          <BatchControls
            files={textQueue}
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
            files={textQueue}
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
