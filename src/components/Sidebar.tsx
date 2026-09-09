import React from 'react';
import {
  Grid,
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  Presentation,
  Compass,
  Code2,
  BookOpen,
  Archive,
  Type,
  Subtitles,
  ScanText,
  History,
} from 'lucide-react';
import type { FormatCategory } from '../types';

interface SidebarProps {
  activeCategory: FormatCategory;
  setActiveCategory: (cat: FormatCategory) => void;
}

const CATEGORIES: { id: FormatCategory; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'universal', label: 'Universal Converter', icon: Grid },
  { id: 'image', label: 'Image Converter', icon: ImageIcon },
  { id: 'pdf', label: 'PDF Toolkit', icon: FileText, badge: 'HOT' },
  { id: 'document', label: 'Document Tools', icon: FileText },
  { id: 'spreadsheet', label: 'Spreadsheets', icon: FileSpreadsheet },
  { id: 'presentation', label: 'Presentations', icon: Presentation },
  { id: 'vector', label: 'Vector Graphics', icon: Compass },
  { id: 'text_data', label: 'Text & Data Tools', icon: Code2 },
  { id: 'ebook', label: 'E-Book Converter', icon: BookOpen },
  { id: 'archive', label: 'Archive Tools', icon: Archive },
  { id: 'font', label: 'Font Tools', icon: Type },
  { id: 'subtitle', label: 'Subtitles / Captions', icon: Subtitles },
  { id: 'ocr', label: 'OCR Text Recognition', icon: ScanText, badge: 'AI' },
  { id: 'history', label: 'Conversion History', icon: History },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeCategory, setActiveCategory }) => {
  return (
    <aside className="w-full lg:w-64 glass-panel border-r border-slate-800/80 p-4 shrink-0 flex flex-col gap-1.5">
      <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        Format Categories
      </div>

      <nav className="flex flex-col gap-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                <span>{cat.label}</span>
              </div>

              {cat.badge && (
                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${
                  cat.badge === 'AI' 
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40' 
                    : 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                }`}>
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="mt-auto pt-4 border-t border-slate-800/60 px-3 py-2 text-center text-[11px] text-slate-500">
        <p className="font-semibold text-slate-400">100% Client-Side Privacy</p>
        <p className="text-[10px] mt-0.5">Files never leave your browser</p>
      </div>
    </aside>
  );
};
