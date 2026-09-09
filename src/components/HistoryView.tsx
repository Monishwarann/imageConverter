import React, { useState } from 'react';
import { History, Search, Trash2, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import type { ConversionHistoryItem } from '../types';
import { clearHistory } from '../services/historyStorage';

interface HistoryViewProps {
  history: ConversionHistoryItem[];
  onRefresh: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = history.filter(
    (h) =>
      h.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.inputFormat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.outputFormat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all conversion history?')) {
      clearHistory();
      onRefresh();
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Conversion History</h2>
            <p className="text-xs text-slate-400">View recent file conversions performed in your browser session.</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      {history.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by file name or format (e.g. PNG, report.docx)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 text-white text-xs font-medium rounded-2xl pl-11 pr-4 py-3 border border-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* History List */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  {item.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate max-w-sm">{item.originalName}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="font-semibold text-indigo-400">
                      {item.inputFormat} → {item.outputFormat}
                    </span>
                    <span>•</span>
                    <span>{formatBytes(item.originalSize)}</span>
                    {item.convertedSize > 0 && (
                      <>
                        <span>→</span>
                        <span className="text-emerald-400 font-semibold">{formatBytes(item.convertedSize)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 text-slate-500">
          <p className="text-sm font-medium">No conversion history records found.</p>
        </div>
      )}
    </div>
  );
};
