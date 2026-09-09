import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, FileText, Image as ImageIcon, Code2 } from 'lucide-react';
import type { FileItem } from '../types';

interface FilePreviewModalProps {
  item: FileItem | null;
  onClose: () => void;
  onDownload: (item: FileItem) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ item, onClose, onDownload }) => {
  if (!item || !item.convertedBlob) return null;

  const [textContent, setTextContent] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (item && item.convertedBlob) {
      if (item.category === 'image') {
        const url = URL.createObjectURL(item.convertedBlob);
        setImageUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        item.convertedBlob.text().then((text) => {
          setTextContent(text.slice(0, 15000)); // limit text preview chunk
        });
      }
    }
  }, [item]);

  const handleCopyText = () => {
    if (textContent) {
      navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-4xl rounded-3xl p-6 border border-slate-700 shadow-2xl relative flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              {item.category === 'image' ? (
                <ImageIcon className="w-5 h-5" />
              ) : item.category === 'text_data' ? (
                <Code2 className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white truncate max-w-md">
                {item.convertedName || item.name}
              </h3>
              <p className="text-xs text-emerald-400 font-semibold">Converted Successfully</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {textContent && (
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Content'}</span>
              </button>
            )}

            <button
              onClick={() => onDownload(item)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto bg-slate-950 p-4 rounded-2xl border border-slate-900 flex items-center justify-center">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
            />
          )}

          {textContent && (
            <pre className="w-full h-[60vh] overflow-auto text-xs font-mono text-slate-300 whitespace-pre-wrap break-all p-4 bg-slate-900/80 rounded-xl border border-slate-800 leading-relaxed selection:bg-indigo-500 selection:text-white">
              {textContent}
            </pre>
          )}

          {!imageUrl && !textContent && (
            <div className="text-center p-8 text-slate-400 text-xs font-medium">
              Preview unavailable for binary file. Click Download to save file locally.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
