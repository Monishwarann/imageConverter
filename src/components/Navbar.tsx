import React from 'react';
import { Layers, Zap, History, Sparkles } from 'lucide-react';
import type { FormatCategory } from '../types';

interface NavbarProps {
  activeCategory: FormatCategory;
  setActiveCategory: (cat: FormatCategory) => void;
  queueCount: number;
  completedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  setActiveCategory,
  queueCount,
  completedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
      {/* Logo & Tagline */}
      <div 
        onClick={() => setActiveCategory('universal')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
          <Zap className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              Convert<span className="text-indigo-400">X</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
              PRO v2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Convert Anything. Create Everything.
          </p>
        </div>
      </div>

      {/* Center Quick Stats Badge */}
      <div className="hidden md:flex items-center gap-4 bg-slate-900/60 px-4 py-1.5 rounded-full border border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Queue: <strong className="text-white">{queueCount}</strong></span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Done: <strong className="text-emerald-400">{completedCount}</strong></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveCategory('history')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
            activeCategory === 'history'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">History</span>
        </button>

        <a
          href="#upload-zone"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
        >
          <span>Convert Now</span>
        </a>
      </div>
    </header>
  );
};
