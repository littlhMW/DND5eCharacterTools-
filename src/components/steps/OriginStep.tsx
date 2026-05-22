import React from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { races } from '../../data/races';
import { DictyTwisterLink } from '../DictyTwisterLink';
import { TraitSelection } from '../shared/TraitSelection';

export function OriginStep() {
  const { state, dispatch } = useCharacter();
  
  const selectedRace = races.find(r => r.id === state.character.raceId);
  const selectedSubrace = selectedRace?.subraces?.find(sr => sr.id === state.character.subraceId);

  // 生成属性加值文本
  const getAbilityBonusText = (race: any) => {
    if (!race || !race.abilityBonuses?.length) return '';
    const abilityMap: Record<string, string> = {
      'STR': '力量',
      'DEX': '敏捷',
      'CON': '体质',
      'INT': '智力',
      'WIS': '感知',
      'CHA': '魅力'
    };
    return race.abilityBonuses
      .map((b: any) => `${abilityMap[b.ability] || b.ability} +${b.bonus}`)
      .join('，');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <h2 className="text-2xl font-serif text-amber-600 border-b border-stone-200 pb-3 mb-6">1. 种族</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {races.map(race => (
            <div 
              key={race.id}
              onClick={() => dispatch({ type: 'SET_RACE', payload: { raceId: race.id, subraceId: race.subraces?.[0]?.id } })}
              className={`cursor-pointer p-5 rounded-lg border transition-all duration-300 ${
                state.character.raceId === race.id 
                  ? 'border-amber-500 bg-stone-50 shadow-[0_4px_20px_rgba(90,90,64,0.08)] transform -translate-y-1' 
                  : 'border-stone-200 hover:border-stone-300 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif text-stone-900">{race.name}</h3>
                <DictyTwisterLink type="race" name={race.name} source={race.source} />
              </div>
              <p className="text-stone-600 mt-2 text-xs leading-relaxed font-sans">{race.description}</p>
              {race.abilityBonuses?.length > 0 && (
                <p className="text-[10px] text-stone-500 mt-2 font-sans">属性加值：{getAbilityBonusText(race)}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Subrace Section */}
      {selectedRace && selectedRace.subraces && selectedRace.subraces.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-serif text-amber-600 border-b border-stone-200 pb-3 mb-6">2. 子种族</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedRace.subraces.map(subrace => (
              <div 
                key={subrace.id}
                onClick={() => dispatch({ type: 'SET_RACE', payload: { raceId: selectedRace.id, subraceId: subrace.id } })}
                className={`cursor-pointer p-5 rounded-lg border transition-all duration-300 ${
                  state.character.subraceId === subrace.id 
                    ? 'border-amber-500 bg-stone-50 shadow-[0_4px_20px_rgba(90,90,64,0.08)] transform -translate-y-1' 
                    : 'border-stone-200 hover:border-stone-300 bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <h3 className="text-lg font-serif text-stone-900">{subrace.name}</h3>
                <p className="text-stone-600 mt-2 text-xs leading-relaxed font-sans">{subrace.description}</p>
                {subrace.abilityBonuses?.length > 0 && (
                  <p className="text-[10px] text-stone-500 mt-2 font-sans">额外属性：{getAbilityBonusText(subrace)}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Traits Preview for Step 1 */}
      {selectedRace && (
        <section className="mt-8 p-6 bg-white rounded-lg border border-stone-200 shadow-sm animate-in fade-in duration-500">
          <h3 className="text-xl font-serif text-amber-600 border-b border-stone-200 pb-3 mb-6">起源特性预览</h3>
          
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-sans uppercase tracking-[0.15em] text-stone-400 mb-4">基础种族: {selectedRace.name}</h4>
              <div className="grid gap-4">
                {selectedRace.traits.map((t, index) => (
                  <div key={`race-trait-${index}`} className="bg-stone-50 p-3 rounded-md border border-stone-100">
                    <h5 className="font-semibold text-stone-800 text-base">{t.name}</h5>
                    <p className="text-stone-600 text-xs mt-1.5 leading-relaxed font-sans">{t.description}</p>
                    {t.choices && t.choices.map(choice => (
                      <TraitSelection key={choice.id} choice={choice} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {selectedSubrace && (
              <div className="pt-6 border-t border-stone-200">
                <h4 className="text-sm font-sans uppercase tracking-[0.15em] text-stone-400 mb-4">附加子种族特性: {selectedSubrace.name}</h4>
                <div className="grid gap-4">
                  {selectedSubrace.traits.map((t, index) => (
                    <div key={`subrace-trait-${index}`} className="bg-stone-50 p-3 rounded-md border border-stone-100">
                      <h5 className="font-semibold text-stone-800 text-base">{t.name}</h5>
                      <p className="text-stone-600 text-xs mt-1.5 leading-relaxed font-sans">{t.description}</p>
                      {t.choices && t.choices.map(choice => (
                        <TraitSelection key={choice.id} choice={choice} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}