import React, { useState, useEffect } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Book, Shield, Scroll, Swords, Github, ExternalLink, Info, Wand2, User, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { classes } from '../data/classes';
import { races, getRaceByIdAndSource } from '../data/races';
import { backgrounds } from '../data/backgrounds';
import { getAIConfig, saveAIConfig, PROVIDERS } from '../utils/aiHelper';
import { EXPANSIONS, getActiveExpansions, saveActiveExpansions, ExpansionBook, getExpansionSettings, saveExpansionSettings, BookSettings, isSourceEnabled } from '../utils/expansionHelper';
import { generateXgeBackstory } from '../utils/xgeLifeGenerator';

export function LandingPage() {
  const { dispatch } = useCharacter();
  const [savedChars, setSavedChars] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // States for fast generation & AI Oracle
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const [aiConfig, setAiConfig] = useState(() => getAIConfig());
  
  // Independent tool states for toolbox list dropdown & modals
  const [toolboxOpen, setToolboxOpen] = useState(false);
  const [openDiceModal, setOpenDiceModal] = useState(false);
  const [openPointBuyModal, setOpenPointBuyModal] = useState(false);
  const [openAiModal, setOpenAiModal] = useState(false);
  const [openXgeModal, setOpenXgeModal] = useState(false);
  const [openExpModal, setOpenExpModal] = useState(false);
  const [activeExpansions, setActiveExpansions] = useState<string[]>(() => getActiveExpansions());
  const [expansionSettings, setExpansionSettings] = useState<Record<string, BookSettings>>(() => getExpansionSettings());
  const [xgePreviewBg, setXgePreviewBg] = useState('acolyte');
  const [xgePreviewText, setXgePreviewText] = useState('');

  const [diceLog, setDiceLog] = useState<{ time: string, result: string }[]>([]);

  const [importString, setImportString] = useState('');
  const [showImportInput, setShowImportInput] = useState(false);
  const [expMsg, setExpMsg] = useState({ type: '', text: '' });

  const handleExportConfig = () => {
    const configStr = JSON.stringify(expansionSettings);
    navigator.clipboard.writeText(configStr)
      .then(() => {
        setExpMsg({ type: 'success', text: '✅ 已复制配置到剪贴板！' });
        setTimeout(() => setExpMsg({ type: '', text: '' }), 4000);
      })
      .catch(() => {
        setImportString(configStr);
        setShowImportInput(true);
        setExpMsg({ type: 'success', text: '📋 自动复制失败，已填入输入框，请手动复制。' });
      });
  };

  const handleImportConfig = () => {
    if (!importString.trim()) {
      setExpMsg({ type: 'error', text: '❌ 导入内容不能为空！' });
      return;
    }
    try {
      const parsed = JSON.parse(importString.trim());
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('格式必须为 JSON 对象');
      }
      
      const keys = Object.keys(parsed);
      if (keys.length === 0) {
        throw new Error('配置对象为空');
      }
      
      for (const k of keys) {
        const val = parsed[k];
        if (typeof val !== 'object' || val === null || val.enabled === undefined) {
          throw new Error(`扩展 [${k}] 格式不符`);
        }
      }
      
      setExpansionSettings(parsed);
      saveExpansionSettings(parsed);
      setActiveExpansions(getActiveExpansions());
      setImportString('');
      setShowImportInput(false);
      setExpMsg({ type: 'success', text: '🎉 成功导入并应用扩展配置！' });
      setTimeout(() => setExpMsg({ type: '', text: '' }), 4000);
    } catch (e: any) {
      setExpMsg({ type: 'error', text: `❌ 导入失败：${e.message || '无效 JSON'}` });
    }
  };

  const handleRollDice = (sides: number) => {
    const roll = Math.floor(Math.random() * sides) + 1;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setDiceLog((prev) => [
      { time: timeStr, result: ` 投骰 d${sides}: 🎲 结果 [ ${roll} ]` },
      ...prev
    ].slice(0, 15));
  };

  const handleBookMasterToggle = (expId: string, checked: boolean) => {
    const current = expansionSettings[expId] || { enabled: false, races: false, classes: false, backgrounds: false, other: false };
    const updated = {
      ...current,
      enabled: checked,
      races: checked ? true : current.races,
      classes: checked ? true : current.classes,
      backgrounds: checked ? true : current.backgrounds,
      other: checked ? true : current.other,
    };
    const newSettings = {
      ...expansionSettings,
      [expId]: updated
    };
    setExpansionSettings(newSettings);
    saveExpansionSettings(newSettings);
    setActiveExpansions(getActiveExpansions());
  };

  const handleCategoryToggle = (expId: string, category: 'races' | 'classes' | 'backgrounds' | 'other', checked: boolean) => {
    const current = expansionSettings[expId] || { enabled: false, races: false, classes: false, backgrounds: false, other: false };
    const updated = {
      ...current,
      [category]: checked
    };
    if (checked) {
      updated.enabled = true;
    }
    const newSettings = {
      ...expansionSettings,
      [expId]: updated
    };
    setExpansionSettings(newSettings);
    saveExpansionSettings(newSettings);
    setActiveExpansions(getActiveExpansions());
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dndChars');
      if (saved) {
        const parsed = JSON.parse(saved);
        let updated = false;
        const mapped = parsed.map((char: any, i: number) => {
          if (!char.id) {
            char.id = crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
            updated = true;
          }
          return char;
        });
        if (updated) {
          localStorage.setItem('dndChars', JSON.stringify(mapped));
        }
        setSavedChars(mapped);
      }
    } catch(e) {}
  }, []);

  const handleStartCreation = () => {
    dispatch({ type: 'SET_VIEW', payload: 'wizard' });
  };

  // Save changes to AI config
  const handleAiConfigChange = (key: string, value: any) => {
    const updated = saveAIConfig({ [key]: value });
    setAiConfig(updated);
  };

  // Preset transition for choosing AI provider
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const providerId = e.target.value;
    const providerObj = PROVIDERS.find(p => p.id === providerId);
    if (providerObj) {
      const updated = saveAIConfig({
        provider: providerId,
        apiBaseUrl: providerObj.defaultBaseUrl,
        model: providerObj.defaultModel
      });
      setAiConfig(updated);
    } else {
      handleAiConfigChange('provider', providerId);
    }
  };

  // Generate starting adventurers
  const generateRandomCharacter = () => {
    if (races.length === 0 || classes.length === 0) return;

    const validRaces = races.map(r => {
      const validAlts = r.alternatives?.filter(alt => isSourceEnabled(alt.source || 'phb', 'races'));
      if (validAlts && validAlts.length > 0) {
        const alt = validAlts[Math.floor(Math.random() * validAlts.length)];
        return { ...alt, subraces: r.subraces };
      }
      if (isSourceEnabled(r.source || 'phb', 'races')) return r;
      return null;
    }).filter(Boolean);
    const validClasses = classes.filter(c => isSourceEnabled(c.source || 'phb', 'classes'));
    const validBackgrounds = backgrounds.filter(b => isSourceEnabled(b.source || 'phb', 'backgrounds'));

    if (validRaces.length === 0 || validClasses.length === 0) return;

    // 1. Pick random race
    const randomRace = validRaces[Math.floor(Math.random() * validRaces.length)];
    let randomSubraceId = '';
    if (randomRace.subraces && randomRace.subraces.length > 0) {
      const validSubraces = randomRace.subraces.filter(sr => isSourceEnabled(sr.source || randomRace.source || 'phb', 'races'));
      if (validSubraces.length > 0) {
        const randomSub = validSubraces[Math.floor(Math.random() * validSubraces.length)];
        randomSubraceId = randomSub.id;
      }
    }
    
    // 2. Pick random class
    const randomClass = validClasses[Math.floor(Math.random() * validClasses.length)];
    let randomSubclassId = '';
    if (randomClass.subclasses && randomClass.subclasses.length > 0) {
      const validSubclasses = randomClass.subclasses.filter(sc => isSourceEnabled(sc.source || randomClass.source || 'phb', 'classes'));
      if (validSubclasses.length > 0) {
        const randomSubclass = validSubclasses[Math.floor(Math.random() * validSubclasses.length)];
        randomSubclassId = randomSubclass.id;
      }
    }
    
    // 3. Shuffled standard array
    const stdArray = [15, 14, 13, 12, 10, 8];
    for (let i = stdArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = stdArray[i];
      stdArray[i] = stdArray[j];
      stdArray[j] = temp;
    }
    
    const abilities = {
      STR: stdArray[0],
      DEX: stdArray[1],
      CON: stdArray[2],
      INT: stdArray[3],
      WIS: stdArray[4],
      CHA: stdArray[5]
    };

    // 4. Pick random alignment
    const ALIGNMENTS = [
      '守序善良', '中立善良', '混乱善良',
      '守序中立', '绝对中立', '混乱中立',
      '守序邪恶', '中立邪恶', '混乱邪恶'
    ];
    const randomAlignment = ALIGNMENTS[Math.floor(Math.random() * ALIGNMENTS.length)];

    // 5. Pick random background
    let randomBackgroundId = '';
    if (validBackgrounds && validBackgrounds.length > 0) {
      const randomBg = validBackgrounds[Math.floor(Math.random() * validBackgrounds.length)];
      randomBackgroundId = randomBg.id;
    }
    
    const newChar = {
      id: crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: '',
      alignment: randomAlignment,
      deity: '',
      age: '',
      appearance: '',
      specialty: '',
      personality: '',
      ideals: '',
      bonds: '',
      flaws: '',
      backstory: '',
      level: 3,
      raceId: randomRace.id,
      raceSource: randomRace.source,
      subraceId: randomSubraceId || undefined,
      classId: randomClass.id,
      subclassId: randomSubclassId || undefined,
      backgroundId: randomBackgroundId,
      baseAbilities: abilities,
      skillSelections: [],
      languageSelections: [],
      equipmentSelections: [],
      traitSelections: {},
      knownSpells: [],
      preparedSpells: [],
      customSpells: []
    };
    
    try {
      const saved = localStorage.getItem('dndChars');
      let currentList = [];
      if (saved) {
        currentList = JSON.parse(saved);
      }
      const updatedList = [newChar, ...currentList];
      localStorage.setItem('dndChars', JSON.stringify(updatedList));
      setSavedChars(updatedList);
      
      const subNameStr = randomSubraceId ? ` (${randomRace.subraces?.find(s => s.id === randomSubraceId)?.name})` : '';
      const subclassStr = randomSubclassId ? ` (${randomClass.subclasses.find(s => s.id === randomSubclassId)?.name})` : '';
      
      setToastText(`🎲 招募成功！全新的 3级（${randomRace.name}${subNameStr} / ${randomClass.name}${subclassStr}）已加入您的角色档案库，滚动至下方加载即可自定义编辑！`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5500);
    } catch (e) {
      console.error('Failed to save generated character:', e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfc] text-stone-900 font-sans selection:bg-amber-200">
      {/* Decorative Navbar */}
      <nav id="landing-navbar" className="w-full px-6 py-4 flex justify-between items-center border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-stone-800">
          <Book className="w-6 h-6 text-amber-600" />
          <span className="font-serif font-bold text-xl tracking-tight">D&D 5e Wiki 角色创建</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-stone-605 items-center">
          <div className="relative">
            <button
              id="btn-toolbox-toggle"
              onClick={(e) => {
                e.preventDefault();
                setToolboxOpen(!toolboxOpen);
              }}
              className="hover:text-amber-600 transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 font-medium text-sm text-stone-600 outline-none"
            >
              工具箱
              <span className="text-[10px] opacity-60">▼</span>
            </button>
            {toolboxOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setToolboxOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100 text-left font-sans">
                  <button
                    id="lnk-toolbox-dice"
                    onClick={() => {
                      setToolboxOpen(false);
                      setOpenDiceModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    🎲 快速骰子掷器
                  </button>
                  <button
                    id="lnk-toolbox-pointbuy"
                    onClick={() => {
                      setToolboxOpen(false);
                      setOpenPointBuyModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    📊 属性购点速查
                  </button>
                  <button
                    id="lnk-toolbox-ai"
                    onClick={() => {
                      setToolboxOpen(false);
                      setOpenAiModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    🤖 AI 辅助设置
                  </button>
                  <button
                    id="lnk-toolbox-xge"
                    onClick={() => {
                      setToolboxOpen(false);
                      setOpenXgeModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    📜 XGE 经历生成设置
                  </button>
                  <button
                    id="lnk-toolbox-exp"
                    onClick={() => {
                      setToolboxOpen(false);
                      setOpenExpModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    📚 扩展书与规则集管理
                  </button>
                </div>
              </>
            )}
          </div>
          <span className="text-stone-400">|</span>
          <a href="https://github.com/littlhMW/DND5eCharacterTools-" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-stone-900 text-stone-600 transition-colors font-sans leading-none no-underline">
            <Github size={16} /> GitHub 开源
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 md:py-32 relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center -z-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-100 rounded-full blur-[120px] opacity-30 -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl w-full text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full text-stone-600 font-medium text-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            基于 5etools 规则集与中文本地化翻译
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-stone-900 tracking-tight font-serif leading-[1.1]">
            铸就属于你的<br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-500">传奇史诗</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-605 max-w-2xl mx-auto leading-relaxed">
            D&D 5e 中文设定集与向导式角色卡生成系统。包含种族、职业、法术与属性分配的一站式体验，整合大语言模型智能书写。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <motion.button
              id="btn-hero-start"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartCreation}
              className="flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-md font-medium text-lg hover:bg-stone-800 transition-colors shadow-xl shadow-stone-900/10 w-full sm:w-auto justify-center group border-none cursor-pointer"
            >
              <Swords className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              立刻创建角色
            </motion.button>
          </div>
        </motion.div>

        {/* Floating Toast Alert */}
        {showToast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] max-w-xl w-full px-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-stone-900 border border-amber-500/30 text-white rounded-lg p-4 shadow-2xl shadow-amber-900/20 text-sm flex items-center gap-3 border-l-4 border-l-amber-500">
              <span className="text-xl">🎲</span>
              <div className="flex-1 font-medium text-stone-100">{toastText}</div>
              <button onClick={() => setShowToast(false)} className="text-stone-400 hover:text-white ml-2 text-xs bg-transparent border-none cursor-pointer">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 本地角色档案库 & 随机快速招募 */}
        <div className="w-full max-w-5xl mt-16 text-left">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-3 border-b border-stone-200 pb-4">
            <User size={24} className="text-amber-600" />
            已保存的角色卡
          </h2>

          {/* Stored Character Cards */}
          {savedChars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {savedChars.map((char: any) => {
                const cls = classes.find(c => c.id === char.classId);
                const race = getRaceByIdAndSource(char.raceId, char.raceSource);
                const currentCharId = char.id;
                return (
                  <div key={char.id} className="bg-white p-5 rounded-md border border-stone-200 shadow-sm hover:border-amber-300 transition-colors group cursor-pointer relative" onClick={() => dispatch({ type: 'LOAD_CHARACTER', payload: char })}>
                    {deletingId === currentCharId && (
                      <div className="absolute inset-0 bg-stone-900/95 text-white flex flex-col items-center justify-center p-5 rounded-md z-30" onClick={(e) => e.stopPropagation()}>
                        <span className="text-sm font-semibold mb-3 text-stone-200">确定要删除这个角色吗？</span>
                        <div className="flex gap-4">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newChars = savedChars.filter((item: any) => item.id !== currentCharId);
                              setSavedChars(newChars);
                              localStorage.setItem('dndChars', JSON.stringify(newChars));
                              setDeletingId(null);
                            }}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded transition-colors border-none cursor-pointer"
                          >
                            确认删除
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeletingId(null);
                            }}
                            className="px-4 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-200 font-medium text-xs rounded transition-colors border-none cursor-pointer"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    )}
                    <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-700">{char.name || '未命名'}</h3>
                    <button 
                      className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-colors p-1 z-10 bg-transparent border-none cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeletingId(currentCharId);
                      }}
                      title="删除角色"
                    >
                      <svg xmlns="http://www.w3.org/2005/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                    <p className="text-sm text-stone-500 mt-1 mb-4 flex items-center gap-2">
                       <span className="inline-block bg-stone-100 px-2 py-0.5 rounded text-xs font-mono">Lv {char.level || 3}</span>
                       <span>{race?.name || '未知种族'}</span>
                       <span>{cls?.name || '无职业'}</span>
                    </p>
                    <button className="text-sm font-medium text-amber-600 hover:text-amber-700 w-full bg-amber-50 hover:bg-amber-100 py-2 rounded-lg transition-colors border-none cursor-pointer">
                      加载角色卡
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-stone-400 text-sm mb-6 py-8 border border-dashed border-stone-200 rounded-md text-center bg-white/40">
              暂无已保存的角色。点击下方按钮随机招募一个，或直接点击上方「立刻创建角色」！
            </div>
          )}

          {/* Random Character Generation Helper */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="space-y-1 text-left">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5 font-serif">
                🎲 快速随机生成 (Lv. 3)
              </h3>
              <p className="text-xs text-stone-505 leading-relaxed">
                遵循标准属性购点与规则库，随机生成包含种族、子种族、职业、子职、背景在内的 3 级角色并加入。
              </p>
            </div>
            <button
              id="btn-fast-random"
              onClick={generateRandomCharacter}
              className="bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold px-4.5 py-2.5 rounded transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow-sm border-none"
            >
              <Swords size={14} />
              随机生成
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-32"
        >
          <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-md flex items-center justify-center text-amber-600 border border-amber-100">
              <Scroll size={24} />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">核心设定全包含</h3>
            <p className="text-stone-605 leading-relaxed text-sm">
              内建 5e 玩家手册的核心种族、职业与背景支持。清晰直观的法术筛选及豁免计算。
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-md flex items-center justify-center text-blue-600 border border-blue-100">
              <Wand2 size={24} />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">自动属性换算</h3>
            <p className="text-stone-605 leading-relaxed text-sm">
              属性更改自动引发调整值变化。技能、熟练、豁免、先攻及被动察觉、特殊感官自动合并计算。
            </p>
          </div>
          <div className="bg-stone-50 p-8 rounded-lg border border-dashed border-stone-300 flex flex-col gap-4 opacity-70">
            <div className="w-12 h-12 bg-stone-200 rounded-md flex items-center justify-center text-stone-600 border border-stone-300">
              <Shield size={24} />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-500">即将推出: PDF导出</h3>
            <p className="text-stone-500 leading-relaxed text-sm">
              本地离线导出标准的空白或已填色DND 5e经典三页A4 PDF角色卡，后续持续进行功能迭新。
            </p>
          </div>
        </motion.div>
      </main>

      {/* Dice Roller Modal */}
      {openDiceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left">
            <button 
              onClick={() => setOpenDiceModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
              title="关闭"
            >
              ✕
            </button>

            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                🎲 快速骰点
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                点击下方按钮可投掷符合核心跑团规则的多面骰，掷骰结果将实时在此显示，不改变您的角色档案卡。
              </p>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="grid grid-cols-4 gap-2">
                {[4, 6, 8, 10, 12, 20, 100].map((sides) => (
                  <button
                    key={sides}
                    onClick={() => handleRollDice(sides)}
                    className="py-2 bg-stone-50 hover:bg-amber-50 hover:text-amber-800 border border-stone-200 hover:border-amber-200 text-xs font-semibold rounded transition-colors cursor-pointer"
                  >
                    d{sides}
                  </button>
                ))}
              </div>

              <div className="mt-3">
                <div className="text-[11px] font-semibold text-stone-500 mb-1 flex justify-between items-center">
                  <span>投掷历史 (仅限本次)</span>
                  {diceLog.length > 0 && (
                    <button onClick={() => setDiceLog([])} className="text-stone-400 hover:text-stone-605 text-[10px] cursor-pointer bg-transparent border-none">
                      清空听
                    </button>
                  )}
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded p-2 text-xs font-mono h-32 overflow-y-auto space-y-1">
                  {diceLog.length === 0 ? (
                    <span className="text-stone-400 text-[10px] block text-center pt-8">暂无投掷，点击上方按钮测试手气</span>
                  ) : (
                    diceLog.map((log, idx) => (
                      <div key={idx} className="text-stone-700 flex justify-between text-[11px] border-b border-stone-100/50 pb-0.5 animate-in slide-in-from-top-1 duration-100">
                        <span>{log.time}</span>
                        <span className="font-bold text-amber-800">{log.result}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-end">
              <button
                onClick={() => setOpenDiceModal(false)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Point Buy Modal */}
      {openPointBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-lg max-w-sm w-full shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left">
            <button 
              onClick={() => setOpenPointBuyModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
              title="关闭"
            >
              ✕
            </button>

            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                📊 属性购点速查
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                所有基础属性默认自 8 起步，最高可购买到 15。总可用预留预算点数为 27 点。
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <table className="w-full text-[11px] text-stone-700 border-collapse border border-stone-200 rounded overflow-hidden">
                <thead>
                  <tr className="bg-stone-100 text-stone-800 border-b border-stone-200">
                     <th className="py-2 px-2.5 text-left font-serif">属性数值</th>
                     <th className="py-2 px-2.5 text-left">消耗点数 (Cost)</th>
                     <th className="py-2 px-2.5 text-left">修正加值 (Mod)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { score: 8, cost: 0, mod: '-1' },
                    { score: 9, cost: 1, mod: '-1' },
                    { score: 10, cost: 2, mod: '±0' },
                    { score: 11, cost: 3, mod: '±0' },
                    { score: 12, cost: 4, mod: '+1' },
                    { score: 13, cost: 5, mod: '+1' },
                    { score: 14, cost: 7, mod: '+2' },
                    { score: 15, cost: 9, mod: '+2' }
                  ].map((row) => (
                    <tr key={row.score} className="border-b border-stone-150 hover:bg-stone-50/50">
                      <td className="py-1 px-2.5 font-mono font-bold text-stone-900">{row.score}</td>
                      <td className="py-1 px-2.5 font-mono text-amber-800 font-bold">{row.cost} 点</td>
                      <td className="py-1 px-2.5 font-mono text-stone-550">{row.mod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-end">
              <button
                onClick={() => setOpenPointBuyModal(false)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Config Modal */}
      {openAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
            <button 
              onClick={() => setOpenAiModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
              title="关闭"
            >
              ✕
            </button>

            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                AI 辅助书写配置说明
              </h2>
              <p className="text-xs text-stone-505 mt-1">
                启用与配置您的本地大模型 API 接口，实现平实有度、段落合理的文本扩写。
              </p>
            </div>

            <div className="space-y-4 text-sm font-sans">
              <div className="flex flex-col gap-2.5">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiConfig.enabled}
                    onChange={(e) => handleAiConfigChange('enabled', e.target.checked)}
                    className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-stone-700">启用 AI 细节书写与润色物语</span>
                </label>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed font-sans">
                细节书写默认关闭。启用后，允许您在自定义角色的「外观」及「背景故事」等栏位中，点击闪光灯按钮，自动调用配置的模型为您润色并分段梳理文字细节。
              </p>

              {aiConfig.enabled ? (
                <div className="space-y-2 border-t border-stone-150 pt-2 animate-in slide-in-from-top-1 duration-150">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">接口提供商</label>
                      <select
                        value={aiConfig.provider}
                        onChange={handleProviderChange}
                        className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none cursor-pointer h-[34px]"
                      >
                        {PROVIDERS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">模型名 (Model)</label>
                      <input
                        type="text"
                        value={aiConfig.model}
                        onChange={(e) => handleAiConfigChange('model', e.target.value)}
                        placeholder="e.g. deepseek-chat"
                        className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none font-mono h-[34px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">
                      API 密钥 (API Key)
                    </label>
                    <input
                      type="password"
                      value={aiConfig.apiKey}
                      onChange={(e) => handleAiConfigChange('apiKey', e.target.value)}
                      placeholder={aiConfig.provider === 'deepseek' ? 'sk-...' : '输入 API Key'}
                      className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="text-[10px] text-stone-500 italic mt-1 pb-1">
                    * 所有配置和 API 密钥均保存在您的本地浏览器中，绝不上传至任何服务器，安全放心。
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-stone-200 rounded-lg p-5 bg-stone-50/50 text-stone-400 text-xs text-center flex flex-col justify-center items-center py-7 font-sans">
                  已默认处于关闭状态。若需在角色卡中展开大模型书写功能，请在上方勾选。
                </div>
              )}
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-end">
              <button
                onClick={() => setOpenAiModal(false)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
              >
                保存关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* XGE This Is Your Life Config Modal */}
      {openXgeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-lg max-w-lg w-full shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
            <button 
              onClick={() => setOpenXgeModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
              title="关闭"
            >
              ✕
            </button>

            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                📜 XGE "这是你的人生" 掷骰面板
              </h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed font-sans">
                根基于《万事指南》（Xanathar's Guide to Everything）核心表随机拼合生成生动的人生经历。
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  选择背景：
                </label>
                <select
                  value={xgePreviewBg}
                  onChange={(e) => setXgePreviewBg(e.target.value)}
                  className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none cursor-pointer h-[34px]"
                >
                  <option value="acolyte">侍祭 (Acolyte)</option>
                  <option value="charlatan">骗子 (Charlatan)</option>
                  <option value="criminal">罪犯 (Criminal)</option>
                  <option value="entertainer">艺人 (Entertainer)</option>
                  <option value="folk-hero">平民英雄 (Folk Hero)</option>
                  <option value="guild-artisan">工匠行会 (Guild Artisan)</option>
                  <option value="noble">贵族 (Noble)</option>
                  <option value="outlander">荒野隐士 (Outlander)</option>
                  <option value="sage">贤者 (Sage)</option>
                  <option value="sailor">水手 (Sailor)</option>
                  <option value="soldier">士兵 (Soldier)</option>
                  <option value="urchin">孤儿 (Urchin)</option>
                </select>
              </div>

              <div className="flex justify-between items-center bg-stone-50 border border-stone-200 rounded p-3">
                <span className="text-[11px] text-stone-600">
                  生成人生经历：
                </span>
                <button
                  onClick={() => {
                    const text = generateXgeBackstory({ backgroundId: xgePreviewBg });
                    setXgePreviewText(text);
                  }}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs rounded transition-colors shadow-xs cursor-pointer border-none flex items-center gap-1 font-sans"
                >
                  🎲 掷骰
                </button>
              </div>

              {xgePreviewText ? (
                <div className="space-y-1.5">
                  <span className="block text-xs font-semibold text-stone-700">
                     骰表掷骰生平结果预览:
                  </span>
                  <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-lg max-h-[160px] overflow-y-auto text-xs text-stone-700 leading-relaxed font-sans whitespace-pre-wrap">
                    {xgePreviewText}
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-stone-200 rounded-lg p-5 bg-stone-50/50 text-stone-405 text-xs text-center leading-relaxed">
                  暂无掷骰。
                </div>
              )}
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-end">
              <button
                onClick={() => setOpenXgeModal(false)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
              >
                关闭面板
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expansion Books Modal */}
      {openExpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-lg max-w-4xl w-full shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
            <button 
              onClick={() => setOpenExpModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
              title="关闭"
            >
              ✕
            </button>

            <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                  📚 扩展书与规则集管理
                </h2>
                <p className="text-xs text-stone-500 mt-1 max-w-xl pr-2 leading-relaxed">
                  启用或禁用特定的官方扩展书。启用后，您可以进一步勾选是否开启该扩展内的 <strong>种族</strong>、<strong>职业</strong> 或 <strong>背景</strong> 功能。
                  <span className="block mt-1">⭐️ <strong>存在同一种族的不同扩展时，在创建角色时点击扩展缩写切换扩展。</strong></span>
                  <span className="block mt-1 font-medium text-amber-600">⚠️ 提示：扩展包目前为 Beta 测试版本，内容可能存在翻译或机制错漏，请谨慎参考。</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const allIds = EXPANSIONS.filter(e => !e.isCore).map(e => e.id);
                    const newSettings = { ...expansionSettings };
                    for (const expId of allIds) {
                      newSettings[expId] = {
                        enabled: true,
                        races: true,
                        classes: true,
                        backgrounds: true,
                        other: true
                      };
                    }
                    setExpansionSettings(newSettings);
                    saveExpansionSettings(newSettings);
                    setActiveExpansions(allIds);
                  }}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded transition-colors border border-stone-200 cursor-pointer"
                >
                  全选非核心
                </button>
                <button
                  onClick={() => {
                    const newSettings = { ...expansionSettings };
                    for (const exp of EXPANSIONS) {
                      if (exp.isCore) continue;
                      newSettings[exp.id] = {
                        enabled: false,
                        races: false,
                        classes: false,
                        backgrounds: false,
                        other: false
                      };
                    }
                    setExpansionSettings(newSettings);
                    saveExpansionSettings(newSettings);
                    setActiveExpansions([]);
                  }}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded transition-colors border border-stone-200 cursor-pointer"
                >
                  全不选
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {EXPANSIONS.map((exp: ExpansionBook) => {
                const bookSet = expansionSettings[exp.id] || { enabled: false, races: false, classes: false, backgrounds: false, other: false };
                const isBookEnabled = exp.isCore || bookSet.enabled;
                
                return (
                  <div key={exp.id} className={`p-3 rounded-md border transition-all flex flex-col ${isBookEnabled ? 'bg-amber-50/20 border-amber-200/50' : 'bg-stone-50/50 border-stone-200 opacity-60 hover:opacity-100'}`}>
                    <div className="flex items-start justify-between gap-2 mb-1.5 border-b border-stone-100 pb-1.5">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className="font-bold text-sm text-stone-900">{exp.name}</span>
                        <span 
                          onClick={() => {
                            if (!exp.isCore) handleBookMasterToggle(exp.id, !bookSet.enabled);
                          }}
                          className={`text-[9px] ${!exp.isCore ? 'cursor-pointer hover:bg-stone-300' : ''} bg-stone-200 text-stone-505 px-1 py-0.5 rounded font-mono uppercase leading-none transition-colors`}
                          title={!exp.isCore ? "点击切换整个规则书状态" : ""}
                        >
                          {exp.shortName}
                        </span>
                        {exp.isCore ? (
                          <span className="text-[9px] bg-amber-500 text-white px-1 py-0.5 rounded leading-none">核心</span>
                        ) : (
                          <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-200 px-1 py-0.5 rounded leading-none">Beta 错漏谨用</span>
                        )}
                      </div>
                      {!exp.isCore && (
                        <div className="shrink-0 flex items-center h-full pt-0.5">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={bookSet.enabled}
                              onChange={(e) => handleBookMasterToggle(exp.id, e.target.checked)}
                            />
                            <div className="w-7 h-4 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[12px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-stone-600 space-y-2.5 mt-1 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-stone-500 leading-relaxed italic mb-2.5">
                          {exp.description}
                        </p>
                        
                        {/* Races */}
                        {exp.races && (
                          <div className={`flex items-start gap-1.5 text-[11px] mb-2 transition-opacity duration-200 ${!isBookEnabled || (bookSet.races === false && !exp.isCore) ? 'opacity-40' : 'opacity-100'}`}>
                            <label className="shrink-0 flex items-center gap-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                disabled={exp.isCore || !bookSet.enabled}
                                checked={exp.isCore ? true : bookSet.races}
                                onChange={(e) => handleCategoryToggle(exp.id, 'races', e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 border-stone-300 accent-amber-600"
                              />
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded leading-none font-medium">
                                种族
                              </span>
                            </label>
                            <span className={`text-stone-700 leading-relaxed font-sans ${(!isBookEnabled || (bookSet.races === false && !exp.isCore)) ? 'line-through decoration-stone-400' : ''}`}>
                              {exp.races}
                            </span>
                          </div>
                        )}

                        {/* Classes */}
                        {exp.classes && (
                          <div className={`flex items-start gap-1.5 text-[11px] mb-2 transition-opacity duration-200 ${!isBookEnabled || (bookSet.classes === false && !exp.isCore) ? 'opacity-40' : 'opacity-100'}`}>
                            <label className="shrink-0 flex items-center gap-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                disabled={exp.isCore || !bookSet.enabled}
                                checked={exp.isCore ? true : bookSet.classes}
                                onChange={(e) => handleCategoryToggle(exp.id, 'classes', e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 accent-emerald-500"
                              />
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded leading-none font-medium">
                                职业
                              </span>
                            </label>
                            <span className={`text-stone-700 leading-relaxed font-sans ${(!isBookEnabled || (bookSet.classes === false && !exp.isCore)) ? 'line-through decoration-stone-400' : ''}`}>
                              {exp.classes}
                            </span>
                          </div>
                        )}

                        {/* Backgrounds */}
                        {exp.backgrounds && (
                          <div className={`flex items-start gap-1.5 text-[11px] mb-2 transition-opacity duration-200 ${!isBookEnabled || (bookSet.backgrounds === false && !exp.isCore) ? 'opacity-40' : 'opacity-100'}`}>
                            <label className="shrink-0 flex items-center gap-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                disabled={exp.isCore || !bookSet.enabled}
                                checked={exp.isCore ? true : bookSet.backgrounds}
                                onChange={(e) => handleCategoryToggle(exp.id, 'backgrounds', e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-indigo-650 focus:ring-indigo-500 border-stone-300 accent-indigo-650"
                              />
                              <span className="text-[10px] bg-violet-100 text-violet-800 px-1 py-0.5 rounded leading-none font-medium">
                                背景
                              </span>
                            </label>
                            <span className={`text-stone-700 leading-relaxed font-sans ${(!isBookEnabled || (bookSet.backgrounds === false && !exp.isCore)) ? 'line-through decoration-stone-400' : ''}`}>
                              {exp.backgrounds}
                            </span>
                          </div>
                        )}

                        {/* Other Features */}
                        {exp.otherFeatures && (
                          <div className={`flex items-start gap-1.5 text-[11px] mb-1 transition-opacity duration-200 ${!isBookEnabled || (bookSet.other === false && !exp.isCore) ? 'opacity-40' : 'opacity-100'}`}>
                            <label className="shrink-0 flex items-center gap-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                disabled={exp.isCore || !bookSet.enabled}
                                checked={exp.isCore ? true : bookSet.other}
                                onChange={(e) => handleCategoryToggle(exp.id, 'other', e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-sky-500 border-stone-300 accent-sky-500"
                              />
                              <span className="text-[10px] bg-sky-100 text-sky-900 px-1 py-0.5 rounded leading-none font-medium">
                                其他
                              </span>
                            </label>
                            <span className={`text-stone-605 leading-relaxed font-sans ${(!isBookEnabled || (bookSet.other === false && !exp.isCore)) ? 'line-through decoration-stone-400' : ''}`}>
                              {exp.otherFeatures}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 配置备份与同步 */}
            <div className="mt-2 pt-3 border-t border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5 font-serif">
                    📋 规则书配置备份与导入
                  </span>
                  {expMsg.text && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${expMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 animate-in fade-in duration-150' : 'bg-red-50 text-red-800'}`}>
                      {expMsg.text}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportConfig}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded transition-colors shadow-xs border-none cursor-pointer flex items-center gap-1 font-sans"
                    title="点击复制当前的规则书开启/关闭配置 JSON"
                  >
                    📤 点击复制配置
                  </button>

                  {!showImportInput ? (
                    <button
                      onClick={() => setShowImportInput(true)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded transition-colors shadow-xs border-none cursor-pointer flex items-center gap-1 font-sans"
                    >
                      📥 点击导入配置
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 animate-in slide-in-from-right-1 duration-150">
                      <input
                        type="text"
                        placeholder="在此粘贴导出的配置 JSON 文本..."
                        value={importString}
                        onChange={(e) => setImportString(e.target.value)}
                        className="text-white text-xs px-2.5 py-1.5 bg-stone-900 border border-stone-700 rounded focus:border-amber-500 focus:outline-none w-56 font-mono h-[32px] placeholder-stone-500"
                      />
                      <button
                        onClick={handleImportConfig}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors border-none cursor-pointer h-[32px] flex items-center justify-center"
                      >
                        确认
                      </button>
                      <button
                        onClick={() => {
                          setShowImportInput(false);
                          setImportString('');
                        }}
                        className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold rounded transition-colors border-none cursor-pointer h-[32px] flex items-center justify-center"
                      >
                        取消
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-end">
              <button
                id="btn-exp-close"
                onClick={() => setOpenExpModal(false)}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded transition-colors shadow-sm cursor-pointer border-none"
              >
                保存并关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer & Credits */}
      <footer className="w-full bg-stone-50 border-t border-stone-200 py-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2 space-y-4 text-stone-650 text-sm">
            <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-3 mb-2">
              <Info className="text-amber-600" size={20} />
              <h3 className="text-lg font-serif font-bold text-stone-900">版权说明与致谢</h3>
            </div>
            <p className="leading-relaxed">
              本项目由 <strong className="text-stone-900">littlh</strong> 开发维护。工具底层架构与数据库深度参考了 <a href="https://5e.tools/" target="_blank" rel="noreferrer" className="text-amber-700 hover:underline no-referrer">5etools</a>。中文本地化文本来自于 <a href="https://github.com/fvtt-cn" target="_blank" rel="noreferrer" className="text-amber-700 hover:underline no-referrer">FVTT-CN Foundry VTT 中文社区翻译组</a>，感谢所有参与过汉化和维护的无偿贡献者们。
            </p>
            <div className="bg-white p-4 rounded-xl border border-stone-200 text-[13px] leading-relaxed relative">
              <strong className="block text-stone-900 mb-1">使用须知:</strong>
              本工具仅作为辅助参考工具。任何最终的局内结算与法术描述，请以实体出版书籍与官方出具的最新勘误文档为前提准则。
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900">支持与反馈</h4>
            <ul className="space-y-3 text-sm text-stone-605 list-none p-0">
              <li>
                <a href="https://github.com/littlhMW/DND5eCharacterTools-/issues" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-600 transition-colors text-stone-600 no-underline">
                  <Github size={16} /> 提交建议与问题
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> 本地化状态: 正常
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-stone-900">相关资源</h4>
            <ul className="space-y-3 text-sm text-stone-605 list-none p-0">
              <li>
                <a href="https://5e.tools/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-600 transition-colors text-stone-600 no-underline">
                  <ExternalLink size={16} /> 5etools 原库
                </a>
              </li>
              <li>
                <a href="https://github.com/fvtt-cn" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-600 transition-colors text-stone-600 no-underline">
                  <ExternalLink size={16} /> FVTT-CN 项目
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
