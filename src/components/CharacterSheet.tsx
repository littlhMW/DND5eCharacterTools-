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
import { getProficiencies, getProficiencyBonus, SKILL_NAMES, SKILL_ABILITIES } from '../utils/proficiencies';

const TABS = ['概览', '专长与特性', '法术', '状态与装备', '背景与细节'];

export function CharacterSheet() {
  const { state, dispatch } = useCharacter();
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const c = state.character;
  const race = races.find(r => r.id === c.raceId);
  const subrace = race?.subraces?.find(sr => sr.id === c.subraceId);
  const cls = classes.find(cl => cl.id === c.classId);
  const subclass = cls?.subclasses.find(sc => sc.id === c.subclassId);
  const bg = backgrounds.find(b => b.id === c.backgroundId);

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
    const rBonus = race?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0;
    const srBonus = subrace?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0;
    const asiBonus = getAsiBonus(ab);
    const total = c.baseAbilities[ab] + rBonus + srBonus + asiBonus;
    return Math.floor((total - 10) / 2);
  };

  const getScore = (ab: Ability) => {
    const rBonus = race?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0;
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
    if (!key.includes('cantrip') && key !== 'spells-step-prepared') {
      if (key.startsWith('wizard-spellbook')) {
        // 法师的法术书，也视为已知
        (val as string[]).forEach(id => ids.add(id));
      } else if (!key.includes('spells-step-unrestricted') && !key.includes('spells-step-restricted')) {
        // 其他已知施法者的法术
        (val as string[]).forEach(id => ids.add(id));
      }
    }
  });
  return Array.from(ids);
}, [c.traitSelections]);
  

  // 戏法 ID
  const cantripIds = useMemo(() => {
    const ids = new Set<string>();
    Object.entries(c.traitSelections).forEach(([key, val]) => {
      if (key.includes('cantrip')) (val as string[]).forEach(id => ids.add(id));
    });
    // 种族自动戏法
    race?.spells?.forEach(s => { if (spellData.find(sp => sp.id === s.spellId)?.level === 0) ids.add(s.spellId); });
    subrace?.spells?.forEach(s => { if (spellData.find(sp => sp.id === s.spellId)?.level === 0) ids.add(s.spellId); });
    return Array.from(ids);
  }, [c.traitSelections, race, subrace]);

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
              <div key={ab} className="bg-white border border-stone-200 rounded-3xl p-4 text-center shadow-sm flex flex-col relative pb-4">
                <div className="flex flex-col items-center mb-1">
                  <div className="text-xs font-sans tracking-widest text-stone-500 font-semibold mb-1">{abNames[ab]} {ab}</div>
                  <div className="text-3xl font-serif text-stone-900 font-bold">{score}</div>
                </div>
                <div className="absolute top-3 right-3 text-sm font-mono font-bold bg-stone-100 px-2 py-1 rounded-lg text-stone-700">{mod >= 0 ? '+' : ''}{mod}</div>
                <div className="text-xs font-sans border-t-2 border-stone-100/50 pt-3 mt-1 flex flex-col gap-1.5 w-full z-10 relative">
                  <div className={`flex items-center gap-1 ${isSaveProficient ? 'text-amber-700 font-bold' : 'text-stone-400'}`}>
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
              <div className="bg-white p-4 rounded-3xl border border-stone-200 text-center shadow-sm">
                <div className="text-xs text-stone-500 uppercase font-semibold mb-1">护甲等级</div>
                <div className="text-3xl font-serif">{10 + getMod('DEX')}</div>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-stone-200 text-center shadow-sm">
                <div className="text-xs text-stone-500 uppercase font-semibold mb-1">速度</div>
                <div className="text-2xl font-serif">{race?.speed || 30} <span className="text-sm text-stone-500">尺</span></div>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-stone-200 text-center shadow-sm">
                <div className="text-xs text-stone-500 uppercase font-semibold mb-1">生命值</div>
                <div className="text-3xl font-serif text-red-700">{(cls?.hitDie || 10) + getMod('CON') + (c.level - 1) * ((cls?.hitDie || 10) / 2 + 1 + getMod('CON'))}</div>
              </div>
            </div>
            
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm h-full">
              <h3 className="text-lg font-serif mb-4">熟练项与语言</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-semibold text-stone-900 mb-1">护甲与武器</div>
                  <p className="text-stone-600">{[...(cls?.armorProficiencies || []), ...(cls?.weaponProficiencies || []), ...(race?.weaponProficiencies || []), ...(race?.armorProficiencies || []), ...(subrace?.weaponProficiencies || []), ...(subrace?.armorProficiencies || [])].filter((v, i, a) => a.indexOf(v) === i).join('、 ') || '无'}</p>
                </div>
                <div>
                  <div className="font-semibold text-stone-900 mb-1">工具</div>
                  <p className="text-stone-600">{[...(cls?.toolProficiencies || []), ...(race?.toolProficiencies || []), ...(subrace?.toolProficiencies || []), ...(bg?.toolProficiencies || [])].concat(
                    (c.traitSelections['dwarf-tool'] as string[] || []).map(id => ({ 'smithsTools': '铁匠工具', 'brewersSupplies': '酿酒工具', 'masonsTools': '泥瓦匠工具' }[id] || id))
                  ).filter((v, i, a) => a.indexOf(v) === i).join('、 ') || '无'}</p>
                </div>
                <div>
                  <div className="font-semibold text-stone-900 mb-1">语言</div>
                  <p className="text-stone-600">
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
    const showCantrips = cantripIds.map(id => spellData.find(s => s.id === id)).filter(Boolean) as typeof spellData;

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
  showLeveled = knownIds.map(id => spellData.find(s => s.id === id)).filter(Boolean) as typeof spellData;
}

    // 无论如何，追加种族/亚种/亚职的自动法术（除去戏法）
    const extraSpells = [...(race?.spells || []), ...(subrace?.spells || []), ...(subclass?.spells || [])]
      .filter(s => s.level > 0)
      .map(s => spellData.find(sp => sp.id === s.spellId))
      .filter(Boolean) as typeof spellData;
      
    extraSpells.forEach(extra => {
      if (!showLeveled.some(s => s.id === extra.id)) {
        showLeveled.push(extra);
      }
    });

    const handlePrepareToggle = (spellId: string) => {
      if (!isPreparedCaster) return;
      const current = preparedIds;
      const next = current.includes(spellId)
        ? current.filter(id => id !== spellId)
        : [...current, spellId];
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: 'spells-step-prepared', selectedIds: next } });
    };

    const renderLevelTable = (level: number, spells: typeof spellData, slots: number = 0) => {
      const title = level === 0 ? '戏法' : `${level}环 (${slots} 法术位)`;
      return (
        <div key={level} className="mb-8 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="bg-stone-50 px-6 py-3 border-b border-stone-100">
            <h3 className="text-lg font-serif text-amber-600">{title}</h3>
          </div>
          {spells.length === 0 ? (
            <p className="text-sm text-stone-400 italic text-center py-8">暂无</p>
          ) : (
            <table className="w-full text-sm font-sans">
              <thead className="text-xs text-stone-500 uppercase bg-stone-50 border-b border-stone-100">
                <tr>
                  {isPreparedCaster && <th className="w-10 px-2 py-2">准备</th>}
                  <th className="px-4 py-2 text-left">法术名称</th>
                  <th className="px-4 py-2 hidden md:table-cell">学派</th>
                  <th className="px-4 py-2 hidden md:table-cell">施法时间</th>
                  <th className="px-4 py-2 hidden md:table-cell">距离</th>
                  <th className="px-4 py-2">来源</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {spells.map(spell => {
                  const isPrepared = preparedIds.includes(spell.id);
                  // 判断来源
                  let source = '职业';
                  if (race?.spells?.some(s => s.spellId === spell.id)) source = '种族';
                  else if (subrace?.spells?.some(s => s.spellId === spell.id)) source = '亚种';
                  else if (subclass?.spells?.some(s => s.spellId === spell.id)) source = '亚职';
                  else {
                    for (const [key, val] of Object.entries(c.traitSelections)) {
                       if (val && Array.isArray(val) && val.includes(spell.id)) {
                         if (race && key.startsWith(race.id)) source = '种族';
                         else if (subrace && key.startsWith(subrace.id)) source = '亚种';
                         else if (bg && key.startsWith(bg.id)) source = '背景';
                       }
                    }
                  }
                  return (
                    <tr key={spell.id} className="hover:bg-amber-50/20 transition-colors">
                      {isPreparedCaster && (
                        <td className="px-2 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isPrepared}
                            onChange={() => handlePrepareToggle(spell.id)}
                            className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
                          />
                        </td>
                      )}
                      <td className="px-4 py-3 font-medium text-stone-900">{spell.name}</td>
                      <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{spell.school}</td>
                      <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{spell.castingTime}</td>
                      <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{spell.range}</td>
                      <td className="px-4 py-3 text-stone-500 text-xs">{source}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      );
    };

    return (
      <div className="animate-in fade-in max-w-5xl space-y-6">
        {renderLevelTable(0, showCantrips)}
        {Array.from({ length: maxSlotLevel }, (_, i) => i + 1).map(level => {
          const spells = showLeveled.filter(s => s.level === level);
          const slots = slotArray[level - 1] || 0;
          return renderLevelTable(level, spells, slots);
        })}
      </div>
    );
  };

  // 状态与装备 Tab (保持不变)
  // 背景与细节 Tab (保持不变)

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-stone-900 font-sans p-4 md:p-8 md:pt-12">
      <div className="max-w-7xl mx-auto bg-stone-50 border border-stone-200 rounded-3xl shadow-xl overflow-hidden pb-4 ring-1 ring-stone-900/5">
        {/* Header */}
        <div className="px-8 md:px-12 py-10 flex flex-col md:flex-row justify-between items-end bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50 rounded-bl-[100%] opacity-50 -z-10" />
          <div>
            <h1 className="text-5xl font-serif text-stone-900 font-bold mb-4">{c.name || '未命名角色'}</h1>
            <div className="text-stone-600 flex gap-3 text-sm font-medium flex-wrap">
              <span className="bg-stone-100 px-3 py-1 rounded-full">等级 {c.level}</span>
              <span className="bg-stone-100 px-3 py-1 rounded-full">{subrace?.name || race?.name || '未知种族'}</span>
              <span className="bg-stone-100 px-3 py-1 rounded-full">{subclass?.name || cls?.name || '无职业'}</span>
              <span className="bg-stone-100 px-3 py-1 rounded-full">{bg?.name || '未知背景'}</span>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'wizard' })} className="px-6 py-2.5 border border-stone-200 rounded-full hover:bg-stone-50 transition font-medium shadow-sm">返回编辑</button>
            <button onClick={() => dispatch({ type: 'LEVEL_UP' })} className="px-6 py-2.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition font-bold shadow-sm shadow-amber-500/20">提升等级</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-8 mt-2 bg-stone-50 overflow-x-auto gap-2">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3.5 text-sm font-bold tracking-wide whitespace-nowrap rounded-t-xl z-10 relative top-[1px] ${
                activeTab === tab ? 'text-amber-700 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.03)] border-t border-x border-stone-200' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100/50 border-t border-x border-transparent'
              }`}
            >{tab}</button>
          ))}
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 bg-white min-h-[65vh] border-t border-stone-200">
          {activeTab === '概览' && renderMainTab()}
          {activeTab === '专长与特性' && (
            // 专长与特性内容（省略，保持之前的 renderFeatures 即可）
            <div className="space-y-6 animate-in fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8">
                <h3 className="text-2xl font-serif text-amber-600 mb-6 border-b border-stone-100 pb-3">职业特性</h3>
                <ul className="space-y-6">
                  {[
                    ...(cls?.traits || []).filter(t => t.level! <= c.level).map(t => ({ ...t, isSubclass: false })),
                    ...(subclass ? subclass.traits.filter(t => t.level! <= c.level).map(t => ({ ...t, isSubclass: true })) : [])
                  ].sort((a, b) => (a.level || 0) - (b.level || 0)).map((t, index) => (
                    <li key={`${t.name}-${t.level}-${index}`} className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-stone-300">
                      <strong className="text-stone-900 block mb-1 font-serif text-lg">{t.name} <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full ml-2">Lv {t.level}</span></strong>
                      <span className="text-sm font-sans text-stone-600 leading-relaxed block">{t.description}</span>
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
                          displayNames = ids.map(id => choice.options?.find(o => o.id === id)?.name || spellData.find(s => s.id === id)?.name || id);
                        }

                        return <div key={choice.id} className="mt-2 text-sm font-sans bg-stone-50 border border-stone-100 p-3 rounded-xl"><span className="font-semibold text-stone-700">{choice.name}:</span> <span className="text-amber-700">{displayNames.join(', ')}</span></div>;
                      })}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8">
                <h3 className="text-2xl font-serif text-amber-600 mb-6 border-b border-stone-100 pb-3">种族与背景特性</h3>
                <ul className="space-y-6">
                  {race?.traits.map((t, i) => (
                    <li key={`race-${t.name}-${i}`} className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-stone-300">
                      <strong className="text-stone-900 block mb-1 font-serif text-lg">{t.name}</strong>
                      <span className="text-sm font-sans text-stone-600 leading-relaxed block">{t.description}</span>
                    </li>
                  ))}
                  {subrace?.traits.map((t, i) => (
                    <li key={`subrace-${t.name}-${i}`} className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-stone-300">
                      <strong className="text-stone-900 block mb-1 font-serif text-lg">{t.name}</strong>
                      <span className="text-sm font-sans text-stone-600 leading-relaxed block">{t.description}</span>
                    </li>
                  ))}
                  {bg && (
                    <li className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-stone-400">
                      <strong className="text-stone-800 block mb-1 font-serif text-lg">{bg.feature.name} <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full ml-2">背景</span></strong>
                      <span className="text-sm font-sans text-stone-600 leading-relaxed block">{bg.feature.description}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
          {activeTab === '法术' && renderSpells()}
          {activeTab === '状态与装备' && (
            <div className="space-y-8 max-w-5xl animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(() => {
                  const chosenEquipment: string[] = [];
                  if (cls?.traits) {
                    Object.entries(c.traitSelections).forEach(([key, val]) => {
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
                    <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                      <h3 className="text-xl font-serif text-stone-900 mb-4 border-b border-stone-100 pb-3">起始装备</h3>
                      <ul className="space-y-3 text-sm">
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
                        {bg?.startingEquipment?.map((eq, i) => (
                          <li key={`bg-${i}`} className="flex items-start bg-stone-50 p-3 rounded-xl border border-stone-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 mr-3 flex-shrink-0" />
                            <EquipmentText text={eq} />
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 pt-4 border-t border-stone-100 text-sm text-stone-500">
                        <span className="font-semibold text-stone-700">资金：</span>视职业和背景选择（通常为 15-50 金币）
                      </div>
                    </div>
                  );
                })()}
                <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
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
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                <h3 className="text-xl font-serif text-stone-900 mb-6 border-b border-stone-100 pb-3">基本细节</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div><div className="text-sm text-stone-500 mb-1">阵营</div><div className="font-serif text-lg font-semibold">{c.alignment || '-'}</div></div>
                  <div><div className="text-sm text-stone-500 mb-1">年龄</div><div className="font-serif text-lg font-semibold">{c.age || '-'}</div></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                <h3 className="text-xl font-serif text-stone-900 mb-6 border-b border-stone-100 pb-3">性格与特质</h3>
                <div className="space-y-6">
                  <div><div className="text-sm text-amber-600 font-semibold mb-2">性格特质</div><p className="text-stone-700 bg-stone-50 px-5 py-4 rounded-2xl border">{c.personality || '未填写'}</p></div>
                  <div><div className="text-sm text-amber-600 font-semibold mb-2">理想</div><p className="text-stone-700 bg-stone-50 px-5 py-4 rounded-2xl border">{c.ideals || '未填写'}</p></div>
                  <div><div className="text-sm text-amber-600 font-semibold mb-2">牵绊</div><p className="text-stone-700 bg-stone-50 px-5 py-4 rounded-2xl border">{c.bonds || '未填写'}</p></div>
                  <div><div className="text-sm text-amber-600 font-semibold mb-2">缺点</div><p className="text-stone-700 bg-stone-50 px-5 py-4 rounded-2xl border">{c.flaws || '未填写'}</p></div>
                  <div><div className="text-sm text-amber-600 font-semibold mb-2">外貌</div><p className="text-stone-700 bg-stone-50 px-5 py-4 rounded-2xl border">{c.appearance || '未填写'}</p></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}