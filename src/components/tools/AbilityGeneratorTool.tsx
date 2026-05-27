import React, { useState, useEffect } from 'react';
import { Ability, Race, DndClass } from '../../types/dnd';
import { races } from '../../data/races';
import { classes } from '../../data/classes';
import { isSourceEnabled } from '../../utils/expansionHelper';
import { getAvailableRaces } from '../../utils/raceHelper';
import { Dices, ListChecks, Coins, PenTool, RefreshCw, Star, Info } from 'lucide-react';

const ABILITIES: { id: Ability; label: string; name: string; desc: string }[] = [
  { id: 'STR', label: '力量', name: 'STR', desc: '影响近战攻击、负重、运动。' },
  { id: 'DEX', label: '敏捷', name: 'DEX', desc: '影响远程攻击、先攻、护甲等级、手艺。' },
  { id: 'CON', label: '体质', name: 'CON', desc: '影响最大生命值上限、专注护甲、坚韧。' },
  { id: 'INT', label: '智力', name: 'INT', desc: '影响奥秘/历史学识、法师施法。' },
  { id: 'WIS', label: '感知', name: 'WIS', desc: '影响洞察、察觉、牧师/德鲁伊施法。' },
  { id: 'CHA', label: '魅力', name: 'CHA', desc: '影响说服、欺诈、威吓、术士/邪术师施法。' }
];

const POINT_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

type GeneratorMode = 'standard' | 'pointbuy' | 'roll' | 'manual';

interface AbilityGeneratorToolProps {
  onClose?: () => void;
}

