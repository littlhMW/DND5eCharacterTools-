import React, { useState, useMemo } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { races, getRaceByIdAndSource } from '../data/races';
import { classes } from '../data/classes';
import { backgrounds } from '../data/backgrounds';
import { spells as spellData } from '../data/spells';
import { feats } from '../data/feats';
import { classSpellLists } from '../data/spellLists';
import { Ability } from '../types/dnd';
import { DictyTwisterLink } from './DictyTwisterLink';
import { EquipmentText } from './shared/EquipmentText';
import { FormattedDescription } from './shared/FormattedDescription';
import { getProficiencies, getProficiencyBonus, SKILL_NAMES, SKILL_ABILITIES } from '../utils/proficiencies';
import { getCleanDescription } from '../utils/customRollTraits';
import { getLevelFromXp, getTierOfPlay, XP_LEVEL_TABLE, getXpRequiredForLevel } from '../utils/xpLevel';
import { generateTitle } from '../utils/titleGenerator';

const TABS = ['概览', '法术', '状态与装备', '背景与细节'];

export function CharacterSheet() {
  const { state, dispatch } = useCharacter();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const showTitleOnSheet = localStorage.getItem('showTitleOnSheet') !== 'false';
  const showXpOnSheet = localStorage.getItem('showXpOnSheet') !== 'false';

  const [isEditingXp, setIsEditingXp] = useState(false);
  const [tempXpValue, setTempXpValue] = useState<number | undefined>(undefined);
  const [xpAddAmount, setXpAddAmount] = useState<number>(0);

  const saveAndCloseXpEdit = (valToSave?: number) => {
    const finalVal = valToSave !== undefined ? valToSave : tempXpValue;
    if (finalVal !== undefined) {
      const newXp = Math.min(355000, Math.max(0, finalVal));
      const nextLevel = getLevelFromXp(newXp);
      dispatch({ type: 'UPDATE_BASIC_INFO', payload: { xp: newXp, level: nextLevel } });
    }
    setIsEditingXp(false);
    setTempXpValue(undefined);
  };

  const c = state.character;
  const race = getRaceByIdAndSource(c.raceId, c.raceSource);
  const subrace = race?.subraces?.find(sr => sr.id === c.subraceId);
  const cls = classes.find(cl => cl.id === c.classId);
  const subclass = cls?.subclasses?.find(sc => sc.id === c.subclassId);
  const bg = backgrounds.find(b => b.id === c.backgroundId);
  const finalRaceSpells = (race?.id === 'tiefling' && subrace) ? [] : (race?.spells || []);

  const getAsiBonus = (ab: Ability) => {
    let bonus = 0;
    Object.values(c.traitSelections).forEach(selections => {
      if (Array.isArray(selections)) {
        selections.forEach(sel => {
          if (sel === `asi-${ab}`) bonus += 1;
        });
      }
    });
    return bonus;
  };

  const getMod = (ab: Ability) => {
    const rBonus = (race?.id === 'human' && subrace?.id === 'human-variant') ? 0 : (race?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0);
    const srBonus = subrace?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0;
    const asiBonus = getAsiBonus(ab);
    const total = c.baseAbilities[ab] + rBonus + srBonus + asiBonus;
    return Math.floor((total - 10) / 2);
  };

  const getScore = (ab: Ability) => {
    const rBonus = (race?.id === 'human' && subrace?.id === 'human-variant') ? 0 : (race?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0);
    const srBonus = subrace?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0;
    const asiBonus = getAsiBonus(ab);
    return c.baseAbilities[ab] + rBonus + srBonus + asiBonus;
  };

  const { saves, skills, expertise } = getProficiencies(c, cls, race, subrace, bg);
  const profBonus = getProficiencyBonus(c.level);

  // 职业法术列表 ID（现在 spellList 是字符串）
  const spellListId = (cls?.spellcasting?.spellList as string) || cls?.id || '';
  const availableSpellsIds = useMemo(() => classSpellLists[spellListId] || [], [spellListId]);

  // 已准备法术 ID
  const preparedIds = useMemo(() => c.traitSelections['spells-step-prepared'] || [], [c.traitSelections]);

  // 已知法术 ID（排除准备法术，用于已知施法者及法师的法术书）

const knownIds = useMemo(() => {
  const ids = new Set<string>();
  Object.entries(c.traitSelections).forEach(([key, val]) => {
    if (!val || !Array.isArray(val)) return;
    // 1. 如果是专门用于选高阶法术的 key：
    if (key === 'spells-step-leveled' || key === 'spells-step-unrestricted' || key === 'spells-step-restricted' || key.startsWith('wizard-spellbook')) {
      (val as string[]).forEach(id => ids.add(id));
    }
    // 2. 对于其它的选择项，只有在它是合法的 1 环及以上法术，或者该选择项是自定义法术/魔法秘密等特性时，才加入已知列表
    else {
      const isCustomSpellKey = key.includes('magical-secrets') || key.includes('custom-spells') || key.includes('bonus-spell');
      (val as string[]).forEach(id => {
        const isRealLeveledSpell = spellData.some(sp => sp.id === id && sp.level > 0);
        if (isRealLeveledSpell || (isCustomSpellKey && id.trim() !== '')) {
          ids.add(id);
        }
      });
    }
  });
  return Array.from(ids);
}, [c.traitSelections]);
  

  // 戏法 ID
  const cantripIds = useMemo(() => {
    const ids = new Set<string>();
    Object.entries(c.traitSelections).forEach(([key, val]) => {
      if (!val || !Array.isArray(val)) return;
      if (key.includes('cantrip')) {
        (val as string[]).forEach(id => {
          // 只把真实的戏法（level 为 0）或者特定的选择值加入戏法列表
          // 自选法师戏法等占位符在这里不应该被当成戏法，如果它不是真实的戏法
          const sp = spellData.find(sp => sp.id === id);
          if (sp && sp.level === 0) {
            ids.add(id);
          } else if (!sp && !id.includes('自选')) {
            // 如果是其它无此戏法的数据（自定义等），如果是空或特殊占位符排除
            if (id.trim() !== '') ids.add(id);
          }
        });
      }
    });
    // 种族自动戏法
    finalRaceSpells?.forEach(s => { if (spellData.find(sp => sp.id === s.spellId)?.level === 0) ids.add(s.spellId); });
    subrace?.spells?.forEach(s => { if (spellData.find(sp => sp.id === s.spellId)?.level === 0) ids.add(s.spellId); });
    return Array.from(ids);
  }, [c.traitSelections, race, subrace, finalRaceSpells]);

  const isPreparedCaster = cls?.spellcasting?.type === 'prepared';

  /* ---------- 概览 Tab ---------- */
  const renderMainTab = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="col-span-1 grid grid-cols-3 md:grid-cols-1 gap-4">
          {(['STR','DEX','CON','INT','WIS','CHA'] as Ability[]).map(ab => {
            const score = getScore(ab);
            const mod = getMod(ab);
            const abNames: Record<Ability, string> = { STR: '力量', DEX: '敏捷', CON: '体质', INT: '智力', WIS: '感知', CHA: '魅力' };
            const isSaveProficient = saves.includes(ab);
            const abilitySkills = Object.entries(SKILL_ABILITIES).filter(([, a]) => a === ab).map(([s]) => s);
            return (
              <div key={ab} className="bg-white border-2 border-stone-300 rounded-b-3xl rounded-t-sm p-4 text-center shadow-sm flex flex-col relative pb-5">
                <div className="flex flex-col items-center mb-2">
                  <div className="text-[10px] sm:text-xs font-sans tracking-widest text-stone-500 font-bold mb-1 uppercase">{abNames[ab]} {ab}</div>
                  <div className="text-4xl font-serif text-stone-900 font-bold">{score}</div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-lg font-serif font-bold bg-white border-2 border-stone-300 px-3 py-1 rounded-full text-amber-900 shadow-sm">{mod >= 0 ? '+' : ''}{mod}</div>
                <div className="text-xs font-sans pt-6 mt-2 flex flex-col gap-1.5 w-full z-10 relative">
                  <div className={`flex items-center gap-1 ${isSaveProficient ? 'text-amber-800 font-bold' : 'text-stone-500'}`}>
                    <span className="w-4 text-center">{isSaveProficient ? '•' : '○'}</span>
                    <span className="flex-1 text-left">豁免</span>
                    <span className="font-mono">{(mod + (isSaveProficient ? profBonus : 0)) >= 0 ? '+' : ''}{mod + (isSaveProficient ? profBonus : 0)}</span>
                  </div>
                  {abilitySkills.map(skill => {
                    const isExpert = expertise.includes(skill);
                    const isProf = skills.includes(skill);
                    const bonus = mod + (isExpert ? profBonus * 2 : (isProf ? profBonus : 0));
                    const mark = isExpert ? '☆' : (isProf ? '•' : '○');
                    return (
                      <div key={skill} className={`flex items-center gap-1 ${isExpert ? 'text-amber-700 font-bold' : isProf ? 'text-amber-700 font-semibold' : 'text-stone-400'}`}>
                        <span className="w-4 text-center">{mark}</span>
                        <span className="flex-1 text-left">{SKILL_NAMES[skill]}</span>
                        <span className="font-mono">{bonus >= 0 ? '+' : ''}{bonus}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-span-1 md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-8 md:pl-6 pt-4 md:pt-0">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-t-full rounded-b-xl border-2 border-stone-300 text-center shadow-sm flex flex-col justify-center relative pt-8">
                <div className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-1 absolute top-3 left-1/2 -translate-x-1/2 w-full">护甲等级</div>
                <div className="text-4xl font-serif text-stone-900">{10 + getMod('DEX')}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-stone-300 text-center shadow-sm flex flex-col justify-center">
                <div className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-1">速度</div>
                <div className="text-3xl font-serif text-stone-900">{race?.speed || 30} <span className="text-xs text-stone-500 font-sans">尺</span></div>
              </div>
              <div className="bg-amber-100/10 p-4 rounded-t-xl rounded-b-full border-2 border-amber-200 text-center shadow-sm flex flex-col justify-center pb-8 relative">
                <div className="text-[10px] text-amber-900/60 uppercase font-bold tracking-widest mb-1">生命值</div>
                <div className="text-4xl font-serif text-amber-800 font-bold">{(cls?.hitDie || 10) + getMod('CON') + (c.level - 1) * ((cls?.hitDie || 10) / 2 + 1 + getMod('CON'))}</div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-amber-800/60 font-sans whitespace-nowrap">生命骰: {c.level}d{cls?.hitDie || 10}</div>
              </div>
            </div>
            
            {/* 游戏层级与经验晋升表 (Tiers of Play) */}
            {showXpOnSheet && (
              <div className="bg-white rounded-xl border-2 border-stone-300 p-5 shadow-sm space-y-3 font-sans">
                <div className="border-b border-stone-250 pb-2">
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-stone-900">
                    游戏层级与晋升 ({getTierOfPlay(c.level).tier})
                  </h4>
                </div>
                <p className="text-[11px] text-stone-650 leading-relaxed font-normal">
                  {getTierOfPlay(c.level).description}
                </p>
                
                <div className="border-t border-stone-200 pt-3 space-y-3 text-xs">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[11px] text-stone-500 font-semibold">经验值 (当前 / 下一级):</span>
                    <div className="flex items-center gap-1 font-mono">
                      {isEditingXp ? (
                        <input
                          type="number"
                          min="0"
                          value={tempXpValue !== undefined ? tempXpValue : (c.xp ?? 0)}
                          onChange={(e) => {
                            setTempXpValue(parseInt(e.target.value) || 0);
                          }}
                          onBlur={() => saveAndCloseXpEdit()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveAndCloseXpEdit();
                            } else if (e.key === 'Escape') {
                              setIsEditingXp(false);
                            }
                          }}
                          autoFocus
                          className="w-20 bg-stone-50 border border-stone-300 rounded px-1.5 py-0.5 text-center font-bold text-stone-850 focus:outline-none focus:border-amber-653 focus:ring-1 focus:ring-amber-600 transition-colors"
                        />
                      ) : (
                        <span
                          onClick={() => {
                            setTempXpValue(c.xp ?? 0);
                            setIsEditingXp(true);
                          }}
                          className="cursor-pointer font-bold text-stone-850 hover:text-amber-700 underline decoration-dashed decoration-amber-500 underline-offset-4 px-1.5 py-0.5 rounded hover:bg-stone-50 transition-colors"
                          title="点击编辑当前经验值"
                        >
                          {c.xp ?? 0}
                        </span>
                      )}
                      <span className="text-stone-400">/</span>
                      <span className="text-stone-800 font-bold text-[11px]">
                        {c.level < 20 ? (XP_LEVEL_TABLE.find(m => m.level === c.level + 1)?.xpRequired ?? 355000) : 355000}
                      </span>
                      <span className="text-stone-400 font-sans text-[10px]">XP</span>
                    </div>
                  </div>
                  {c.level < 20 ? (
                    (() => {
                      const currentMilestone = XP_LEVEL_TABLE.find(m => m.level === c.level);
                      const nextMilestone = XP_LEVEL_TABLE.find(m => m.level === c.level + 1);
                      if (!nextMilestone || !currentMilestone) return null;
                      const diff = nextMilestone.xpRequired - currentMilestone.xpRequired;
                      const currentOffset = (c.xp ?? 0) - currentMilestone.xpRequired;
                      const percent = Math.min(100, Math.max(0, (currentOffset / diff) * 100));
                      return (
                        <div>
                          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                            <div className="bg-amber-600 h-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[9px] mt-1 w-full font-mono text-stone-500">
                            <span>Lv.{c.level} ({currentMilestone.xpRequired} XP)</span>
                            <span className="text-stone-605 font-medium font-sans">还需 {Math.max(0, nextMilestone.xpRequired - (c.xp ?? 0))} XP 升级到 Lv.{c.level + 1}</span>
                            <span>Lv.{c.level + 1} ({nextMilestone.xpRequired} XP)</span>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center text-stone-750 font-bold text-[11px] py-1 bg-stone-50 rounded border border-stone-205 font-serif">
                      已达到最高等级 20。此角色已进入经典传奇事迹与不朽神话阶位。
                    </div>
                  )}

                  {/* 经验值调整工具区 */}
                  <div className="pt-3 border-t border-stone-150 space-y-2.5">
                    <div className="text-[10px] text-stone-500 font-semibold tracking-wider uppercase">
                      经验快速增减 (XP Adjustment):
                    </div>
                    
                    {/* 常用增加经验按钮 */}
                    <div className="flex flex-wrap gap-1.5 font-sans">
                      {[100, 500, 1000, 2000, 5000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => {
                            const newXp = Math.min(355000, Math.max(0, (c.xp ?? 0) + amount));
                            const nextLevel = getLevelFromXp(newXp);
                            dispatch({ type: 'UPDATE_BASIC_INFO', payload: { xp: newXp, level: nextLevel } });
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-stone-700 bg-stone-50 hover:bg-amber-100/70 hover:text-amber-800 border border-stone-300 rounded shadow-xs hover:border-amber-400 active:scale-95 transition-all cursor-pointer"
                        >
                          +{amount}
                        </button>
                      ))}
                    </div>

                    {/* 手动追加自定义数值 */}
                    <div className="flex items-center gap-1.5 mt-1.5 font-sans">
                      <div className="relative flex items-center shadow-xs rounded border border-stone-300 bg-stone-50/50 focus-within:border-amber-600 focus-within:ring-1 focus-within:ring-amber-600 transition-all">
                        <span className="pl-2.5 pr-1 text-stone-400 font-bold text-xs select-none">+</span>
                        <input
                          type="number"
                          placeholder="数值"
                          value={xpAddAmount === 0 ? '' : xpAddAmount}
                          onChange={(e) => setXpAddAmount(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-20 py-1 pr-2 bg-transparent text-xs font-semibold focus:outline-none placeholder-stone-400 font-mono"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (xpAddAmount > 0) {
                            const newXp = Math.min(355000, Math.max(0, (c.xp ?? 0) + xpAddAmount));
                            const nextLevel = getLevelFromXp(newXp);
                            dispatch({ type: 'UPDATE_BASIC_INFO', payload: { xp: newXp, level: nextLevel } });
                            setXpAddAmount(0); // Clear input
                          }
                        }}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded transition-colors shadow-xs active:scale-95 cursor-pointer"
                      >
                        增加经验
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-stone-300 p-6 shadow-sm h-full">
              <h3 className="text-xl font-serif mb-4 text-stone-900 border-b border-stone-200 pb-2">熟练项与语言</h3>
              <div className="space-y-4 text-sm font-sans">
                <div>
                  <div className="font-bold text-stone-900 mb-1">护甲与武器</div>
                  <p className="text-stone-700">{[...(cls?.armorProficiencies || []), ...(cls?.weaponProficiencies || []), ...(race?.weaponProficiencies || []), ...(race?.armorProficiencies || []), ...(subrace?.weaponProficiencies || []), ...(subrace?.armorProficiencies || [])].filter((v, i, a) => a.indexOf(v) === i).join('、 ') || '无'}</p>
                </div>
                <div className="border-t border-stone-200 pt-3">
                  <div className="font-bold text-stone-900 mb-1">工具</div>
                  <p className="text-stone-700">{[...(cls?.toolProficiencies || []), ...(race?.toolProficiencies || []), ...(subrace?.toolProficiencies || []), ...(bg?.toolProficiencies || [])].concat(
                    (c.traitSelections['dwarf-tool'] as string[] || []).map(id => ({ 'smithsTools': '铁匠工具', 'brewersSupplies': '酿酒工具', 'masonsTools': '泥瓦匠工具' }[id] || id))
                  ).filter((v, i, a) => a.indexOf(v) === i).join('、 ') || '无'}</p>
                </div>
                <div className="border-t border-stone-200 pt-3">
                  <div className="font-bold text-stone-900 mb-1">语言</div>
                  <p className="text-stone-700">
                    {race?.languages?.join('、 ') || '通用语'}
                    {bg?.languages ? ` (及背景额外任选 ${bg.languages} 门)` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 专长与特性 Tab (保持不变，省略）

  const renderSpells = () => {
    if (!cls) return <p className="text-stone-500 italic">无职业数据。</p>;

    // 当前等级法术位
    const slotArray = cls.spellcasting?.spellSlots?.[c.level - 1] || [];
    const maxSlotLevel = slotArray.reduce((max, slots, idx) => slots > 0 ? idx + 1 : max, 0);

    // 戏法列表
    const showCantrips = cantripIds.map(id => {
      const s = spellData.find(s => s.id === id);
      if (s) return s;
      return { id, name: id, level: 0, school: '神秘', castTime: '未知', range: '-', duration: '-', components: [], description: '（自定义戏法）' } as any;
    }).filter(Boolean);

    // 高阶法术列表
let showLeveled: typeof spellData = [];
if (cls.id === 'wizard') {
  // 法师：显示法术书中的法术
  const spellbookIds = new Set<string>();
  Object.entries(c.traitSelections).forEach(([key, val]) => {
    if (key.startsWith('wizard-spellbook')) (val as string[]).forEach(id => spellbookIds.add(id));
  });
  showLeveled = Array.from(spellbookIds)
    .map(id => spellData.find(s => s.id === id))
    .filter(s => s && s.level > 0) as typeof spellData;
} else if (isPreparedCaster) {
  // 其他准备施法者：显示全部可选法术
  showLeveled = availableSpellsIds
    .map(id => spellData.find(s => s.id === id))
    .filter(s => s && s.level > 0) as typeof spellData;
} else {
  // 已知施法者：只显示已知法术
  showLeveled = knownIds.map(id => {
    const s = spellData.find(s => s.id === id);
    if (s) return s;
    return { id, name: id, level: 1, school: '神秘', castTime: '未知', range: '-', duration: '-', components: [], description: '（自定义法术）' } as any;
  }).filter(Boolean);
}

    // 无论如何，追加种族/亚种/亚职的自动法术（除去戏法）
    const extraSpells = [...finalRaceSpells, ...(subrace?.spells || []), ...(subclass?.spells || [])]
      .filter(s => s.level > 0 && s.level <= c.level)
      .map(s => spellData.find(sp => sp.id === s.spellId))
      .filter(Boolean) as typeof spellData;
      
    extraSpells.forEach(extra => {
      if (!showLeveled.some(s => s.id === extra.id)) {
        showLeveled.push(extra);
      }
    });

    const getSpellSource = (spellId: string) => {
      if (finalRaceSpells?.some(s => s.spellId === spellId)) return '种族';
      if (subrace?.spells?.some(s => s.spellId === spellId)) return '亚种';
      if (subclass?.spells?.some(s => s.spellId === spellId)) return '亚职';
      for (const [key, val] of Object.entries(c.traitSelections)) {
        if (val && Array.isArray(val) && val.includes(spellId)) {
          if (race && key.startsWith(race.id)) return '种族';
          if (subrace && key.startsWith(subrace.id)) return '亚种';
          if (bg && key.startsWith(bg.id)) return '背景';
        }
      }
      return '职业';
    };

    const racialSpells = [...showCantrips, ...showLeveled].filter(s => {
      const src = getSpellSource(s.id);
      return src === '种族' || src === '亚种' || src === '背景';
    });

    const classCantrips = showCantrips.filter(s => !racialSpells.some(rs => rs.id === s.id));
    const classLeveled = showLeveled.filter(s => !racialSpells.some(rs => rs.id === s.id));

    const handlePrepareToggle = (spellId: string) => {
      if (!isPreparedCaster) return;
      const current = preparedIds;
      const next = current.includes(spellId)
        ? current.filter(id => id !== spellId)
        : [...current, spellId];
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: 'spells-step-prepared', selectedIds: next } });
    };

    const renderLevelTable = (title: string, spells: typeof spellData, isToggleable: boolean = false) => {
      if (spells.length === 0) return null;
      return (
        <div key={title} className="mb-8 bg-white rounded-md border border-stone-200 overflow-hidden shadow-sm">
          <div className="bg-stone-50 px-6 py-3 border-b border-stone-100">
            <h3 className="text-lg font-serif text-amber-600">{title}</h3>
          </div>
          <table className="w-full text-sm font-sans">
            <thead className="text-xs text-stone-500 uppercase bg-stone-50 border-b border-stone-100">
              <tr>
                {isToggleable && <th className="w-10 px-2 py-2">准备</th>}
                <th className="px-4 py-2 text-left">法术名称</th>
                <th className="px-4 py-2 hidden md:table-cell">学派</th>
                <th className="px-4 py-2 hidden md:table-cell">施法时间</th>
                <th className="px-4 py-2 hidden md:table-cell">距离</th>
                <th className="px-4 py-2">来源</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {spells.sort((a, b) => a.level - b.level).map(spell => {
                const isPrepared = preparedIds.includes(spell.id);
                const source = getSpellSource(spell.id);
                return (
                  <tr key={spell.id} className="hover:bg-amber-50/20 transition-colors">
                    {isToggleable && (
                      <td className="px-2 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isPrepared}
                          onChange={() => handlePrepareToggle(spell.id)}
                          className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {spell.name}
                      <span className="ml-2 text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-md border border-stone-200">
                        {spell.level === 0 ? '戏法' : `${spell.level}环`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{spell.school}</td>
                    <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{spell.castingTime}</td>
                    <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{spell.range}</td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{source}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    };

    return (
      <div className="animate-in fade-in max-w-5xl space-y-6">
        {racialSpells.length > 0 && renderLevelTable('种族与背景法术', racialSpells, false)}
        
        {classCantrips.length > 0 && renderLevelTable('职业戏法', classCantrips, false)}
        
        {Array.from({ length: maxSlotLevel }, (_, i) => i + 1).map(level => {
          const spells = classLeveled.filter(s => s.level === level);
          const slots = slotArray[level - 1] || 0;
          if (spells.length === 0) return null;
          return renderLevelTable(`职业 ${level}环 (${slots} 法术位)`, spells, isPreparedCaster);
        })}
      </div>
    );
  };

  // 状态与装备 Tab (保持不变)
  // 背景与细节 Tab (保持不变)

  return (
    <div className="min-h-screen bg-stone-100 font-serif text-stone-900 p-4 md:p-8 md:pt-12 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-30 z-0 mix-blend-multiply"></div>
      
      <div className="max-w-7xl mx-auto bg-white border-[3px] border-double border-stone-300 rounded-xl shadow-2xl overflow-hidden pb-4 ring-1 ring-stone-900/10 relative z-10">
        {/* Header */}
        <div className="px-6 md:px-10 py-8 md:py-10 flex flex-col md:flex-row justify-between items-end bg-stone-100 relative overflow-hidden border-b-2 border-stone-200">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 w-full mb-6 md:mb-0 md:mr-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 mb-2.5">
              {c.portraitUrl && (
                <div className="relative p-1 bg-amber-50/50 border-2 border-amber-800 rounded-lg shadow shrink-0">
                  <img
                    src={c.portraitUrl}
                    alt={c.name}
                    referrerPolicy="no-referrer"
                    className="w-32 h-32 md:w-40 md:h-40 rounded object-cover border border-amber-800/20"
                  />
                  {/* Decorative corners for fantasy feel */}
                  <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-800" />
                  <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-800" />
                  <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-800" />
                  <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-800" />
                </div>
              )}
              <div className="flex flex-col text-center md:text-left justify-center">
                {showTitleOnSheet && c.title && (
                  <p className="text-base md:text-lg text-amber-700 font-serif italic mb-1.5 font-bold tracking-wide">
                    “ {c.title} ”
                  </p>
                )}
                <h1 className="text-4xl md:text-5xl font-serif text-stone-900 font-bold drop-shadow-sm tracking-tight">{c.name || '未命名角色'}</h1>
              </div>
            </div>
            
            <div className="text-stone-700 flex gap-2 text-xs font-semibold flex-wrap font-sans mt-3.5 items-center">
              <span className="bg-white/80 px-3 py-1 rounded-md whitespace-nowrap border border-stone-300 shadow-sm shadow-stone-200/50">等级 <b className="text-amber-800">{c.level}</b></span>
              <span className="bg-white/80 px-3 py-1 rounded-md whitespace-nowrap border border-stone-300 shadow-sm shadow-stone-200/50">熟练加值 <b className="text-amber-800">+{profBonus}</b></span>
              <span className="bg-white/80 px-3 py-1 rounded-md whitespace-nowrap border border-stone-300 shadow-sm shadow-stone-200/50">{subrace?.name?.replace(' (本相)', '') || race?.name || '未知种族'}</span>
              <span className="bg-white/80 px-3 py-1 rounded-md whitespace-nowrap border border-stone-300 shadow-sm shadow-stone-200/50">{subclass?.name || cls?.name || '无职业'}</span>
              <span className="bg-white/80 px-3 py-1 rounded-md whitespace-nowrap border border-stone-300 shadow-sm shadow-stone-200/50">{bg?.name || '未知背景'}</span>
            </div>
          </div>
          <div className="mt-8 md:mt-0 flex gap-2 sm:gap-3 flex-wrap items-center justify-start md:justify-end relative z-10 w-full md:w-auto shrink-0">
            <button onClick={() => {
              let charToSave = { ...c };
              if (!charToSave.id) charToSave.id = crypto.randomUUID();
              const saved = localStorage.getItem('dndChars');
              let chars = [];
              if (saved) {
                try { chars = JSON.parse(saved); } catch(e){}
              }
              const index = chars.findIndex((ch: any) => ch.id === charToSave.id);
              if (index >= 0) {
                chars[index] = charToSave;
              } else {
                chars.push(charToSave);
              }
              localStorage.setItem('dndChars', JSON.stringify(chars));
              dispatch({ type: 'UPDATE_BASIC_INFO', payload: { id: charToSave.id } });
              setSaveSuccess(true);
              setTimeout(() => setSaveSuccess(false), 2000);
            }} className="px-5 py-2.5 bg-stone-100/80 text-stone-700 border border-stone-300 rounded-md hover:bg-white transition font-sans font-medium shadow-sm active:scale-95 text-sm md:text-base">{saveSuccess ? '已保存 ✓' : '保存角色'}</button>
            <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'landing' })} className="px-5 py-2.5 bg-stone-100/80 text-stone-700 border border-stone-300 rounded-md hover:bg-white transition font-sans font-medium shadow-sm active:scale-95 text-sm md:text-base">返回主页</button>
            <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'wizard' })} className="px-5 py-2.5 bg-stone-100/80 text-stone-700 border border-stone-300 rounded-md hover:bg-white transition font-sans font-medium shadow-sm active:scale-95 text-sm md:text-base">重新编辑</button>
            <button onClick={() => {
              const nextLevel = Math.min(20, c.level + 1);
              const nextXp = getXpRequiredForLevel(nextLevel);
              dispatch({ type: 'UPDATE_BASIC_INFO', payload: { level: nextLevel, xp: nextXp } });
            }} className="px-6 py-2.5 bg-gradient-to-r from-amber-700 to-amber-800 text-amber-50 border border-amber-900 rounded-md hover:from-amber-600 hover:to-amber-700 transition font-sans font-bold shadow-md hover:shadow-lg shadow-amber-900/20 active:scale-95 text-sm md:text-base">提升等级</button>
          </div>
        </div>


        {/* Tabs */}
        <div className="flex px-4 md:px-8 mt-4 bg-stone-100/50 overflow-x-auto gap-1 border-b-2 border-stone-300 shadow-inner">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm md:text-base font-bold tracking-widest whitespace-nowrap rounded-t-lg transition-all duration-200 z-10 relative top-[2px] ${
                activeTab === tab 
                  ? 'text-amber-900 bg-white border-t-2 border-x-2 border-stone-300 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]' 
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-200/50 border-t-2 border-x-2 border-transparent'
              }`}
            >{tab}</button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 bg-white min-h-[65vh] relative text-stone-800">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-20 pointer-events-none mix-blend-multiply"></div>
          <div className="relative z-10">
          {activeTab === '概览' && renderMainTab()}
          {activeTab === '法术' && renderSpells()}
          {activeTab === '状态与装备' && (
            <div className="space-y-8 max-w-5xl animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(() => {
                  const chosenEquipment: string[] = [];
                  let usedGoldMethod = false;
                  
                  if (cls?.traits) {
                    Object.entries(c.traitSelections).forEach(([key, val]) => {
                      if (key.endsWith('-wealth-method') && val?.[0] === 'gold') {
                        usedGoldMethod = true;
                      }
                      if (key.includes('-equip-') && Array.isArray(val) && val.length > 0) {
                        for (const t of cls.traits) {
                          if (t.choices) {
                            const ch = t.choices.find(c => c.id === key);
                            if (ch && ch.options) {
                              const opt = ch.options.find(o => o.id === val[0]);
                              if (opt) chosenEquipment.push(opt.name.replace(/^\([a-z]\)/, '').trim());
                            }
                          }
                        }
                      }
                    });
                  }

                  return (
                    <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm">
                      <h3 className="text-xl font-serif text-stone-900 mb-4 border-b border-stone-100 pb-3">起始装备</h3>
                      {usedGoldMethod ? (
                        <div className="text-stone-500 italic p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm mb-4">
                          你选择了放弃职业自带装备，使用初始资金购买装备。<br/>
                          <span className="inline-block mt-2 font-medium text-amber-700">（背景自带的装备不受影响。）</span>
                        </div>
                      ) : (
                        <ul className="space-y-3 text-sm mb-3">
                          {chosenEquipment.length > 0 ? (
                            chosenEquipment.map((eq, i) => (
                              <li key={`cls-${i}`} className="flex items-start bg-stone-50 p-3 rounded-xl border border-stone-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-3 flex-shrink-0" />
                                <EquipmentText text={eq} />
                              </li>
                            ))
                          ) : (
                            cls?.startingEquipment?.map((eq, i) => (
                              <li key={`cls-raw-${i}`} className="flex items-start bg-stone-50 p-3 rounded-xl border border-stone-100 text-stone-400 italic">
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 mr-3 flex-shrink-0" />
                                <EquipmentText text={eq} /> (未选择)
                              </li>
                            ))
                          )}
                        </ul>
                      )}
                      
                      <h4 className="text-sm font-bold text-stone-700 mb-3 border-t border-stone-100 pt-3">背景附赠装备</h4>
                      <ul className="space-y-3 text-sm">
                        {bg?.startingEquipment?.map((eq, i) => (
                          <li key={`bg-${i}`} className="flex items-start bg-stone-50 p-3 rounded-xl border border-stone-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 mr-3 flex-shrink-0" />
                            <EquipmentText text={eq} />
                          </li>
                        ))}
                      </ul>

                      {!usedGoldMethod && (
                        <div className="mt-6 pt-4 border-t border-stone-100 text-sm text-stone-500">
                          <span className="font-semibold text-stone-700">资金：</span>通常包含于背景中，或为 15-50 金币。
                        </div>
                      )}
                    </div>
                  );
                })()}
                <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm">
                  <h3 className="text-xl font-serif text-stone-900 mb-4 border-b border-stone-100 pb-3">熟练工具与补给</h3>
                  <ul className="space-y-3">
                    {[...(cls?.toolProficiencies || []), ...(bg?.toolProficiencies || [])].filter(Boolean).map((tool, i) => (
                      <li key={i} className="text-sm font-medium text-stone-800 bg-amber-50/50 px-4 py-3 rounded-xl border border-amber-100">熟练: {tool}</li>
                    ))}
                    {(!cls?.toolProficiencies?.length && !bg?.toolProficiencies?.length) && <p className="text-sm text-stone-500 italic">无熟练工具。</p>}
                  </ul>
                </div>
              </div>
            </div>
          )}
          {activeTab === '背景与细节' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl animate-in fade-in">
              {/* 左单栏: 细节 + 全身立绘 */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl border-2 border-stone-300 shadow-sm">
                  <h3 className="text-lg font-serif text-stone-900 mb-4 border-b border-stone-200 pb-2">基本细节</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-stone-500 mb-0.5">阵营</div>
                      <div className="font-serif text-sm font-semibold">{c.alignment || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-stone-500 mb-0.5">年龄</div>
                      <div className="font-serif text-sm font-semibold">{c.age || '-'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border-2 border-stone-300 shadow-sm flex flex-col items-center">
                  <h3 className="text-lg font-serif text-stone-900 mb-4 border-b border-stone-200 pb-2 w-full text-left">人物全身立绘</h3>
                  {c.fullBodyUrl ? (
                    <div className="w-full relative rounded-lg overflow-hidden border border-stone-200 shadow-inner bg-stone-50 flex justify-center items-center p-2">
                      <img
                        src={c.fullBodyUrl}
                        alt={`${c.name} 全身立绘`}
                        referrerPolicy="no-referrer"
                        className="max-h-[480px] object-contain rounded-md transition-shadow hover:shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-80 rounded-lg border border-dashed border-stone-300 bg-stone-50 flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-xs text-stone-500 font-sans leading-relaxed">暂无全身立绘</span>
                      <span className="text-[10px] text-stone-400 font-sans mt-1">您可在创建角色的底端步骤中上传立绘噢</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 右双栏: 背景故事, 性格特质 */}
              <div className="col-span-1 lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border-2 border-stone-300 shadow-sm">
                  <h3 className="text-lg font-serif text-stone-900 mb-4 border-b border-stone-200 pb-2">背景故事</h3>
                  <div className="space-y-4">
                    {c.backstory ? (
                      <div className="prose prose-stone text-stone-700 max-w-none whitespace-pre-wrap text-sm leading-relaxed font-sans">
                        {c.backstory}
                      </div>
                    ) : (
                      <p className="text-stone-500 italic text-sm">未填写背景故事。</p>
                    )}
                    {c.specialty && (
                      <div className="mt-4 pt-4 border-t border-stone-100">
                        <div className="text-xs text-amber-600 font-semibold mb-1.5">{bg?.specialty?.name || '背景特色'}</div>
                        <p className="text-stone-700 bg-stone-50 px-4 py-3 rounded-lg border border-stone-200 text-sm font-sans">{c.specialty}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border-2 border-stone-300 shadow-sm">
                  <h3 className="text-lg font-serif text-stone-900 mb-4 border-b border-stone-200 pb-2">性格与特质</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="text-xs font-bold text-amber-800 mb-1">性格特质</div>
                      <p className="text-stone-700 text-sm leading-relaxed font-sans">{c.personality || '未填写'}</p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="text-xs font-bold text-amber-800 mb-1">理想</div>
                      <p className="text-stone-700 text-sm leading-relaxed font-sans">{c.ideals || '未填写'}</p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="text-xs font-bold text-amber-800 mb-1">牵绊</div>
                      <p className="text-stone-700 text-sm leading-relaxed font-sans">{c.bonds || '未填写'}</p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="text-xs font-bold text-amber-800 mb-1">缺点</div>
                      <p className="text-stone-700 text-sm leading-relaxed font-sans">{c.flaws || '未填写'}</p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 md:col-span-2">
                      <div className="text-xs font-bold text-amber-800 mb-1">外貌描写</div>
                      <p className="text-stone-700 text-sm leading-relaxed font-sans">{c.appearance || '未填写'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}