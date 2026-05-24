import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCharacter } from '../../context/CharacterContext';
import { TraitChoice } from '../../types/dnd';
import { spells as allSpells } from '../../data/spells';
import { classSpellLists } from '../../data/spellLists';
import { DictyTwisterLink, CustomSpellInput } from '../DictyTwisterLink';
import { classes } from '../../data/classes';
import { races, getRaceByIdAndSource } from '../../data/races';
import { backgrounds } from '../../data/backgrounds';
import { feats } from '../../data/feats';
import { getSpellcastingConfig, getMaxSpellLevel, calcExpectedCantrips, calcExpectedKnownSpells, calcMaxPrepared } from '../steps/SpellsStep';
import { getProficiencies } from '../../utils/proficiencies';
import { isSourceEnabled } from '../../utils/expansionHelper';

import { EquipmentText } from './EquipmentText';
import { FormattedDescription } from './FormattedDescription';

interface TraitSelectionProps {
  choice: TraitChoice;
}

export const TraitSelection: React.FC<TraitSelectionProps> = ({ choice }) => {
  const { state, dispatch } = useCharacter();
  const selectedIds = state.character.traitSelections[choice.id] || [];

  // 防御：既无静态选项也无动态类型，直接退出
  if (!choice.options && !choice.dynamic) {
    return (
      <div className="mt-4 p-4 bg-stone-50 border border-stone-200 rounded-md text-sm text-stone-400">
        (此特性无需选择)
      </div>
    );
  }

  // ========== 静态选项处理 ==========
  if (!choice.dynamic && choice.options) {
    const handleToggle = (optionId: string) => {
      let newSelected = [...selectedIds];
      const chooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;
      if (newSelected.includes(optionId)) {
        newSelected = newSelected.filter(id => id !== optionId);
      } else {
        if (newSelected.length < chooseNum) {
          newSelected.push(optionId);
        } else if (chooseNum === 1) {
          newSelected = [optionId];
        }
      }
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: newSelected } });
    };

    const chooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;
    return (
      <div className="mt-4 p-4 bg-white border border-amber-200/50 rounded-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <h6 className="font-semibold text-stone-800">{choice.name || '选择'}</h6>
          </div>
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
            选择 {chooseNum} 个 ({selectedIds.length}/{chooseNum})
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {(choice.options || []).map(option => {
            const isSelected = selectedIds.includes(option.id);
            const isDisabled = !isSelected && selectedIds.length >= chooseNum && chooseNum > 1;
            return (
              <label key={option.id} className={`flex items-start p-2 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500/20 shadow-sm' : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'} ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                <input type={chooseNum === 1 ? 'radio' : 'checkbox'} disabled={isDisabled} checked={isSelected} onChange={() => handleToggle(option.id)} className="w-3.5 h-3.5 mt-0.5 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer" />
                <div className="ml-2.5 min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-stone-900 truncate" title={option.name}>
                    {choice.id.includes('equip') ? <EquipmentText text={option.name} /> : option.name}
                  </span>
                  {option.description && <span className="block text-[10px] text-stone-500 mt-0.5 leading-tight line-clamp-2" title={option.description}>{option.description}</span>}
                </div>
              </label>
            );
          })}
        </div>
        {choice.id === 'sun-elf-descent-choice' && selectedIds.includes('sun-elf-cantrip') && (
          <div className="mt-4 border-t border-stone-200/50 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <TraitSelection 
              choice={{
                id: 'sun-elf-cantrip-cantrip-choice',
                name: '选择一个法师戏法',
                chooseNumber: 1,
                dynamic: 'spell',
                spellType: 'cantrip',
                spellList: 'wizard'
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // ========== 动态专精选择 ==========
  if (choice.dynamic === 'expertise') {
    const handleToggle = (optionId: string) => {
      let newSelected = [...selectedIds];
      const chooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;
      if (newSelected.includes(optionId)) {
        newSelected = newSelected.filter(id => id !== optionId);
      } else {
        if (newSelected.length < chooseNum) {
          newSelected.push(optionId);
        } else if (chooseNum === 1) {
          newSelected = [optionId];
        }
      }
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: newSelected } });
    };

    const chooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;
    
    // 全部的选项：18个技能 + 盗贼工具
    const allExpertiseOptions = [
      { id: 'acrobatics', name: '特技', description: '敏捷' },
      { id: 'animalHandling', name: '驯兽', description: '感知' },
      { id: 'arcana', name: '奥秘', description: '智力' },
      { id: 'athletics', name: '运动', description: '力量' },
      { id: 'deception', name: '欺瞒', description: '魅力' },
      { id: 'history', name: '历史', description: '智力' },
      { id: 'insight', name: '洞悉', description: '感知' },
      { id: 'intimidation', name: '威吓', description: '魅力' },
      { id: 'investigation', name: '调查', description: '智力' },
      { id: 'medicine', name: '医药', description: '感知' },
      { id: 'nature', name: '自然', description: '智力' },
      { id: 'perception', name: '察觉', description: '感知' },
      { id: 'performance', name: '表演', description: '魅力' },
      { id: 'persuasion', name: '说服', description: '魅力' },
      { id: 'religion', name: '宗教', description: '智力' },
      { id: 'sleightOfHand', name: '巧手', description: '敏捷' },
      { id: 'stealth', name: '隐匿', description: '敏捷' },
      { id: 'survival', name: '生存', description: '感知' },
      { id: 'thieves-tools', name: '盗贼工具', description: '工具' }
    ];

    const cls = classes.find(c => c.id === state.character.classId);
    const race = getRaceByIdAndSource(state.character.raceId, state.character.raceSource);
    let subrace = race?.subraces?.find(sr => sr.id === state.character.subraceId);
    if (state.character.raceId === 'half-elf') subrace = undefined; // Workaround for half-elf custom subrace
    const bg = backgrounds.find(b => b.id === state.character.backgroundId);

    const proficiencies = getProficiencies(state.character, cls, race, subrace, bg);
    
    // 过滤掉已经在其他专精选项中选择过的项
    const otherExpertise = proficiencies.expertise.filter(e => !selectedIds.includes(e));

    const expertiseOptions = allExpertiseOptions.filter(opt => 
      (proficiencies.skills.includes(opt.id) || proficiencies.tools.includes(opt.id)) &&
      !otherExpertise.includes(opt.id)
    );

    return (
      <div className="mt-4 p-4 bg-white border border-amber-200/50 rounded-md shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
            <h6 className="font-semibold text-stone-800">{choice.name || '选择专精'}</h6>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
            {selectedIds.length} / {chooseNum}
          </span>
        </div>
        
        {expertiseOptions.length === 0 ? (
          <div className="text-xs text-stone-400 py-4 text-center bg-stone-50/50 rounded-lg border border-dashed border-stone-200">
            暂无可选的熟练项（需已获得该项熟练）
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expertiseOptions.map(option => {
              const isSelected = selectedIds.includes(option.id);
              const isDisabled = !isSelected && selectedIds.length >= chooseNum && (typeof chooseNum === 'number' ? chooseNum > 1 : true);
              return (
                <label key={option.id} className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'} ${isDisabled ? 'opacity-40 cursor-not-allowed grayscale-[0.5]' : 'hover:border-amber-200'}`}>
                  <input type={chooseNum === 1 ? 'radio' : 'checkbox'} disabled={isDisabled} checked={isSelected} onChange={() => handleToggle(option.id)} className="w-4 h-4 mt-0.5 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer" />
                  <div className="ml-3">
                    <span className={`block text-sm font-medium ${isSelected ? 'text-amber-900' : 'text-stone-900'}`}>{option.name}</span>
                    {option.description && <span className="block text-[10px] text-stone-500 mt-0.5 uppercase tracking-wider">{option.description}</span>}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ========== 动态属性提升或专长选择 ==========
  if (choice.dynamic === 'asi') {
    const [activeMode, setActiveMode] = useState<'asi' | 'feat'>(
      selectedIds.some(id => id.startsWith('feat-')) ? 'feat' : 'asi'
    );
    
    const isFeatMode = activeMode === 'feat';
    const isAsiMode = activeMode === 'asi';
    const asiPoints = selectedIds.filter(id => id.startsWith('asi-')).length;
    
    // Switch between modes
    const handleSetMode = (mode: 'asi' | 'feat') => {
      setActiveMode(mode);
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: [] } });
    };

    const handleAsiChange = (ab: string, delta: number) => {
      const currentAbPoints = selectedIds.filter(id => id === `asi-${ab}`).length;
      if (delta > 0) {
        if (asiPoints < 2 && currentAbPoints < 2) {
          dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: [...selectedIds, `asi-${ab}`] } });
        }
      } else {
        if (currentAbPoints > 0) {
          const newSelected = [...selectedIds];
          const idx = newSelected.lastIndexOf(`asi-${ab}`);
          if (idx !== -1) newSelected.splice(idx, 1);
          dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: newSelected } });
        }
      }
    };

    const handleFeatToggle = (featId: string) => {
      const fullId = `feat-${featId}`;
      if (selectedIds.includes(fullId)) {
        dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: [] } });
      } else {
        dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: [fullId] } });
      }
    };

    const abilities = [
      { id: 'STR', name: '力量' },
      { id: 'DEX', name: '敏捷' },
      { id: 'CON', name: '体质' },
      { id: 'INT', name: '智力' },
      { id: 'WIS', name: '感知' },
      { id: 'CHA', name: '魅力' }
    ];

    return (
      <div className="mt-4 p-4 bg-white border border-amber-200/50 rounded-md">
        <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-3">
          <h6 className="font-semibold text-stone-800">{choice.name || '提升属性或专长'}</h6>
          <div className="flex bg-stone-100 p-1 rounded-lg">
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${isAsiMode ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              onClick={() => handleSetMode('asi')}
            >
              提升属性
            </button>
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${isFeatMode ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              onClick={() => handleSetMode('feat')}
            >
              选择专长
            </button>
          </div>
        </div>
        
        {isAsiMode ? (
          <div>
            <div className="text-xs text-stone-500 mb-3 flex items-center justify-between">
              <span>分配两点属性值（可各+1，或单项+2）</span>
              <span className={`font-mono font-bold ${asiPoints === 2 ? 'text-green-600' : 'text-amber-600'}`}>
                {asiPoints}/2
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {abilities.map(ab => {
                const pts = selectedIds.filter(id => id === `asi-${ab.id}`).length;
                return (
                  <div key={ab.id} className={`flex items-center justify-between p-2 rounded-xl border ${pts > 0 ? 'border-amber-300 bg-amber-50' : 'border-stone-200 bg-stone-50'}`}>
                    <span className="text-sm font-semibold text-stone-700">{ab.name} {ab.id}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAsiChange(ab.id, -1)}
                        disabled={pts === 0}
                        className={`w-6 h-6 flex items-center justify-center rounded-md border ${pts === 0 ? 'opacity-30 cursor-not-allowed border-stone-200 bg-white' : 'border-stone-300 bg-white hover:bg-stone-100'}`}
                      >
                        -
                      </button>
                      <span className="text-sm font-mono w-4 text-center">{pts > 0 ? `+${pts}` : '0'}</span>
                      <button
                        onClick={() => handleAsiChange(ab.id, 1)}
                        disabled={pts >= 2 || asiPoints >= 2}
                        className={`w-6 h-6 flex items-center justify-center rounded-md border ${pts >= 2 || asiPoints >= 2 ? 'opacity-30 cursor-not-allowed border-stone-200 bg-white' : 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700'}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs text-stone-500 mb-3 flex items-center justify-between">
              <span>选择一个专长</span>
              <span className={`font-mono font-bold ${selectedIds.length === 1 ? 'text-green-600' : 'text-amber-600'}`}>
                {selectedIds.length}/1
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
              {feats.filter(f => isSourceEnabled(f.source || 'phb')).map(feat => {
                const isSelected = selectedIds.includes(`feat-${feat.id}`);
                const isDisabled = !isSelected && selectedIds.length >= 1;
                return (
                  <div 
                    key={feat.id} 
                    className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-amber-500 bg-amber-50' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => {
                      if (!isDisabled) handleFeatToggle(feat.id);
                    }}
                  >
                    <div className={`w-4 h-4 mt-0.5 mr-3 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-amber-600 bg-amber-600' : 'border-stone-300'}`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="block text-sm font-medium text-stone-900">{feat.name}</span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <DictyTwisterLink type="feat" name={feat.name} source={feat.source || 'phb'} />
                    </div>
                  </div>
                  <FormattedDescription text={feat.description} className="text-xs text-stone-500 mt-0.5 leading-relaxed" />
                </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== 动态专长选择 ==========
  if (choice.dynamic === 'feat') {
    const handleFeatToggle = (featId: string) => {
      let newSelected = [...selectedIds];
      const chooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;
      
      if (newSelected.includes(featId)) {
        newSelected = newSelected.filter(id => id !== featId);
      } else {
        if (newSelected.length < chooseNum) {
          newSelected.push(featId);
        } else if (chooseNum === 1) {
          newSelected = [featId];
        }
      }
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: newSelected } });
    };

    const chooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;

    return (
      <div className="mt-4 p-4 bg-white border border-amber-200/50 rounded-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <h6 className="font-semibold text-stone-800">{choice.name || '选择专长'}</h6>
          </div>
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
            选择 {chooseNum} 个 ({selectedIds.length}/{chooseNum})
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
          {feats.filter(f => isSourceEnabled(f.source || 'phb')).map(feat => {
            const isSelected = selectedIds.includes(feat.id);
            const isDisabled = !isSelected && selectedIds.length >= chooseNum && chooseNum > 1;
            return (
              <div 
                key={feat.id} 
                className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-amber-500 bg-amber-50' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => {
                  if (!isDisabled) handleFeatToggle(feat.id);
                }}
              >
                <div className={`w-4 h-4 mt-0.5 mr-3 flex items-center justify-center flex-shrink-0 transition-colors border ${chooseNum === 1 ? 'rounded-full' : 'rounded-sm'} ${isSelected ? 'border-amber-600 bg-amber-600' : 'border-stone-300'}`}>
                   {isSelected && <div className={`bg-white ${chooseNum === 1 ? 'w-1.5 h-1.5 rounded-full' : 'w-2 h-2 rounded-sm'}`} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="block text-sm font-medium text-stone-900">{feat.name}</span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <DictyTwisterLink type="feat" name={feat.name} source={feat.source || 'phb'} />
                    </div>
                  </div>
                  <FormattedDescription text={feat.description} className="block text-xs text-stone-500 mt-0.5 leading-relaxed" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ========== 动态先祖遗赠选择 (鸦阁) ==========
  if (choice.dynamic === 'ancestral-legacy') {
    const [activeMode, setActiveMode] = useState<'inherit' | 'skills'>(
      selectedIds.some(id => id.startsWith('inherit-')) ? 'inherit' : 'skills'
    );
    const [inheritInput, setInheritInput] = useState('');

    const handleSetMode = (mode: 'inherit' | 'skills') => {
      setActiveMode(mode);
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: [] } });
    };

    const handleSkillToggle = (skillId: string) => {
      let newSelected = [...selectedIds];
      if (newSelected.includes(skillId)) {
        newSelected = newSelected.filter(id => id !== skillId);
      } else {
        if (newSelected.length < 2) {
          newSelected.push(skillId);
        } else {
          newSelected = [skillId];
        }
      }
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: newSelected } });
    };

    const handleInheritAdd = () => {
      if (inheritInput.trim()) {
        dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: [`inherit-${inheritInput.trim()}`] } });
        setInheritInput('');
      }
    };

    const allSkills = [
      { id: 'acrobatics', name: '特技', description: '敏捷' },
      { id: 'animalHandling', name: '驯兽', description: '感知' },
      { id: 'arcana', name: '奥秘', description: '智力' },
      { id: 'athletics', name: '运动', description: '力量' },
      { id: 'deception', name: '欺瞒', description: '魅力' },
      { id: 'history', name: '历史', description: '智力' },
      { id: 'insight', name: '洞悉', description: '感知' },
      { id: 'intimidation', name: '威吓', description: '魅力' },
      { id: 'investigation', name: '调查', description: '智力' },
      { id: 'medicine', name: '医药', description: '感知' },
      { id: 'nature', name: '自然', description: '智力' },
      { id: 'perception', name: '察觉', description: '感知' },
      { id: 'performance', name: '表演', description: '魅力' },
      { id: 'persuasion', name: '说服', description: '魅力' },
      { id: 'religion', name: '宗教', description: '智力' },
      { id: 'sleightOfHand', name: '巧手', description: '敏捷' },
      { id: 'stealth', name: '隐匿', description: '敏捷' },
      { id: 'survival', name: '生存', description: '感知' }
    ];

    const currentInherit = selectedIds.find(id => id.startsWith('inherit-'))?.replace('inherit-', '');

    return (
      <div className="mt-4 p-4 bg-white border border-amber-200/50 rounded-md shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
          <h6 className="font-semibold text-stone-800">{choice.name || '先祖遗赠方式'}</h6>
          <div className="flex bg-stone-100 p-1 rounded-lg">
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${activeMode === 'inherit' ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              onClick={() => handleSetMode('inherit')}
            >
              继承原有种族
            </button>
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${activeMode === 'skills' ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              onClick={() => handleSetMode('skills')}
            >
              获得熟练项
            </button>
          </div>
        </div>

        {activeMode === 'inherit' ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="text-xs text-stone-500 leading-relaxed">
              填入你所替换的原种族。你将保留该种族的：任何技能熟练，攀爬、飞行或游泳速度。
              <div className="mt-2 flex items-center">
                参考Wiki种族列表:
                <DictyTwisterLink type="rule" name="races.html" source="" label="种族总表" />
              </div>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inheritInput}
                onChange={e => setInheritInput(e.target.value)}
                placeholder="在此输入原种族名称 (如: 人类、精灵)"
                className="flex-1 text-sm border border-stone-300 rounded px-3 py-1.5 focus:outline-none focus:border-amber-500"
                onKeyDown={e => { if (e.key === 'Enter') handleInheritAdd() }}
              />
              <button 
                onClick={handleInheritAdd}
                disabled={!inheritInput.trim()}
                className="px-4 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded hover:bg-amber-600 disabled:opacity-50 transition-colors"
              >
                确定
              </button>
            </div>

            {currentInherit && (
              <div className="flex justify-between items-center bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-[10px] text-amber-600 uppercase font-bold tracking-wider">已继承种族</span>
                  <span className="text-sm font-semibold text-amber-900">{currentInherit}</span>
                </div>
                <button 
                  onClick={() => dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: [] } })}
                  className="p-1 hover:bg-amber-100 rounded-full text-amber-700 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="text-xs text-stone-500 mb-3 flex items-center justify-between">
              <span>不继承原种族特性，自选两项技能熟练项：</span>
              <span className={`font-mono font-bold ${selectedIds.length === 2 ? 'text-green-600' : 'text-amber-600'}`}>
                {selectedIds.length}/2
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {allSkills.map(skill => {
                const isSelected = selectedIds.includes(skill.id);
                const isDisabled = !isSelected && selectedIds.length >= 2;
                return (
                  <label key={skill.id} className={`flex items-start p-2.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500/20 shadow-sm' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'} ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-amber-200'}`}>
                    <input type="checkbox" disabled={isDisabled} checked={isSelected} onChange={() => handleSkillToggle(skill.id)} className="w-3.5 h-3.5 mt-0.5 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer" />
                    <div className="ml-2.5">
                      <span className={`block text-xs font-semibold ${isSelected ? 'text-amber-900' : 'text-stone-900'}`}>{skill.name}</span>
                      <span className="block text-[10px] text-stone-500 mt-0.5 uppercase tracking-tighter">{skill.description}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== 动态法术选择 ==========
  if (choice.dynamic === 'spell') {
    const spellListId = choice.spellList || '';
    const availableSpellIds = classSpellLists[spellListId] || [];
    
    // 动态计算最大可获取的法术环阶（比如法师随等级提高可选更高环阶的法术）
    let dynamicMaxLevel = choice.maxLevel;
    const cls = classes.find(c => c.id === state.character.classId);
    const subclass = cls?.subclasses?.find(sc => sc.id === state.character.subclassId);
    const spellcasting = getSpellcastingConfig(cls, subclass, state.character.level);
    
    const isMainCantripChoice = choice.id === 'spells-step-cantrips' || ((choice.id.includes(cls?.id || '') || (subclass && choice.id.includes(subclass.id))) && choice.id.includes('-cantrips-'));
    const isMainKnownChoice = choice.id === 'spells-step-leveled' || ((choice.id.includes(cls?.id || '') || (subclass && choice.id.includes(subclass.id))) && choice.id.includes('-known-'));

    if ((choice.spellType === 'spellbook' || choice.spellType === 'known') && (dynamicMaxLevel === undefined || isMainKnownChoice)) {
      if (spellcasting?.spellSlots) {
        dynamicMaxLevel = getMaxSpellLevel(spellcasting.spellSlots, state.character.level);
      }
    }

    let availableSpells = allSpells.filter(s => availableSpellIds.includes(s.id) && (dynamicMaxLevel === undefined || s.level <= dynamicMaxLevel));
    
    // 根据 spellType 过滤显示类型：戏法只选戏法，已知/准备只选1环以上
    if (choice.spellType === 'cantrip') {
      availableSpells = availableSpells.filter(s => s.level === 0);
    } else if (choice.spellType === 'known' || choice.spellType === 'prepared' || choice.spellType === 'spellbook') {
      availableSpells = availableSpells.filter(s => s.level > 0);
    }
    
    const preselectedIds = choice.preselected || [];
    const allSpellsToRender = [...availableSpells];
    preselectedIds.forEach(psId => {
      if (!allSpellsToRender.some(s => s.id === psId)) {
        const psSpell = allSpells.find(s => s.id === psId);
        if (psSpell) allSpellsToRender.push(psSpell);
      }
    });

    const cantrips = allSpellsToRender.filter(s => s.level === 0);
    const leveledSpells = allSpellsToRender.filter(s => s.level > 0);

    let dynamicChooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;
    let dynamicChoiceName = choice.name;

    if (isMainCantripChoice && choice.spellType === 'cantrip') {
      const expected = calcExpectedCantrips(spellcasting, state.character.level);
      if (expected > 0) {
        dynamicChooseNum = expected;
        dynamicChoiceName = `选择 ${expected} 个${cls?.name || ''}戏法`;
      }
    } else if (isMainKnownChoice && choice.spellType === 'known') {
      const expected = calcExpectedKnownSpells(spellcasting, state.character.level);
      if (expected > 0) {
        dynamicChooseNum = expected;
        dynamicChoiceName = `选择 ${expected} 个${cls?.name || ''}法术`;
      }
    } else if (choice.id.includes('wizard-spellbook') && choice.spellType === 'spellbook') {
      dynamicChooseNum = 6 + 2 * (state.character.level - 1);
      dynamicChoiceName = `选择 ${dynamicChooseNum} 个${cls?.name || ''}法术加入法术书`;
    }

    const handleSpellToggle = (spellId: string) => {
      if (preselectedIds.includes(spellId)) return;
      let newSelected = [...selectedIds];
      if (newSelected.includes(spellId)) {
        newSelected = newSelected.filter(id => id !== spellId);
      } else {
        if (newSelected.length < dynamicChooseNum) {
          newSelected.push(spellId);
        } else if (dynamicChooseNum === 1) {
          newSelected = [spellId];
        }
      }
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: newSelected } });
    };

    return (
      <div className="mt-4 p-4 bg-white border border-amber-200/50 rounded-md">
        <div className="flex items-center justify-between mb-3">
          <h6 className="font-semibold text-stone-800">{dynamicChoiceName || '选择法术'}</h6>
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
            已选 {selectedIds.length}/{dynamicChooseNum}
          </span>
        </div>
        {choice.description && <p className="text-xs text-stone-500 mb-3">{choice.description}</p>}
        
        {cantrips.length > 0 && (
          <div className="mb-4">
            <h6 className="text-sm font-semibold text-stone-600 mb-2">戏法</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {cantrips.map(spell => {
                const isPreselected = preselectedIds.includes(spell.id);
                const isSelected = isPreselected || selectedIds.includes(spell.id);
                const isDisabled = isPreselected || (!isSelected && selectedIds.length >= dynamicChooseNum && dynamicChooseNum > 1);
                return (
                  <label key={spell.id} className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-amber-500 bg-amber-50' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input type="checkbox" disabled={isDisabled} checked={isSelected} onChange={() => handleSpellToggle(spell.id)} className="w-4 h-4 text-amber-600" />
                    <span className="ml-2 text-sm text-stone-800">{spell.name}{isPreselected ? ' (特性获取)' : ''}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
        
        {leveledSpells.length > 0 && (
          <div>
            <h6 className="text-sm font-semibold text-stone-600 mb-2">1环及以上</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {leveledSpells.map(spell => {
                const isPreselected = preselectedIds.includes(spell.id);
                const isSelected = isPreselected || selectedIds.includes(spell.id);
                const isDisabled = isPreselected || (!isSelected && selectedIds.length >= dynamicChooseNum && dynamicChooseNum > 1);
                return (
                  <label key={spell.id} className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-amber-500 bg-amber-50' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input type="checkbox" disabled={isDisabled} checked={isSelected} onChange={() => handleSpellToggle(spell.id)} className="w-4 h-4 text-amber-600" />
                    <span className="ml-2 text-sm text-stone-800">{spell.name}{isPreselected ? ' (特性获取)' : ''} <span className="text-xs text-stone-400">({spell.level}环)</span></span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== 自定义法术输入 ==========
  if (choice.dynamic === 'custom-spells') {
    return (
      <CustomSpellInput choiceId={choice.id} maxCount={typeof choice.chooseNumber === 'number' ? choice.chooseNumber : parseInt(choice.chooseNumber as string, 10) || 2} title={choice.name} />
    );
  }

  // ========== 动态技能选择 ==========
  if (choice.dynamic === 'skill') {
    const handleToggle = (optionId: string) => {
      let newSelected = [...selectedIds];
      const chooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;
      if (newSelected.includes(optionId)) {
        newSelected = newSelected.filter(id => id !== optionId);
      } else {
        if (newSelected.length < chooseNum) {
          newSelected.push(optionId);
        } else if (chooseNum === 1) {
          newSelected = [optionId];
        }
      }
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: newSelected } });
    };

    const chooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;
    const allSkills = [
      { id: 'acrobatics', name: '特技', description: '敏捷' },
      { id: 'animalHandling', name: '驯兽', description: '感知' },
      { id: 'arcana', name: '奥秘', description: '智力' },
      { id: 'athletics', name: '运动', description: '力量' },
      { id: 'deception', name: '欺瞒', description: '魅力' },
      { id: 'history', name: '历史', description: '智力' },
      { id: 'insight', name: '洞悉', description: '感知' },
      { id: 'intimidation', name: '威吓', description: '魅力' },
      { id: 'investigation', name: '调查', description: '智力' },
      { id: 'medicine', name: '医药', description: '感知' },
      { id: 'nature', name: '自然', description: '智力' },
      { id: 'perception', name: '察觉', description: '感知' },
      { id: 'performance', name: '表演', description: '魅力' },
      { id: 'persuasion', name: '说服', description: '魅力' },
      { id: 'religion', name: '宗教', description: '智力' },
      { id: 'sleightOfHand', name: '巧手', description: '敏捷' },
      { id: 'stealth', name: '隐匿', description: '敏捷' },
      { id: 'survival', name: '生存', description: '感知' }
    ];

    return (
      <div className="mt-4 p-4 bg-white border border-amber-200/50 rounded-md shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
          <div className="flex items-center">
            <h6 className="font-semibold text-stone-800">{choice.name || '选择技能'}</h6>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
            {selectedIds.length} / {chooseNum}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allSkills.map(option => {
            const isSelected = selectedIds.includes(option.id);
            const isDisabled = !isSelected && selectedIds.length >= chooseNum && chooseNum > 1;
            return (
              <label key={option.id} className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'} ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                <input type={chooseNum === 1 ? 'radio' : 'checkbox'} disabled={isDisabled} checked={isSelected} onChange={() => handleToggle(option.id)} className="w-4 h-4 mt-0.5 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer" />
                <div className="ml-3">
                  <span className={`block text-sm font-medium ${isSelected ? 'text-amber-900' : 'text-stone-900'}`}>{option.name}</span>
                  <span className="block text-[10px] text-stone-500 mt-0.5">{option.description}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // ========== 动态语言选择 ==========
  if (choice.dynamic === 'language') {
    const handleToggle = (optionId: string) => {
      let newSelected = [...selectedIds];
      const chooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;
      if (newSelected.includes(optionId)) {
        newSelected = newSelected.filter(id => id !== optionId);
      } else {
        if (newSelected.length < chooseNum) {
          newSelected.push(optionId);
        } else if (chooseNum === 1) {
          newSelected = [optionId];
        }
      }
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: newSelected } });
    };

    const chooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;
    const allLanguages = [
      { id: 'lang-abyssal', name: '深渊语' },
      { id: 'lang-celestial', name: '天界语' },
      { id: 'lang-common', name: '通用语' },
      { id: 'lang-deep-speech', name: '深潜语' },
      { id: 'lang-draconic', name: '龙语' },
      { id: 'lang-dwarvish', name: '矮人语' },
      { id: 'lang-elvish', name: '精灵语' },
      { id: 'lang-giant', name: '巨人语' },
      { id: 'lang-gnomish', name: '侏儒语' },
      { id: 'lang-goblin', name: '地精语' },
      { id: 'lang-halfling', name: '半身人语' },
      { id: 'lang-infernal', name: '炼狱语' },
      { id: 'lang-orc', name: '兽人语' },
      { id: 'lang-primordial', name: '原初语' },
      { id: 'lang-sylvan', name: '木族语' },
      { id: 'lang-undercommon', name: '地底通用语' }
    ];

    return (
      <div className="mt-4 p-4 bg-white border border-amber-200/50 rounded-md shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
          <div className="flex items-center">
            <h6 className="font-semibold text-stone-800">{choice.name || '选择语言'}</h6>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
            {selectedIds.length} / {chooseNum}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {allLanguages.map(option => {
            const isSelected = selectedIds.includes(option.id);
            const isDisabled = !isSelected && selectedIds.length >= chooseNum && chooseNum > 1;
            return (
              <label key={option.id} className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'} ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                <input type={chooseNum === 1 ? 'radio' : 'checkbox'} disabled={isDisabled} checked={isSelected} onChange={() => handleToggle(option.id)} className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer" />
                <span className={`block ml-2 text-sm font-medium ${isSelected ? 'text-amber-900' : 'text-stone-900'}`}>{option.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // ========== 动态工具选择 ==========
  if (choice.dynamic === 'tool') {
    const handleToggle = (optionId: string) => {
      let newSelected = [...selectedIds];
      const chooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;
      if (newSelected.includes(optionId)) {
        newSelected = newSelected.filter(id => id !== optionId);
      } else {
        if (newSelected.length < chooseNum) {
          newSelected.push(optionId);
        } else if (chooseNum === 1) {
          newSelected = [optionId];
        }
      }
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId: choice.id, selectedIds: newSelected } });
    };

    const chooseNum = typeof choice.chooseNumber === 'number' ? choice.chooseNumber : 1;
    const allTools = [
      { id: 'alchemist-supplies', name: '炼金工具' },
      { id: 'brewers-supplies', name: '酿酒工具' },
      { id: 'calligraphers-supplies', name: '书写工具' },
      { id: 'carpenters-tools', name: '木匠工具' },
      { id: 'cartographers-tools', name: '制图工具' },
      { id: 'cobblers-tools', name: '皮匠工具' },
      { id: 'cooks-utensils', name: '厨师用具' },
      { id: 'glassblowers-tools', name: '吹玻璃工具' },
      { id: 'jewelers-tools', name: '珠宝匠工具' },
      { id: 'leatherworkers-tools', name: '制革工具' },
      { id: 'masons-tools', name: '泥瓦匠工具' },
      { id: 'painters-supplies', name: '画具' },
      { id: 'potters-tools', name: '制陶工具' },
      { id: 'smiths-tools', name: '铁匠工具' },
      { id: 'tinkers-tools', name: '工匠工具' },
      { id: 'weavers-tools', name: '编织工具' },
      { id: 'woodcarvers-tools', name: '木雕工具' },
      { id: 'disguise-kit', name: '伪装工具' },
      { id: 'forgery-kit', name: '伪造工具' },
      { id: 'herbalism-kit', name: '草药工具' },
      { id: 'navigators-tools', name: '导航工具' },
      { id: 'poisoners-kit', name: '制毒工具' },
      { id: 'thieves-tools', name: '盗贼工具' },
      { id: 'land-vehicles', name: '陆上载具' },
      { id: 'water-vehicles', name: '水上载具' },
      { id: 'bagpipes', name: '风笛' },
      { id: 'drum', name: '鼓' },
      { id: 'dulcimer', name: '扬琴' },
      { id: 'flute', name: '长笛' },
      { id: 'lute', name: '鲁特琴' },
      { id: 'lyre', name: '里拉琴' },
      { id: 'horn', name: '号角' },
      { id: 'pan-flute', name: '排箫' },
      { id: 'shawm', name: '双簧管' },
      { id: 'viol', name: '维奥尔琴' }
    ];

    return (
      <div className="mt-4 p-4 bg-white border border-amber-200/50 rounded-md shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
          <div className="flex items-center">
            <h6 className="font-semibold text-stone-800">{choice.name || '选择工具'}</h6>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
            {selectedIds.length} / {chooseNum}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {allTools.map(option => {
            const isSelected = selectedIds.includes(option.id);
            const isDisabled = !isSelected && selectedIds.length >= chooseNum && chooseNum > 1;
            return (
              <label key={option.id} className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'} ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                <input type={chooseNum === 1 ? 'radio' : 'checkbox'} disabled={isDisabled} checked={isSelected} onChange={() => handleToggle(option.id)} className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer flex-shrink-0" />
                <span className={`block ml-2 text-sm font-medium ${isSelected ? 'text-amber-900' : 'text-stone-900'} truncate`} title={option.name}>{option.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // 兜底
  return (
    <div className="mt-4 p-4 bg-stone-50 border border-stone-200 rounded-md text-sm text-stone-400">
      此选择项暂无可用选项。
    </div>
  );
}