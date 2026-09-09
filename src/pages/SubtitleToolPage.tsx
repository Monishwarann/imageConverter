import React from 'react';
import { UniversalUploadZone } from '../components/UniversalUploadZone';
import { ConversionQueue } from '../components/ConversionQueue';
import { BatchControls } from '../components/BatchControls';
import type { FileItem, ConversionMode } from '../types';
import { Subtitles, Clock } from 'lucide-react';

interface SubtitleToolPageProps {
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

export const SubtitleToolPage: React.FC<SubtitleToolPageProps> = (props) => {
  const subQueue = props.queue.filter((q) => q.category === 'subtitle');

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner Cyan/Teal Theme */}
      <div className="relative overflow-hidden glass-panel p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-teal-950/80 shadow-2xl shadow-cyan-950/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-600 to-emerald-400 flex items-center justify-center shadow-xl shadow-cyan-500/40">
              <Subtitles className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white tracking-tight">Subtitle & Caption Studio</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full uppercase tracking-wider">
                  Sync Engine
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Cross-convert SRT, VTT, ASS & SSA caption files or generate clean plain-text transcripts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-cyan-950/60 px-3.5 py-2 rounded-2xl border border-cyan-800/50 text-xs font-bold text-cyan-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Timestamp Synchronizer</span>
          </div>
        </div>

        {/* Format Pills */}
        <div className="mt-6 pt-6 border-t border-cyan-900/40 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 uppercase tracking-wider">Target Format All:</span>
            {['VTT', 'SRT', 'TXT', 'ASS'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => props.onApplyFormatToAll(fmt)}
                className="px-3 py-1 rounded-xl text-xs font-extrabold bg-slate-900/80 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-600 hover:text-white transition-all"
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <UniversalUploadZone onFilesAdded={props.onFilesAdded} activeCategory="subtitle" />

      {subQueue.length > 0 && (
        <>
          <BatchControls
            files={subQueue}
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
            files={subQueue}
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
