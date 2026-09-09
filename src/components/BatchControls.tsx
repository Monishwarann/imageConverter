import React from 'react';
import {
  Play,
  Archive,
  Trash2,
  CheckSquare,
  Square,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import type { ConversionMode, FileItem } from '../types';

interface BatchControlsProps {
  files: FileItem[];
  selectedIds: string[];
  onSelectAll: (select: boolean) => void;
  onConvertAll: () => void;
  onConvertSelected: () => void;
  onDownloadAllZip: () => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  onApplyFormatToAll: (format: string) => void;
  isProcessing: boolean;
  mode: ConversionMode;
}

export const BatchControls: React.FC<BatchControlsProps> = ({
  files,
  selectedIds,
  onSelectAll,
  onConvertAll,
  onConvertSelected,
  onDownloadAllZip,
  onClearCompleted,
  onClearAll,
  onApplyFormatToAll,
  isProcessing,
  mode,
}) => {
  const allSelected = files.length > 0 && selectedIds.length === files.length;
  const completedCount = files.filter((f) => f.status === 'completed').length;
  const hasCompleted = completedCount > 0;

  // Get common available output formats across current files
  const commonFormats = Array.from(
    new Set(files.flatMap((f) => f.availableOutputs))
  );

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      {/* Left Selection Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSelectAll(!allSelected)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/80 transition-colors"
        >
          {allSelected ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4 text-slate-500" />}
          <span>{allSelected ? 'Deselect All' : `Select All (${files.length})`}</span>
        </button>

        {/* Global Bulk Format Selector */}
        {mode === 'batch' && commonFormats.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 hidden sm:inline">Format all:</span>
            <select
              onChange={(e) => onApplyFormatToAll(e.target.value)}
              className="bg-slate-900 text-white font-bold rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Target...</option>
              {commonFormats.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {hasCompleted && (
          <>
            <button
              onClick={onDownloadAllZip}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
            >
              <Archive className="w-4 h-4" />
              <span>Download ZIP ({completedCount})</span>
            </button>

            <button
              onClick={onClearCompleted}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Done</span>
            </button>
          </>
        )}

        {files.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-colors"
          >
            <span>Clear All</span>
          </button>
        )}

        {selectedIds.length > 0 && selectedIds.length < files.length && (
          <button
            onClick={onConvertSelected}
            disabled={isProcessing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 disabled:opacity-50 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Convert Selected ({selectedIds.length})</span>
          </button>
        )}

        <button
          onClick={onConvertAll}
          disabled={isProcessing || files.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-extrabold shadow-xl shadow-indigo-600/40 disabled:opacity-50 transition-all hover:scale-[1.02]"
        >
          {isProcessing ? (
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Play className="w-4 h-4 fill-white" />
          )}
          <span>{isProcessing ? 'Processing Queue...' : `Convert All (${files.length})`}</span>
        </button>
      </div>
    </div>
  );
};
