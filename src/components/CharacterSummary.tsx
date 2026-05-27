import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import { races, getRaceByIdAndSource } from '../data/races';
import { classes } from '../data/classes';
import { backgrounds } from '../data/backgrounds';
import { spells as allSpells } from '../data/spells';
import { feats } from '../data/feats';
import { classSpellLists } from '../data/spellLists';
import { DictyTwisterLink } from './DictyTwisterLink';
import { Ability } from '../types/dnd';
import { getProficiencies, getProficiencyBonus, SKILL_NAMES, SKILL_ABILITIES } from '../utils/proficiencies';
import { FormattedDescription } from './shared/FormattedDescription';
import { getCleanDescription } from '../utils/customRollTraits';

export function CharacterSummary() {
  const { state } = useCharacter();
  const c = state.character;
  
  const race = getRaceByIdAndSource(c.raceId, c.raceSource);
  const subrace = race?.subraces?.find(sr => sr.id === c.subraceId);
  const cls = classes.find(cl => cl.id === c.classId);
  const subclass = cls?.subclasses?.find(sc => sc.id === c.subclassId);
  const bg = backgrounds.find(b => b.id === c.backgroundId);

  // 根据法术 ID 获取名称的辅助函数
  const getSpellName = (id: string) => allSpells.find(s => s.id === id)?.name || id;

  const conMod = Math.floor((c.baseAbilities.CON + ((race?.id === 'human' && subrace?.id === 'human-variant') ? 0 : (race?.abilityBonuses?.find(b => b.ability === 'CON')?.bonus || 0)) + (subrace?.abilityBonuses?.find(b => b.ability === 'CON')?.bonus || 0) - 10) / 2);
  const dexMod = Math.floor((c.baseAbilities.DEX + ((race?.id === 'human' && subrace?.id === 'human-variant') ? 0 : (race?.abilityBonuses?.find(b => b.ability === 'DEX')?.bonus || 0)) + (subrace?.abilityBonuses?.find(b => b.ability === 'DEX')?.bonus || 0) - 10) / 2);
  
  const hpPerLevelBonus = c.subraceId === 'hill-dwarf' ? 1 : 0;
  const hitDie = cls?.hitDie || 8;
  const averageHitDie = Math.ceil(hitDie / 2 + 0.5);
  const maxHp = cls ? (hitDie + conMod + hpPerLevelBonus) + (c.level - 1) * (averageHitDie + conMod + hpPerLevelBonus) : 0;
  
  let baseAc = 10 + dexMod;
  if (cls?.id === 'barbarian') {
    baseAc = 10 + dexMod + conMod;
  }

  const { saves, skills, expertise } = getProficiencies(c, cls, race, subrace, bg);
  const profBonus = getProficiencyBonus(c.level);

  return (
    <div className="flex-1 flex flex-col h-full bg-white p-4 sm:p-6 overflow-y-auto w-full font-serif relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-30 pointer-events-none mix-blend-multiply"></div>
      <div className="relative z-10 w-full flex-1 flex flex-col">
      <div className="mb-4 border-b-2 border-amber-600/30 pb-3">
        <h2 className="text-2xl font-serif text-amber-800 mb-2 drop-shadow-sm">{c.name || '未命名'}</h2>
        <div className="text-stone-600 text-xs flex flex-wrap items-center gap-2 mt-1 font-sans">
          <span className="font-bold bg-white border border-stone-300 shadow-sm px-2 py-1 rounded-md text-amber-800">
            Level {c.level} <span className="ml-1 text-[10px]">{c.level}级</span>
          </span>
          {race && (
            <span className="flex items-center group relative bg-stone-200/50 pl-2 pr-1 py-1 rounded-md text-stone-700">
              <span>{subrace?.name?.replace(' (本相)', '') || race.name}</span>
              <DictyTwisterLink type="race" name={race.name} source={race.source || 'phb'} />
            </span>
          )}
          {bg && (
            <span className="flex items-center group relative bg-stone-200/50 pl-2 pr-1 py-1 rounded-md text-stone-700">
              <span>{bg.name}</span>
              <DictyTwisterLink type="background" name={bg.name} source={bg.source || 'phb'} />
            </span>
          )}
          {cls && (
            <span className="flex items-center group relative italic bg-stone-200/50 pl-2 pr-1 py-1 rounded-md text-stone-700">
               <span>{subclass?.name || cls.name}</span>
               <DictyTwisterLink type="class" name={cls.name} subId={subclass?.id} source={subclass?.source || cls.source || 'phb'} baseSource={cls.source || 'phb'} />
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="bg-amber-100/50 border border-amber-200 rounded-md p-2 flex-1 text-center shrink-0">
            <div className="text-[10px] font-sans uppercase tracking-[0.15em] text-stone-500 mb-0.5">最大生命值 HP</div>
            <div className="text-xl font-serif text-amber-700 font-bold">{cls ? maxHp : '--'}</div>
          </div>
          <div className="bg-stone-100 border border-stone-200 rounded-md p-2 flex-1 text-center shrink-0">
            <div className="text-[10px] font-sans uppercase tracking-[0.15em] text-stone-500 mb-0.5">无甲防御 AC</div>
            <div className="text-xl font-serif text-stone-700 font-bold">{baseAc}</div>
          </div>
        </div>

        {/* Abilities */}
        <div>
          <h3 className="text-sm font-sans uppercase tracking-[0.15em] text-stone-400 mb-3 border-b border-stone-200 pb-1">基础属性</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as Ability[]).map((ab) => {
              const val = c.baseAbilities[ab] || 10;
              const baseVal = val;
              const bonus = (race?.id === 'human' && subrace?.id === 'human-variant') ? 0 : (race?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0);
              const subBonus = subrace?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0;
              const asiBonus = Object.values(c.traitSelections).flat().filter(id => id === `asi-${ab}`).length;
              
              // 半专长处理
              let featBonus = 0;
              Object.values(c.traitSelections).flat().forEach(id => {
                if (id === 'feat-tavern-brawler' && (ab === 'STR' || ab === 'CON')) featBonus += 0; // 这边太复杂，先暂时只加ASI
                if (id === 'feat-observant' && (ab === 'INT' || ab === 'WIS')) featBonus += 0; 
              }); // The user did not specify half-feats precision, we will just use asiBonus

              const total = baseVal + bonus + subBonus + asiBonus;
              const mod = Math.floor((total - 10) / 2);

              const isSaveProficient = saves.includes(ab);
              const abilitySkills = Object.entries(SKILL_ABILITIES).filter(([, a]) => a === ab).map(([s]) => s);
              
              return (
                <div key={ab} className="bg-white border border-stone-200 rounded-md p-2 relative shadow-sm overflow-hidden flex flex-col">
                  <div className="flex flex-col justify-center items-center mb-1">
                    <div className="text-[9px] font-sans uppercase tracking-widest text-stone-500 mb-0.5">{ab}</div>
                    <div className="text-xl font-serif text-amber-600">{total}</div>
                    <div className="text-[10px] font-medium font-sans text-stone-400 absolute top-1 right-1 bg-stone-50 px-1 py-0.5 rounded">{mod >= 0 ? '+' : ''}{mod}</div>
                  </div>
                  <div className="text-[10px] font-sans border-t border-stone-100 pt-1 flex flex-col gap-0.5">
                    <div className={`flex items-center gap-1 ${isSaveProficient ? 'text-amber-700 font-semibold' : 'text-stone-400'}`}>
                      <span className="w-3 text-center">{isSaveProficient ? '•' : '○'}</span>
                      <span className="flex-1">豁免</span>
                      <span>{(mod + (isSaveProficient ? profBonus : 0)) >= 0 ? '+' : ''}{mod + (isSaveProficient ? profBonus : 0)}</span>
                    </div>
                    {abilitySkills.map(skill => {
                      const isExpert = expertise.includes(skill);
                      const isProf = skills.includes(skill);
                      const bonus = mod + (isExpert ? profBonus * 2 : (isProf ? profBonus : 0));
                      const mark = isExpert ? '☆' : (isProf ? '•' : '○');
                      return (
                        <div key={skill} className={`flex items-center gap-1 ${isExpert ? 'text-amber-700 font-bold' : isProf ? 'text-amber-700 font-semibold' : 'text-stone-400'}`}>
                          <span className="w-3 text-center">{mark}</span>
                          <span className="flex-1">{SKILL_NAMES[skill]}</span>
                          <span>{bonus >= 0 ? '+' : ''}{bonus}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accumulated Traits */}
        <div>
          <h3 className="text-sm font-sans uppercase tracking-[0.15em] text-stone-400 mb-2 border-b border-stone-200 pb-1">特性</h3>
          <ul className="space-y-2">
            {race?.traits?.filter(t => !t.level || t.level <= c.level)
              .filter(t => {
                if (subrace) {
                  if (race.id === 'half-elf' && t.name === '多才多艺') return false;
                  if (race.id === 'tiefling' && t.name === '炼狱传承') return false;
                }
                return true;
              })
              .map(t => (
              <li key={`race-${t.name}`} className="flex flex-col text-xs border-l-2 border-stone-300 pl-2">
                <span className="font-semibold text-stone-800 text-sm mb-0.5">{t.name}</span>
                <span className="text-stone-500 leading-relaxed font-sans">{t.description}</span>
                {t.choices?.map(choice => renderChoiceSelection(choice, c.traitSelections))}
              </li>
            ))}
            {subrace?.traits?.filter(t => !t.level || t.level <= c.level).map(t => (
              <li key={`subrace-${t.name}`} className="flex flex-col text-xs border-l-2 border-stone-300 pl-2">
                <span className="font-semibold text-stone-800 text-sm mb-0.5">{t.name}</span>
                <span className="text-stone-500 leading-relaxed font-sans">{t.description}</span>
                {t.choices?.map(choice => renderChoiceSelection(choice, c.traitSelections))}
              </li>
            ))}
            {bg && (
              <li className="flex flex-col text-xs border-l-2 border-stone-300 pl-2">
                <span className="font-semibold text-stone-800 text-sm mb-0.5">{bg.feature.name}</span>
                <span className="text-stone-500 leading-relaxed font-sans">{bg.feature.description}</span>
                {bg.choices?.map(choice => renderChoiceSelection(choice, c.traitSelections))}
              </li>
            )}
            {[
              ...(cls?.traits || []).filter(t => t.level! <= c.level).map(t => ({ ...t, isSubclass: false })),
              ...(subclass ? subclass.traits.filter(t => t.level! <= c.level).map(t => ({ ...t, isSubclass: true })) : [])
            ].sort((a, b) => (a.level || 0) - (b.level || 0)).map((t, index) => (
              <li key={`class-${t.name}-${t.level}-${index}`} className={`flex flex-col text-xs border-l-2 ${t.isSubclass ? 'border-amber-400' : 'border-amber-500'} pl-2`}>
                <span className={`font-semibold ${t.isSubclass ? 'text-amber-700' : 'text-amber-600'} text-sm mb-0.5`}>
                  {t.name}
                  {t.isSubclass && <span className="text-[10px] font-sans bg-amber-50 text-amber-600 px-1 py-0.5 rounded ml-1.5 align-middle border border-amber-200/50">子职业</span>}
                </span>
                <FormattedDescription text={getCleanDescription(t.name, t.description, c.traitSelections)} className="text-stone-500 leading-relaxed font-sans" />
                {t.choices?.map(choice => renderChoiceSelection(choice, c.traitSelections))}
              </li>
            ))}
          </ul>
          {(!race && !cls && !bg) && <p className="text-sm text-stone-500 italic font-sans">请做出选择以查看特性...</p>}
        </div>

        {/* Selected Feats */}
        {(() => {
          const selectedFeats = (Object.values(c.traitSelections).flat() as string[]).filter(id => typeof id === 'string' && id.startsWith('feat-')).map(id => id.substring(5));
          const featsList = selectedFeats.map(fid => feats.find(f => f.id === fid)).filter(Boolean);
          if (featsList.length === 0) return null;
          return (
            <div className="mt-4">
              <h3 className="text-sm font-sans uppercase tracking-[0.15em] text-stone-400 mb-2 border-b border-stone-200 pb-1">专长</h3>
              <ul className="space-y-2">
                {featsList.map((f, i) => (
                  <li key={`feat-${f?.id}-${i}`} className="flex flex-col text-xs border-l-2 border-stone-400 pl-2">
                    <span className="font-semibold text-stone-800 text-sm mb-0.5 flex items-center gap-1.5">
                       {f?.name} 
                       <DictyTwisterLink type="feat" name={f?.name!} source={f?.source || 'phb'} />
                    </span>
                    <span className="text-stone-500 leading-relaxed font-sans">{f?.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
      </div>
      </div>
    </div>
  );
}

// 提取出来的通用选择结果渲染函数
function renderChoiceSelection(choice: any, traitSelections: Record<string, string[]>) {
  const selectedIds = traitSelections[choice.id] || [];
  if (selectedIds.length === 0) return null;

  const toolMap: Record<string, string> = {
    'thieves-tools': '盗贼工具',
    'smiths-tools': '铁匠工具',
    'brewers-supplies': '酿酒工具',
    'masons-tools': '石匠工具',
    'disguise-kit': '易容工具',
    'forgery-kit': '造假工具',
    'herbalism-kit': '草药志',
    'navigators-tools': '航海工具',
    'poisoners-kit': '制毒工具',
    'land-vehicles': '陆地载具',
    'water-vehicles': '水上载具'
  };

  // 动态法术选择：显示法术名称
  if (choice.dynamic === 'spell') {
    const names = selectedIds.map(id => allSpells.find(s => s.id === id)?.name || id).join(', ');
    return (
      <div key={choice.id} className="mt-1 text-xs font-sans">
        <span className="font-semibold text-stone-700">{choice.name || '法术选择'}: </span>
        <span className="text-amber-700">{names}</span>
      </div>
    );
  }

  // 动态技能或专精
  if (choice.dynamic === 'skill' || choice.dynamic === 'expertise') {
    const names = selectedIds.map(id => {
      let currentId = id;
      if (id.startsWith('skill-')) currentId = id.substring(6);
      return toolMap[currentId] || SKILL_NAMES[currentId as keyof typeof SKILL_NAMES] || id;
    });
    return (
      <div key={choice.id} className="mt-1 text-xs font-sans">
        <span className="font-semibold text-stone-700">{choice.name || '选择'}: </span>
        <span className="text-amber-700">{names.join(', ')}</span>
      </div>
    );
  }

  // 动态语言
  if (choice.dynamic === 'language') {
    const langMap: Record<string, string> = {
      common: '通用语', elvish: '精灵语', dwarvish: '矮人语', giant: '巨人语',
      gnomish: '侏儒语', goblin: '地精语', halfling: '半身人语', orc: '兽人语',
      abyssal: '深渊语', celestial: '天界语', draconic: '龙语', deep_speech: '深潜语',
      infernal: '炼狱语', primordial: '原初语', sylvan: '木族语', undercommon: '地底语'
    };
    const names = selectedIds.map(id => langMap[id] || id);
    return (
      <div key={choice.id} className="mt-1 text-xs font-sans">
        <span className="font-semibold text-stone-700">{choice.name || '语言'}: </span>
        <span className="text-amber-700">{names.join(', ')}</span>
      </div>
    );
  }

  // 工具熟练
  if (choice.dynamic === 'tool') {
    const names = selectedIds.map(id => toolMap[id] || id);
    return (
      <div key={choice.id} className="mt-1 text-xs font-sans">
        <span className="font-semibold text-stone-700">{choice.name || '工具'}: </span>
        <span className="text-amber-700">{names.join(', ')}</span>
      </div>
    );
  }

  // 动态专长或属性提升
  if (choice.dynamic === 'asi' || choice.dynamic === 'feat') {
    const displayNames = selectedIds.map(id => {
      let featId = id;
      if (id.startsWith('feat-')) featId = id.substring(5);
      if (id.startsWith('asi-')) {
        const ability = id.substring(4).toLowerCase();
        const map: Record<string, string> = { str: '力量', dex: '敏捷', con: '体质', int: '智力', wis: '感知', cha: '魅力' };
        return `${map[ability] || ability.toUpperCase()}+1`;
      }
      const feat = feats.find(f => f.id === featId);
      return feat ? feat.name : id;
    });
    return (
      <div key={choice.id} className="mt-1 text-xs font-sans">
        <span className="font-semibold text-stone-700">{choice.name || '专长/属性提升'}: </span>
        <span className="text-amber-700">{displayNames.join(', ')}</span>
      </div>
    );
  }

  // 先祖遗赠处理
  if (choice.dynamic === 'ancestral-legacy') {
    const names = selectedIds.map(id => {
      if (id.startsWith('inherit-')) {
        return `继承自种族: ${id.replace('inherit-', '')}`;
      }
      return SKILL_NAMES[id as keyof typeof SKILL_NAMES] || id;
    });
    return (
      <div key={choice.id} className="mt-1 text-xs font-sans">
        <span className="font-semibold text-stone-700">{choice.name || '先祖遗赠选项'}: </span>
        <span className="text-amber-700">{names.join(', ')}</span>
      </div>
    );
  }

  // 其他动态专精或自定义类型
  if (choice.dynamic) {
    return (
      <div key={choice.id} className="mt-1 text-xs font-sans">
        <span className="font-semibold text-stone-700">{choice.name || '选择'}: </span>
        <span className="text-amber-700">{selectedIds.join(', ')}</span>
      </div>
    );
  }

  // 静态选项
  const selectedOptions = (choice.options || []).filter((o: any) => selectedIds.includes(o.id));
  if (selectedOptions.length === 0) return null;
  return (
    <div key={choice.id} className="mt-1 text-xs font-sans">
      <span className="font-semibold text-stone-700">{choice.name || '选择'}: </span>
      <span className="text-amber-700">{selectedOptions.map((o: any) => o.name).join(', ')}</span>
    </div>
  );
}