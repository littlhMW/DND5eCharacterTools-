import React, { useMemo } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { classes } from '../../data/classes';
import { spells as allSpells } from '../../data/spells';
import { classSpellLists } from '../../data/spellLists';
import { isSourceEnabled } from '../../utils/expansionHelper';
import { DictyTwisterLink } from '../DictyTwisterLink';
import { races } from '../../data/races';

export function getMaxSpellLevel(spellSlots: number[][], level: number) {
  const idx = Math.min(level - 1, spellSlots.length - 1);
  const slots = spellSlots[idx] || [];
  let max = 0;
  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i] > 0) { max = i + 1; break; }
  }
  return max;
}

export function getSpellcastingConfig(cls: any, subclass: any, level: number) {
  if (subclass?.spellcasting && level >= (subclass.spellcastingStartLevel || cls?.subclassAvailableAtLevel)) {
    return subclass.spellcasting;
  }
  return cls?.spellcasting || null;
}

export function calcExpectedCantrips(spellcasting: any, level: number) {
  if (!spellcasting) return 0;
  const idx = Math.min(level - 1, spellcasting.cantripsKnown.length - 1);
  return spellcasting.cantripsKnown[idx] || 0;
}

export function calcExpectedKnownSpells(spellcasting: any, level: number) {
  if (!spellcasting || spellcasting.type !== 'known') return 0;
  if (spellcasting.spellsKnown && Array.isArray(spellcasting.spellsKnown)) {
    const idx = Math.min(level - 1, spellcasting.spellsKnown.length - 1);
    return spellcasting.spellsKnown[idx] || 0;
  }
  return 0;
}

export function calcMaxPrepared(spellcasting: any, level: number, classId: string, abilityScores: Record<string, number>) {
  if (!spellcasting || spellcasting.type !== 'prepared') return 0;
  const ability = spellcasting.ability || 'WIS';
  const mod = Math.floor(((abilityScores[ability] || 10) - 10) / 2);
  if (classId === 'paladin') {
    return Math.max(1, mod + Math.floor(level / 2));
  }
  return Math.max(1, mod + level);
}

