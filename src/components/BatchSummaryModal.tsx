import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, Archive, ArrowRight, AlertTriangle } from 'lucide-react';
import type { FileItem } from '../types';

interface BatchSummaryModalProps {
  files: FileItem[];
  onClose: () => void;
  onDownloadZip: () => void;
}

export const BatchSummaryModal: React.FC<BatchSummaryModalProps> = ({ files, onClose, onDownloadZip }) => {
  const completedFiles = files.filter((f) => f.status === 'completed');
  const failedFiles = files.filter((f) => f.status === 'failed');

  const totalOriginalSize = completedFiles.reduce((acc, f) => acc + f.size, 0);
  const totalConvertedSize = completedFiles.reduce((acc, f) => acc + (f.convertedSize || 0), 0);
  const savedBytes = Math.max(0, totalOriginalSize - totalConvertedSize);
  const savedPercent = totalOriginalSize > 0 ? Math.round((savedBytes / totalOriginalSize) * 100) : 0;

  useEffect(() => {
    if (completedFiles.length > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#10b981'],
      });
    }
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-8 border border-slate-700 shadow-2xl relative text-center animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Conversion Complete!</h2>
        <p className="text-xs text-slate-400 mb-6">Your batch conversion completed successfully.</p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 mb-6">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Files</span>
            <span className="text-lg font-black text-white">{files.length}</span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Successful</span>
            <span className="text-lg font-black text-emerald-400">{completedFiles.length}</span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Space Saved</span>
            <span className="text-lg font-black text-indigo-400">{savedPercent}%</span>
          </div>
        </div>

        {/* Size Comparison Card */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 mb-6 flex items-center justify-between text-xs">
          <div className="text-left">
            <span className="text-slate-400 block text-[10px]">Original Size</span>
            <span className="font-bold text-slate-200">{formatBytes(totalOriginalSize)}</span>
          </div>

          <ArrowRight className="w-4 h-4 text-indigo-400" />

          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Output Size</span>
            <span className="font-bold text-emerald-400">{formatBytes(totalConvertedSize)}</span>
          </div>
        </div>

        {failedFiles.length > 0 && (
          <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30 text-amber-300 text-xs flex items-center justify-center gap-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{failedFiles.length} files failed to convert. You can retry them in the queue.</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onDownloadZip();
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-extrabold shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Archive className="w-4 h-4" />
            <span>Download All as ZIP ({completedFiles.length})</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close & View Files
          </button>
        </div>
      </div>
    </div>
  );
};
