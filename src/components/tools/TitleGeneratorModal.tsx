import React, { useState, useEffect } from 'react';
import { generateTitle } from '../../utils/titleGenerator';
import { RefreshCw, Copy, Check } from 'lucide-react';

interface TitleGeneratorModalProps {
  onClose: () => void;
}

export function TitleGeneratorModal({ onClose }: TitleGeneratorModalProps) {
  const [titles, setTitles] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateNewTitles = () => {
    const newTitles = Array.from({ length: 12 }, () => generateTitle());
    setTitles(newTitles);
    setCopiedIndex(null);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    generateNewTitles();
  }, []);

  return (
    <div id="modal-title-generator" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
        <button 
          id="btn-close-title-generator"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
          title="关闭"
        >
          ✕
        </button>

        <div className="border-b border-stone-200 pb-3 flex justify-between items-end">
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-600 flex items-center gap-2">
              🎖️ 冒险者称号生成器
            </h2>
            <p className="text-[11px] text-stone-500 mt-1">
              从田间绰号到史诗传说，生成随机称号。
            </p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto max-h-[60vh] py-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {titles.map((title, index) => (
              <div 
                key={index}
                className="group relative flex items-center justify-between p-3 border border-stone-200 rounded-lg bg-stone-50 hover:bg-stone-100 hover:border-amber-300 transition-colors"
                id={`title-item-${index}`}
              >
                <span className="font-bold text-stone-800 text-xs sm:text-sm tracking-tight truncate pr-5" title={title}>
                  {title}
                </span>
                <button
                  onClick={() => copyToClipboard(title, index)}
                  className="absolute right-2 text-stone-400 hover:text-amber-600 bg-transparent border-none cursor-pointer p-1 animate-in duration-200"
                  title="复制称号"
                >
                  {copiedIndex === index ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-stone-200 flex justify-end">
          <button 
            id="btn-refresh-titles"
            onClick={generateNewTitles}
            className="bg-amber-600 text-white font-semibold text-sm px-5 py-2.5 rounded shadow-sm hover:bg-amber-700 transition-all flex items-center gap-2 border-none cursor-pointer"
          >
            <RefreshCw size={14} />
            换一批
          </button>
        </div>
      </div>
    </div>
  );
}