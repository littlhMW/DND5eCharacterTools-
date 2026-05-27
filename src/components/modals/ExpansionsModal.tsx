import React from 'react';
import { EXPANSIONS, ExpansionBook, BookSettings } from '../../utils/expansionHelper';

interface ExpansionsModalProps {
  open: boolean;
  onClose: () => void;
  expansionSettings: Record<string, BookSettings>;
  setExpansionSettings: (settings: Record<string, BookSettings>) => void;
  saveExpansionSettings: (settings: Record<string, BookSettings>) => void;
  setActiveExpansions: (exp: string[]) => void;
  handleBookMasterToggle: (expId: string, checked: boolean) => void;
  handleCategoryToggle: (expId: string, category: 'races' | 'classes' | 'backgrounds' | 'other', checked: boolean) => void;
  handleExportConfig: () => void;
  handleImportConfig: () => void;
  showImportInput: boolean;
  setShowImportInput: (show: boolean) => void;
  importString: string;
  setImportString: (val: string) => void;
  expMsg: { type: string; text: string };
}

export function ExpansionsModal({
  open,
  onClose,
  expansionSettings,
  setExpansionSettings,
  saveExpansionSettings,
  setActiveExpansions,
  handleBookMasterToggle,
  handleCategoryToggle,
  handleExportConfig,
  handleImportConfig,
  showImportInput,
  setShowImportInput,
  importString,
  setImportString,
  expMsg
}: ExpansionsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
          title="关闭"
        >
          ✕
        </button>

        <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
              📚 扩展书与规则集管理
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xl pr-2 leading-relaxed">
              启用或禁用特定的官方扩展书。启用后，您可以进一步勾选是否开启该扩展内的 <strong>种族</strong>、<strong>职业</strong> 或 <strong>背景</strong> 功能。
              <span className="block mt-1">⭐️ <strong>存在同一种族的不同扩展时，在创建角色时点击扩展缩写切换扩展。</strong></span>
              <span className="block mt-1 font-medium text-amber-600">⚠️ 提示：扩展包目前为 Beta 测试版本，内容可能存在翻译或机制错漏，请谨慎参考。</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const allIds = EXPANSIONS.filter(e => !e.isCore).map(e => e.id);
                const newSettings = { ...expansionSettings };
                for (const expId of allIds) {
                  newSettings[expId] = {
                    enabled: true,
                    races: true,
                    classes: true,
                    backgrounds: true,
                    other: true
                  };
                }
                setExpansionSettings(newSettings);
                saveExpansionSettings(newSettings);
                setActiveExpansions(allIds);
              }}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded transition-colors border border-stone-200 cursor-pointer"
            >
              全选非核心
            </button>
            <button
              onClick={() => {
                const newSettings = { ...expansionSettings };
                for (const exp of EXPANSIONS) {
                  if (exp.isCore) continue;
                  newSettings[exp.id] = {
                    enabled: false,
                    races: false,
                    classes: false,
                    backgrounds: false,
                    other: false
                  };
                }
                setExpansionSettings(newSettings);
                saveExpansionSettings(newSettings);
                setActiveExpansions([]);
              }}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded transition-colors border border-stone-200 cursor-pointer"
            >
              全不选
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {EXPANSIONS.map((exp: ExpansionBook) => {
            const bookSet = expansionSettings[exp.id] || { enabled: false, races: false, classes: false, backgrounds: false, other: false };
            const isBookEnabled = exp.isCore || bookSet.enabled;
            
            return (
              <div key={exp.id} className={`p-3 rounded-md border transition-all flex flex-col ${isBookEnabled ? 'bg-amber-50/20 border-amber-200/50' : 'bg-stone-50/50 border-stone-200 opacity-60 hover:opacity-100'}`}>
                <div className="flex items-start justify-between gap-2 mb-1.5 border-b border-stone-100 pb-1.5">
                  <div className="flex items-center flex-wrap gap-1.5">
                    <span className="font-bold text-sm text-stone-900">{exp.name}</span>
                    <span 
                      onClick={() => {
                        if (!exp.isCore) handleBookMasterToggle(exp.id, !bookSet.enabled);
                      }}
                      className={`text-[9px] ${!exp.isCore ? 'cursor-pointer hover:bg-stone-300' : ''} bg-stone-200 text-stone-500 px-1 py-0.5 rounded font-mono uppercase leading-none transition-colors`}
                      title={!exp.isCore ? "点击切换整个规则书状态" : ""}
                    >
                      {exp.shortName}
                    </span>
                    {exp.isCore ? (
                      <span className="text-[9px] bg-amber-500 text-white px-1 py-0.5 rounded leading-none">核心</span>
                    ) : (
                      <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-200 px-1 py-0.5 rounded leading-none">Beta 错漏谨用</span>
                    )}
                  </div>
                  {!exp.isCore && (
                    <div className="shrink-0 flex items-center h-full pt-0.5">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={bookSet.enabled}
                          onChange={(e) => handleBookMasterToggle(exp.id, e.target.checked)}
                        />
                        <div className="w-7 h-4 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[12px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-stone-600 space-y-2.5 mt-1 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-stone-500 leading-relaxed italic mb-2.5">
                      {exp.description}
                    </p>
                    
                    {/* Races */}
                    {exp.races && (
                      <div className={`flex items-start gap-1.5 text-[11px] mb-2 transition-opacity duration-200 ${!isBookEnabled || (bookSet.races === false && !exp.isCore) ? 'opacity-40' : 'opacity-100'}`}>
                        <label className="shrink-0 flex items-center gap-1 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            disabled={exp.isCore || !bookSet.enabled}
                            checked={exp.isCore ? true : bookSet.races}
                            onChange={(e) => handleCategoryToggle(exp.id, 'races', e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 border-stone-300 accent-amber-600"
                          />
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded leading-none font-medium">
                            种族
                          </span>
                        </label>
                        <span className={`text-stone-700 leading-relaxed font-sans ${(!isBookEnabled || (bookSet.races === false && !exp.isCore)) ? 'line-through decoration-stone-400' : ''}`}>
                          {exp.races}
                        </span>
                      </div>
                    )}

                    {/* Classes */}
                    {exp.classes && (
                      <div className={`flex items-start gap-1.5 text-[11px] mb-2 transition-opacity duration-200 ${!isBookEnabled || (bookSet.classes === false && !exp.isCore) ? 'opacity-40' : 'opacity-100'}`}>
                        <label className="shrink-0 flex items-center gap-1 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            disabled={exp.isCore || !bookSet.enabled}
                            checked={exp.isCore ? true : bookSet.classes}
                            onChange={(e) => handleCategoryToggle(exp.id, 'classes', e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 accent-emerald-500"
                          />
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded leading-none font-medium">
                            职业
                          </span>
                        </label>
                        <span className={`text-stone-700 leading-relaxed font-sans ${(!isBookEnabled || (bookSet.classes === false && !exp.isCore)) ? 'line-through decoration-stone-400' : ''}`}>
                          {exp.classes}
                        </span>
                      </div>
                    )}

                    {/* Backgrounds */}
                    {exp.backgrounds && (
                      <div className={`flex items-start gap-1.5 text-[11px] mb-2 transition-opacity duration-200 ${!isBookEnabled || (bookSet.backgrounds === false && !exp.isCore) ? 'opacity-40' : 'opacity-100'}`}>
                        <label className="shrink-0 flex items-center gap-1 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            disabled={exp.isCore || !bookSet.enabled}
                            checked={exp.isCore ? true : bookSet.backgrounds}
                            onChange={(e) => handleCategoryToggle(exp.id, 'backgrounds', e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-indigo-650 focus:ring-indigo-500 border-stone-300 accent-indigo-650"
                          />
                          <span className="text-[10px] bg-violet-100 text-violet-800 px-1 py-0.5 rounded leading-none font-medium">
                            背景
                          </span>
                        </label>
                        <span className={`text-stone-700 leading-relaxed font-sans ${(!isBookEnabled || (bookSet.backgrounds === false && !exp.isCore)) ? 'line-through decoration-stone-400' : ''}`}>
                          {exp.backgrounds}
                        </span>
                      </div>
                    )}

                    {/* Other Features */}
                    {exp.otherFeatures && (
                      <div className={`flex items-start gap-1.5 text-[11px] mb-1 transition-opacity duration-200 ${!isBookEnabled || (bookSet.other === false && !exp.isCore) ? 'opacity-40' : 'opacity-100'}`}>
                        <label className="shrink-0 flex items-center gap-1 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            disabled={exp.isCore || !bookSet.enabled}
                            checked={exp.isCore ? true : bookSet.other}
                            onChange={(e) => handleCategoryToggle(exp.id, 'other', e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-sky-500 border-stone-300 accent-sky-500"
                          />
                          <span className="text-[10px] bg-sky-100 text-sky-900 px-1 py-0.5 rounded leading-none font-medium">
                            其他
                          </span>
                        </label>
                        <span className={`text-stone-605 leading-relaxed font-sans ${(!isBookEnabled || (bookSet.other === false && !exp.isCore)) ? 'line-through decoration-stone-400' : ''}`}>
                          {exp.otherFeatures}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 配置备份与同步 */}
        <div className="mt-2 pt-3 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5 font-serif">
                📋 规则书配置备份与导入
              </span>
              {expMsg.text && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${expMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 animate-in fade-in duration-150' : 'bg-red-50 text-red-800'}`}>
                  {expMsg.text}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportConfig}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded transition-colors shadow-xs border-none cursor-pointer flex items-center gap-1 font-sans"
                title="点击复制当前的规则书开启/关闭配置 JSON"
              >
                📤 点击复制配置
              </button>

              {!showImportInput ? (
                <button
                  onClick={() => setShowImportInput(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded transition-colors shadow-xs border-none cursor-pointer flex items-center gap-1 font-sans"
                >
                  📥 点击导入配置
                </button>
              ) : (
                <div className="flex items-center gap-1.5 animate-in slide-in-from-right-1 duration-150">
                  <input
                    type="text"
                    placeholder="在此粘贴导出的配置 JSON 文本..."
                    value={importString}
                    onChange={(e) => setImportString(e.target.value)}
                    className="text-white text-xs px-2.5 py-1.5 bg-stone-900 border border-stone-700 rounded focus:border-amber-500 focus:outline-none w-56 font-mono h-[32px] placeholder-stone-500"
                  />
                  <button
                    onClick={handleImportConfig}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors border-none cursor-pointer h-[32px] flex items-center justify-center"
                  >
                    确认
                  </button>
                  <button
                    onClick={() => {
                      setShowImportInput(false);
                      setImportString('');
                    }}
                    className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold rounded transition-colors border-none cursor-pointer h-[32px] flex items-center justify-center"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded transition-colors shadow-sm cursor-pointer border-none"
          >
            保存并关闭
          </button>
        </div>
      </div>
    </div>
  );
}
