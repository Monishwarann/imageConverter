import React, { useState } from 'react';
import { UniversalUploadZone } from '../components/UniversalUploadZone';
import { ConversionQueue } from '../components/ConversionQueue';
import { BatchControls } from '../components/BatchControls';
import type { FileItem, ConversionMode } from '../types';
import { Archive, ShieldCheck, FolderTree } from 'lucide-react';

interface ArchiveToolPageProps {
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

export const ArchiveToolPage: React.FC<ArchiveToolPageProps> = (props) => {
  const [preserveStructure, setPreserveStructure] = useState(true);
  const archiveQueue = props.queue.filter((q) => q.category === 'archive');

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner Deep Purple Theme */}
      <div className="relative overflow-hidden glass-panel p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 shadow-2xl shadow-purple-950/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 flex items-center justify-center shadow-xl shadow-purple-500/40">
              <Archive className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white tracking-tight">Archive Tools & ZIP Studio</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full uppercase tracking-wider">
                  JSZip Engine
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Create structured ZIP archives with subfolders (`/images`, `/documents`, `/data`) or extract ZIP, TAR, GZ, 7Z safely.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/60 px-3.5 py-2 rounded-2xl border border-emerald-800/50 text-xs font-bold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zip Bomb & Traversal Shield</span>
          </div>
        </div>

        {/* Structure Options Bar */}
        <div className="mt-6 pt-6 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
          <div className="flex items-center gap-3">
            <FolderTree className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300">Organize Output Folders:</span>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={preserveStructure}
                onChange={(e) => setPreserveStructure(e.target.checked)}
                className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
              />
              <span>Categorized Subdirectories (`/images`, `/documents`)</span>
            </label>
          </div>
        </div>
      </div>

      <UniversalUploadZone onFilesAdded={props.onFilesAdded} activeCategory="archive" />

      {archiveQueue.length > 0 && (
        <>
          <BatchControls
            files={archiveQueue}
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
            files={archiveQueue}
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
