import React from 'react';
import { generateXgeBackstory } from '../../utils/xgeLifeGenerator';

interface XgeModalProps {
  open: boolean;
  onClose: () => void;
  xgePreviewText: string;
  setXgePreviewText: React.Dispatch<React.SetStateAction<string>>;
  xgePreviewClass: string;
  setXgePreviewClass: React.Dispatch<React.SetStateAction<string>>;
  xgePreviewBg: string;
  setXgePreviewBg: React.Dispatch<React.SetStateAction<string>>;
  xgePreviewAge: string | number;
  setXgePreviewAge: React.Dispatch<React.SetStateAction<string | number>>;
  xgePreviewChaMod: string | number;
  setXgePreviewChaMod: React.Dispatch<React.SetStateAction<string | number>>;
  classes: any[];
  backgrounds: any[];
}

export function XgeModal({
  open,
  onClose,
  xgePreviewText,
  setXgePreviewText,
  xgePreviewClass,
  setXgePreviewClass,
  xgePreviewBg,
  setXgePreviewBg,
  xgePreviewAge,
  setXgePreviewAge,
  xgePreviewChaMod,
  setXgePreviewChaMod,
  classes,
  backgrounds
}: XgeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
          title="关闭"
        >
          ✕
        </button>

        <div className="border-b border-stone-200 pb-3">
          <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
            📜 XGE "这是你的人生" 掷骰面板
          </h2>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed font-sans">
            根基于《万事指南》（Xanathar's Guide to Everything）核心表随机拼合生成生动的人生经历。
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2 bg-amber-50/50 p-2 rounded border border-amber-200">
            <div className="flex items-start gap-2">
              <input 
                type="checkbox"
                id="xgeNonPhbSupportToggle"
                checked={localStorage.getItem('useNonPhbSupportXge') !== 'false'}
                onChange={(e) => {
                  localStorage.setItem('useNonPhbSupportXge', String(e.target.checked));
                  setXgePreviewText(xgePreviewText + ' ');
                  setTimeout(() => setXgePreviewText((prev) => prev.trim()), 0);
                }}
                className="w-4 h-4 mt-0.5 text-amber-600 rounded bg-white border-stone-300 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="xgeNonPhbSupportToggle" className="text-xs font-semibold text-amber-900 cursor-pointer flex-1">
                开启非 PHB 背景/职业支持 (非官方内容)
                <span className="block text-[10px] text-amber-700/80 font-normal mt-0.5">
                  不仅支持 PHB，还解锁所有扩展包中的职业与背景的故事支持。
                </span>
              </label>
            </div>
            <div className="flex items-start gap-2 border-t border-amber-200/50 pt-2">
              <input 
                type="checkbox"
                id="xgeExpandedToggle"
                checked={localStorage.getItem('useExpandedXge') === 'true'}
                onChange={(e) => {
                  localStorage.setItem('useExpandedXge', String(e.target.checked));
                  setXgePreviewText(xgePreviewText + ' ');
                  setTimeout(() => setXgePreviewText((prev) => prev.trim()), 0);
                }}
                className="w-4 h-4 mt-0.5 text-amber-600 rounded bg-white border-stone-300 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="xgeExpandedToggle" className="text-xs font-semibold text-amber-900 cursor-pointer flex-1">
                启用个人故事扩展（非官方内容）
                <span className="block text-[10px] text-amber-700/80 font-normal mt-0.5">
                  解锁数倍于原版的自制随机背景、奇遇、命运波澜。
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                选择职业：
              </label>
              <select
                value={xgePreviewClass}
                onChange={(e) => setXgePreviewClass(e.target.value)}
                className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none cursor-pointer h-[34px]"
              >
                <option value="">(空缺则随机)</option>
                {localStorage.getItem('useNonPhbSupportXge') !== 'false' 
                  ? classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                  : [
                      {id: 'barbarian', name: '野蛮人'},
                      {id: 'bard', name: '吟游诗人'},
                      {id: 'cleric', name: '牧师'},
                      {id: 'druid', name: '德鲁伊'},
                      {id: 'fighter', name: '战士'},
                      {id: 'monk', name: '武僧'},
                      {id: 'paladin', name: '圣武士'},
                      {id: 'ranger', name: '游侠'},
                      {id: 'rogue', name: '游荡者'},
                      {id: 'sorcerer', name: '术士'},
                      {id: 'warlock', name: '邪术师'},
                      {id: 'wizard', name: '法师'}
                    ].map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                }
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                选择背景：
              </label>
              <select
                value={xgePreviewBg}
                onChange={(e) => setXgePreviewBg(e.target.value)}
                className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none cursor-pointer h-[34px]"
              >
                <option value="">(空缺则随机)</option>
                {localStorage.getItem('useNonPhbSupportXge') !== 'false' 
                  ? backgrounds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                  : [
                      {id: 'acolyte', name: '侍祭'},
                      {id: 'charlatan', name: '骗子'},
                      {id: 'criminal', name: '罪犯'},
                      {id: 'entertainer', name: '艺人'},
                      {id: 'folk-hero', name: '平民英雄'},
                      {id: 'guild-artisan', name: '工匠行会'},
                      {id: 'hermit', name: '隐士'},
                      {id: 'noble', name: '贵族'},
                      {id: 'outlander', name: '荒野隐士'},
                      {id: 'sage', name: '贤者'},
                      {id: 'sailor', name: '水手'},
                      {id: 'soldier', name: '士兵'},
                      {id: 'urchin', name: '孤儿'}
                    ].map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                }
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                年龄：
              </label>
              <input
                type="number"
                placeholder="随机"
                value={xgePreviewAge}
                onChange={(e) => setXgePreviewAge(e.target.value ? parseInt(e.target.value, 10) : '')}
                className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none h-[34px]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                魅力调整值：
              </label>
              <input
                type="number"
                placeholder="默认 +0"
                value={xgePreviewChaMod}
                onChange={(e) => setXgePreviewChaMod(e.target.value ? parseInt(e.target.value, 10) : '')}
                className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none h-[34px]"
              />
            </div>
          </div>

          <div className="flex justify-between items-center bg-stone-50 border border-stone-200 rounded p-3">
            <span className="text-[11px] text-stone-600">
              生成人生经历：
            </span>
            <button
              onClick={() => {
                const useExpanded = localStorage.getItem('useExpandedXge') === 'true';
                const useNonPhbSupport = localStorage.getItem('useNonPhbSupportXge') !== 'false';
                const ctx = { 
                  backgroundId: xgePreviewBg, 
                  classId: xgePreviewClass,
                  age: typeof xgePreviewAge === 'number' ? xgePreviewAge : undefined,
                  chaMod: typeof xgePreviewChaMod === 'number' ? xgePreviewChaMod : undefined
                };
                const text = generateXgeBackstory(ctx, { useExpanded, useNonPhbSupport });
                setXgePreviewText(text);
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs rounded transition-colors shadow-xs cursor-pointer border-none flex items-center gap-1 font-sans"
            >
              🎲 掷骰
            </button>
          </div>

          {xgePreviewText ? (
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-stone-700">
                 骰表掷骰生平结果预览:
              </span>
              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-lg max-h-[160px] overflow-y-auto text-xs text-stone-700 leading-relaxed font-sans whitespace-pre-wrap">
                {xgePreviewText}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-stone-200 rounded-lg p-5 bg-stone-50/50 text-stone-405 text-xs text-center leading-relaxed">
              暂无掷骰。
            </div>
          )}
        </div>

        <div className="border-t border-stone-200 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
          >
            关闭面板
          </button>
        </div>
      </div>
    </div>
  );
}