export function AbilityGeneratorTool({ onClose }: AbilityGeneratorToolProps) {
  const [mode, setMode] = useState<GeneratorMode>('pointbuy');

  // Race & Class selection preview states
  const [selectedRaceId, setSelectedRaceId] = useState<string>('');
  const [selectedSubraceId, setSelectedSubraceId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  // Filtered lists of races and classes based on active expansions
  const enabledRaces = getAvailableRaces();

  const enabledClasses = classes.filter(c => isSourceEnabled(c.source || 'phb', 'classes'));

  // Selected Race details
  const activeRace = enabledRaces.find(r => r.id === selectedRaceId);
  const activeSubrace = activeRace?.subraces?.find(s => s.id === selectedSubraceId);
  const activeClass = enabledClasses.find(c => c.id === selectedClassId);

  // Ability Scores Core State
  const [baseAbilities, setBaseAbilities] = useState<Record<Ability, number>>({
    STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10
  });

  // Mode assignment states
  const [standardAssignments, setStandardAssignments] = useState<Partial<Record<Ability, number>>>({});
  const [rolledPool, setRolledPool] = useState<{ total: number; detail: number[] }[]>([]);
  const [rollAssignments, setRollAssignments] = useState<Partial<Record<Ability, number>>>({});

  // When changing mode, reset base abilities appropriately to reasonable starting values
  useEffect(() => {
    if (mode === 'pointbuy') {
      setBaseAbilities({ STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 });
    } else if (mode === 'standard') {
      // Clear assignments
      setStandardAssignments({});
      setBaseAbilities({ STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 });
    } else if (mode === 'roll') {
      setRollAssignments({});
      setBaseAbilities({ STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 });
    } else {
      setBaseAbilities({ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 });
    }
  }, [mode]);

  // Point Buy budget calc
  const usedPoints = ABILITIES.reduce((sum, ab) => {
    const val = baseAbilities[ab.id];
    return sum + (POINT_COSTS[val] || 0);
  }, 0);
  const remainingPoints = 27 - usedPoints;

  // Race Ability Modifier Calculation
  const getRaceBonusValue = (ab: Ability): number => {
    let bonus = 0;
    // Check main race
    if (activeRace?.abilityBonuses) {
      activeRace.abilityBonuses.forEach(b => {
        if (b.ability === ab) bonus += b.bonus;
      });
    }
    // Check subrace
    if (activeSubrace?.abilityBonuses) {
      activeSubrace.abilityBonuses.forEach(b => {
        if (b.ability === ab) bonus += b.bonus;
      });
    }
    return bonus;
  };

  const getAbilityTotal = (ab: Ability): number => {
    let base = 8;
    if (mode === 'standard') {
      const idx = standardAssignments[ab];
      base = idx !== undefined ? STANDARD_ARRAY[idx] : 8;
    } else if (mode === 'roll') {
      const idx = rollAssignments[ab];
      base = idx !== undefined && rolledPool[idx] ? rolledPool[idx].total : 8;
    } else {
      base = baseAbilities[ab];
    }
    return base + getRaceBonusValue(ab);
  };

  // Set single manual ability score
  const updateManualAbilityScore = (ab: Ability, score: number) => {
    setBaseAbilities(prev => ({
      ...prev,
      [ab]: score
    }));
  };

  // Roll standard 4d6 drop lowest 6 times
  const trigger4d6Rolling = () => {
    const pool = [];
    for (let i = 0; i < 6; i++) {
      const rolls = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ];
      const sorted = [...rolls].sort((a, b) => a - b);
      // Drop lowest, sum top 3
      const sum = sorted[1] + sorted[2] + sorted[3];
      pool.push({ total: sum, detail: rolls });
    }
    setRolledPool(pool);
    setRollAssignments({});
  };

  // Auto assign standard array / rolled values
  const triggerAutoAssign = (isStandard: boolean) => {
    const indices = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
    const newAssignments: Record<Ability, number> = {
      STR: indices[0],
      DEX: indices[1],
      CON: indices[2],
      INT: indices[3],
      WIS: indices[4],
      CHA: indices[5]
    };
    if (isStandard) {
      setStandardAssignments(newAssignments);
    } else {
      if (rolledPool.length === 0) trigger4d6Rolling();
      setRollAssignments(newAssignments);
    }
  };

  // Handle standard dropdown assignments
  const handleAssignChange = (ab: Ability, idxStr: string, isStandard: boolean) => {
    const assignments = isStandard ? standardAssignments : rollAssignments;
    const setAssignments = isStandard ? setStandardAssignments : setRollAssignments;

    if (idxStr === '') {
      const updated = { ...assignments };
      delete updated[ab];
      setAssignments(updated);
      return;
    }

    const targetIdx = parseInt(idxStr);
    const updated = { ...assignments };

    // If another ability used this index, swap or unassign them
    Object.keys(updated).forEach(k => {
      const abilityKey = k as Ability;
      if (updated[abilityKey] === targetIdx) {
        delete updated[abilityKey];
      }
    });

    updated[ab] = targetIdx;
    setAssignments(updated);
  };

  // Helper for modifiers
  const getModifierStr = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  // Reset standard attributes state
  const resetPointBuyValues = () => {
    setBaseAbilities({ STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 });
  };

  // Group classes by source / simple alphabet
  const standardClasses = enabledClasses;

  return (
    <div className="flex flex-col gap-5 text-stone-800">
      
      {/* Race and Class Option Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 bg-stone-50 border border-stone-200/80 rounded-xl p-4">
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
            1. 选择种族 (查看加值)
          </label>
          <select
            value={selectedRaceId}
            onChange={(e) => {
              setSelectedRaceId(e.target.value);
              setSelectedSubraceId('');
            }}
            className="w-full text-xs font-serif p-2.5 rounded-lg border border-stone-200 bg-white text-stone-700 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="">-- 无种族加值 --</option>
            {enabledRaces
              .filter(r => r.name && !r.name.includes('占位'))
              .map(raceList => (
                <option key={raceList.id} value={raceList.id}>
                  {raceList.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
            精细子种族 (若有)
          </label>
          <select
            value={selectedSubraceId}
            onChange={(e) => setSelectedSubraceId(e.target.value)}
            disabled={!activeRace?.subraces || activeRace.subraces.length === 0}
            className="w-full text-xs font-serif p-2.5 rounded-lg border border-stone-200 bg-white text-stone-700 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-40 disabled:bg-stone-100 cursor-pointer"
          >
            <option value="">-- 无子种族 --</option>
            {activeRace?.subraces?.map(sub => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
            2. 选择职业 (查看高价值主属性)
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full text-xs font-serif p-2.5 rounded-lg border border-stone-200 bg-white text-stone-700 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="">-- 不标出核心属性 --</option>
            {standardClasses.map(clsList => (
              <option key={clsList.id} value={clsList.id}>
                {clsList.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Methods Tab bar */}
      <div className="flex border-b border-stone-200">
        {[
          { id: 'pointbuy', label: '属性购点', desc: '分配27点预算', icon: Coins },
          { id: 'standard', label: '标准阵列', desc: '分配15至8固定数组', icon: ListChecks },
          { id: 'roll', label: '4D6掷骰', desc: '掷取随机池再分配', icon: Dices },
          { id: 'manual', label: '纯手动自定义', desc: '自由设定3至20分值', icon: PenTool }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isSelected = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as GeneratorMode)}
              className={`flex-1 pb-3 pt-1 text-center font-serif flex flex-col items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent hover:text-stone-900 text-stone-500 hover:border-stone-300'
              }`}
            >
              <TabIcon size={18} className={isSelected ? 'text-amber-700' : 'text-stone-400'} />
              <div className="flex flex-col items-center">
                <span className="text-xs font-extrabold tracking-wide">{tab.label}</span>
                <span className="text-[9.5px] scale-95 origin-center font-sans opacity-70 mt-0.5 hidden sm:inline">
                  {tab.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Method Config Specific controls content */}
      <div className="p-4 bg-amber-50/20 border border-stone-200/60 rounded-xl">
        {mode === 'pointbuy' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-850">27点属性购买方案</h4>
              <p className="text-stone-500 mt-1">每个核心基底最低 8（花费 0 点），最高 15（花费 9 点）。</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3.5 py-2 bg-stone-100 rounded-lg text-center shadow-inner">
                <span className="block text-[10px] text-stone-500 font-bold uppercase">总预算</span>
                <span className="font-mono text-base font-extrabold text-stone-800">27</span>
              </div>
              <div
                className={`px-3.5 py-2 rounded-lg text-center shadow-sm border ${
                  remainingPoints >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-250'
                }`}
              >
                <span className={`block text-[10px] uppercase font-bold ${remainingPoints >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  剩余
                </span>
                <span className={`font-mono text-base font-extrabold ${remainingPoints >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {remainingPoints}
                </span>
              </div>
              <button
                onClick={resetPointBuyValues}
                className="px-3 py-2 bg-stone-200 hover:bg-stone-300 rounded font-serif text-stone-700 hover:text-stone-900 transition font-bold"
              >
                重置点数
              </button>
            </div>
          </div>
        )}

        {mode === 'standard' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-850">标准数组任意分配</h4>
              <p className="text-stone-500 mt-1">
                将可用预置分数分配到各项：
                <strong className="font-mono text-amber-800 text-sm bg-amber-100/60 px-1.5 py-0.5 rounded ml-1">
                  15, 14, 13, 12, 10, 8
                </strong>
              </p>
            </div>
            <button
              onClick={() => triggerAutoAssign(true)}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-serif text-xs transition font-bold self-end shadow-sm"
            >
              一键随机分配
            </button>
          </div>
        )}

        {mode === 'roll' && (
          <div className="space-y-3.5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-850">4d6 移除最低值 (6次掷骰决定)</h4>
                <p className="text-stone-500 mt-1">
                  每次投掷4个d6骰子，移除并忽略其中最小面数值，将其余3颗面数总合作为属性数值预备。
                </p>
              </div>
              <div className="flex items-center gap-2 self-end">
                <button
                  onClick={trigger4d6Rolling}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-serif text-xs transition font-bold shadow-sm flex items-center gap-1.5"
                >
                  <RefreshCw size={12} />
                  开始掷骰
                </button>
                <button
                  onClick={() => triggerAutoAssign(false)}
                  disabled={rolledPool.length === 0}
                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded font-serif text-xs transition font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  自动分配池
                </button>
              </div>
            </div>

            {/* Simulated Roll Results */}
            {rolledPool.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-stone-100 border border-stone-200 p-3 rounded-lg">
                {rolledPool.map((p, idx) => (
                  <div key={idx} className="bg-white rounded p-1.5 text-center border border-stone-200 shadow-sm">
                    <span className="block text-[9px] text-stone-400 font-bold">第 {idx + 1} 组</span>
                    <span className="font-mono text-sm font-black text-indigo-700 block my-0.5">{p.total}</span>
                    <span className="text-[8.5px] text-stone-400 font-mono">
                      ({p.detail.join(',')})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-stone-400 border border-dashed border-stone-300 rounded-lg font-serif">
                点按右方「开始掷骰」按钮，生成你的 D&D 传奇属性池！
              </div>
            )}
          </div>
        )}

        {mode === 'manual' && (
          <div>
            <h4 className="font-serif font-bold text-sm text-stone-850">自定义及手动输入模式</h4>
            <p className="text-stone-500 mt-1 text-xs">
              无规则约束形式。该模式直接编辑基础原始分，范围取值 3 ~ 20。适合规则房特色玩法或自由设定。
            </p>
          </div>
        )}
      </div>

      {/* Main core attributes table table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[380px] sm:min-w-max">
          <thead>
            <tr className="border-b-2 border-stone-200 text-xs font-bold text-stone-500 tracking-wider">
              <th className="pb-2.5 pt-1 px-3 w-28">能力属性</th>
              <th className="pb-2.5 pt-1 px-3 text-center w-36">基础分值</th>
              <th className="pb-2.5 pt-1 px-3 text-center w-24">种族加值</th>
              <th className="pb-2.5 pt-1 px-3 text-center w-24">总计</th>
              <th className="pb-2.5 pt-1 px-3 text-center w-24">修正值</th>
              <th className="pb-2.5 pt-1 px-2 text-right">属性定位与描述</th>
            </tr>
          </thead>
          <tbody>
            {ABILITIES.map(ab => {
              const raceBonus = getRaceBonusValue(ab.id);
              const total = getAbilityTotal(ab.id);
              const modStr = getModifierStr(total);

              // Check if selected class recommends this ability
              const isClassPrimary = activeClass?.primaryAbility.includes(ab.id);

              return (
                <tr
                  key={ab.id}
                  className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors py-3"
                >
                  {/* Name */}
                  <td className="py-3 px-3 font-serif">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-stone-900 text-sm">{ab.label}</span>
                      <span className="font-mono text-[10.5px] text-stone-400 font-bold">({ab.name})</span>
                      {isClassPrimary && (
                        <span
                          title={`${activeClass?.name}的核心主属性`}
                          className="text-amber-500 cursor-help"
                        >
                          <Star size={13} fill="currentColor" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Base score edit selectors */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex justify-center items-center">
                      
                      {mode === 'manual' && (
                        <div className="flex items-center gap-1 bg-white border border-stone-200 shadow-sm rounded-lg p-0.5">
                          <button
                            onClick={() => updateManualAbilityScore(ab.id, Math.max(3, baseAbilities[ab.id] - 1))}
                            className="w-7 h-7 flex items-center justify-center font-bold font-mono bg-stone-50 hover:bg-stone-200 text-stone-600 rounded transition border-none cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-stone-850 text-xs">
                            {baseAbilities[ab.id]}
                          </span>
                          <button
                            onClick={() => updateManualAbilityScore(ab.id, Math.min(20, baseAbilities[ab.id] + 1))}
                            className="w-7 h-7 flex items-center justify-center font-bold font-mono bg-stone-50 hover:bg-stone-200 text-stone-600 rounded transition border-none cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      )}

                      {mode === 'pointbuy' && (
                        <div className="flex items-center gap-1 bg-white border border-stone-200 shadow-sm rounded-lg p-0.5">
                          <button
                            disabled={baseAbilities[ab.id] <= 8}
                            onClick={() => updateManualAbilityScore(ab.id, baseAbilities[ab.id] - 1)}
                            className="w-7 h-7 flex items-center justify-center font-bold font-mono bg-stone-50 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-50 text-stone-600 rounded transition border-none cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-stone-850 text-xs">
                            {baseAbilities[ab.id]}
                          </span>
                          <button
                            disabled={
                              baseAbilities[ab.id] >= 15 ||
                              remainingPoints < (POINT_COSTS[baseAbilities[ab.id] + 1] - POINT_COSTS[baseAbilities[ab.id]])
                            }
                            onClick={() => {
                              const costDiff = POINT_COSTS[baseAbilities[ab.id] + 1] - POINT_COSTS[baseAbilities[ab.id]];
                              updateManualAbilityScore(ab.id, baseAbilities[ab.id] + 1);
                            }}
                            className="w-7 h-7 flex items-center justify-center font-bold font-mono bg-stone-50 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-50 text-stone-600 rounded transition border-none cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      )}

                      {mode === 'standard' && (
                        <select
                          value={standardAssignments[ab.id] !== undefined ? standardAssignments[ab.id] : ''}
                          onChange={(e) => handleAssignChange(ab.id, e.target.value, true)}
                          className="w-20 sm:w-32 text-xs text-center font-mono p-1 sm:p-1.5 border border-stone-200 rounded-lg bg-white shadow-sm font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                        >
                          <option value="">- 请分配 -</option>
                          {STANDARD_ARRAY.map((v, i) => {
                            const isAssignedToOther = Object.entries(standardAssignments).some(
                              ([key, idx]) => key !== ab.id && idx === i
                            );
                            return (
                              <option key={i} value={i} disabled={isAssignedToOther}>
                                {v} {isAssignedToOther ? ' (已分配)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      )}

                      {mode === 'roll' && (
                        <select
                          disabled={rolledPool.length === 0}
                          value={rollAssignments[ab.id] !== undefined ? rollAssignments[ab.id] : ''}
                          onChange={(e) => handleAssignChange(ab.id, e.target.value, false)}
                          className="w-20 sm:w-32 text-xs text-center font-mono p-1 sm:p-1.5 border border-stone-200 rounded-lg bg-white shadow-sm font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:bg-stone-50 disabled:opacity-50 cursor-pointer"
                        >
                          <option value="">- 请分配 -</option>
                          {rolledPool.map((p, i) => {
                            const isAssignedToOther = Object.entries(rollAssignments).some(
                              ([key, idx]) => key !== ab.id && idx === i
                            );
                            return (
                              <option key={i} value={i} disabled={isAssignedToOther}>
                                {p.total} {isAssignedToOther ? ' (已分配)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      )}

                    </div>
                  </td>

                  {/* Racial bonuses modifier */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-mono text-xs font-bold ${
                        raceBonus > 0
                          ? 'bg-emerald-150 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {raceBonus > 0 ? `+${raceBonus}` : '0'}
                    </span>
                  </td>

                  {/* Total final scores */}
                  <td className="py-3 px-3 text-center">
                    <span className="font-mono text-base font-black text-stone-900">
                      {total}
                    </span>
                  </td>

                  {/* Stat Modifier sign */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg font-mono font-black border text-xs min-w-[34px] ${
                        parseInt(modStr) > 0
                          ? 'bg-amber-50/55 text-amber-800 border-amber-200'
                          : parseInt(modStr) < 0
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-stone-50 text-stone-500 border-stone-200'
                      }`}
                    >
                      {modStr}
                    </span>
                  </td>

                  {/* Ability descriptions info */}
                  <td className="py-3 px-2 text-right">
                    <span className="text-[10px] sm:text-xs text-stone-450 text-right leading-relaxed block">
                      {ab.desc}
                    </span>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Under pricing table reference for Point Buy only */}
      {mode === 'pointbuy' && (
        <div className="pt-2 border-t border-stone-150 text-xs">
          <div className="flex items-center gap-1.5 text-stone-550 mb-2 font-bold select-none">
            <Info size={13} className="text-amber-600" />
            <span>属性购点规则参考 (自底分8购买)：</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {Object.entries(POINT_COSTS).map(([val, cost]) => (
              <div key={val} className="flex justify-between items-center px-2 py-1 bg-stone-50 rounded border border-stone-150/50">
                <span className="font-mono text-stone-600 font-bold">{val}分</span>
                <span className="font-mono text-amber-700 font-extrabold">{cost}点</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Character Profile Playstyle analysis block */}
      <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
        <h4 className="font-serif font-bold text-stone-700">⚔️ 属性构成及职业倾向评估</h4>
        <p className="text-stone-500 leading-relaxed">
          {(() => {
            const scores: { ab: Ability; score: number }[] = ABILITIES.map(ab => ({
              ab: ab.id,
              score: getAbilityTotal(ab.id)
            }));
            const sorted = [...scores].sort((a, b) => b.score - a.score);
            const top2 = [sorted[0].ab, sorted[1].ab];

            let evaluation = '该配置具有均衡稳定的属性流。';
            if (top2.includes('STR') && top2.includes('CON')) {
              evaluation = '💪 近战蛮勇或战士倾向：极高的力量与体质，使你在冲锋陷阵、抗线吸引火力方面所向披靡。主手重武狂战士的绝佳底子。';
            } else if (top2.includes('DEX') && top2.includes('CON')) {
              evaluation = '🏹 猎手游侠或射手倾向：敏捷与体质拉满，不仅保障了无懈可击的护甲加成，也在保持远程射击和意志专注等判定上坚韧无比。';
            } else if (top2.includes('DEX') && top2.includes('INT')) {
              evaluation = '💼 游荡者诡术或法术游侠倾向：身手极其敏捷、心智绝顶聪明，在解除陷阱、窃取奥秘或辅助戏法上有天然神速优势。';
            } else if (top2.includes('INT') && top2.includes('CON')) {
              evaluation = '🔮 战法师或古典学派法师：既能维持极高的施法智商，高体质也有条不紊地保护你在枪林弹雨下不被打断法术维持判定。';
            } else if (top2.includes('WIS') && top2.includes('CON')) {
              evaluation = '☀️ 虔诚牧师或林野德鲁伊：优秀的感知能让你洞察天意与人言，极高体力维持重甲或野性变身的稳固抗打击。';
            } else if (top2.includes('CHA') && top2.includes('CON')) {
              evaluation = '🔥 纯种术士、邪术师或帕拉丁：魅力是施展超凡血脉法术与展现领袖气质的源泉，坚韧的体质守卫着神秘禁锢专注。';
            } else if (top2.includes('DEX') && top2.includes('WIS')) {
              evaluation = '🧘 武僧或潜行斥候倾向：心能感知风声鸟语，神速闪避如鬼魅。敏捷跟感知双高是你化危为安的无形气功防御。';
            } else if (top2.includes('STR') && top2.includes('DEX')) {
              evaluation = '🛡️ 十八般兵器格斗大师：物理搏击素质顶级，无论是重装大剑猛砸，还是短兵滑步快打，都有卓越的熟练基础。';
            } else if (top2.includes('STR') && top2.includes('CHA')) {
              evaluation = '🔱 圣武士誓言执念：力量开道，豪迈领导力照拂万方，让你的誓言化作斩击在战场中绽裂灿烂圣光。';
            }

            return (
              <>
                <span className="font-extrabold text-stone-800">当前最高核心能力为: </span>
                <span className="text-amber-800 font-mono font-black uppercase">
                  {ABILITIES.find(a => a.id === sorted[0].ab)?.label} ({sorted[0].score})
                </span>
                <span> 与 </span>
                <span className="text-amber-800 font-mono font-black uppercase bg-amber-100/50 px-1 py-0.5 rounded">
                  {ABILITIES.find(a => a.id === sorted[1].ab)?.label} ({sorted[1].score})
                </span>
                。
                <span className="block mt-1 bg-white p-2.5 rounded-lg border border-stone-200 text-stone-600">
                  {evaluation}
                </span>
              </>
            );
          })()}
        </p>
      </div>

      {/* Cancel Close and Confirm Buttons */}
      {onClose && (
        <div className="border-t border-stone-200 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
          >
            返回工具箱
          </button>
        </div>
      )}

    </div>
  );
}
