import React, { useState } from 'react';
import { UniversalUploadZone } from '../components/UniversalUploadZone';
import { ConversionQueue } from '../components/ConversionQueue';
import { BatchControls } from '../components/BatchControls';
import type { FileItem, ConversionMode } from '../types';
import { Type, Eye } from 'lucide-react';

interface FontToolPageProps {
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

export const FontToolPage: React.FC<FontToolPageProps> = (props) => {
  const [sampleText, setSampleText] = useState('The quick brown fox jumps over the lazy dog 1234567890');
  const [fontSize, setFontSize] = useState(28);
  const fontQueue = props.queue.filter((q) => q.category === 'font');

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner Hot Pink/Coral Theme */}
      <div className="relative overflow-hidden glass-panel p-8 rounded-3xl border border-pink-500/30 bg-gradient-to-r from-pink-950/80 via-slate-900/90 to-rose-950/80 shadow-2xl shadow-pink-950/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-600 to-amber-500 flex items-center justify-center shadow-xl shadow-pink-500/40">
              <Type className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white tracking-tight">Web Font Studio & Visualizer</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded-full uppercase tracking-wider">
                  FontFace API
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Convert TTF, OTF, WOFF & WOFF2 web fonts with real-time live typeface rendering & custom sample text preview.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-pink-950/60 px-3.5 py-2 rounded-2xl border border-pink-800/50 text-xs font-bold text-pink-300">
            <Eye className="w-4 h-4 text-pink-400" />
            <span>Interactive Type Tester</span>
          </div>
        </div>

        {/* Live Font Tester Control Box */}
        <div className="mt-6 pt-6 border-t border-pink-900/40 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Live Typeface Tester</span>
            <div className="flex items-center gap-2">
              <span>Font Size: {fontSize}px</span>
              <input
                type="range"
                min="14"
                max="60"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-32 accent-pink-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <input
            type="text"
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            style={{ fontSize: `${fontSize}px` }}
            className="w-full bg-slate-950/90 text-white font-sans rounded-2xl px-4 py-3 border border-pink-900/50 focus:outline-none focus:border-pink-500 tracking-wide"
          />
        </div>
      </div>

      <UniversalUploadZone onFilesAdded={props.onFilesAdded} activeCategory="font" />

      {fontQueue.length > 0 && (
        <>
          <BatchControls
            files={fontQueue}
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
            files={fontQueue}
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
