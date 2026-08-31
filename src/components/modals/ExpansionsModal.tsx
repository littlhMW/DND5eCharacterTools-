import React, { useState, useMemo } from 'react';
import { EXPANSIONS, ExpansionBook, BookSettings, getActiveExpansions } from '../../utils/expansionHelper';
import { races } from '../../data/races';
import { classes } from '../../data/classes';
import { backgrounds } from '../../data/backgrounds';

interface ExpansionsModalProps {
  open: boolean;
  onClose: () => void;
  expansionSettings: Record<string, BookSettings>;
  setExpansionSettings: (settings: Record<string, BookSettings>) => void;
  saveExpansionSettings: (settings: Record<string, BookSettings>) => void;
  setActiveExpansions: (exp: string[]) => void;
  handleBookMasterToggle: (expId: string, checked: boolean) => void;
  handleCategoryToggle: (expId: string, category: 'races' | 'classes' | 'backgrounds' | 'other', checked: boolean) => void;
  handleItemToggle?: (expId: string, category: 'races' | 'classes' | 'backgrounds' | 'other', itemId: string, checked: boolean) => void;
  handleExportConfig: () => void;
  handleImportConfig: () => void;
  showImportInput: boolean;
  setShowImportInput: (show: boolean) => void;
  importString: string;
  setImportString: (val: string) => void;
  expMsg: { type: string; text: string };
  allowNewerExpansionOverride: boolean;
  setAllowNewerExpansionOverride: (val: boolean) => void;
}

const CAT_LABELS: Record<string, { label: string; color: string }> = {
  core: { label: '核心 (Core)', color: 'bg-amber-100 text-amber-800' },
  expansion: { label: '扩展 (Expansion)', color: 'bg-blue-100 text-blue-800' },
  setting: { label: '世设 (Setting)', color: 'bg-emerald-100 text-emerald-800' },
  adventure: { label: '冒险 (Adventure)', color: 'bg-indigo-100 text-indigo-800' }
};

