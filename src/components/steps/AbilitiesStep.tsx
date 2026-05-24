import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Ability } from '../../types/dnd';
import { races, getRaceByIdAndSource } from '../../data/races';
import { Dices, ListChecks, Coins, PenTool } from 'lucide-react';

const ABILITIES: { id: Ability, name: string }[] = [
  { id: 'STR', name: '力量 (STR)' }, 
  { id: 'DEX', name: '敏捷 (DEX)' }, 
  { id: 'CON', name: '体质 (CON)' }, 
  { id: 'INT', name: '智力 (INT)' }, 
  { id: 'WIS', name: '感知 (WIS)' }, 
  { id: 'CHA', name: '魅力 (CHA)' }
];

const POINT_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

type Mode = 'roll' | 'standard' | 'pointbuy' | 'manual';

export function AbilitiesStep() {
  const { state, dispatch } = useCharacter();
  const [mode, setMode] = useState<Mode>('manual');

  const selectedRace = getRaceByIdAndSource(state.character.raceId, state.character.raceSource);
  const selectedSubrace = selectedRace?.subraces?.find(sr => sr.id === state.character.subraceId);

  // States for different modes
  const [rolledValues, setRolledValues] = useState<number[]>([]);
  const [rollAssignments, setRollAssignments] = useState<Partial<Record<Ability, number>>>({});
  const [standardAssignments, setStandardAssignments] = useState<Partial<Record<Ability, number>>>({});

  const getBonus = (ab: Ability) => {
    let bonus = 0;
    if (!(selectedRace?.id === 'human' && selectedSubrace?.id === 'human-variant')) {
      selectedRace?.abilityBonuses.forEach(b => {
        if (b.ability === ab) bonus += b.bonus;
      });
    }
    selectedSubrace?.abilityBonuses?.forEach(b => {
      if (b.ability === ab) bonus += b.bonus;
    });
    return bonus;
  };

  const getAsiBonus = (ab: Ability) => {
    let bonus = 0;
    Object.values(state.character.traitSelections).forEach(selections => {
      if (Array.isArray(selections)) {
        selections.forEach(sel => {
          if (sel === `asi-${ab}`) bonus += 1;
        });
      }
    });
    return bonus;
  };

  const updateAbility = (ab: Ability, val: number) => {
    dispatch({
      type: 'SET_ABILITIES',
      payload: { ...state.character.baseAbilities, [ab]: val }
    });
  };

  const unassignIndex = (assignments: Partial<Record<Ability, number>>, idx: number) => {
    const newAss = { ...assignments };
    Object.keys(newAss).forEach(key => {
        if (newAss[key as Ability] === idx) delete newAss[key as Ability];
    });
    return newAss;
  };

  const applyAssignments = (pool: number[], assignments: Partial<Record<Ability, number>>) => {
    const newBase = { ...state.character.baseAbilities };
    Object.entries(assignments).forEach(([ab, idx]) => {
        if (idx !== undefined && idx !== null) {
            newBase[ab as Ability] = pool[idx];
        }
    });
    dispatch({ type: 'SET_ABILITIES', payload: newBase });
  };

  const handleAssignChange = (ab: Ability, idxStr: string, isStandard: boolean) => {
    const pool = isStandard ? STANDARD_ARRAY : rolledValues;
    const currentAssignments = isStandard ? standardAssignments : rollAssignments;
    const setAssignments = isStandard ? setStandardAssignments : setRollAssignments;

    if (idxStr === "") {
        const newAss = { ...currentAssignments };
        delete newAss[ab];
        setAssignments(newAss);
        return;
    }

    const idx = parseInt(idxStr);
    const newAss = unassignIndex(currentAssignments, idx);
    newAss[ab] = idx;
    setAssignments(newAss);
    applyAssignments(pool, newAss);
  };

  const randomAssign = (isStandard: boolean) => {
    const pool = isStandard ? STANDARD_ARRAY : rolledValues;
    if (pool.length === 0) return;
    const setAssignments = isStandard ? setStandardAssignments : setRollAssignments;
    const indices = [0,1,2,3,4,5].sort(() => Math.random() - 0.5);
    const newAss: Record<Ability, number> = {
         STR: indices[0], DEX: indices[1], CON: indices[2],
         INT: indices[3], WIS: indices[4], CHA: indices[5]
    };
    setAssignments(newAss);
    applyAssignments(pool, newAss);
  };

  // Roll Mode Handlers
  const handleRoll = () => {
    const values = [];
    for(let i=0; i<6; i++) {
       const rolls = [
         Math.floor(Math.random()*6)+1,
         Math.floor(Math.random()*6)+1,
         Math.floor(Math.random()*6)+1,
         Math.floor(Math.random()*6)+1
       ];
       rolls.sort();
       values.push(rolls[1]+rolls[2]+rolls[3]);
    }
    setRolledValues(values);
    setRollAssignments({});
  };

  // Point Buy Calculations
  const usedPoints = ABILITIES.reduce((acc, ab) => {
      const val = state.character.baseAbilities[ab.id];
      const cost = POINT_COSTS[val];
      return acc + (cost !== undefined ? cost : 0);
  }, 0);
  const remainingPoints = 27 - usedPoints;

  const resetPointBuy = () => {
    dispatch({ type: 'SET_ABILITIES', payload: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 }});
  };

  const getDisplayBase = (ab: Ability) => {
      if (mode === 'standard') {
          return standardAssignments[ab] !== undefined ? STANDARD_ARRAY[standardAssignments[ab]!] : null;
      }
      if (mode === 'roll') {
          return rollAssignments[ab] !== undefined ? rolledValues[rollAssignments[ab]!] : null;
      }
      return state.character.baseAbilities[ab];
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 items-start">
      
      {/* Sidebar Tabs */}
      <div className="w-full md:w-20 flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 border-b md:border-b-0 md:border-r border-stone-200 md:pr-3 flex-shrink-0">
         {[
           { id: 'roll', label: '掷骰', icon: Dices },
           { id: 'standard', label: '标准', icon: ListChecks },
           { id: 'pointbuy', label: '购点', icon: Coins },
           { id: 'manual', label: '手动', icon: PenTool }
         ].map(tab => {
             const Icon = tab.icon;
             return (
                 <button 
                    key={tab.id}
                    onClick={() => setMode(tab.id as Mode)}
                    className={`px-2 py-2 text-xs text-left rounded-lg font-medium flex items-center justify-center flex-col gap-1 whitespace-nowrap transition-colors ${mode === tab.id ? 'bg-amber-100 text-amber-800' : 'hover:bg-stone-100 text-stone-600'}`}
                 >
                     <Icon size={16} />
                     {tab.label}
                 </button>
             );
         })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-2xl bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
         
         {/* Headers & Controls */}
         <div className="mb-6 border-b border-stone-100 pb-4">
             {mode === 'roll' && (
                 <div>
                     <h3 className="text-2xl font-serif text-stone-800 mb-2">掷骰</h3>
                     <div className="flex items-center gap-4 flex-wrap mb-4">
                         <div className="flex items-center gap-2">
                             <span className="text-sm text-stone-600">公式:</span>
                             <div className="px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-lg font-mono text-sm">4d6dl1</div>
                         </div>
                         <button onClick={handleRoll} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                             掷骰
                         </button>
                     </div>
                     {rolledValues.length > 0 && (
                         <div className="flex items-center gap-4 flex-wrap">
                             <div className="flex gap-2">
                                 <span className="text-stone-500 font-mono text-lg">=</span>
                                 {rolledValues.map((v, i) => (
                                     <span key={i} className="font-mono text-lg font-bold text-stone-700 px-2 py-1 bg-stone-50 border border-stone-200 rounded-md">
                                         [{v}]
                                     </span>
                                 ))}
                             </div>
                             <button onClick={() => randomAssign(false)} className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md text-sm transition">
                                 随机分配
                             </button>
                         </div>
                     )}
                 </div>
             )}

             {mode === 'standard' && (
                 <div>
                     <h3 className="text-2xl font-serif text-stone-800 mb-2">标准数组</h3>
                     <p className="text-stone-600 text-sm mb-4">将这些数值任意分配到你的属性点上：<strong className="font-mono ml-2">15, 14, 13, 12, 10, 8</strong></p>
                     <button onClick={() => randomAssign(true)} className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md text-sm transition">
                         随机分配
                     </button>
                 </div>
             )}

             {mode === 'pointbuy' && (
                 <div>
                     <h3 className="text-2xl font-serif text-stone-800 mb-2">购点</h3>
                     <div className="flex items-center gap-4 mb-4">
                         <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-center w-24">
                             <div className="text-xs text-stone-500 mb-1">总点数</div>
                             <div className="text-lg font-bold text-stone-700">27</div>
                         </div>
                         <div className={`border rounded-lg p-3 text-center w-24 ${remainingPoints >= 0 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                             <div className={`text-xs mb-1 ${remainingPoints >= 0 ? 'text-amber-700' : 'text-red-700'}`}>剩余点数</div>
                             <div className={`text-lg font-bold ${remainingPoints >= 0 ? 'text-amber-800' : 'text-red-800'}`}>{remainingPoints}</div>
                         </div>
                         <button onClick={resetPointBuy} className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md text-sm transition self-end">
                             重置
                         </button>
                     </div>
                 </div>
             )}

             {mode === 'manual' && (
                 <div>
                     <h3 className="text-2xl font-serif text-stone-800 mb-2">手动</h3>
                     <p className="text-stone-600 text-sm">在“基础”列中直接修改你想要的属性值。</p>
                 </div>
             )}
         </div>

         {/* Attributes Table */}
         <div className="overflow-x-auto">
             <table className="w-full text-left min-w-max border-collapse">
                 <thead>
                     <tr className="border-b-2 border-stone-200">
                         <th className="pb-2 pt-2 px-3 font-semibold text-stone-600 w-16"></th>
                         <th className="pb-2 pt-2 px-3 font-semibold text-stone-600 text-center">基础</th>
                         <th className="pb-2 pt-2 px-3 font-semibold text-stone-600 text-center">种族</th>
                         <th className="pb-2 pt-2 px-3 font-semibold text-stone-600 text-center">职业</th>
                         <th className="pb-2 pt-2 px-3 font-semibold text-stone-600 text-center">总计</th>
                         <th className="pb-2 pt-2 px-3 font-semibold text-stone-600 text-center">调整值</th>
                     </tr>
                 </thead>
                 <tbody>
                     {ABILITIES.map(ab => {
                         const displayBase = getDisplayBase(ab.id);
                         const isAssigned = displayBase !== null;
                         const actualVal = isAssigned ? displayBase : 10; // Fallback for calculation
                         const racialBonus = getBonus(ab.id);
                         const classBonus = getAsiBonus(ab.id);
                         const total = actualVal + racialBonus + classBonus;
                         const mod = Math.floor((total - 10) / 2);
                         const modStr = mod >= 0 ? `+${mod}` : `${mod}`;

                         return (
                             <tr key={ab.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                                 <td className="py-3 px-3 font-bold font-serif text-stone-800">{ab.id}</td>
                                 <td className="py-3 px-3">
                                     <div className="flex justify-center items-center h-full">
                                         {mode === 'manual' && (
                                             <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-stone-200 shadow-sm">
                                                 <button onClick={() => updateAbility(ab.id, Math.max(3, actualVal - 1))} className="w-8 h-8 rounded-md bg-stone-50 hover:bg-stone-100 text-stone-600 font-mono">-</button>
                                                 <span className="w-6 text-center font-mono font-medium">{actualVal}</span>
                                                 <button onClick={() => updateAbility(ab.id, Math.min(20, actualVal + 1))} className="w-8 h-8 rounded-md bg-stone-50 hover:bg-stone-100 text-stone-600 font-mono">+</button>
                                             </div>
                                         )}
                                         {mode === 'pointbuy' && (
                                             <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-stone-200 shadow-sm">
                                                 <button 
                                                    onClick={() => updateAbility(ab.id, actualVal - 1)} 
                                                    disabled={actualVal <= 8}
                                                    className="w-8 h-8 rounded-md bg-stone-50 hover:bg-stone-100 text-stone-600 font-mono disabled:opacity-30 disabled:cursor-not-allowed"
                                                 >-</button>
                                                 <span className="w-6 text-center font-mono font-medium">{actualVal}</span>
                                                 <button 
                                                    onClick={() => {
                                                        const costDiff = POINT_COSTS[actualVal + 1] - (POINT_COSTS[actualVal] ?? 0);
                                                        if (remainingPoints >= costDiff) updateAbility(ab.id, actualVal + 1);
                                                    }} 
                                                    disabled={actualVal >= 15 || remainingPoints < (POINT_COSTS[actualVal + 1] - (POINT_COSTS[actualVal] ?? 0))}
                                                    className="w-8 h-8 rounded-md bg-stone-50 hover:bg-stone-100 text-stone-600 font-mono disabled:opacity-30 disabled:cursor-not-allowed"
                                                 >+</button>
                                             </div>
                                         )}
                                         {mode === 'standard' && (
                                             <select 
                                                 value={standardAssignments[ab.id] !== undefined ? standardAssignments[ab.id] : ""}
                                                 onChange={e => handleAssignChange(ab.id, e.target.value, true)}
                                                 className="w-24 p-2 border border-stone-200 rounded-lg bg-white shadow-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                                             >
                                                 <option value="">-</option>
                                                 {STANDARD_ARRAY.map((v, i) => {
                                                     const isUsedByOther = Object.entries(standardAssignments).some(([key, idx]) => key !== ab.id && idx === i);
                                                     if (isUsedByOther) return <option key={i} value={i} disabled>{v}</option>;
                                                     return <option key={i} value={i}>{v}</option>;
                                                 })}
                                             </select>
                                         )}
                                         {mode === 'roll' && (
                                             <select 
                                                 value={rollAssignments[ab.id] !== undefined ? rollAssignments[ab.id] : ""}
                                                 onChange={e => handleAssignChange(ab.id, e.target.value, false)}
                                                 disabled={rolledValues.length === 0}
                                                 className="w-24 p-2 border border-stone-200 rounded-lg bg-white shadow-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:bg-stone-100"
                                             >
                                                 <option value="">-</option>
                                                 {rolledValues.map((v, i) => {
                                                     const isUsedByOther = Object.entries(rollAssignments).some(([key, idx]) => key !== ab.id && idx === i);
                                                     if (isUsedByOther) return <option key={i} value={i} disabled>{v}</option>;
                                                     return <option key={i} value={i}>{v}</option>;
                                                 })}
                                             </select>
                                         )}
                                     </div>
                                 </td>
                                 <td className="py-3 px-3 text-center">
                                     <span className="inline-block px-3 py-1 bg-stone-100 rounded-md font-mono text-stone-500 border border-stone-200">
                                         {racialBonus}
                                     </span>
                                 </td>
                                 <td className="py-3 px-3 text-center">
                                     <span className="inline-block px-3 py-1 bg-blue-50 rounded-md font-mono text-blue-600 border border-blue-200">
                                         {classBonus}
                                     </span>
                                 </td>
                                 <td className="py-3 px-3 text-center font-bold font-serif text-lg text-stone-800">
                                     {!isAssigned && (mode === 'standard' || mode === 'roll') ? '-' : total}
                                 </td>
                                 <td className="py-3 px-3 text-center">
                                     <span className={`inline-block px-3 py-1 font-mono font-bold rounded-lg border ${mod >= 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-stone-100 text-stone-600 border-stone-200'}`}>
                                         {!isAssigned && (mode === 'standard' || mode === 'roll') ? '-' : modStr}
                                     </span>
                                 </td>
                             </tr>
                         );
                     })}
                 </tbody>
             </table>
         </div>

         {/* Point Buy Reference Table */}
         {mode === 'pointbuy' && (
             <div className="mt-8">
                 <h4 className="font-semibold text-stone-800 mb-3 border-b border-stone-100 pb-2">属性值点数花费参考</h4>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                     {Object.entries(POINT_COSTS).map(([val, cost]) => (
                         <div key={val} className="flex justify-between items-center p-2 bg-stone-50 border border-stone-100 rounded-lg">
                             <span className="font-mono font-medium text-stone-700">{val}</span>
                             <span className="text-stone-500">{cost} pt</span>
                         </div>
                     ))}
                 </div>
             </div>
         )}
      </div>
    </div>
  );
}

