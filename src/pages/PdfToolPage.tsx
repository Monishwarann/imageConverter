import React, { useState } from 'react';
import { UniversalUploadZone } from '../components/UniversalUploadZone';
import { ConversionQueue } from '../components/ConversionQueue';
import { BatchControls } from '../components/BatchControls';
import type { FileItem, ConversionMode } from '../types';
import { FileText, Combine, FileCheck, Shield, Sparkles } from 'lucide-react';

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
  const [pdfToolMode, setPdfToolMode] = useState<'convert' | 'merge' | 'watermark'>('convert');
  const pdfQueue = props.queue.filter((q) => q.category === 'pdf');

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner Azure/Sapphire Theme */}
      <div className="relative overflow-hidden glass-panel p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-cyan-950/80 shadow-2xl shadow-blue-950/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-500/40">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white tracking-tight">PDF Toolkit Studio</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full uppercase tracking-wider">
                  PDF-Lib Powered
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Merge PDFs, split pages, extract text & images, watermark, compress & convert PDF to DOCX, TXT, HTML, JPG, PNG or WebP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setPdfToolMode('convert')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                pdfToolMode === 'convert'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Convert PDF</span>
            </button>

            <button
              onClick={() => setPdfToolMode('merge')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                pdfToolMode === 'merge'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Combine className="w-4 h-4" />
              <span>Merge PDFs</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="mt-6 pt-6 border-t border-blue-900/40 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-800/40 text-blue-300 font-semibold">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Watermarking & Page Numbers</span>
          </div>
          <div className="flex items-center gap-1.5 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-800/40 text-cyan-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Searchable Text Extractor</span>
          </div>
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
