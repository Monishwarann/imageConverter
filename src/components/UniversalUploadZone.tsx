import React, { useState, useRef } from 'react';
import { UploadCloud, FolderPlus, Sparkles, FileType } from 'lucide-react';
import { detectFileType } from '../services/formatDetector';
import { getSupportedOutputFormats } from '../services/formatMatrix';
import type { FileItem, FormatCategory } from '../types';

interface UniversalUploadZoneProps {
  onFilesAdded: (files: FileItem[]) => void;
  activeCategory: FormatCategory;
}

export const UniversalUploadZone: React.FC<UniversalUploadZoneProps> = ({ onFilesAdded, activeCategory }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    const newItems: FileItem[] = [];

    for (const file of fileList) {
      const detection = await detectFileType(file);
      const availableOutputs = getSupportedOutputFormats(detection.format);
      const defaultOutput = availableOutputs[0] || 'PDF';

      newItems.push({
        id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        size: file.size,
        detectedFormat: detection.format,
        mimeType: detection.mimeType,
        category: activeCategory === 'universal' ? detection.category : activeCategory,
        selectedOutputFormat: defaultOutput,
        availableOutputs,
        status: 'queued',
        progress: 0,
      });
    }

    if (newItems.length > 0) {
      onFilesAdded(newItems);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileDrop(e.dataTransfer.files);
    }
  };

  // Sample files creator for instant demo testing
  const loadSampleFiles = () => {
    const sampleJpg = new File(['sample image content'], 'sample_photo.jpg', { type: 'image/jpeg' });
    const sampleCsv = new File(['ID,Name,Role\n1,Alice,Engineer\n2,Bob,Designer'], 'sample_data.csv', { type: 'text/csv' });
    const sampleMd = new File(['# ConvertX Document\n\nWelcome to **ConvertX**! All-in-one file converter.'], 'sample_readme.md', { type: 'text/markdown' });
    
    handleFileDrop([sampleJpg, sampleCsv, sampleMd]);
  };

  return (
    <div id="upload-zone" className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 overflow-hidden ${
          isDragging
            ? 'border-indigo-400 bg-indigo-500/10 shadow-2xl shadow-indigo-500/30 scale-[1.01]'
            : 'border-slate-700/80 hover:border-indigo-500/50 bg-slate-900/50 hover:bg-slate-900/80 glass-panel'
        }`}
      >
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFileDrop(e.target.files)}
        />
        
        <input
          ref={folderInputRef}
          type="file"
          // @ts-ignore
          webkitdirectory=""
          directory=""
          className="hidden"
          onChange={(e) => e.target.files && handleFileDrop(e.target.files)}
        />

        <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
          {/* Main Icon */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30 animate-pulse-glow group cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            <UploadCloud className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
            Drop Any File Here
          </h2>

          <p className="text-sm text-slate-400 mb-6 max-w-md leading-relaxed">
            Drag & drop multiple files or folders. Automatic format detection for Images, PDF, Spreadsheets, Docs, Data, Fonts, Archives & Subtitles.
          </p>

          {/* Buttons Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <FileType className="w-4 h-4" />
              <span>Browse Files</span>
            </button>

            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4 text-indigo-400" />
              <span>Select Folder</span>
            </button>

            <button
              type="button"
              onClick={loadSampleFiles}
              className="px-4 py-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-800/50 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Try Sample Files</span>
            </button>
          </div>

          {/* Formats Supported Pill Array */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60">Images (JPG, PNG, WebP, AVIF, GIF)</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60">PDF Toolkit & OCR</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60">Docs & Spreadsheets</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60">JSON, XML, YAML</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60">Fonts & Subtitles</span>
          </div>
        </div>
      </div>
    </div>
  );
};
