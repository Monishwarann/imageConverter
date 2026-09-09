import React, { useState } from 'react';
import { UniversalUploadZone } from '../components/UniversalUploadZone';
import { ConversionQueue } from '../components/ConversionQueue';
import { BatchControls } from '../components/BatchControls';
import type { FileItem, ConversionMode } from '../types';
import { ScanText, Sparkles, Languages, Check } from 'lucide-react';

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
  const [selectedLang, setSelectedLang] = useState<'eng' | 'spa' | 'fra' | 'deu' | 'chi_sim' | 'jpn'>('eng');
  const ocrQueue = props.queue.filter((q) => q.category === 'ocr');

  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'chi_sim', name: 'Chinese' },
    { code: 'jpn', name: 'Japanese' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner Ultra Violet Theme */}
      <div className="relative overflow-hidden glass-panel p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/90 via-slate-900/90 to-fuchsia-950/80 shadow-2xl shadow-purple-950/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-fuchsia-600 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-500/40 animate-pulse-glow">
              <ScanText className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white tracking-tight">AI OCR Text Recognition</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full uppercase tracking-wider">
                  Neural Tesseract AI
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Scan images & PDFs into searchable PDF, editable DOCX or plain TXT text with multi-language AI models.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-950/60 px-3.5 py-2 rounded-2xl border border-purple-800/50 text-xs font-bold text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Searchable PDF Generator</span>
          </div>
        </div>

        {/* Language Selector Pills */}
        <div className="mt-6 pt-6 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mr-2">
              <Languages className="w-4 h-4 text-purple-400" />
              <span>OCR Language:</span>
            </div>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setSelectedLang(l.code as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                  selectedLang === l.code
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                {selectedLang === l.code && <Check className="w-3.5 h-3.5 text-white" />}
                <span>{l.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span className="text-slate-400">Output All:</span>
            {['DOCX', 'PDF', 'TXT'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => props.onApplyFormatToAll(fmt)}
                className="px-3 py-1 rounded-xl text-xs font-extrabold bg-slate-900/80 text-purple-300 border border-purple-800/60 hover:bg-purple-600 hover:text-white transition-all"
              >
                {fmt}
              </button>
            ))}
          </div>
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
