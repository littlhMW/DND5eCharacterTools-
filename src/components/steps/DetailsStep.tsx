import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { races, getRaceByIdAndSource } from '../../data/races';
import { classes } from '../../data/classes';
import { backgrounds } from '../../data/backgrounds';
import { getAIConfig, generateBackstoryAndAppearance } from '../../utils/aiHelper';
import { generateXgeBackstory } from '../../utils/xgeLifeGenerator';
import { generateRandomName, isRandomNameEnabled } from '../../utils/nameGenerator';
import { Sparkles, Dices, Scroll } from 'lucide-react';

const INPUT_FIELDS = [
  { id: 'name', label: '角色名称' },
  { id: 'alignment', label: '阵营' },
  { id: 'age', label: '年龄' },
  { id: 'appearance', label: '外貌描写' },
  { id: 'personality', label: '性格特质' },
  { id: 'ideals', label: '理想' },
  { id: 'bonds', label: '牵绊' },
  { id: 'flaws', label: '缺点' },
  { id: 'backstory', label: '背景故事' },
];

export function DetailsStep() {
  const { state, dispatch } = useCharacter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const aiLocalConfig = getAIConfig();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    dispatch({ type: 'UPDATE_BASIC_INFO', payload: { [e.target.name]: e.target.value } });
  };

  const handleXgeGenerate = () => {
    const useExpanded = localStorage.getItem('xgeUseExpandedInDetails') === 'true';
    const useNonPhbSupport = localStorage.getItem('xgeUseNonPhbInDetails') !== 'false';
    
    // Parse character details like age and ability modifiers
    const ageVal = state.character.age ? parseInt(state.character.age, 10) : undefined;
    const chaScore = state.character.baseAbilities?.CHA ?? 10;
    const chaMod = Math.floor((chaScore - 10) / 2);

    const xgeText = generateXgeBackstory(
      { 
        backgroundId: state.character.backgroundId, 
        classId: state.character.classId,
        age: isNaN(ageVal as number) ? undefined : ageVal,
        chaMod: chaMod
      },
      { useExpanded, useNonPhbSupport }
    );
    
    const currentBackstory = state.character.backstory || '';
    const markerStart = "※【万事指南 · 经历生平】※";
    const markerEnd = "──────────────────────";
    const xgeBlock = `${markerStart}\n${xgeText}\n${markerEnd}`;
    
    let newBackstory = '';
    const startIndex = currentBackstory.indexOf(markerStart);
    
    if (startIndex !== -1) {
      // Found the existing XGE block
      const endIndex = currentBackstory.indexOf(markerEnd, startIndex);
      if (endIndex !== -1) {
        const beforeStr = currentBackstory.substring(0, startIndex).trim();
        const afterStr = currentBackstory.substring(endIndex + markerEnd.length).trim();
        
        newBackstory = beforeStr;
        if (afterStr) {
          newBackstory += (newBackstory ? '\n\n' : '') + xgeBlock + '\n\n' + afterStr;
        } else {
          newBackstory += (newBackstory ? '\n\n' : '') + xgeBlock;
        }
      } else {
        const beforeStr = currentBackstory.substring(0, startIndex).trim();
        newBackstory = beforeStr ? `${beforeStr}\n\n${xgeBlock}` : xgeBlock;
      }
    } else {
      // Check for old legacy format tags in backstory to upgrade gracefully
      const oldMatch = currentBackstory.match(/(【XGE 经历：这是你的人生】|这是你的人生：|这是你的人生:)/);
      if (oldMatch && typeof oldMatch.index === 'number') {
        const beforeStr = currentBackstory.substring(0, oldMatch.index).trim();
        newBackstory = beforeStr ? `${beforeStr}\n\n${xgeBlock}` : xgeBlock;
      } else {
        // Just append to existing text
        const baseStr = currentBackstory.trim();
        newBackstory = baseStr ? `${baseStr}\n\n${xgeBlock}` : xgeBlock;
      }
    }
      
    dispatch({
      type: 'UPDATE_BASIC_INFO',
      payload: { backstory: newBackstory },
    });
  };

  const handleAiGenerate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Find race details
      const race = getRaceByIdAndSource(state.character.raceId, state.character.raceSource);
      const subrace = race?.subraces?.find(s => s.id === state.character.subraceId);
      const cls = classes.find(c => c.id === state.character.classId);
      const subclass = cls?.subclasses?.find(s => s.id === state.character.subclassId);
      const bg = backgrounds.find(b => b.id === state.character.backgroundId);

      const params = {
        characterName: state.character.name || '未命名',
        age: state.character.age || '未指定',
        backgroundName: bg?.name || '未指定',
        raceName: race?.name || '未知种族',
        subraceName: subrace?.name,
        className: cls?.name || '未知职业',
        subclassName: subclass?.name,
        level: state.character.level || 3,
        alignment: state.character.alignment || '偏向中立',
        appearance: state.character.appearance || '',
        backstory: state.character.backstory || '',
        personality: state.character.personality || '',
        ideals: state.character.ideals || '',
        bonds: state.character.bonds || '',
        flaws: state.character.flaws || '',
        raceDescription: race?.description || '',
        subraceDescription: subrace?.description || '',
        classDescription: cls?.description || '',
        subclassDescription: subclass?.description || '',
      };

      const result = await generateBackstoryAndAppearance(params);
      
      // Update character state
      dispatch({
        type: 'UPDATE_BASIC_INFO',
        payload: {
          appearance: result.appearance,
          backstory: result.backstory,
        },
      });

      setSuccessMsg('外貌描写与生平传记谱写完成！已为您融合扩充至下方栏位中。');
    } catch (e: any) {
      console.error(e);
      setError(e.message || '失败，请检查网络和 API 配置。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="border-b border-stone-200 pb-3 mb-6 flex flex-col gap-1.5">
        <h2 className="text-2xl font-serif text-amber-600 flex items-center gap-2">
          <span>角色细节</span>
          {aiLocalConfig.detailsEnabled && (
            <button
              onClick={handleAiGenerate}
              disabled={loading}
              title="AI 丰富细节"
              className={`p-1.5 rounded-full border border-stone-200 hover:border-amber-450 hover:bg-amber-50/50 text-stone-500 hover:text-amber-600 transition-all ${
                loading ? 'animate-spin cursor-not-allowed text-amber-600' : 'cursor-pointer'
              }`}
            >
              <Sparkles size={15} />
            </button>
          )}
        </h2>
        {loading && (
          <p className="text-xs text-amber-600 animate-pulse flex items-center gap-1 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            AI 正在处理细节，请稍后...
          </p>
        )}
        {error && (
          <p className="text-xs text-red-650 flex items-center gap-1 font-sans">
            ⚠️ {error}
          </p>
        )}
        {successMsg && (
          <p className="text-xs text-teal-650 flex items-center gap-1 font-sans">
            ✓ 已成功运用 丰富角色的外貌与背景描述！
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INPUT_FIELDS.map(field => (
          <div key={field.id} className={['personality', 'ideals', 'bonds', 'flaws', 'appearance', 'backstory'].includes(field.id) ? 'md:col-span-2' : ''}>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-stone-700 font-sans">{field.label}</label>
              {field.id === 'name' && isRandomNameEnabled() && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'UPDATE_BASIC_INFO', payload: { name: generateRandomName(state.character.raceId) } })}
                  className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 rounded border border-amber-200 hover:bg-amber-100/50 hover:border-amber-300 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                  title="随机生成姓名"
                >
                  <Dices size={14} /> 随机起名
                </button>
              )}
              {field.id === 'backstory' && localStorage.getItem('xgeEnabledInDetails') === 'true' && (
                <button
                  type="button"
                  onClick={handleXgeGenerate}
                  className="p-1.5 text-amber-700 bg-amber-50 rounded border border-amber-200 hover:bg-amber-100/50 hover:border-amber-300 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                  title="使用XGE人生经历生成"
                >
                  <Scroll size={14} />
                </button>
              )}
            </div>
            {['personality', 'ideals', 'bonds', 'flaws', 'appearance'].includes(field.id) ? (
              <textarea
                name={field.id}
                value={(state.character as any)[field.id] || ''}
                onChange={handleChange}
                rows={3}
                placeholder={`输入你的${field.label}...`}
                className="w-full bg-white border border-stone-200 rounded-md p-4 text-stone-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors shadow-sm resize-none font-sans text-sm"
              />
            ) : field.id === 'backstory' ? (
              <textarea
                name={field.id}
                value={(state.character as any)[field.id] || ''}
                onChange={handleChange}
                rows={6}
                placeholder={`讲述你的角色背景故事...`}
                className="w-full bg-white border border-stone-200 rounded-md p-4 text-stone-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors shadow-sm resize-none font-sans text-sm"
              />
            ) : field.id === 'alignment' ? (
              <select
                name={field.id}
                value={(state.character as any)[field.id] || ''}
                onChange={handleChange}
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-stone-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors shadow-sm font-sans text-sm h-[46px]"
              >
                <option value="">选择阵营...</option>
                <option value="守序善良">守序善良 (Lawful Good)</option>
                <option value="中立善良">中立善良 (Neutral Good)</option>
                <option value="混乱善良">混乱善良 (Chaotic Good)</option>
                <option value="守序中立">守序中立 (Lawful Neutral)</option>
                <option value="绝对中立">绝对中立 (True Neutral)</option>
                <option value="混乱中立">混乱中立 (Chaotic Neutral)</option>
                <option value="守序邪恶">守序邪恶 (Lawful Evil)</option>
                <option value="中立邪恶">中立邪恶 (Neutral Evil)</option>
                <option value="混乱邪恶">混乱邪恶 (Chaotic Evil)</option>
              </select>
            ) : (
              <input
                type="text"
                name={field.id}
                value={(state.character as any)[field.id] || ''}
                onChange={handleChange}
                placeholder={`输入你的${field.label}...`}
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-stone-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors shadow-sm font-sans text-sm h-[46px]"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
