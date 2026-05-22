import React from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { classes } from '../../data/classes';
import { DictyTwisterLink } from '../DictyTwisterLink';
import { TraitSelection } from '../shared/TraitSelection';
import { FormattedDescription } from '../shared/FormattedDescription';
import { spells as allSpells } from '../../data/spells';
import { classSpellLists } from '../../data/spellLists';
import { EquipmentText } from '../shared/EquipmentText';

const allAbilities = {
  STR: '力量', DEX: '敏捷', CON: '体质',
  INT: '智力', WIS: '感知', CHA: '魅力'
};

export function ClassStep() {
  const { state, dispatch } = useCharacter();
  const [rolledGold, setRolledGold] = React.useState<Record<string, number>>({});
  
  const selectedClass = classes.find(c => c.id === state.character.classId);
  const selectedSubclass = selectedClass?.subclasses?.find(sc => sc.id === state.character.subclassId);
  
  const getDynamicChooseNumber = (choice: any, level: number, cls: any, subclass: any) => {
    if (!choice.dynamic) return choice.chooseNumber;
    
    const spellcasting = subclass?.spellcasting && level >= (subclass.spellcastingStartLevel || cls?.subclassAvailableAtLevel)
      ? subclass.spellcasting
      : cls?.spellcasting;
    
    if (!spellcasting) return 0;
    
    if (choice.spellType === 'cantrip') {
      const idx = Math.min(level - 1, spellcasting.cantripsKnown.length - 1);
      return spellcasting.cantripsKnown[idx] || 0;
    } else if (choice.spellType === 'known') {
      if (spellcasting.spellsKnown) {
        const idx = Math.min(level - 1, spellcasting.spellsKnown.length - 1);
        return spellcasting.spellsKnown[idx] || 0;
      }
      return 0;
    } else if (choice.spellType === 'spellbook') {
      if (cls?.id === 'wizard') {
        return 6 + (level - 1) * 2;
      }
      return choice.chooseNumber;
    }
    return choice.chooseNumber;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <div className="flex justify-between items-center border-b border-stone-200 pb-3 mb-6">
          <h2 className="text-2xl font-serif text-amber-600">1. 选择等级</h2>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-serif text-stone-900 bg-amber-100/50 px-4 py-1 rounded-xl shadow-inner border border-amber-200/50">
              Lv {state.character.level}
            </span>
          </div>
        </div>
        <div className="px-2">
          <input
            type="range"
            min="1"
            max="20"
            value={state.character.level}
            onChange={(e) => dispatch({ type: 'SET_LEVEL', payload: parseInt(e.target.value) })}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600 outline-none focus:ring-2 focus:ring-amber-500/30 touch-none"
            style={{
              background: `linear-gradient(to right, #d97706 ${(state.character.level - 1) / 19 * 100}%, #e7e5e4 ${(state.character.level - 1) / 19 * 100}%)`
            }}
          />
          <div className="flex justify-between mt-2 text-xs font-sans text-stone-400 font-medium">
            <span>1</span>
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
          </div>
          <p className="mt-4 text-sm text-stone-500 font-sans">
            你的角色等级决定了可以获得的职业特性、可用法术环阶上限以及熟练加值。
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-serif text-amber-600 border-b border-stone-200 pb-3 mb-6">2. 职业</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map(cls => (
            <div 
              key={cls.id}
              onClick={() => {
                const isSubclassAvailable = state.character.level >= cls.subclassAvailableAtLevel;
                dispatch({ 
                  type: 'SET_CLASS', 
                  payload: { 
                    classId: cls.id, 
                    subclassId: isSubclassAvailable ? cls.subclasses?.[0]?.id : undefined 
                  } 
                });
              }}
              className={`cursor-pointer p-5 rounded-lg border transition-all duration-300 ${
                state.character.classId === cls.id 
                  ? 'border-amber-500 bg-stone-50 shadow-[0_4px_20px_rgba(90,90,64,0.08)] transform -translate-y-1' 
                  : 'border-stone-200 hover:border-stone-300 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif text-stone-900">{cls.name}</h3>
                <DictyTwisterLink type="class" name={cls.name} source={cls.source} />
              </div>
              <FormattedDescription text={cls.description} className="text-stone-600 mt-2 text-xs leading-relaxed font-sans" />
            </div>
          ))}
        </div>
      </section>

      {selectedClass && state.character.level >= selectedClass.subclassAvailableAtLevel && selectedClass.subclasses && selectedClass.subclasses.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-serif text-amber-600 border-b border-stone-200 pb-3 mb-6">3. 子职业</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectedClass.subclasses.map(subclass => (
              <div 
                 key={subclass.id}
                 onClick={() => dispatch({ type: 'SET_SUBCLASS', payload: subclass.id })}
                 className={`cursor-pointer p-4 rounded-lg border transition-all duration-300 ${
                   state.character.subclassId === subclass.id 
                     ? 'border-amber-500 bg-stone-50 shadow-[0_4px_20px_rgba(90,90,64,0.08)] transform -translate-y-1' 
                     : 'border-stone-200 hover:border-stone-300 bg-white shadow-sm hover:shadow-md'
                 }`}
               >
                 <div className="flex justify-between items-center">
                   <h3 className="text-base font-serif text-stone-900">{subclass.name}</h3>
                   <DictyTwisterLink type="class" name={selectedClass.name} subId={subclass.id} source={selectedClass.source} />
                 </div>
                 <FormattedDescription text={subclass.description} className="text-stone-600 mt-2 text-xs leading-relaxed font-sans" />
               </div>
            ))}
          </div>
        </section>
      )}

       {/* Traits Preview */}
       {selectedClass && (
        <section className="mt-8 p-6 bg-white rounded-lg border border-stone-200 shadow-sm animate-in fade-in duration-500">
          <h3 className="text-xl font-serif text-amber-600 border-b border-stone-200 pb-3 mb-6">职业特性预览 (最高到等级 {state.character.level})</h3>
          
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6 text-sm font-sans space-y-2 mt-4">
            <div className="font-semibold text-stone-800 text-base border-b border-stone-200 pb-1 mb-2 uppercase tracking-widest">职业概览</div>
            <div><span className="font-semibold text-stone-700">生命值</span></div>
            <div className="pl-2 border-l-2 border-stone-200"><span className="font-semibold text-stone-600">生命骰：</span> 1d{selectedClass.hitDie}</div>
            <div className="pl-2 border-l-2 border-stone-200"><span className="font-semibold text-stone-600">首级生命值：</span> {selectedClass.hitDie} + 你的体质调整值</div>
            <div className="pl-2 border-l-2 border-stone-200"><span className="font-semibold text-stone-600">其后生命值：</span> 1级之后每{selectedClass.name}等级 1d{selectedClass.hitDie} (或 {Math.ceil(selectedClass.hitDie / 2 + 0.5)}) + 你的体质调整值</div>
            
            <div className="mt-4"><span className="font-semibold text-stone-700">熟练</span></div>
            <div className="pl-2 border-l-2 border-stone-200"><span className="font-semibold text-stone-600">护甲：</span> <EquipmentText text={selectedClass.armorProficiencies.length ? selectedClass.armorProficiencies.join('、') : '无'} /></div>
            <div className="pl-2 border-l-2 border-stone-200"><span className="font-semibold text-stone-600">武器：</span> <EquipmentText text={selectedClass.weaponProficiencies.length ? selectedClass.weaponProficiencies.join('、') : '无'} /></div>
            <div className="pl-2 border-l-2 border-stone-200"><span className="font-semibold text-stone-600">工具：</span> {selectedClass.toolProficiencies.length ? selectedClass.toolProficiencies.join('、') : '无'}</div>
            <div className="pl-2 border-l-2 border-stone-200"><span className="font-semibold text-stone-600">豁免：</span> {selectedClass.saves.map(s => allAbilities[s as keyof typeof allAbilities]).join('、')}</div>
            {selectedClass.skills && (
              <div className="pl-2 border-l-2 border-stone-200"><span className="font-semibold text-stone-600">技能：</span> 从{selectedClass.skills.choices.join('、')}中选择{selectedClass.skills.count}个</div>
            )}
          </div>

          <div className="space-y-4">
            {[
              ...selectedClass.traits.filter(t => t.level! <= state.character.level).map(t => ({ ...t, sourceName: `基础职业: ${selectedClass.name}` })),
              ...(selectedSubclass && state.character.level >= selectedClass.subclassAvailableAtLevel 
                ? selectedSubclass.traits.filter(t => t.level! <= state.character.level).map(t => ({ ...t, sourceName: `子职业: ${selectedSubclass.name}` })) 
                : [])
            ].sort((a, b) => (a.level || 0) - (b.level || 0)).map((t, index) => (
              <div key={`${t.name}-${index}`} className="bg-stone-50 p-3 rounded-md border border-stone-100">
                <div className="flex items-center gap-3 mb-2">
                  <h5 className="font-semibold text-amber-600 text-base">{t.name}</h5>
                  <span className="text-[10px] text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full font-sans tracking-wide">Lv {t.level}</span>
                  <span className="text-[10px] text-stone-400 font-sans uppercase tracking-widest ml-auto">{t.sourceName}</span>
                </div>
                <FormattedDescription text={t.description} className="text-stone-600 text-xs leading-relaxed font-sans" />
                {t.choices && (() => {
                  let sortedChoices = [...t.choices];
                  // 找到起始装备选择组
                  const wealthMethodIdx = sortedChoices.findIndex(c => c.id.endsWith('-wealth-method'));
                  let wealthMethodChoice = null;
                  let wealthMethodSelected = 'standard'; // default
                  
                  if (wealthMethodIdx >= 0) {
                    wealthMethodChoice = sortedChoices.splice(wealthMethodIdx, 1)[0];
                    wealthMethodSelected = state.character.traitSelections[wealthMethodChoice.id]?.[0] || 'standard';
                  }

                  // 筛出所有装备相关的 selection
                  const equipChoices = sortedChoices.filter(c => c.id.includes('-equip-'));
                  const nonEquipChoices = sortedChoices.filter(c => !c.id.includes('-equip-'));

                  const renderWealthMethod = () => {
                    if (!wealthMethodChoice) return null;
                    const classId = selectedClass.id;
                    
                    const getWealthFormula = (cid: string) => {
                      switch (cid) {
                        case 'barbarian': return '2d4 × 10';
                        case 'druid': return '2d4 × 10';
                        case 'sorcerer': return '3d4 × 10';
                        case 'rogue': return '4d4 × 10';
                        case 'warlock': return '4d4 × 10';
                        case 'wizard': return '4d4 × 10';
                        case 'monk': return '5d4';
                        default: return '5d4 × 10';
                      }
                    };

                    const handleSetMode = (mode: 'standard' | 'gold') => {
                      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: wealthMethodChoice!.id, selectedIds: [mode] } });
                    };

                    const isStandardMode = wealthMethodSelected === 'standard';
                    const isGoldMode = wealthMethodSelected === 'gold';

                    return (
                      <div className="mt-4 p-4 bg-white border border-amber-200/50 rounded-md">
                        <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                          <h6 className="font-semibold text-stone-800">{wealthMethodChoice.name || '获取装备方式'}</h6>
                          <div className="flex bg-stone-100 p-1 rounded-lg">
                            <button
                              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${isStandardMode ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                              onClick={() => handleSetMode('standard')}
                            >
                              默认起始装备
                            </button>
                            <button
                              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${isGoldMode ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                              onClick={() => handleSetMode('gold')}
                            >
                              自购装备(Roll)
                            </button>
                          </div>
                        </div>
                        
                        {isStandardMode ? (
                          <div className="text-sm font-sans text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-100">
                            <p className="mb-4">你将获得来自<strong>职业</strong>与<strong>背景</strong>提供的默认起始装备。请在下方完成你的装备替换或选取：</p>
                            <div className="space-y-3">
                              {equipChoices.map(choice => {
                                const dynamicNum = getDynamicChooseNumber(choice, state.character.level, selectedClass, selectedSubclass);
                                const dynamicChoice = { ...choice, chooseNumber: dynamicNum };
                                return <TraitSelection key={choice.id} choice={dynamicChoice} />;
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm font-sans text-stone-600 bg-amber-50 p-4 rounded-xl border border-amber-100">
                            <p className="mb-3">你放弃了职业与背景提供的装备，选择根据公式自行Roll点并得到起始资金（GP），然后自行购买装备。</p>
                            <div className="flex items-center gap-3">
                              <div className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-amber-800 font-mono text-sm font-bold shadow-sm">
                                公式: {getWealthFormula(classId)}
                              </div>
                              <button
                                onClick={() => {
                                  let sum = 0;
                                  const fm = getWealthFormula(classId);
                                  const isTen = fm.includes('× 10');
                                  const d4count = parseInt(fm[0]);
                                  for(let i=0; i<d4count; i++) sum += Math.floor(Math.random()*4)+1;
                                  if(isTen) sum *= 10;
                                  setRolledGold(prev => ({...prev, [classId]: sum}));
                                }}
                                className="px-4 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-sm"
                              >
                                掷骰
                              </button>
                            </div>
                            {rolledGold[classId] !== undefined && (
                              <div className="mt-4 p-3 bg-white rounded-lg border border-amber-200 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
                                <span className="text-stone-700 font-medium">你的起始资金为:</span>
                                <span className="text-2xl font-bold font-serif text-amber-600">{rolledGold[classId]} gp</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  };

                  return (
                    <>
                      {renderWealthMethod()}
                      {nonEquipChoices.map(choice => {
                        const dynamicNum = getDynamicChooseNumber(choice, state.character.level, selectedClass, selectedSubclass);
                        const dynamicChoice = { ...choice, chooseNumber: dynamicNum };
                        return <TraitSelection key={choice.id} choice={dynamicChoice} />;
                      })}
                    </>
                  );
                })()}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
