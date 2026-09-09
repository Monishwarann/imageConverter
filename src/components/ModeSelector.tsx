import React from 'react';
import { Layers, Combine, Settings2, Sparkles } from 'lucide-react';
import type { ConversionMode } from '../types';

interface ModeSelectorProps {
  mode: ConversionMode;
  setMode: (mode: ConversionMode) => void;
  fileCount: number;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode, fileCount }) => {
  const modes: { id: ConversionMode; label: string; desc: string; icon: React.ElementType }[] = [
    {
      id: 'multi',
      label: 'Multi Convert',
      desc: 'Mixed files with custom output format per file',
      icon: Layers,
    },
    {
      id: 'batch',
      label: 'Batch Convert',
      desc: 'Convert all compatible files to same output',
      icon: Sparkles,
    },
    {
      id: 'merge',
      label: 'Merge to PDF',
      desc: 'Combine multiple images/PDFs into 1 single PDF',
      icon: Combine,
    },
    {
      id: 'single',
      label: 'Single Convert',
      desc: 'Focused conversion mode for 1 file',
      icon: Settings2,
    },
  ];

  return (
    <div className="bg-slate-900/80 p-2 rounded-2xl border border-slate-800 flex flex-wrap lg:flex-nowrap gap-2">
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = mode === m.id;

        return (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex-1 min-w-[180px] p-3 rounded-xl text-left transition-all relative overflow-hidden ${
              isActive
                ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                : 'bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                <span>{m.label}</span>
              </div>
              {isActive && fileCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/20 text-white">
                  {fileCount}
                </span>
              )}
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed line-clamp-1">{m.desc}</p>
          </button>
        );
      })}
    </div>
  );
};
