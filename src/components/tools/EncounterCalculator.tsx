import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

const XP_THRESHOLDS: Record<number, Record<string, number>> = {
  1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
  2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
  3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
  4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
  5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
  6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
  7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
  11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 }
};

const CR_XP: Record<string, number> = {
  "0": 10,
  "1/8": 25,
  "1/4": 50,
  "1/2": 100,
  "1": 200,
  "2": 450,
  "3": 700,
  "4": 1100,
  "5": 1800,
  "6": 2300,
  "7": 2900,
  "8": 3900,
  "9": 5000,
  "10": 5900,
  "11": 7200,
  "12": 8400,
  "13": 10000,
  "14": 11500,
  "15": 13000,
  "16": 15000,
  "17": 18000,
  "18": 20000,
  "19": 22000,
  "20": 25000
};

const CR_LIST = [
  "0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5",
  "6", "7", "8", "9", "10", "11", "12", "13", "14",
  "15", "16", "17", "18", "19", "20"
];

const getMultiplier = (count: number) => {
  if (count === 1) return 1;
  if (count === 2) return 1.5;
  if (count >= 3 && count <= 6) return 2;
  if (count >= 7 && count <= 10) return 2.5;
  if (count >= 11 && count <= 14) return 3;
  return 4; // 15 or more
};

interface EncounterCalculatorProps {
  onClose: () => void;
}

export function EncounterCalculator({ onClose }: EncounterCalculatorProps) {
  const [pcLevel, setPcLevel] = useState<number | 'all'>('all');
  const [partySize, setPartySize] = useState<number>(4);
  const [difficulty, setDifficulty] = useState<string>("medium");

  const getCellData = (level: number, cr: string) => {
    const ts = XP_THRESHOLDS[level];
    if (!ts) return null;
    
    let minXP = ts[difficulty] * partySize;
    let maxXP = Infinity;
    
    if (difficulty === 'easy') maxXP = ts['medium'] * partySize;
    else if (difficulty === 'medium') maxXP = ts['hard'] * partySize;
    else if (difficulty === 'hard') maxXP = ts['deadly'] * partySize;
    
    // Limits search for counts up to 20
    let validCounts: number[] = [];
    const baseCrXp = CR_XP[cr];
    
    for (let c = 1; c <= 20; c++) {
      const adjXp = Math.floor(c * baseCrXp * getMultiplier(c));
      // For deadly encounters, we don't have a strict upper limit, but it shouldn't get absolutely absurd.
      // E.g. we might cap deadly at 2x the deadly threshold to keep counts reasonable.
      if (difficulty === 'deadly') {
          if (adjXp >= minXP && adjXp < minXP * 2) validCounts.push(c);
      } else {
          if (adjXp >= minXP && adjXp < maxXP) validCounts.push(c);
      }
    }
    
    if (validCounts.length === 0) return '';
    const minC = validCounts[0];
    const maxC = validCounts[validCounts.length - 1];
    return minC === maxC ? `${minC}` : `${minC}-${maxC}`;
  };

  const levelsToRender = pcLevel === 'all' 
    ? Array.from({ length: 20 }, (_, i) => i + 1) 
    : [pcLevel as number];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none z-10"
          title="关闭"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row items-center gap-4 justify-between border-b border-stone-200 pb-4 shrink-0">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-amber-100/50 flex items-center justify-center text-amber-600">
                <Calculator size={16} />
              </div>
              <h2 className="text-xl font-serif font-bold text-amber-600 leading-none">
                5e 遭遇规模计算器
              </h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <span className="text-stone-600">对于</span>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="easy">一个简单的 (Easy)</option>
              <option value="medium">一个中等的 (Medium)</option>
              <option value="hard">一个困难的 (Hard)</option>
              <option value="deadly">一个致命的 (Deadly)</option>
            </select>
            <span className="text-stone-600">遭遇,</span>
            
            <select
              value={partySize}
              onChange={e => setPartySize(Number(e.target.value))}
              className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
            >
               {Array.from({length: 10}, (_, i) => i + 1).map(sz => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
            <span className="text-stone-600">个人物, 等级为:</span>
            
            <select
              value={pcLevel}
              onChange={e => setPcLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">任何级别 (1-20)</option>
              {Array.from({length: 20}, (_, i) => i + 1).map(lv => (
                <option key={lv} value={lv}>{lv} 级</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded border border-stone-200 bg-stone-50/50">
          <table className="w-full text-center border-collapse text-xs md:text-sm whitespace-nowrap">
            <thead className="bg-stone-200/60 text-stone-700 sticky top-0 font-bold z-10 shadow-sm shadow-stone-200/50">
              <tr>
                <th className="py-2.5 px-2 border-r border-stone-200/60 sticky left-0 font-serif bg-stone-200/90 z-20 w-20">PC等级</th>
                {CR_LIST.map(cr => (
                  <th key={cr} className="py-2.5 px-2 font-mono min-w-[36px] border-b border-stone-200/40">
                    <span className="block text-[8px] text-stone-500 font-sans tracking-wide">CR</span>
                    {cr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {levelsToRender.map(lv => (
                <tr key={lv} className="border-b border-stone-200/60 hover:bg-white transition-colors even:bg-stone-100/30">
                  <td className="py-2 px-2 font-bold text-stone-800 border-r border-stone-200/60 sticky left-0 bg-inherit font-mono shadow-[1px_0_2px_rgba(0,0,0,0.03)] z-10">
                    {lv}
                  </td>
                  {CR_LIST.map(cr => {
                    const countRange = getCellData(lv, cr);
                    return (
                      <td key={cr} className="py-2 px-1 text-stone-600 px-0.5">
                        <span className={countRange ? "inline-block px-1.5 py-0.5 bg-white border border-stone-200 rounded font-mono shadow-sm text-amber-800 font-bold min-w-[28px]" : ""}>
                          {countRange}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="text-center text-[10px] text-stone-400">
           注: 推荐怪物的数量上限为20，数量跨度基于《地下城主指南》的经验阈值与怪物群落经验系数(1倍至4倍)。
        </div>
      </div>
    </div>
  );
}
