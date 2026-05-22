import React, { useState, useMemo } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { races } from '../data/races';
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

const TABS = ['概览', '职业特性', '专长', '法术', '状态与装备', '背景与细节'];

export function CharacterSheet() {
  const { state, dispatch } = useCharacter();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const c = state.character;
  const race = races.find(r => r.id === c.raceId);
  const subrace = race?.subraces?.find(sr => sr.id === c.subraceId);
  const cls = classes.find(cl => cl.id === c.classId);
  const subclass = cls?.subclasses.find(sc => sc.id === c.subclassId);
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
              <div key={ab} className="bg-[#faf8f5] border-2 border-stone-300 rounded-b-3xl rounded-t-sm p-4 text-center shadow-sm flex flex-col relative pb-5">
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
              <div className="bg-[#faf8f5] p-4 rounded-t-full rounded-b-xl border-2 border-stone-300 text-center shadow-sm flex flex-col justify-center relative pt-8">
                <div className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-1 absolute top-3 left-1/2 -translate-x-1/2 w-full">护甲等级</div>
                <div className="text-4xl font-serif text-stone-900">{10 + getMod('DEX')}</div>
              </div>
              <div className="bg-[#faf8f5] p-4 rounded-xl border-2 border-stone-300 text-center shadow-sm flex flex-col justify-center">
                <div className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-1">速度</div>
                <div className="text-3xl font-serif text-stone-900">{race?.speed || 30} <span className="text-xs text-stone-500 font-sans">尺</span></div>
              </div>
              <div className="bg-[#fcfaf8] p-4 rounded-t-xl rounded-b-full border-2 border-amber-200 text-center shadow-sm flex flex-col justify-center pb-8 relative">
                <div className="text-[10px] text-amber-900/60 uppercase font-bold tracking-widest mb-1">生命值</div>
                <div className="text-4xl font-serif text-amber-800 font-bold">{(cls?.hitDie || 10) + getMod('CON') + (c.level - 1) * ((cls?.hitDie || 10) / 2 + 1 + getMod('CON'))}</div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-amber-800/60 font-sans whitespace-nowrap">生命骰: {c.level}d{cls?.hitDie || 10}</div>
              </div>
            </div>
            
          </div>
          <div className="space-y-6">
            <div className="bg-[#faf8f5] rounded-xl border-2 border-stone-300 p-6 shadow-sm h-full">
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
    <div className="min-h-screen bg-[#f9f8f6] font-serif text-stone-900 p-4 md:p-8 md:pt-12 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-30 z-0 mix-blend-multiply"></div>
      
      <div className="max-w-7xl mx-auto bg-[#faf8f5] border-[3px] border-double border-stone-300 rounded-xl shadow-2xl overflow-hidden pb-4 ring-1 ring-stone-900/10 relative z-10">
        {/* Header */}
        <div className="px-8 md:px-12 py-12 flex flex-col md:flex-row justify-between items-end bg-gradient-to-br from-[#faf8f5] to-[#f4eee6] relative overflow-hidden border-b-2 border-stone-200">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-700/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 w-full mb-6 md:mb-0 md:mr-6">
            <h1 className="text-5xl md:text-6xl font-serif text-stone-900 font-bold mb-4 drop-shadow-sm tracking-tight">{c.name || '未命名角色'}</h1>
            <div className="text-stone-700 flex gap-3 text-sm font-medium flex-wrap font-sans">
              <span className="bg-white/80 px-4 py-1.5 rounded-md whitespace-nowrap border border-stone-300 shadow-sm shadow-stone-200/50">等级 <b className="text-amber-800">{c.level}</b></span>
              <span className="bg-white/80 px-4 py-1.5 rounded-md whitespace-nowrap border border-stone-300 shadow-sm shadow-stone-200/50">{subrace?.name || race?.name || '未知种族'}</span>
              <span className="bg-white/80 px-4 py-1.5 rounded-md whitespace-nowrap border border-stone-300 shadow-sm shadow-stone-200/50">{subclass?.name || cls?.name || '无职业'}</span>
              <span className="bg-white/80 px-4 py-1.5 rounded-md whitespace-nowrap border border-stone-300 shadow-sm shadow-stone-200/50">{bg?.name || '未知背景'}</span>
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
            <button onClick={() => dispatch({ type: 'LEVEL_UP' })} className="px-6 py-2.5 bg-gradient-to-r from-amber-700 to-amber-800 text-amber-50 border border-amber-900 rounded-md hover:from-amber-600 hover:to-amber-700 transition font-sans font-bold shadow-md hover:shadow-lg shadow-amber-900/20 active:scale-95 text-sm md:text-base">提升等级</button>
          </div>
        </div>


        {/* Tabs */}
        <div className="flex px-4 md:px-8 mt-4 bg-stone-100/50 overflow-x-auto gap-1 border-b-2 border-stone-300 shadow-inner">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm md:text-base font-bold tracking-widest whitespace-nowrap rounded-t-lg transition-all duration-200 z-10 relative top-[2px] ${
                activeTab === tab 
                  ? 'text-amber-900 bg-[#faf8f5] border-t-2 border-x-2 border-stone-300 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]' 
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-200/50 border-t-2 border-x-2 border-transparent'
              }`}
            >{tab}</button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 md:p-10 bg-[#faf8f5] min-h-[65vh] relative text-stone-800">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-20 pointer-events-none mix-blend-multiply"></div>
          <div className="relative z-10">
          {activeTab === '概览' && renderMainTab()}
          {activeTab === '职业特性' && (() => {
            return (
            <div className="space-y-6 animate-in fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#faf8f5] rounded-xl border-2 border-stone-300 shadow-sm p-8 h-fit">
                <h3 className="text-2xl font-serif text-amber-800 mb-6 border-b-2 border-stone-300 pb-3 font-bold tracking-tight">职业特性</h3>
                <ul className="space-y-6">
                  {[
                    ...(cls?.traits || []).filter(t => t.level! <= c.level).map(t => ({ ...t, isSubclass: false })),
                    ...(subclass ? subclass.traits.filter(t => t.level! <= c.level).map(t => ({ ...t, isSubclass: true })) : [])
                  ].sort((a, b) => (a.level || 0) - (b.level || 0)).map((t, index) => (
                    <li key={`${t.name}-${t.level}-${index}`} className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-stone-300">
                      <strong className="text-stone-900 block mb-1 font-serif text-lg">{t.name} <span className="text-[10px] text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full ml-2 uppercase tracking-widest font-bold">LV {t.level}</span></strong>
                      <FormattedDescription text={t.description} className="text-sm font-sans text-stone-700 leading-relaxed block" />
                      {t.choices && t.choices.map(choice => {
                        const ids = c.traitSelections[choice.id] || [];
                        if (ids.length === 0) return null;
                        
                        let displayNames = [];
                        if (choice.dynamic === 'asi') {
                           const featIds = ids.filter(id => id.startsWith('feat-')).map(id => id.substring(5));
                           const asiIds = ids.filter(id => id.startsWith('asi-')).map(id => id.substring(4));
                           if (featIds.length > 0) {
                             displayNames = featIds.map(fid => feats.find(f => f.id === fid)?.name || fid);
                           } else {
                             const counts: Record<string, number> = {};
                             asiIds.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
                             const abNames: Record<string, string> = { STR: '力量', DEX: '敏捷', CON: '体质', INT: '智力', WIS: '感知', CHA: '魅力' };
                             displayNames = Object.entries(counts).map(([ab, count]) => `${abNames[ab] || ab} +${count}`);
                           }
                        } else {
                          displayNames = ids.map(id => {
                            const option = choice.options?.find(o => o.id === id);
                            if (option) return option.name;
                            
                            const spell = spellData.find(s => s.id === id);
                            if (spell) return spell.name;

                            const feat = feats.find(f => f.id === id);
                            if (feat) return feat.name;

                            return id;
                          });
                        }

                        return <div key={choice.id} className="mt-2 text-sm font-sans bg-white border border-stone-200 p-3 rounded-lg shadow-sm"><span className="font-semibold text-stone-700">{choice.name}:</span> <span className="text-amber-800 font-medium">{displayNames.join(', ')}</span></div>;
                      })}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#faf8f5] rounded-xl border-2 border-stone-300 shadow-sm p-8 h-fit">
                <h3 className="text-2xl font-serif text-amber-800 mb-6 border-b-2 border-stone-300 pb-3 font-bold tracking-tight">种族与背景特性</h3>
                <ul className="space-y-6">
                  {race?.traits
                    .filter(t => {
                      if (subrace) {
                        if (race.id === 'half-elf' && t.name === '多才多艺') return false;
                        if (race.id === 'tiefling' && t.name === '炼狱传承') return false;
                      }
                      return true;
                    })
                    .map((t, i) => (
                      <li key={`race-${t.name}-${i}`} className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-stone-300">
                        <strong className="text-stone-900 block mb-1 font-serif text-lg">{t.name}</strong>
                        <FormattedDescription text={t.description} className="text-sm font-sans text-stone-700 leading-relaxed block" />
                      </li>
                    ))}
                  {subrace?.traits.map((t, i) => (
                    <li key={`subrace-${t.name}-${i}`} className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-stone-300">
                      <strong className="text-stone-900 block mb-1 font-serif text-lg">{t.name}</strong>
                      <FormattedDescription text={t.description} className="text-sm font-sans text-stone-700 leading-relaxed block" />
                    </li>
                  ))}
                  {bg && (
                    <li className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-stone-400">
                      <strong className="text-stone-900 block mb-1 font-serif text-lg">{bg.feature.name} <span className="text-[10px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full ml-2 tracking-widest uppercase font-bold">背景</span></strong>
                      <FormattedDescription text={bg.feature.description} className="text-sm font-sans text-stone-700 leading-relaxed block" />
                    </li>
                  )}
                </ul>
              </div>
            </div>
            );
          })()}
          {activeTab === '专长' && (() => {
            const chosenFeatIds = new Set<string>();
            Object.values(c.traitSelections).forEach(ids => {
              if (Array.isArray(ids)) {
                ids.forEach(id => {
                   if (id.startsWith('feat-')) chosenFeatIds.add(id.substring(5));
                   else if (feats.some(f => f.id === id)) chosenFeatIds.add(id);
                });
              }
            });
            const chosenFeats = Array.from(chosenFeatIds).map(id => feats.find(f => f.id === id)).filter(Boolean);

            if (chosenFeats.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center p-12 bg-[#faf8f5] rounded-xl border-2 border-stone-300 border-dashed opacity-70">
                  <span className="text-4xl mb-4">📜</span>
                  <h3 className="text-xl font-serif text-stone-600 mb-2">尚未获得任何专长</h3>
                  <p className="text-stone-500 font-sans text-sm text-center">你的角色在此等级尚未选择专长，或者选择了属性提升（ASI）。</p>
                </div>
              );
            }

            return (
              <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
                <h3 className="text-3xl font-serif text-amber-800 mb-8 border-b-2 border-stone-300 pb-4 font-bold tracking-tight text-center">已获得专长</h3>
                <div className="grid grid-cols-1 gap-6">
                  {chosenFeats.map((f, i) => (
                    <div key={`feat-${f!.id}-${i}`} className="bg-white p-6 rounded-xl border-2 border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-colors">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform -rotate-12 translate-x-4">
                        <span className="text-8xl font-serif">⚡</span>
                      </div>
                      <strong className="text-amber-900 block mb-3 font-serif text-2xl drop-shadow-sm">{f!.name}</strong>
                      <FormattedDescription text={f!.description} className="text-base font-sans text-stone-700 leading-relaxed prose prose-stone" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
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
            <div className="space-y-8 max-w-3xl animate-in fade-in">
              <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm">
                <h3 className="text-xl font-serif text-stone-900 mb-6 border-b border-stone-100 pb-3">基本细节</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div><div className="text-sm text-stone-500 mb-1">阵营</div><div className="font-serif text-lg font-semibold">{c.alignment || '-'}</div></div>
                  <div><div className="text-sm text-stone-500 mb-1">年龄</div><div className="font-serif text-lg font-semibold">{c.age || '-'}</div></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm">
                <h3 className="text-xl font-serif text-stone-900 mb-6 border-b border-stone-100 pb-3">背景故事</h3>
                <div className="space-y-6">
                  {c.backstory && (
                    <div className="prose prose-stone text-stone-700 max-w-none whitespace-pre-wrap">
                      {c.backstory}
                    </div>
                  )}
                  {(!c.backstory && !c.specialty) && <p className="text-stone-500 italic">未填写背景故事。</p>}
                  {c.specialty && (
                    <div className="mt-4">
                      <div className="text-sm text-amber-600 font-semibold mb-2">{bg?.specialty?.name || '特色'}</div>
                      <p className="text-stone-700 bg-stone-50 px-5 py-4 rounded-md border">{c.specialty}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm">
                <h3 className="text-xl font-serif text-stone-900 mb-6 border-b border-stone-100 pb-3">性格与特质</h3>
                <div className="space-y-6">
                  <div><div className="text-sm text-amber-600 font-semibold mb-2">性格特质</div><p className="text-stone-700 bg-stone-50 px-5 py-4 rounded-md border">{c.personality || '未填写'}</p></div>
                  <div><div className="text-sm text-amber-600 font-semibold mb-2">理想</div><p className="text-stone-700 bg-stone-50 px-5 py-4 rounded-md border">{c.ideals || '未填写'}</p></div>
                  <div><div className="text-sm text-amber-600 font-semibold mb-2">牵绊</div><p className="text-stone-700 bg-stone-50 px-5 py-4 rounded-md border">{c.bonds || '未填写'}</p></div>
                  <div><div className="text-sm text-amber-600 font-semibold mb-2">缺点</div><p className="text-stone-700 bg-stone-50 px-5 py-4 rounded-md border">{c.flaws || '未填写'}</p></div>
                  <div><div className="text-sm text-amber-600 font-semibold mb-2">外貌</div><p className="text-stone-700 bg-stone-50 px-5 py-4 rounded-md border">{c.appearance || '未填写'}</p></div>
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