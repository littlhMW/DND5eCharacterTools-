import React, { useState } from 'react';
import { Dices, Trash2 } from 'lucide-react';

interface QuickDiceRollerProps {
  onClose: () => void;
}

export function QuickDiceRoller({ onClose }: QuickDiceRollerProps) {
  const [diceLog, setDiceLog] = useState<{ time: string; result: string; detail: string }[]>([]);
  const [customRoll, setCustomRoll] = useState('');

  const handleRollDice = (sides: number) => {
    const rolled = Math.floor(Math.random() * sides) + 1;
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    setDiceLog((prev) => [{ time, result: String(rolled), detail: `1d${sides}` }, ...prev]);
  };

  const handleCustomRoll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customRoll.trim()) return;

    try {
      const parsed = parseAndRoll(customRoll);
      const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
      setDiceLog((prev) => [{ time, result: parsed.total, detail: parsed.detail }, ...prev]);
      setCustomRoll('');
    } catch (err: any) {
      alert(err.message || '无效的掷骰表达式');
    }
  };

  const parseAndRoll = (expr: string) => {
    // Basic parser for expressions like: 3d10+7-2d4
    const regex = /([+-]?)\s*(\d*)[dD](\d+)|([+-]?)\s*(\d+)/g;
    let match;
    let total = 0;
    let details: string[] = [];

    const cleanedExpr = expr.replace(/\s+/g, '');
    if (!cleanedExpr) throw new Error('Empty expression');
    if (!/^([+-]?(\d+[dD]\d+|\d+))+$/.test(cleanedExpr)) {
      throw new Error('表达式格式不正确，只能包含数字、d 符号和加减号。例如 4d6, 2d8+3');
    }

    let hasRoll = false;
    while ((match = regex.exec(cleanedExpr)) !== null) {
      hasRoll = true;
      const isDice = match[3] !== undefined;

      if (isDice) {
        const sign = (match[1] === '-' ? -1 : 1);
        const count = match[2] ? parseInt(match[2], 10) : 1;
        const sides = parseInt(match[3], 10);

        if (count > 100) throw new Error('单次掷骰数量不能超过100');
        if (sides < 2 || sides > 1000) throw new Error('面数超出范围 (2-1000)');

        let rollTotal = 0;
        let rollResults = [];
        for (let i = 0; i < count; i++) {
          const r = Math.floor(Math.random() * sides) + 1;
          rollTotal += r;
          rollResults.push(r);
        }
        
        total += sign * rollTotal;
        const signStr = details.length > 0 ? (sign === 1 ? ' + ' : ' - ') : (sign === -1 ? '-' : '');
        details.push(`${signStr}[${rollResults.join(',')}]`);
      } else {
        const sign = (match[4] === '-' ? -1 : 1);
        const val = parseInt(match[5], 10);
        total += sign * val;
        const signStr = details.length > 0 ? (sign === 1 ? ' + ' : ' - ') : (sign === -1 ? '-' : '');
        details.push(`${signStr}${val}`);
      }
    }

    if (!hasRoll) throw new Error('未解析到表达式');
    
    return {
      total: String(total),
      detail: `${cleanedExpr} ➔ ${details.join('')}`
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 relative flex flex-col gap-5 animate-in zoom-in-95 duration-200 text-left">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1.5 cursor-pointer font-sans bg-stone-100 hover:bg-stone-200 rounded-full transition-colors border-none"
          title="关闭"
        >
          ✕
        </button>

        <div className="border-b border-stone-200 pb-4">
          <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <Dices className="text-amber-600" size={24} /> 快速骰子
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            点击常用多面骰，或输入如 "4d6"、"310+7" 进行复杂计算。
          </p>
        </div>

        <div className="space-y-4 text-sm">
          {/* Quick Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[4, 6, 8, 10, 12, 20, 100].map((sides) => (
              <button
                key={sides}
                onClick={() => handleRollDice(sides)}
                className="py-2.5 bg-stone-50 hover:bg-amber-50 hover:text-amber-800 border-2 border-stone-100 hover:border-amber-200 text-sm font-semibold rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
              >
                d{sides}
              </button>
            ))}
          </div>

          {/* Custom Roll */}
          <form onSubmit={handleCustomRoll} className="flex gap-2">
            <input 
              type="text" 
              placeholder="自定义表达式，如 2d8+3" 
              value={customRoll}
              onChange={(e) => setCustomRoll(e.target.value)}
              className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm rounded-lg transition-colors cursor-pointer border border-stone-200 active:scale-95"
            >
              掷骰
            </button>
          </form>

          {/* Log */}
          <div className="mt-4">
            <div className="text-[11px] font-semibold text-stone-500 mb-2 flex justify-between items-center">
              <span>投掷历史 (仅限本次)</span>
              {diceLog.length > 0 && (
                <button 
                  onClick={() => setDiceLog([])} 
                  className="text-stone-400 hover:text-red-500 text-[10px] cursor-pointer bg-transparent border-none flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} /> 清空
                </button>
              )}
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs font-mono h-40 overflow-y-auto space-y-2 shadow-inner">
              {diceLog.length === 0 ? (
                <div className="h-full flex items-center justify-center text-stone-400 text-xs">
                  暂无投掷，尝试一下运气。
                </div>
              ) : (
                diceLog.map((log, idx) => (
                  <div key={idx} className="text-stone-700 flex flex-col gap-1 border-b border-stone-100/50 pb-1.5 last:border-0 animate-in slide-in-from-top-2 duration-150">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400 text-[10px]">{log.time}</span>
                      <span className="font-bold text-amber-700 text-sm">{log.result}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 break-words">{log.detail}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm cursor-pointer border-none"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
