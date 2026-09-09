import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Presentation,
  Archive,
  Code2,
  Type,
  Subtitles,
  Download,
  Eye,
  Trash2,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CheckSquare,
  Square,
} from 'lucide-react';
import type { FileItem } from '../types';

interface ConversionQueueProps {
  files: FileItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onUpdateOutputFormat: (id: string, format: string) => void;
  onRemoveItem: (id: string) => void;
  onRetryItem: (id: string) => void;
  onOpenPreview: (item: FileItem) => void;
  onOpenSettings: (item: FileItem) => void;
  onDownloadItem: (item: FileItem) => void;
}

export const ConversionQueue: React.FC<ConversionQueueProps> = ({
  files,
  selectedIds,
  onToggleSelect,
  onUpdateOutputFormat,
  onRemoveItem,
  onRetryItem,
  onOpenPreview,
  onOpenSettings,
  onDownloadItem,
}) => {
  const getFormatIcon = (category: string) => {
    switch (category) {
      case 'image':
      case 'vector':
        return <ImageIcon className="w-5 h-5 text-indigo-400" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'presentation':
        return <Presentation className="w-5 h-5 text-amber-400" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-purple-400" />;
      case 'font':
        return <Type className="w-5 h-5 text-pink-400" />;
      case 'subtitle':
        return <Subtitles className="w-5 h-5 text-cyan-400" />;
      case 'text_data':
        return <Code2 className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="flex flex-col gap-3">
      {files.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        const isCompleted = item.status === 'completed';
        const isFailed = item.status === 'failed';
        const isProcessing = item.status === 'processing';

        return (
          <div
            key={item.id}
            className={`glass-panel p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isSelected ? 'border-indigo-500/60 bg-indigo-950/20' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Left Info Section */}
            <div className="flex items-center gap-3.5 w-full sm:w-auto min-w-0">
              <button
                type="button"
                onClick={() => onToggleSelect(item.id)}
                className="text-slate-500 hover:text-indigo-400 shrink-0"
              >
                {isSelected ? (
                  <CheckSquare className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-600" />
                )}
              </button>

              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                {getFormatIcon(item.category)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-[300px]">
                    {item.name}
                  </h4>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {item.detectedFormat}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span>{formatBytes(item.size)}</span>

                  {isCompleted && item.convertedSize && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">
                        {formatBytes(item.convertedSize)} ({Math.round(((item.size - item.convertedSize) / item.size) * 100)}% saved)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Output Dropdown & Status */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold hidden md:inline">Convert to:</span>
                <select
                  disabled={isProcessing || isCompleted}
                  value={item.selectedOutputFormat}
                  onChange={(e) => onUpdateOutputFormat(item.id, e.target.value)}
                  className="bg-slate-900 text-white font-extrabold text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                >
                  {item.availableOutputs.map((out) => (
                    <option key={out} value={out}>
                      {out}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Indicator Badge */}
              <div className="shrink-0">
                {isProcessing && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-semibold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{item.progress}%</span>
                  </div>
                )}

                {isCompleted && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ready</span>
                  </div>
                )}

                {isFailed && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>Failed</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenSettings(item)}
                  title="Advanced Options"
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                {isCompleted && (
                  <>
                    <button
                      onClick={() => onOpenPreview(item)}
                      title="Preview Converted File"
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDownloadItem(item)}
                      title="Download File"
                      className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-md shadow-indigo-600/30"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </>
                )}

                {isFailed && (
                  <button
                    onClick={() => onRetryItem(item.id)}
                    title="Retry Conversion"
                    className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove File"
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
