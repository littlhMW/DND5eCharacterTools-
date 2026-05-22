import React, { useState } from 'react';
import { BookOpen, Plus, X } from 'lucide-react';
import { useCharacter } from '../context/CharacterContext';

interface Props {
  type: 'race' | 'class' | 'background' | 'spell' | 'rule' | 'feat';
  name: string;
  subId?: string;
  source: string;
  label?: string;
}

export function DictyTwisterLink({ type, name, subId, source, label }: Props) {
  let url = '';
  const base = 'https://5e.dickytwister.org';
  const encodedName = encodeURIComponent(name);

  if (type === 'rule') {
    url = `${base}/${name}`;
  } else if (type === 'race') {
    url = `${base}/races.html#${name}_${source}`;
  } else if (type === 'class') {
    if (subId) {
      url = `${base}/classes.html#${name}_${source},state:sub-${subId}-${source}=b1`;
    } else {
      url = `${base}/classes.html#${name}_${source}`;
    }
  } else if (type === 'background') {
    url = `${base}/backgrounds.html#${name}_${source}`;
  } else if (type === 'spell') {
    url = `${base}/spells.html#${name}_${source}`;
  } else if (type === 'feat') {
    url = `${base}/feats.html#${name}_${source}`;
  }

  return (
    <a 
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center justify-center rounded-full bg-stone-100 hover:bg-amber-100 hover:text-amber-700 border border-stone-200 hover:border-amber-400 text-stone-500 transition-all ml-3 shadow-sm hover:shadow ${label ? 'px-2 py-1 text-xs' : 'p-1.5'}`}
      title="在 5etools 上查看"
    >
      <BookOpen size={16} />
      {label && <span className="ml-1 font-sans">{label}</span>}
    </a>
  );
}

export function CustomSpellInput({ choiceId, maxCount = 2, title = "自定义法术输入" }: { choiceId: string, maxCount?: number, title?: string }) {
  const { state, dispatch } = useCharacter();
  const selectedSpells = state.character.traitSelections[choiceId] || [];
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() && selectedSpells.length < maxCount) {
      dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId, selectedIds: [...selectedSpells, inputValue.trim()] } });
      setInputValue('');
    }
  };

  const handleRemove = (index: number) => {
    const newSpells = [...selectedSpells];
    newSpells.splice(index, 1);
    dispatch({ type: 'SET_TRAIT_SELECTION', payload: { choiceId, selectedIds: newSpells } });
  };

  return (
    <div className="mt-4 p-4 bg-white border border-amber-200/50 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <h6 className="font-semibold text-stone-800">{title}</h6>
        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
          已选 {selectedSpells.length}/{maxCount}
        </span>
      </div>
      <div className="text-xs text-stone-500 mb-3 flex items-center">
        你可以在这里手动填写或记录法术。参考Wiki法术列表:
        <DictyTwisterLink type="rule" name="spells.html" source="" label="法术总表" />
      </div>
      
      <div className="flex gap-2 mb-3">
        <input 
          type="text" 
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="如: 火球术"
          disabled={selectedSpells.length >= maxCount}
          className="flex-1 text-sm border border-stone-300 rounded px-3 py-1.5 focus:outline-none focus:border-amber-500 disabled:bg-stone-100"
          onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
        />
        <button 
          onClick={handleAdd}
          disabled={!inputValue.trim() || selectedSpells.length >= maxCount}
          className="px-3 py-1.5 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 flex flex-shrink-0 items-center justify-center"
        >
          <Plus size={16} />添加
        </button>
      </div>

      {selectedSpells.length > 0 && (
        <ul className="space-y-2">
          {selectedSpells.map((spell, i) => (
            <li key={i} className="flex justify-between items-center text-sm bg-stone-50 px-3 py-2 rounded border border-stone-200">
              <span className="text-stone-700">{spell}</span>
              <button onClick={() => handleRemove(i)} className="text-stone-400 hover:text-red-500">
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
