import React, { useState, useEffect } from 'react';
import { Type, Settings, Dices, Copy, Check } from 'lucide-react';
import { generateRandomName, isRandomNameEnabled, setRandomNameEnabled, getNameGeneratorRaces } from '../../utils/nameGenerator';
import { races } from '../../data/races';

interface NameGeneratorModalProps {
  onClose: () => void;
}

export function NameGeneratorModal({ onClose }: NameGeneratorModalProps) {
  const [enabled, setEnabled] = useState(false);
  const [selectedRace, setSelectedRace] = useState('任意');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'any'>('any');
  const [generatedName, setGeneratedName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEnabled(isRandomNameEnabled());
  }, []);

  const handleToggle = () => {
    const newVal = !enabled;
    setEnabled(newVal);
    setRandomNameEnabled(newVal);
  };

  const handleGenerate = () => {
    let raceToUse = selectedRace;
    if (selectedRace === '任意') {
      const allRaces = getNameGeneratorRaces();
      raceToUse = allRaces[Math.floor(Math.random() * allRaces.length)];
    }
    
    let isMale = true;
    if (selectedGender === 'female') isMale = false;
    else if (selectedGender === 'any') isMale = Math.random() > 0.5;

    const newName = generateRandomName(raceToUse, isMale);
    setGeneratedName(newName);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!generatedName) return;
    navigator.clipboard.writeText(generatedName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [searchTerm, setSearchTerm] = useState('');
  
  const allRacesRaw = getNameGeneratorRaces();
  const allRacesWithAny = ['任意', ...allRacesRaw];
  
  const filteredRaces = allRacesWithAny.filter(race => 
    race.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative flex flex-col gap-5 animate-in zoom-in-95 duration-200 text-left font-sans">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
          title="关闭"
        >
          ✕
        </button>

        <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100/50 flex items-center justify-center text-amber-600">
              <Type size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-amber-600 leading-none">
                名字生成器
              </h2>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed font-sans">
                根据不同种族和文化背景为您的人物生成符合世界观的名字。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex bg-stone-50 p-3 rounded-lg border border-stone-200 items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-stone-700 font-medium">
               <Settings size={16} className="text-stone-500" />
               在角色详情创建步骤启用「随机起名」按钮
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={enabled} onChange={handleToggle} />
              <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  性别倾向
                </label>
                <div className="flex bg-stone-100 rounded-lg p-1 border border-stone-200">
                  <button
                    onClick={() => setSelectedGender('any')}
                    className={`flex-1 text-sm py-1.5 font-medium rounded-md transition-colors border-none cursor-pointer ${selectedGender === 'any' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700 bg-transparent'}`}
                  >
                    无
                  </button>
                  <button
                    onClick={() => setSelectedGender('male')}
                    className={`flex-1 text-sm py-1.5 font-medium rounded-md transition-colors border-none cursor-pointer ${selectedGender === 'male' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700 bg-transparent'}`}
                  >
                    男性
                  </button>
                  <button
                    onClick={() => setSelectedGender('female')}
                    className={`flex-1 text-sm py-1.5 font-medium rounded-md transition-colors border-none cursor-pointer ${selectedGender === 'female' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700 bg-transparent'}`}
                  >
                    女性
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col items-center">
                 <button
                    onClick={handleGenerate}
                    className="w-full justify-center px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer border-none flex items-center gap-2"
                  >
                    <Dices size={16} /> 随机生成名字
                 </button>

                 {generatedName && (
                   <div className="mt-6 flex flex-col items-center animate-in zoom-in-95 duration-200 bg-amber-50/50 p-4 rounded-lg border border-amber-100 w-full relative">
                      <span className="text-[10px] text-stone-400 font-bold mb-2 absolute top-2 left-2">结果</span>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-serif font-bold text-amber-600 tracking-tight text-center">{generatedName}</span>
                      </div>
                      <button 
                        onClick={handleCopy}
                        className="mt-3 text-stone-400 hover:text-stone-800 p-1.5 rounded-full bg-white border border-stone-200 hover:border-stone-300 transition-colors absolute bottom-2 right-2 cursor-pointer flex items-center gap-1 shadow-sm"
                        title="复制名字"
                      >
                        {copied ? <><Check size={12} className="text-green-600" /><span className="text-[10px] text-green-600 font-medium px-1">已复制</span></> : <><Copy size={12} /></>}
                      </button>
                   </div>
                 )}
              </div>
            </div>

            <div className="w-full md:w-2/3 border-l border-stone-100 pl-0 md:pl-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-semibold text-stone-700">
                  选择背景种族文化 <span className="font-normal text-stone-400 ml-1">({filteredRaces.length})</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索种族..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="px-8 py-1 text-xs border border-stone-200 rounded-md w-40 focus:outline-none focus:border-amber-400 bg-stone-50/50"
                  />
                  <svg className="w-3 h-3 text-stone-400 absolute left-2.5 top-2" xmlns="http://www.w3.org/2005/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="absolute right-2 top-1.5 text-stone-400 hover:text-stone-600 border-none bg-transparent cursor-pointer p-0.5"
                    >
                      <svg className="w-3 h-3" xmlns="http://www.w3.org/2005/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-2 pb-1 scrollbar-thin scrollbar-thumb-stone-200" style={{maxHeight: '340px'}}>
                {filteredRaces.map(race => (
                  <button
                    key={race}
                    onClick={() => setSelectedRace(race)}
                    className={`px-2.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-left truncate flex items-center justify-between ${selectedRace === race ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300'}`}
                    title={race}
                  >
                    <span>{race}</span>
                    {selectedRace === race && <Check size={12} className="text-amber-500 opacity-70" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