export function ExpansionsModal({
  open,
  onClose,
  expansionSettings,
  setExpansionSettings,
  saveExpansionSettings,
  setActiveExpansions,
  handleBookMasterToggle,
  handleCategoryToggle,
  handleItemToggle,
  handleExportConfig,
  handleImportConfig,
  showImportInput,
  setShowImportInput,
  importString,
  setImportString,
  expMsg,
  allowNewerExpansionOverride,
  setAllowNewerExpansionOverride
}: ExpansionsModalProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'races' | 'classes' | 'backgrounds'>('all');
  const [catFilter, setCatFilter] = useState<'all' | 'core' | 'expansion' | 'setting' | 'adventure'>('all');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (id: string, force?: boolean) => {
    const next = new Set(expandedCards);
    if (force === true) next.add(id);
    else if (force === false) next.delete(id);
    else {
      if (next.has(id)) next.delete(id);
      else next.add(id);
    }
    setExpandedCards(next);
  };

  // Pre-calculate items per expansion
  const itemsByExp = useMemo(() => {
    const dict: Record<string, {
      races: { id: string; name: string }[];
      subraces: { id: string; name: string; raceId: string; raceName: string }[];
      classes: { id: string; name: string }[];
      subclasses: { id: string; name: string; classId: string; className: string }[];
      backgrounds: { id: string; name: string }[];
    }> = {};

    for (const exp of EXPANSIONS) {
      dict[exp.id] = { races: [], subraces: [], classes: [], subclasses: [], backgrounds: [] };
    }

    races.forEach(r => {
      const src = (r.source || 'phb').toLowerCase();
      if (dict[src]) dict[src].races.push({ id: r.id, name: r.name });
      
      r.subraces?.forEach(sr => {
        const subSrc = (sr.source || r.source || 'phb').toLowerCase();
        if (dict[subSrc]) dict[subSrc].subraces.push({ id: sr.id, name: sr.name, raceId: r.id, raceName: r.name });
      });
      
      r.alternatives?.forEach(alt => {
        const altSrc = (alt.source || 'phb').toLowerCase();
        if (dict[altSrc]) dict[altSrc].races.push({ id: alt.id, name: alt.name || r.name });
      });
    });

    classes.forEach(c => {
      const src = (c.source || 'phb').toLowerCase();
      if (dict[src]) dict[src].classes.push({ id: c.id, name: c.name });
      
      c.subclasses?.forEach(sc => {
        const subSrc = (sc.source || c.source || 'phb').toLowerCase();
        if (dict[subSrc]) dict[subSrc].subclasses.push({ id: sc.id, name: sc.name, classId: c.id, className: c.name });
      });
    });

    backgrounds.forEach(b => {
      const src = (b.source || 'phb').toLowerCase();
      if (dict[src]) dict[src].backgrounds.push({ id: b.id, name: b.name });
    });

    // Deduplicate lists purely by ID to avoid any key warnings later in React render
    for (const expId in dict) {
      dict[expId].races = Array.from(new Map(dict[expId].races.map(item => [item.id, item])).values());
      dict[expId].subraces = Array.from(new Map(dict[expId].subraces.map(item => [item.id, item])).values());
    }

    return dict;
  }, []);

  const visibleExpansions = useMemo(() => {
    return EXPANSIONS.filter(exp => {
      if (catFilter !== 'all' && exp.bookCategory !== catFilter) return false;
      
      const items = itemsByExp[exp.id];
      if (!items) return false;
      if (filterMode === 'races' && !items.races.length && !items.subraces.length) return false;
      if (filterMode === 'classes' && !items.classes.length && !items.subclasses.length) return false;
      if (filterMode === 'backgrounds' && !items.backgrounds.length) return false;
      return true;
    });
  }, [catFilter, filterMode, itemsByExp]);

  const groupsMenu = ['core', 'expansion', 'setting', 'adventure'] as const;

  const handleEnableVisible = () => {
    const newSettings = { ...expansionSettings };
    const toggleIds: string[] = [];
    visibleExpansions.forEach(exp => {
      if (!exp.isCore) {
        newSettings[exp.id] = { enabled: true, races: true, classes: true, backgrounds: true, other: true, itemOverrides: {} };
        toggleIds.push(exp.id);
      }
    });
    setExpansionSettings(newSettings);
    saveExpansionSettings(newSettings);
    setActiveExpansions([...new Set([...getActiveExpansions(), ...toggleIds])]);
  };

  const handleDisableVisible = () => {
    const newSettings = { ...expansionSettings };
    visibleExpansions.forEach(exp => {
      if (!exp.isCore) {
        newSettings[exp.id] = { enabled: false, races: false, classes: false, backgrounds: false, other: false, itemOverrides: {} };
      }
    });
    setExpansionSettings(newSettings);
    saveExpansionSettings(newSettings);
    setActiveExpansions(EXPANSIONS.filter(e => e.isCore || newSettings[e.id]?.enabled).map(e => e.id));
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-xl relative flex flex-col animate-in zoom-in-95 duration-200 text-left font-sans">
        
        {/* Header */}
        <div className="p-4 md:p-5 pb-3 border-b border-stone-200 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
                📚 规则集与扩展大全
              </h2>
              <p className="text-xs text-stone-500 mt-1 max-w-xl pr-2 leading-relaxed">
                动态扫描内容。启用扩展后可开关具体种族/职业。仅开启单一子职时亦会自动启用该扩展。
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
              title="关闭"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-amber-50/40 rounded-lg border border-amber-200/50">
            <div className="flex flex-col gap-0.5 max-w-[80%] text-left">
              <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                🔄 重名种族与职业以最新源覆盖
              </span>
              <span className="text-[10px] text-stone-500 leading-normal pl-5">
                启用时，自动在种族/职业页完全呈现和选定最高优先发行新版本；关闭时，允许点击缩写标示手动循环切版本。
              </span>
            </div>
            <button
              type="button"
              id="btn-toggle-expansion-override"
              onClick={() => {
                const nextVal = !allowNewerExpansionOverride;
                setAllowNewerExpansionOverride(nextVal);
                localStorage.setItem('allowNewerExpansionOverride', String(nextVal));
              }}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                allowNewerExpansionOverride ? 'bg-amber-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  allowNewerExpansionOverride ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3">
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg w-fit">
                <span className="text-[10px] text-stone-400 ml-1 mr-0.5 font-bold">内容:</span>
                {(['all', 'races', 'classes', 'backgrounds'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`px-3 py-1 text-[11px] rounded-md transition-colors font-medium border-none cursor-pointer ${filterMode === mode ? 'bg-white shadow-sm text-amber-700' : 'bg-transparent text-stone-500 hover:text-stone-700'}`}
                  >
                    {mode === 'all' ? '全部' : mode === 'races' ? '种族' : mode === 'classes' ? '职业' : '背景'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg w-fit">
                <span className="text-[10px] text-stone-400 ml-1 mr-0.5 font-bold">类型:</span>
                <button
                  onClick={() => setCatFilter('all')}
                  className={`px-3 py-1 text-[11px] rounded-md transition-colors font-medium border-none cursor-pointer ${catFilter === 'all' ? 'bg-white shadow-sm text-stone-800' : 'bg-transparent text-stone-500 hover:text-stone-700'}`}
                >全部</button>
                {groupsMenu.map(c => (
                  <button
                    key={c}
                    onClick={() => setCatFilter(c)}
                    className={`px-3 py-1 text-[11px] rounded-md transition-colors font-medium border-none cursor-pointer ${catFilter === c ? 'bg-white shadow-sm text-stone-800' : 'bg-transparent text-stone-500 hover:text-stone-700'}`}
                  >
                    {CAT_LABELS[c].label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEnableVisible}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded transition-colors border border-amber-200 cursor-pointer shadow-sm"
              >
                开启当前列表
              </button>
              <button
                onClick={handleDisableVisible}
                className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-600 text-xs font-medium rounded transition-colors border border-stone-200 cursor-pointer shadow-sm"
              >
                关闭当前列表
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-stone-50/50 flex flex-col gap-8 scroll-smooth">
          {groupsMenu.map(category => {
            const groupExps = visibleExpansions.filter(e => (e.bookCategory || 'expansion') === category);
            if (groupExps.length === 0) return null;

            return (
              <div key={category} className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1 border-b border-stone-200 pb-1">
                  {CAT_LABELS[category].label}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {groupExps.map(exp => {
                    const bookSet = expansionSettings[exp.id] || { enabled: false, races: false, classes: false, backgrounds: false, other: false, itemOverrides: {} };
                    const isBookEnabled = exp.isCore || bookSet.enabled;
                    const items = itemsByExp[exp.id];
                    const isExpanded = expandedCards.has(exp.id);

                    const isItemOn = (cat: 'races'|'classes'|'backgrounds', itemId: string) => {
                       if (exp.isCore) return true;
                       const overrideKey = `${cat}:${itemId}`;
                       if (bookSet.itemOverrides && bookSet.itemOverrides[overrideKey] !== undefined) {
                         return bookSet.itemOverrides[overrideKey];
                       }
                       return bookSet.enabled && bookSet[cat] !== false;
                    };

                    const ItemBadge: React.FC<{ cat: 'races'|'classes'|'backgrounds', index: number, itemId: string, label: string, colorCls: string }> = ({ cat, itemId, index, label, colorCls }) => {
                      const on = isItemOn(cat, itemId);
                      return (
                        <button
                          disabled={exp.isCore}
                          onClick={(e) => { e.stopPropagation(); handleItemToggle?.(exp.id, cat, itemId, !on); }}
                          className={`inline-flex items-center px-1.5 py-1 rounded-sm text-[10.5px] font-medium border transition-colors cursor-pointer ${!exp.isCore ? 'hover:opacity-80' : 'cursor-default'} ${on ? colorCls : 'bg-stone-100/50 text-stone-400 border-stone-200 line-through decoration-stone-400'}`}
                          title={exp.isCore ? '核心内容不可单独关闭' : `点击切换 ${label}`}
                        >
                          {label}
                        </button>
                      );
                    };

                    return (
                      <div key={exp.id} className={`rounded-lg border transition-all flex flex-col bg-white overflow-hidden shadow-sm ${isBookEnabled ? 'border-stone-300' : 'border-stone-200 opacity-70 hover:opacity-100'}`}>
                        {/* Card Header */}
                        <div 
                          className="flex justify-between items-center p-3 cursor-pointer select-none hover:bg-stone-50 transition-colors"
                          onClick={() => toggleCard(exp.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] w-4 h-4 flex items-center justify-center rounded-full bg-stone-200 text-stone-500 font-bold transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                              ▶
                            </span>
                            <span className="font-bold text-[14px] text-stone-900">{exp.name}</span>
                            <span className="text-[9px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded font-mono uppercase border border-stone-200">
                              {exp.shortName}
                            </span>
                            {exp.isCore && (
                              <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded ml-1">核心</span>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-[10px] text-stone-400 hidden sm:inline-block max-w-[200px] truncate">
                              {exp.description}
                            </span>
                            {!exp.isCore && (
                              <div className="shrink-0 flex items-center" onClick={e => e.stopPropagation()}>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={bookSet.enabled}
                                    onChange={(e) => {
                                      handleBookMasterToggle(exp.id, e.target.checked);
                                      if (e.target.checked && !isExpanded) toggleCard(exp.id, true);
                                    }}
                                  />
                                  <div className="w-8 h-4.5 bg-stone-200 border border-stone-300 rounded-full peer peer-checked:after:translate-x-[14px] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-stone-300 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-amber-500 peer-checked:border-amber-600 peer-checked:after:border-amber-200"></div>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Body (Accordion) */}
                        {isExpanded && (
                          <div className="p-3 pt-0 border-t border-stone-100 bg-stone-50/30">
                            
                            {/* Item Grouping Logic */}
                            {(() => {
                              const groupedRaces: Record<string, { parent?: {id:string; name:string}, subs: {id:string; name:string; raceId:string; raceName:string}[] }> = {};
                              items.races.forEach(r => { groupedRaces[r.id] = { parent: r, subs: [] }; });
                              items.subraces.forEach(sr => {
                                if (!groupedRaces[sr.raceId]) groupedRaces[sr.raceId] = { subs: [] };
                                groupedRaces[sr.raceId].subs.push(sr);
                              });

                              const groupedClasses: Record<string, { parent?: {id:string; name:string}, subs: {id:string; name:string; classId:string; className:string}[] }> = {};
                              items.classes.forEach(c => { groupedClasses[c.id] = { parent: c, subs: [] }; });
                              items.subclasses.forEach(sc => {
                                if (!groupedClasses[sc.classId]) groupedClasses[sc.classId] = { subs: [] };
                                groupedClasses[sc.classId].subs.push(sc);
                              });

                              return (
                                <div className="flex flex-col gap-3 mt-3">
                                  {/* Races */}
                                  {(filterMode === 'all' || filterMode === 'races') && (items.races.length > 0 || items.subraces.length > 0) && (
                                    <div className={`transition-opacity ${!isBookEnabled ? 'opacity-40' : 'opacity-100'}`}>
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            disabled={exp.isCore || !bookSet.enabled}
                                            checked={exp.isCore ? true : bookSet.races}
                                            onChange={(e) => handleCategoryToggle(exp.id, 'races', e.target.checked)}
                                            className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 border-stone-300 accent-amber-600"
                                          />
                                          <span className="text-xs font-semibold text-amber-900 border-b border-amber-200/50 pb-0.5 pr-2">种族与亚种</span>
                                        </label>
                                      </div>
                                      <div className="flex flex-col gap-1.5 pl-[22px] mt-1.5">
                                        {Object.entries(groupedRaces).map(([groupId, group]) => (
                                          <div key={groupId} className="flex flex-wrap items-baseline gap-1.5 bg-amber-50/50 p-1.5 rounded-md border border-amber-100/50">
                                            <span className="text-[11px] font-bold text-amber-800/70 mr-1 min-w-[36px]">
                                              {group.parent ? group.parent.name : group.subs[0].raceName}
                                            </span>
                                            {group.parent && (
                                              <ItemBadge index={0} cat="races" itemId={group.parent.id} label="基础" colorCls="bg-amber-100/70 text-amber-900 border-amber-300/60 font-bold" />
                                            )}
                                            {group.subs.map((sr, i) => (
                                              <ItemBadge key={`sr_${sr.id}_${i}`} index={i} cat="races" itemId={sr.id} label={sr.name} colorCls="bg-white text-amber-700 border-amber-200/60 shadow-sm" />
                                            ))}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Classes */}
                                  {(filterMode === 'all' || filterMode === 'classes') && (items.classes.length > 0 || items.subclasses.length > 0) && (
                                    <div className={`transition-opacity ${!isBookEnabled ? 'opacity-40' : 'opacity-100'}`}>
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            disabled={exp.isCore || !bookSet.enabled}
                                            checked={exp.isCore ? true : bookSet.classes}
                                            onChange={(e) => handleCategoryToggle(exp.id, 'classes', e.target.checked)}
                                            className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 accent-emerald-600"
                                          />
                                          <span className="text-xs font-semibold text-emerald-900 border-b border-emerald-200/50 pb-0.5 pr-2">职业与子职</span>
                                        </label>
                                      </div>
                                      <div className="flex flex-col gap-1.5 pl-[22px] mt-1.5">
                                        {Object.entries(groupedClasses).map(([groupId, group]) => (
                                          <div key={groupId} className="flex flex-wrap items-baseline gap-1.5 bg-emerald-50/50 p-1.5 rounded-md border border-emerald-100/50">
                                            <span className="text-[11px] font-bold text-emerald-800/70 mr-1 min-w-[36px]">
                                              {group.parent ? group.parent.name : group.subs[0].className}
                                            </span>
                                            {group.parent && (
                                              <ItemBadge index={0} cat="classes" itemId={group.parent.id} label="基础" colorCls="bg-emerald-100/70 text-emerald-900 border-emerald-300/60 font-bold" />
                                            )}
                                            {group.subs.map((sc, i) => (
                                              <ItemBadge key={`sc_${sc.id}_${i}`} index={i} cat="classes" itemId={sc.id} label={sc.name} colorCls="bg-white text-emerald-700 border-emerald-200/60 shadow-sm" />
                                            ))}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Backgrounds */}
                                  {(filterMode === 'all' || filterMode === 'backgrounds') && (items.backgrounds.length > 0) && (
                                    <div className={`transition-opacity ${!isBookEnabled ? 'opacity-40' : 'opacity-100'}`}>
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            disabled={exp.isCore || !bookSet.enabled}
                                            checked={exp.isCore ? true : bookSet.backgrounds}
                                            onChange={(e) => handleCategoryToggle(exp.id, 'backgrounds', e.target.checked)}
                                            className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-stone-300 accent-indigo-600"
                                          />
                                          <span className="text-xs font-semibold text-indigo-900 border-b border-indigo-200/50 pb-0.5 pr-2">背景经历</span>
                                        </label>
                                      </div>
                                      <div className="flex flex-wrap gap-1.5 pl-[22px]">
                                        {items.backgrounds.map((b, i) => (
                                          <ItemBadge key={`b_${b.id}_${i}`} index={i} cat="backgrounds" itemId={b.id} label={b.name} colorCls="bg-indigo-100/70 text-indigo-900 border-indigo-300/40" />
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Fallback for empty block */}
                                  {filterMode === 'all' && items.races.length === 0 && items.subraces.length === 0 && items.classes.length === 0 && items.subclasses.length === 0 && items.backgrounds.length === 0 && (
                                    <div className="pl-2 pt-2">
                                      <span className="text-[11px] text-stone-400 italic">（该分类下无具体子项目，可能包含法术、专长或其他杂项扩展规则）</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 md:px-5 bg-stone-50/80 border-t border-stone-200 flex-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportConfig}
                className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-sm text-xs font-medium rounded transition-colors cursor-pointer"
              >
                📤 导出配置
              </button>
              {!showImportInput ? (
                <button
                  onClick={() => setShowImportInput(true)}
                  className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-sm text-xs font-medium rounded transition-colors cursor-pointer"
                >
                  📥 导入配置
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="粘贴 JSON"
                    value={importString}
                    onChange={(e) => setImportString(e.target.value)}
                    className="text-stone-800 text-xs px-2 py-1.5 bg-white border border-stone-300 rounded focus:border-amber-500 outline-none w-48 shadow-inner"
                  />
                  <button onClick={handleImportConfig} className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded border-none shadow-sm cursor-pointer transition-colors">确认</button>
                  <button onClick={() => setShowImportInput(false)} className="px-2 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs rounded border-none shadow-sm cursor-pointer transition-colors">取消</button>
                </div>
              )}
            </div>
            
            {expMsg.text && (
              <span className={`text-[10px] sm:mx-auto font-medium px-2 py-1 rounded ${expMsg.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-red-100 text-red-900 border border-red-200'}`}>
                {expMsg.text}
              </span>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded transition-colors shadow-sm cursor-pointer border-none ml-auto"
            >
              完成并重载
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
