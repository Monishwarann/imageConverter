import React, { useState } from 'react';
import { UniversalUploadZone } from '../components/UniversalUploadZone';
import { ConversionQueue } from '../components/ConversionQueue';
import { BatchControls } from '../components/BatchControls';
import type { FileItem, ConversionMode } from '../types';
import { Image as ImageIcon, Zap, Scaling } from 'lucide-react';

interface ImageToolPageProps {
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

export const ImageToolPage: React.FC<ImageToolPageProps> = (props) => {
  const [targetFormat, setTargetFormat] = useState('WEBP');
  const [qualityPreset, setQualityPreset] = useState(85);
  const imageQueue = props.queue.filter((q) => q.category === 'image' || q.category === 'vector');

  const handleApplyPresetFormat = (fmt: string) => {
    setTargetFormat(fmt);
    props.onApplyFormatToAll(fmt);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden glass-panel p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 shadow-2xl shadow-indigo-950/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-500 flex items-center justify-center shadow-xl shadow-indigo-500/40 animate-pulse-glow">
              <ImageIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white tracking-tight">Image Converter Suite</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full uppercase tracking-wider">
                  Pro Studio
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Convert JPG, PNG, WebP, AVIF, GIF, BMP, TIFF & ICO with lossy/lossless compression, DPI scaling & canvas hardware acceleration.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-indigo-950/60 px-3.5 py-2 rounded-2xl border border-indigo-800/50 text-xs font-semibold text-indigo-300">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Canvas 2D Engine</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-950/60 px-3.5 py-2 rounded-2xl border border-purple-800/50 text-xs font-semibold text-purple-300">
              <Scaling className="w-4 h-4 text-purple-400" />
              <span>Auto Resize & Crop</span>
            </div>
          </div>
        </div>

        {/* Format Shortcut Pills Bar */}
        <div className="mt-6 pt-6 border-t border-indigo-900/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Format All:</span>
            {['WEBP', 'PNG', 'JPG', 'AVIF', 'PDF', 'ICO'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleApplyPresetFormat(fmt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                  targetFormat === fmt
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 scale-105'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Quality:</span>
            {[100, 85, 60].map((q) => (
              <button
                key={q}
                onClick={() => setQualityPreset(q)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                  qualityPreset === q
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {q}% {q === 100 ? 'Max' : q === 85 ? 'High' : 'Compact'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <UniversalUploadZone onFilesAdded={props.onFilesAdded} activeCategory="image" />

      {/* Batch Controls & Queue */}
      {imageQueue.length > 0 && (
        <>
          <BatchControls
            files={imageQueue}
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
            files={imageQueue}
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
