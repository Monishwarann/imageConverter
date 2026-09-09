import React from 'react';
import {
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  Code2,
  ScanText,
  Subtitles,
  ArrowRight,
} from 'lucide-react';
import type { FormatCategory } from '../types';

interface QuickToolsGridProps {
  setActiveCategory: (cat: FormatCategory) => void;
}

const QUICK_TOOLS = [
  {
    title: 'Image Converter',
    desc: 'Convert JPG, PNG, WebP, AVIF, GIF with compression & resize options',
    icon: ImageIcon,
    category: 'image' as FormatCategory,
    color: 'from-indigo-500 to-purple-600',
  },
  {
    title: 'PDF Toolkit',
    desc: 'Merge, split, compress, watermark & convert PDF to DOCX/TXT/Images',
    icon: FileText,
    category: 'pdf' as FormatCategory,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Spreadsheets',
    desc: 'Convert XLSX, XLS, CSV, TSV, ODS to Excel, CSV or PDF',
    icon: FileSpreadsheet,
    category: 'spreadsheet' as FormatCategory,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'OCR Text Extractor',
    desc: 'Extract text from scanned PDFs & images into editable DOCX/TXT',
    icon: ScanText,
    category: 'ocr' as FormatCategory,
    color: 'from-purple-500 to-pink-600',
  },
  {
    title: 'Text & Data Tools',
    desc: 'Format, minify & convert JSON, XML, YAML, Markdown & HTML',
    icon: Code2,
    category: 'text_data' as FormatCategory,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Subtitles & Captions',
    desc: 'Cross convert SRT, VTT, ASS, SSA caption files',
    icon: Subtitles,
    category: 'subtitle' as FormatCategory,
    color: 'from-amber-500 to-orange-600',
  },
];

export const QuickToolsGrid: React.FC<QuickToolsGridProps> = ({ setActiveCategory }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Popular Toolkits</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.title}
              onClick={() => setActiveCategory(tool.category)}
              className="glass-card p-5 rounded-2xl cursor-pointer group flex flex-col justify-between h-full"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                  {tool.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{tool.desc}</p>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 mt-4 group-hover:translate-x-1 transition-transform">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
