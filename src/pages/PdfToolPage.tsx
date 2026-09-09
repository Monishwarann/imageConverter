import React, { useState } from 'react';
import { UniversalUploadZone } from '../components/UniversalUploadZone';
import { ConversionQueue } from '../components/ConversionQueue';
import { BatchControls } from '../components/BatchControls';
import type { FileItem, ConversionMode } from '../types';
import { FileText } from 'lucide-react';

interface PdfToolPageProps {
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

export const PdfToolPage: React.FC<PdfToolPageProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'convert' | 'merge'>('convert');
  const pdfQueue = props.queue.filter((q) => q.category === 'pdf');

  return (
    <div className="flex flex-col gap-6">
      {/* Tool Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">PDF Toolkit Pro</h2>
            <p className="text-xs text-slate-400">Merge PDFs, convert PDF to DOCX/TXT/Images, add watermarks & compress.</p>
          </div>
        </div>

        {/* Sub-tools Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('convert')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'convert' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            PDF Convert
          </button>
          <button
            onClick={() => setActiveTab('merge')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'merge' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Merge PDFs
          </button>
        </div>
      </div>

      <UniversalUploadZone onFilesAdded={props.onFilesAdded} activeCategory="pdf" />

      {pdfQueue.length > 0 && (
        <>
          <BatchControls
            files={pdfQueue}
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
            files={pdfQueue}
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
