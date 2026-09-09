import React, { useState } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import type { FileItem, ConversionOptions } from '../types';

interface AdvancedSettingsModalProps {
  item: FileItem | null;
  onClose: () => void;
  onSave: (id: string, options: ConversionOptions) => void;
}

export const AdvancedSettingsModal: React.FC<AdvancedSettingsModalProps> = ({ item, onClose, onSave }) => {
  if (!item) return null;

  const [options, setOptions] = useState<ConversionOptions>(item.customOptions || {
    quality: 85,
    pageSize: 'A4',
    orientation: 'portrait',
    margins: 10,
    csvDelimiter: ',',
    indentation: 2,
    ocrLanguage: 'eng',
  });

  const handleSave = () => {
    onSave(item.id, options);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Conversion Options</h3>
            <p className="text-xs text-slate-400 font-medium">{item.name}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-1">
          {/* Image Options */}
          {(item.category === 'image' || item.category === 'vector') && (
            <div className="flex flex-col gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-extrabold uppercase text-indigo-400 tracking-wider">Image Settings</h4>
              
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Quality ({options.quality || 85}%)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={options.quality || 85}
                  onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Max Width (px)</label>
                  <input
                    type="number"
                    placeholder="Auto"
                    value={options.width || ''}
                    onChange={(e) => setOptions({ ...options, width: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Max Height (px)</label>
                  <input
                    type="number"
                    placeholder="Auto"
                    value={options.height || ''}
                    onChange={(e) => setOptions({ ...options, height: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PDF Options */}
          {(item.category === 'pdf' || item.selectedOutputFormat === 'PDF') && (
            <div className="flex flex-col gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-extrabold uppercase text-indigo-400 tracking-wider">PDF Page Options</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Page Size</label>
                  <select
                    value={options.pageSize || 'A4'}
                    onChange={(e) => setOptions({ ...options, pageSize: e.target.value as any })}
                    className="w-full bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2 border border-slate-700"
                  >
                    <option value="A4">A4</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                    <option value="A3">A3</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Orientation</label>
                  <select
                    value={options.orientation || 'portrait'}
                    onChange={(e) => setOptions({ ...options, orientation: e.target.value as any })}
                    className="w-full bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2 border border-slate-700"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Watermark Text</label>
                <input
                  type="text"
                  placeholder="e.g. CONFIDENTIAL or DRAFT"
                  value={options.watermarkText || ''}
                  onChange={(e) => setOptions({ ...options, watermarkText: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* OCR Options */}
          {item.category === 'ocr' && (
            <div className="flex flex-col gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-extrabold uppercase text-purple-400 tracking-wider">OCR Language</h4>
              <select
                value={options.ocrLanguage || 'eng'}
                onChange={(e) => setOptions({ ...options, ocrLanguage: e.target.value as any })}
                className="w-full bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2 border border-slate-700"
              >
                <option value="eng">English</option>
                <option value="spa">Spanish (Español)</option>
                <option value="fra">French (Français)</option>
                <option value="deu">German (Deutsch)</option>
                <option value="chi_sim">Chinese Simplified (中文)</option>
                <option value="jpn">Japanese (日本語)</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Apply Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
