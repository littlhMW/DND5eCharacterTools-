import React from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { backgrounds } from '../../data/backgrounds';
import { DictyTwisterLink } from '../DictyTwisterLink';
import { TraitSelection } from '../shared/TraitSelection';
import { Dices } from 'lucide-react';

import { SKILL_NAMES } from '../../utils/proficiencies';

export function BackgroundStep() {
  const { state, dispatch } = useCharacter();
  
  const selectedBackground = backgrounds.find(bg => bg.id === state.character.backgroundId);

  const rollTrait = (field: 'personality' | 'ideals' | 'bonds' | 'flaws', options: string[]) => {
    if (options && options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      dispatch({ type: 'UPDATE_BASIC_INFO', payload: { [field]: options[randomIndex] } });
    }
  };

  const handleTraitChange = (field: 'personality' | 'ideals' | 'bonds' | 'flaws', value: string) => {
    dispatch({ type: 'UPDATE_BASIC_INFO', payload: { [field]: value } });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <h2 className="text-2xl font-serif text-amber-600 border-b border-stone-200 pb-3 mb-6">选择背景</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {backgrounds.map(bg => (
            <div 
              key={bg.id}
              onClick={() => dispatch({ type: 'SET_BACKGROUND', payload: bg.id })}
              className={`cursor-pointer p-5 rounded-3xl border transition-all duration-300 ${
                state.character.backgroundId === bg.id 
                  ? 'border-amber-500 bg-stone-50 shadow-[0_4px_20px_rgba(90,90,64,0.08)] transform -translate-y-1' 
                  : 'border-stone-200 hover:border-stone-300 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-serif text-stone-900">{bg.name}</h3>
                <DictyTwisterLink type="background" name={bg.name} source={bg.source} />
              </div>
              <p className="text-stone-600 line-clamp-3 leading-relaxed font-sans text-xs">{bg.description}</p>
            </div>
          ))}
        </div>
      </section>

      {selectedBackground && (
        <section className="mt-8 p-6 bg-white rounded-3xl border border-stone-200 shadow-sm animate-in fade-in duration-500">
          <h3 className="text-xl font-serif text-amber-600 border-b border-stone-200 pb-3 mb-6">背景信息: {selectedBackground.name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-sans uppercase tracking-[0.15em] text-stone-400 mb-4">熟练项</h4>
              <ul className="space-y-3">
                {selectedBackground.skillProficiencies.length > 0 && (
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2 mt-0.5">•</span>
                    <div>
                      <span className="font-semibold text-stone-800 text-sm">技能熟练项: </span>
                      <span className="text-stone-600 text-sm font-sans">{selectedBackground.skillProficiencies.map(s => SKILL_NAMES[s] || s).join('、')}</span>
                    </div>
                  </li>
                )}
                {selectedBackground.toolProficiencies.length > 0 && (
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2 mt-0.5">•</span>
                    <div>
                      <span className="font-semibold text-stone-800 text-sm">工具熟练项: </span>
                      <span className="text-stone-600 text-sm font-sans">{selectedBackground.toolProficiencies.join('、')}</span>
                    </div>
                  </li>
                )}
                {selectedBackground.languages > 0 && (
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2 mt-0.5">•</span>
                    <div>
                      <span className="font-semibold text-stone-800 text-sm">额外语言: </span>
                      <span className="text-stone-600 text-sm font-sans">任选 {selectedBackground.languages} 门</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-sans uppercase tracking-[0.15em] text-stone-400 mb-4">初始装备</h4>
              <ul className="space-y-2">
                {selectedBackground.startingEquipment.map((eq, i) => (
                  <li key={i} className="text-stone-600 text-sm font-sans flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    {eq}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-stone-200">
            <h4 className="text-sm font-sans uppercase tracking-[0.15em] text-stone-400 mb-4">背景特性</h4>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <h5 className="font-semibold text-amber-600 text-lg">{selectedBackground.feature.name}</h5>
              <p className="text-stone-600 text-sm mt-2 leading-relaxed font-sans">{selectedBackground.feature.description}</p>
            </div>
          </div>
          
          {selectedBackground.choices && selectedBackground.choices.length > 0 && (
            <div className="pt-6 border-t border-stone-200 mt-6">
              <h4 className="text-sm font-sans uppercase tracking-[0.15em] text-stone-400 mb-4">背景选择项</h4>
              {selectedBackground.choices.map(choice => (
                <TraitSelection key={choice.id} choice={choice} />
              ))}
            </div>
          )}

          {selectedBackground.suggestedCharacteristics && (
            <div className="pt-6 border-t border-stone-200 mt-6">
              <h4 className="text-sm font-sans uppercase tracking-[0.15em] text-stone-400 mb-4">建议特征</h4>
              <div className="space-y-6">
                {[
                  { id: 'personality' as const, label: '性格特质', data: selectedBackground.suggestedCharacteristics.personalityTraits },
                  { id: 'ideals' as const, label: '理想', data: selectedBackground.suggestedCharacteristics.ideals },
                  { id: 'bonds' as const, label: '牵绊', data: selectedBackground.suggestedCharacteristics.bonds },
                  { id: 'flaws' as const, label: '缺点', data: selectedBackground.suggestedCharacteristics.flaws },
                ].map(({ id, label, data }) => (
                  <div key={id} className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-amber-600 flex items-center gap-2">
                        {label}
                        <button
                          onClick={() => rollTrait(id, data)}
                          className="p-1.5 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors flex items-center text-xs font-sans gap-1"
                          title="随机投掷"
                        >
                          <Dices className="w-4 h-4" />
                          掷骰
                        </button>
                      </h5>
                    </div>
                    {/* Render the current chosen text for this trait */}
                    <textarea 
                      value={state.character[id] || ''}
                      onChange={(e) => handleTraitChange(id, e.target.value)}
                      placeholder={`在此处输入你的${label}，或点击"掷骰"随机获取或从下方选择...`}
                      className="w-full bg-white border border-stone-200 rounded-xl p-3 text-stone-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors shadow-sm resize-none font-sans text-sm mb-3"
                      rows={1}
                    />
                    <ul className="space-y-2 mt-2">
                      {data.map((trait, index) => (
                        <li 
                          key={index} 
                          className="text-stone-600 text-sm font-sans flex items-start gap-2 cursor-pointer hover:text-amber-700 transition-colors p-1.5 rounded-lg hover:bg-white"
                          onClick={() => handleTraitChange(id, trait)}
                        >
                          <span className="text-amber-600/50 mt-0.5 font-mono text-xs">{index + 1}.</span>
                          <span className={state.character[id] === trait ? "text-amber-600 font-medium" : ""}>{trait}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
