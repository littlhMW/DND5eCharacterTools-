import React from 'react';
import { useCharacter } from '../../context/CharacterContext';

const INPUT_FIELDS = [
  { id: 'name', label: '角色名称' },
  { id: 'alignment', label: '阵营' },
  { id: 'age', label: '年龄' },
  { id: 'appearance', label: '外貌描写' },
  { id: 'personality', label: '性格特质' },
  { id: 'ideals', label: '理想' },
  { id: 'bonds', label: '牵绊' },
  { id: 'flaws', label: '缺点' },
];

export function DetailsStep() {
  const { state, dispatch } = useCharacter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    dispatch({ type: 'UPDATE_BASIC_INFO', payload: { [e.target.name]: e.target.value } });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-serif text-amber-600 border-b border-stone-200 pb-3 mb-6">角色细节</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INPUT_FIELDS.map(field => (
          <div key={field.id} className={['personality', 'ideals', 'bonds', 'flaws', 'appearance'].includes(field.id) ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-semibold text-stone-700 mb-2 font-sans">{field.label}</label>
            {['personality', 'ideals', 'bonds', 'flaws', 'appearance'].includes(field.id) ? (
              <textarea
                name={field.id}
                value={(state.character as any)[field.id] || ''}
                onChange={handleChange}
                rows={3}
                placeholder={`输入你的${field.label}...`}
                className="w-full bg-white border border-stone-200 rounded-2xl p-4 text-stone-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors shadow-sm resize-none font-sans text-sm"
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
