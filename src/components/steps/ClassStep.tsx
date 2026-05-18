import React from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { classes } from '../../data/classes';
import { DictyTwisterLink } from '../DictyTwisterLink';
import { TraitSelection } from '../shared/TraitSelection';
import { spells as allSpells } from '../../data/spells';
import { classSpellLists } from '../../data/spellLists';
import { EquipmentText } from '../shared/EquipmentText';

const allAbilities = {
  STR: '力量', DEX: '敏捷', CON: '体质',
  INT: '智力', WIS: '感知', CHA: '魅力'
};

export function ClassStep() {
  const { state, dispatch } = useCharacter();
  
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
              className={`cursor-pointer p-5 rounded-3xl border transition-all duration-300 ${
                state.character.classId === cls.id 
                  ? 'border-amber-500 bg-stone-50 shadow-[0_4px_20px_rgba(90,90,64,0.08)] transform -translate-y-1' 
                  : 'border-stone-200 hover:border-stone-300 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif text-stone-900">{cls.name}</h3>
                <DictyTwisterLink type="class" name={cls.name} source={cls.source} />
              </div>
              <p className="text-stone-600 mt-2 text-xs leading-relaxed font-sans">{cls.description}</p>
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
                 className={`cursor-pointer p-4 rounded-3xl border transition-all duration-300 ${
                   state.character.subclassId === subclass.id 
                     ? 'border-amber-500 bg-stone-50 shadow-[0_4px_20px_rgba(90,90,64,0.08)] transform -translate-y-1' 
                     : 'border-stone-200 hover:border-stone-300 bg-white shadow-sm hover:shadow-md'
                 }`}
               >
                 <div className="flex justify-between items-center">
                   <h3 className="text-base font-serif text-stone-900">{subclass.name}</h3>
                   <DictyTwisterLink type="class" name={selectedClass.name} subId={subclass.id} source={selectedClass.source} />
                 </div>
                 <p className="text-stone-600 mt-2 text-xs leading-relaxed font-sans">{subclass.description}</p>
               </div>
            ))}
          </div>
        </section>
      )}

       {/* Traits Preview */}
       {selectedClass && (
        <section className="mt-8 p-6 bg-white rounded-3xl border border-stone-200 shadow-sm animate-in fade-in duration-500">
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
              <div key={`${t.name}-${index}`} className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-3 mb-2">
                  <h5 className="font-semibold text-amber-600 text-base">{t.name}</h5>
                  <span className="text-[10px] text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full font-sans tracking-wide">Lv {t.level}</span>
                  <span className="text-[10px] text-stone-400 font-sans uppercase tracking-widest ml-auto">{t.sourceName}</span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed font-sans">{t.description}</p>
                {t.choices && (() => {
                  let sortedChoices = [...t.choices];
                  // 把 wealth-method 移到选择之前
                  const wealthMethodIdx = sortedChoices.findIndex(c => c.id.endsWith('-wealth-method'));
                  let wealthMethodSelected = '';
                  if (wealthMethodIdx >= 0) {
                    const [wm] = sortedChoices.splice(wealthMethodIdx, 1);
                    sortedChoices.unshift(wm);
                    wealthMethodSelected = state.character.traitSelections[wm.id]?.[0] || '';
                  }

                  return sortedChoices.map(choice => {
                    // 如果选择了起始资金自购，并且当前 choice 属于装备组，则不显示它
                    if (wealthMethodSelected === 'gold' && choice.id.includes('-equip-')) {
                       return null;
                    }

                    const dynamicNum = getDynamicChooseNumber(choice, state.character.level, selectedClass, selectedSubclass);
                    const dynamicChoice = { ...choice, chooseNumber: dynamicNum };
                    
                    return <TraitSelection key={choice.id} choice={dynamicChoice} />;
                  });
                })()}

                {/* 如果选择了起始资金且本 trait 包含了 wealth-method（通常叫 初始装备与技能选项），则显示链接提示 */}
                {t.choices && t.choices.some(c => c.id.endsWith('-wealth-method')) && state.character.traitSelections[t.choices.find(c => c.id.endsWith('-wealth-method'))!.id]?.[0] === 'gold' && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200/50 rounded-2xl text-sm font-sans flex flex-col items-center justify-center text-stone-600 space-y-2 relative overflow-hidden">
                     <span className="font-medium text-amber-800">你选择了不获取自带装备而使用起始资金</span>
                     <span>请前往物品表根据职业初始资金 (通常为 Xd4 × 10 金币) 购买装备：</span>
                     <a href="https://5e.dickytwister.org/items.html" target="_blank" rel="noreferrer" className="inline-block mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-lg font-medium shadow-sm transition-colors text-xs">
                        前往装备列表选购
                     </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
