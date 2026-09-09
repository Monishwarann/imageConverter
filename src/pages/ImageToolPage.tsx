import React from 'react';
import { UniversalUploadZone } from '../components/UniversalUploadZone';
import { ConversionQueue } from '../components/ConversionQueue';
import { BatchControls } from '../components/BatchControls';
import type { FileItem, ConversionMode } from '../types';
import { Image as ImageIcon, Sliders } from 'lucide-react';

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
  const imageQueue = props.queue.filter((q) => q.category === 'image' || q.category === 'vector');

  return (
    <div className="flex flex-col gap-6">
      {/* Tool Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Image Converter Suite</h2>
            <p className="text-xs text-slate-400">Convert JPG, PNG, WebP, AVIF, GIF, BMP, TIFF, ICO with live quality & size controls.</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-800/40">
          <Sliders className="w-4 h-4" />
          <span>Canvas 2D Hardware Accelerated</span>
        </div>
      </div>

      <UniversalUploadZone onFilesAdded={props.onFilesAdded} activeCategory="image" />

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
