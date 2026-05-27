import React from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { races } from '../../data/races';
import { isSourceEnabled } from '../../utils/expansionHelper';
import { getAvailableRaces } from '../../utils/raceHelper';
import { DictyTwisterLink } from '../DictyTwisterLink';
import { TraitSelection } from '../shared/TraitSelection';

export function OriginStep() {
  const { state, dispatch } = useCharacter();
  
  const [viewedSources, setViewedSources] = React.useState<Record<string, string>>({});

  const availableRaces = getAvailableRaces({
    ...(state.character.raceSource && { [state.character.raceId]: state.character.raceSource }),
    ...viewedSources
  });

  const selectedRace = availableRaces.find(r => r.id === state.character.raceId);
  const selectedSubrace = selectedRace?.subraces?.find(sr => sr.id === state.character.subraceId);

  const cycleSource = (e: React.MouseEvent, race: any) => {
    e.stopPropagation();
    if (!race.alternatives || race.alternatives.length <= 1) return;
    const currentIdx = race.alternatives.findIndex((a: any) => a.source === race.source);
    const nextIdx = (currentIdx + 1) % race.alternatives.length;
    const nextSource = race.alternatives[nextIdx].source;
    
    setViewedSources(prev => ({ ...prev, [race.id]: nextSource }));
    
    if (state.character.raceId === race.id) {
      dispatch({ 
         type: 'SET_RACE', 
         payload: { 
           raceId: race.id, 
           raceSource: nextSource, 
           subraceId: state.character.subraceId 
         } 
      });
    }
  };

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
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-stone-200 pb-3 mb-6 gap-2">
          <h2 className="text-2xl font-serif text-amber-600 mb-0">1. 种族</h2>
          <span className="text-xs text-stone-500 font-sans">💡 提示：若种族含有多个版本，点击其右上角的扩展缩写（如 PHB / VGM / EE）可随时切换规则版本</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableRaces.map(race => (
            <div 
              key={race.id}
              onClick={() => dispatch({ type: 'SET_RACE', payload: { raceId: race.id, raceSource: race.source, subraceId: race.subraces?.[0]?.id } })}
              className={`cursor-pointer p-5 rounded-lg border transition-all duration-300 ${
                state.character.raceId === race.id 
                  ? 'border-amber-500 bg-stone-50 shadow-[0_4px_20px_rgba(90,90,64,0.08)] transform -translate-y-1' 
                  : 'border-stone-200 hover:border-stone-300 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-serif text-stone-900">{race.name}</h3>
                  {race.source && (
                    <span 
                      onClick={race.alternatives && race.alternatives.length > 1 ? (e) => cycleSource(e, race) : undefined}
                      className={`text-[10px] bg-stone-100 text-stone-500 border border-stone-200 px-1.5 py-0.5 rounded uppercase tracking-wider ${race.alternatives && race.alternatives.length > 1 ? 'cursor-pointer hover:bg-stone-200 hover:text-stone-700 transition-colors' : ''}`}
                      title={race.alternatives && race.alternatives.length > 1 ? "点击切换该种族的其他扩展版本" : ""}
                    >
                      {race.source}
                    </span>
                  )}
                </div>
                {race.source && <DictyTwisterLink type="race" name={race.name} source={race.source} />}
              </div>
              <p className="text-stone-600 mt-2 text-xs leading-relaxed font-sans">{race.description}</p>
              {race.abilityBonuses?.length > 0 && (
                <p className="text-[10px] text-stone-500 mt-2 font-sans">
                  属性加值：{race.id === 'human' && state.character.subraceId === 'human-variant' ? '(已被变体替换)' : getAbilityBonusText(race)}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Subrace Section */}
      {selectedRace && selectedRace.subraces && selectedRace.subraces.length > 1 && (
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
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-serif text-stone-900">{subrace.name}</h3>
                    {subrace.source && <span className="text-[10px] bg-stone-100 text-stone-500 border border-stone-200 px-1.5 py-0.5 rounded uppercase tracking-wider">{subrace.source}</span>}
                  </div>
                  {subrace.source && <DictyTwisterLink type="race" name={`${selectedRace.name} (${subrace.name.replace(selectedRace.name, '').trim()})`} source={subrace.source} />}
                </div>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-xs font-sans text-stone-600 bg-stone-50 p-4 rounded-md border border-stone-100">
                <div>
                  <span className="font-semibold text-stone-800 block mb-1">体型</span>
                  {selectedRace.size === 'Medium' ? '中型' : selectedRace.size === 'Small' ? '小型' : selectedRace.size}
                </div>
                <div>
                  <span className="font-semibold text-stone-800 block mb-1">速度</span>
                  {selectedRace.speed} 尺
                </div>
                <div>
                  <span className="font-semibold text-stone-800 block mb-1">感官</span>
                  {selectedRace.vision || '普通视觉'}
                </div>
                <div>
                  <span className="font-semibold text-stone-800 block mb-1">语言</span>
                  {selectedRace.languages.join(', ')}
                </div>
              </div>
              <div className="grid gap-4">
                {selectedRace.traits
                  .filter(t => {
                    // 只有未配置level，或者level <= 当前等级时才显示
                    if (t.level !== undefined && t.level > state.character.level) return false;
                    if (selectedSubrace) {
                      if (selectedRace.id === 'half-elf' && t.name === '多才多艺') return false;
                      if (selectedRace.id === 'tiefling' && t.name === '炼狱传承') return false;
                    }
                    return true;
                  })
                  .map((t, index) => (
                    <div key={`race-trait-${index}`} className="bg-stone-50 p-3 rounded-md border border-stone-100">
                      <h5 className="font-semibold text-stone-800 text-base">
                        {t.name}
                        {t.level !== undefined && t.level > 0 && <span className="text-[10px] text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full ml-2 uppercase tracking-widest font-bold">LV {t.level}</span>}
                      </h5>
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
                  {selectedSubrace.traits
                    .filter(t => t.level === undefined || t.level <= state.character.level)
                    .map((t, index) => (
                    <div key={`subrace-trait-${index}`} className="bg-stone-50 p-3 rounded-md border border-stone-100">
                      <h5 className="font-semibold text-stone-800 text-base">
                        {t.name}
                        {t.level !== undefined && t.level > 0 && <span className="text-[10px] text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full ml-2 uppercase tracking-widest font-bold">LV {t.level}</span>}
                      </h5>
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