export function SpellsStep() {
  const { state, dispatch } = useCharacter();
  const c = state.character;

  const race = races.find(r => r.id === c.raceId);
  const subrace = race?.subraces?.find(sr => sr.id === c.subraceId);

  const cls = classes.find(cl => cl.id === c.classId);
  const subclass = cls?.subclasses?.find(sc => sc.id === c.subclassId);
  const spellcasting = getSpellcastingConfig(cls, subclass, c.level);

const autoSpells = useMemo(() => {
  const spells: { id: string; level: number }[] = [];
  // 子职业提供的自动法术（领域法术等）
  if (subclass?.spells) {
    subclass.spells
      .filter(s => s.level <= c.level && s.spellId && allSpells.some(sp => sp.id === s.spellId))
      .forEach(s => spells.push({ id: s.spellId, level: s.level }));
  }
  // 种族和子种族的法术
  const charRace = races.find(r => r.id === c.raceId);
  const charSubrace = charRace?.subraces?.find(sr => sr.id === c.subraceId);
  if (charRace?.spells) {
    charRace.spells
      .filter(s => (s.level || 0) <= c.level && s.spellId && allSpells.some(sp => sp.id === s.spellId))
      .forEach(s => spells.push({ id: s.spellId, level: s.level || 0 }));
  }
  if (charSubrace?.spells) {
    charSubrace.spells
      .filter(s => (s.level || 0) <= c.level && s.spellId && allSpells.some(sp => sp.id === s.spellId))
      .forEach(s => spells.push({ id: s.spellId, level: s.level || 0 }));
  }
  
  // 从其他特性（非当前职业和自身拼写步数）来的法术
  Object.entries(c.traitSelections).forEach(([key, val]) => {
    if (!key.startsWith('spells-step-') && !key.startsWith('wizard-spellbook') && val) {
      if (key.includes('magical-secrets') || key.includes('custom-spells') || key.endsWith('-cantrip')) {
        (val as string[]).forEach(id => {
          const sp = allSpells.find(s => s.id === id);
          if (sp) {
             if (!spells.some(existing => existing.id === sp.id)) spells.push({ id: sp.id, level: sp.level });
          } else {
             if (!spells.some(existing => existing.id === id)) spells.push({ id, level: 1 }); // 假法术
          }
        });
      } else {
        (val as string[]).forEach(id => {
          const sp = allSpells.find(s => s.id === id);
          if (sp && !spells.some(existing => existing.id === sp.id)) {
            spells.push({ id: sp.id, level: sp.level });
          }
        });
      }
    }
  });
  return spells;
}, [subclass, c.raceId, c.subraceId, c.level, c.traitSelections]);
  const autoSpellIds = useMemo(() => new Set(autoSpells.map(s => s.id)), [autoSpells]);

  const expectedCantrips = calcExpectedCantrips(spellcasting, c.level);
  const maxPrepared = spellcasting?.type === 'prepared'
    ? calcMaxPrepared(spellcasting, c.level, cls?.id || '', c.baseAbilities)
    : 0;
  const expectedKnown = spellcasting?.type === 'known' ? calcExpectedKnownSpells(spellcasting, c.level) : 0;

  const allSelectedCantripIds = useMemo(() => {
    const ids = new Set<string>();
    Object.entries(c.traitSelections).forEach(([key, val]) => {
      // 仅包含 spells-step 中选择的戏法
      if (key.startsWith('spells-step-') && val) {
        (val as string[]).forEach(id => {
          const sp = allSpells.find(s => s.id === id);
          if (sp && sp.level === 0) ids.add(id);
        });
      }
    });
    autoSpells.filter(s => {
      const sp = allSpells.find(sp => sp.id === s.id);
      return sp && sp.level === 0;
    }).forEach(s => ids.add(s.id));
    return Array.from(ids);
  }, [c.traitSelections, autoSpells]);

  const spellbookIds = useMemo(() => {
  if (cls?.id !== 'wizard') return null;
  const ids = new Set<string>();
  Object.entries(c.traitSelections).forEach(([key, val]) => {
    if (key.startsWith('wizard-spellbook') && val) {
      (val as string[]).forEach(id => ids.add(id));
    }
  });
  return Array.from(ids);
}, [c.traitSelections, cls]);

  // 关键修正：spellList 现在应该是字符串，直接使用；如果没有，退回到职业 id
  const spellListId = spellcasting?.spellList || cls?.id || '';
  const availableIds = classSpellLists[spellListId] || [];

  const selectedPrepared = useMemo(() => c.traitSelections['spells-step-prepared'] || [], [c.traitSelections]);

  const schoolRestriction = useMemo(() => {
    if (subclass?.traits) {
      for (const t of subclass.traits) {
        if (t.choices) {
          for (const ch of t.choices) {
            if (ch.schoolRestriction) return ch.schoolRestriction;
          }
        }
      }
    }
    return null;
  }, [subclass]);

  const unrestrictedLevels = useMemo(() => {
    if (subclass?.id === 'arcane-trickster' || subclass?.id === 'eldritch-knight') return [8, 14, 20];
    return [];
  }, [subclass]);
  const unrestrictedCount = useMemo(() => unrestrictedLevels.filter(lvl => lvl <= c.level).length, [unrestrictedLevels, c.level]);
  const restrictedCount = Math.max(0, expectedKnown - unrestrictedCount);

  const selectedUnrestricted = useMemo(() => c.traitSelections['spells-step-unrestricted'] || [], [c.traitSelections]);
  const selectedRestricted = useMemo(() => c.traitSelections['spells-step-restricted'] || [], [c.traitSelections]);

  const allSelectedLeveledIds = useMemo(() => {
    const ids = new Set<string>();
    Object.entries(c.traitSelections).forEach(([key, val]) => {
      // 仅包含 spells-step 中选择的且非 prepared 的法术，(包含 restricted/unrestricted/leveled)
      if (key.startsWith('spells-step-') && !key.includes('prepared') && val) {
        (val as string[]).forEach(id => {
          const sp = allSpells.find(s => s.id === id);
          if (sp && sp.level > 0) ids.add(id);
        });
      }
    });
    autoSpells.filter(s => {
      const sp = allSpells.find(sp => sp.id === s.id);
      return sp && sp.level > 0;
    }).forEach(s => ids.add(s.id));
    return Array.from(ids);
  }, [c.traitSelections, autoSpells]);

  const maxSpellLevel = spellcasting?.spellSlots
    ? getMaxSpellLevel(spellcasting.spellSlots, c.level)
    : 1;

  const fullAvailableSpells = useMemo(() => {
    const idsSet = new Set(availableIds);
    const autoIdsSet = new Set(autoSpells.map(s => s.id));
    return allSpells.filter(s => 
      ((idsSet.has(s.id) && s.level <= maxSpellLevel) || autoIdsSet.has(s.id)) &&
      isSourceEnabled(s.source || 'phb')
    );
  }, [availableIds, autoSpells, maxSpellLevel]);

  const availableCantrips = fullAvailableSpells.filter(s => s.level === 0);
  const leveledSpells = fullAvailableSpells.filter(s => s.level > 0);

  const isPrepared = spellcasting?.type === 'prepared';
  const isKnown = spellcasting?.type === 'known';
  const isMixed = schoolRestriction && unrestrictedCount > 0;


const spellsToDisplay = cls?.id === 'wizard' 
  ? leveledSpells.filter(s => spellbookIds?.includes(s.id))
  : leveledSpells;

  


  const descriptionText = useMemo(() => {
    if (!spellcasting) return '';
    if (isPrepared) {
      const ability = spellcasting.ability || '感知';
      if (cls?.id === 'paladin') return `您是一名圣武士。准备数量 = ${ability}调整值 + 等级/2。最多准备 ${maxPrepared} 个法术。`;
      if (cls?.id === 'wizard') return `您是一名法师。准备数量 = ${spellcasting.ability}调整值 + 法师等级。最多准备 ${maxPrepared} 个法术。`;
      return `您是一名准备施法者。准备数量 = ${ability}调整值 + 等级。最多准备 ${maxPrepared} 个法术。`;
    }
    if (isMixed) {
      const schoolNames = schoolRestriction!.join('、');
      return `您是一名已知施法者，应学会 ${expectedCantrips} 个戏法和 ${expectedKnown} 个高阶法术。由于您是 ${subclass?.name}，在 ${unrestrictedLevels.join('、')} 级时法术可来自任意学派，因此有 ${unrestrictedCount} 个任意名额和 ${restrictedCount} 个 ${schoolNames} 名额。`;
    }
    return `您是一名已知施法者，应学会 ${expectedCantrips} 个戏法和 ${expectedKnown} 个高阶法术。`;
  }, [isPrepared, isMixed, spellcasting, cls, subclass, maxPrepared, expectedCantrips, expectedKnown, unrestrictedCount, restrictedCount, schoolRestriction]);

  const hasNoSpellsAtAll = !spellcasting && autoSpells.length === 0;

  if (hasNoSpellsAtAll) {
    return <div className="flex flex-col items-center justify-center p-12 text-stone-500 min-h-[300px]"><h2 className="text-2xl font-serif text-stone-400 mb-2">无施法能力</h2><p className="font-sans text-sm">您选择的职业、种族或特性未提供任何法术能力。</p></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 种族/特性/专长 自动获取的法术 */}
      {autoSpells.length > 0 && (
        <section>
          <div className="flex justify-between items-end border-b border-stone-200 pb-3 mb-6">
            <h3 className="text-xl font-serif text-stone-900">额外与特性法术</h3>
            <span className="text-sm px-3 py-1 rounded-full font-sans font-medium bg-stone-100 text-stone-700">
              通过种族、专长或其它途径习得
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
            {autoSpells.map(s => {
              let spell = allSpells.find(sp => sp.id === s.id);
              if (!spell) {
                spell = { id: s.id, name: s.id, level: 1, school: '神秘', castTime: '未知', range: '-', duration: '-', components: [], description: '（自定义法术）' } as any;
              }
              return <SpellCard key={spell.id} spell={spell as any} isSelected={true} isDisabled={true} isAuto={true} onClick={() => {}} />;
            })}
          </div>
        </section>
      )}

      {spellcasting && (
      <>
      <section>
        <h2 className="text-2xl font-serif text-amber-600 border-b border-stone-200 pb-3 mb-4">{cls?.name}法术管理</h2>
        <p className="text-stone-600 font-sans text-sm mb-2">{isPrepared ? '准备施法者' : '已知施法者'}{spellcasting.ability && <> · 施法关键属性：{spellcasting.ability}</>}</p>
      </section>

      {/* 戏法 */}
      {availableCantrips.length > 0 && (
        <section>
          <div className="flex justify-between items-end border-b border-stone-200 pb-3 mb-6">
            <h3 className="text-xl font-serif text-stone-900">戏法 (0环魔法)</h3>
            <span className={`text-sm px-3 py-1 rounded-full font-sans font-medium ${allSelectedCantripIds.filter(id => !autoSpellIds.has(id)).length >= expectedCantrips ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              应选 {expectedCantrips} · 已选 {allSelectedCantripIds.filter(id => !autoSpellIds.has(id)).length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
            {availableCantrips.filter(s => !autoSpellIds.has(s.id)).map(spell => {
              const isSelected = allSelectedCantripIds.includes(spell.id);
              const currentCount = allSelectedCantripIds.filter(id => !autoSpellIds.has(id)).length;
              const isDisabled = expectedCantrips > 0 && currentCount >= expectedCantrips && !isSelected;
              return <SpellCard key={spell.id} spell={spell} isSelected={isSelected} isDisabled={isDisabled} isAuto={false} onClick={() => {
                if (isDisabled) return;
                const cur = allSelectedCantripIds.filter(id => !autoSpellIds.has(id));
                if (isSelected) {
                  dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: 'spells-step-cantrips', selectedIds: cur.filter(id => id !== spell.id) } });
                } else {
                  dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: 'spells-step-cantrips', selectedIds: [...cur, spell.id] } });
                }
              }} />;
            })}
          </div>
        </section>
      )}

      {/* 准备施法者 */}
      {isPrepared && (
        <section>
          <div className="flex justify-between items-end border-b border-stone-200 pb-3 mb-6">
            <h3 className="text-xl font-serif text-stone-900">准备法术</h3>
            <span className={`text-sm px-3 py-1 rounded-full font-sans font-medium ${selectedPrepared.length >= maxPrepared ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              可准备 {maxPrepared} · 已准备 {selectedPrepared.length}
            </span>
          </div>
          {cls?.id === 'wizard' && spellbookIds && spellbookIds.length === 0 && (
            <p className="text-sm text-amber-600 mb-4 bg-amber-50 p-3 rounded-xl border border-amber-200">
              提示：您的法术书目前是空的。请先在“职业”步骤中完善法师的“选择法术加入法术书”选项。
            </p>
          )}
          {Array.from(new Set(spellsToDisplay.map(s => s.level))).sort((a: any, b: any) => a - b).map(lvl => (
            <div key={lvl} className="mb-8">
              <h4 className="font-serif text-lg text-stone-800 mb-3 border-b border-stone-100 pb-2">{lvl}环法术</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                {spellsToDisplay.filter(sp => sp.level === lvl).map(spell => {
                  const isAuto = autoSpellIds.has(spell.id);
                  const isSelected = selectedPrepared.includes(spell.id) || isAuto;
                  const currentCount = selectedPrepared.filter(id => !autoSpellIds.has(id)).length;
                  const isDisabled = isAuto || (currentCount >= maxPrepared && !isSelected);
                  return <SpellCard key={spell.id} spell={spell} isSelected={isSelected} isDisabled={isDisabled} isAuto={isAuto} onClick={() => {
                    if (isDisabled) return;
                    const cur = selectedPrepared.filter(id => !autoSpellIds.has(id));
                    if (isSelected) {
                      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: 'spells-step-prepared', selectedIds: cur.filter(id => id !== spell.id) } });
                    } else {
                      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: 'spells-step-prepared', selectedIds: [...cur, spell.id] } });
                    }
                  }} />;
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 已知施法者 - 混合限制 */}
      {isKnown && isMixed && (
        <>
          <section>
            <div className="flex justify-between items-end border-b border-stone-200 pb-3 mb-6">
              <h3 className="text-xl font-serif text-stone-900">任意学派法术</h3>
              <span className={`text-sm px-3 py-1 rounded-full font-sans font-medium ${selectedUnrestricted.length >= unrestrictedCount ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>名额 {unrestrictedCount} · 已选 {selectedUnrestricted.length}</span>
            </div>
            {Array.from(new Set(leveledSpells.map(s => s.level))).sort((a: any, b: any) => a - b).map(lvl => {
              const spellsOfLvl = leveledSpells.filter(sp => sp.level === lvl);
              if (spellsOfLvl.length === 0) return null;
              return (
                <div key={lvl} className="mb-8">
                  <h4 className="font-serif text-lg text-stone-800 mb-3 border-b border-stone-100 pb-2">{lvl}环法术</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                    {spellsOfLvl.map(spell => {
                      const isSelected = selectedUnrestricted.includes(spell.id);
                      const isFull = selectedUnrestricted.length >= unrestrictedCount && !isSelected;
                      return <SpellCard key={spell.id} spell={spell} isSelected={isSelected} isDisabled={isFull} onClick={() => { if (!isFull) dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: 'spells-step-unrestricted', selectedIds: isSelected ? selectedUnrestricted.filter(id => id !== spell.id) : [...selectedUnrestricted, spell.id] } }); }} />;
                    })}
                  </div>
                </div>
              )
            })}
          </section>
          <section className="mt-8">
            <div className="flex justify-between items-end border-b border-stone-200 pb-3 mb-6">
              <h3 className="text-xl font-serif text-stone-900">{schoolRestriction?.join('、')}法术</h3>
              <span className={`text-sm px-3 py-1 rounded-full font-sans font-medium ${selectedRestricted.length >= restrictedCount ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>名额 {restrictedCount} · 已选 {selectedRestricted.length}</span>
            </div>
            {Array.from(new Set(leveledSpells.map(s => s.level))).sort((a: any, b: any) => a - b).map(lvl => {
              const spellsOfLvl = leveledSpells.filter(sp => sp.level === lvl && schoolRestriction?.includes(sp.school));
              if (spellsOfLvl.length === 0) return null;
              return (
                <div key={lvl} className="mb-8">
                  <h4 className="font-serif text-lg text-stone-800 mb-3 border-b border-stone-100 pb-2">{lvl}环法术</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                    {spellsOfLvl.map(spell => {
                      const isSelected = selectedRestricted.includes(spell.id);
                      const isFull = selectedRestricted.length >= restrictedCount && !isSelected;
                      return <SpellCard key={spell.id} spell={spell} isSelected={isSelected} isDisabled={isFull} onClick={() => { if (!isFull) dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: 'spells-step-restricted', selectedIds: isSelected ? selectedRestricted.filter(id => id !== spell.id) : [...selectedRestricted, spell.id] } }); }} />;
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}

      {/* 非施法者 - 仅显示种族/特性赠送的1环及以上法术 */}
      {!isPrepared && !isKnown && cls?.id !== 'wizard' && leveledSpells.length > 0 && (
        <section>
           <div className="flex justify-between items-end border-b border-stone-200 pb-3 mb-6">
            <h3 className="text-xl font-serif text-stone-900">1环及以上法术</h3>
            <span className="text-sm px-3 py-1 rounded-full font-sans font-medium bg-stone-100 text-stone-700">
              种族/特性赠送
            </span>
          </div>
          {Array.from(new Set(leveledSpells.map(s => s.level))).sort((a: any, b: any) => a - b).map(lvl => (
            <div key={lvl} className="mb-8">
              <h4 className="font-serif text-lg text-stone-800 mb-3 border-b border-stone-100 pb-2">{lvl}环法术</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                {leveledSpells.filter(sp => sp.level === lvl).map(spell => {
                  const isAuto = autoSpellIds.has(spell.id);
                  return <SpellCard key={spell.id} spell={spell} isSelected={true} isDisabled={true} isAuto={isAuto} onClick={() => {}} />;
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 已知施法者 - 统一 */}
      {isKnown && !isMixed && (leveledSpells.length > 0) && (
        <section>
          <div className="flex justify-between items-end border-b border-stone-200 pb-3 mb-6">
            <h3 className="text-xl font-serif text-stone-900">1环及以上法术</h3>
            <span className={`text-sm px-3 py-1 rounded-full font-sans font-medium ${allSelectedLeveledIds.filter(id => !autoSpellIds.has(id)).length >= expectedKnown ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              应选 {expectedKnown} · 已选 {allSelectedLeveledIds.filter(id => !autoSpellIds.has(id)).length}
            </span>
          </div>
          {Array.from(new Set(leveledSpells.filter(s => !autoSpellIds.has(s.id)).map(s => s.level))).sort((a: any, b: any) => a - b).map(lvl => (
            <div key={lvl} className="mb-8">
              <h4 className="font-serif text-lg text-stone-800 mb-3 border-b border-stone-100 pb-2">{lvl}环法术</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                {leveledSpells.filter(sp => sp.level === lvl && !autoSpellIds.has(sp.id)).map(spell => {
                  const isSelected = allSelectedLeveledIds.includes(spell.id);
                  const currentCount = allSelectedLeveledIds.filter(id => !autoSpellIds.has(id)).length;
                  const isDisabled = expectedKnown > 0 && currentCount >= expectedKnown && !isSelected;
                  return <SpellCard key={spell.id} spell={spell} isSelected={isSelected} isDisabled={isDisabled} isAuto={false}
                    onClick={() => {
                      if (isDisabled || expectedKnown <= 0) return;
                      const cur = allSelectedLeveledIds.filter(id => !autoSpellIds.has(id));
                      if (isSelected) dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: 'spells-step-leveled', selectedIds: cur.filter(id => id !== spell.id) } });
                      else dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: 'spells-step-leveled', selectedIds: [...cur, spell.id] } });
                    }} />;
                })}
              </div>
            </div>
          ))}
        </section>
      )}
      </>
      )}
    </div>
  );
}

export const SpellCard: React.FC<{
  spell: any;
  isSelected: boolean;
  isDisabled: boolean;
  isAuto?: boolean;
  onClick: () => void;
}> = ({ spell, isSelected, isDisabled, isAuto, onClick }) => {
  return (
    <div onClick={() => !isDisabled && onClick()}
      className={`p-2.5 md:p-3 rounded-lg border transition-all duration-300 relative flex flex-col justify-between h-full ${
        isSelected ? 'border-amber-500 bg-amber-50/50 transform -translate-y-0.5' :
        isDisabled ? 'opacity-40 cursor-not-allowed border-stone-100 bg-stone-50 text-stone-400' :
        'cursor-pointer border-stone-200 hover:border-stone-300 bg-white shadow-sm hover:shadow-md'
      }`}
    >
      {isAuto && <span className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold z-10">自动</span>}
      <div>
        <div className="flex justify-between items-start mb-1 gap-1.5">
          <h4 className="font-semibold font-serif text-sm text-stone-800 leading-tight pr-6">{spell.name}</h4>
          <span className="flex-shrink-0 text-[9px] bg-stone-100 px-1.5 py-0.5 rounded-full text-stone-600 border border-stone-200 font-sans font-medium whitespace-nowrap">
            {spell.level === 0 ? '戏法' : `${spell.level} 环`}
          </span>
        </div>
        <p className="text-[10px] font-sans mb-1 text-stone-500 line-clamp-1">{spell.school} · {spell.castingTime}</p>
        <p className="text-[11px] font-sans text-stone-600 leading-snug line-clamp-2 md:line-clamp-3">{spell.description}</p>
      </div>
      <div className="mt-1.5 flex justify-end">
        <DictyTwisterLink type="spell" name={spell.name} source={spell.source || 'phb'} label="查询" />
      </div>
    </div>
  );
}