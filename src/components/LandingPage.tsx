import React, { useState, useEffect } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Book, Shield, Scroll, Swords, Github, ExternalLink, Info, Wand2, User, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { classes } from '../data/classes';
import { races } from '../data/races';
import { backgrounds } from '../data/backgrounds';
import { getAIConfig, saveAIConfig, PROVIDERS } from '../utils/aiHelper';
import { EXPANSIONS, getActiveExpansions, saveActiveExpansions, ExpansionBook } from '../utils/expansionHelper';

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

  const [diceLog, setDiceLog] = useState<{ time: string, result: string }[]>([]);

  const handleRollDice = (sides: number) => {
    const roll = Math.floor(Math.random() * sides) + 1;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setDiceLog((prev) => [
      { time: timeStr, result: ` 投骰 d${sides}: 🎲 结果 [ ${roll} ]` },
      ...prev
    ].slice(0, 15));
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
    
    const isSourceAllowed = (src?: string) => {
      if (!src || src.toLowerCase() === 'phb') return true;
      return activeExpansions.includes(src.toLowerCase());
    };

    const validRaces = races.filter(r => isSourceAllowed(r.source));
    const validClasses = classes.filter(c => isSourceAllowed(c.source));
    const validBackgrounds = backgrounds.filter(b => isSourceAllowed(b.source));

    if (validRaces.length === 0 || validClasses.length === 0) return;

    // 1. Pick random race
    const randomRace = validRaces[Math.floor(Math.random() * validRaces.length)];
    let randomSubraceId = '';
    if (randomRace.subraces && randomRace.subraces.length > 0) {
      const validSubraces = randomRace.subraces.filter(sr => isSourceAllowed(sr.source));
      if (validSubraces.length > 0) {
        const randomSub = validSubraces[Math.floor(Math.random() * validSubraces.length)];
        randomSubraceId = randomSub.id;
      }
    }
    
    // 2. Pick random class
    const randomClass = validClasses[Math.floor(Math.random() * validClasses.length)];
    let randomSubclassId = '';
    if (randomClass.subclasses && randomClass.subclasses.length > 0) {
      const validSubclasses = randomClass.subclasses.filter(sc => isSourceAllowed(sc.source));
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
      
      setToastText(`🎲 招募成功！全新的 3级冒险家（${randomRace.name}${subNameStr} / ${randomClass.name}${subclassStr}）已加入您的角色档案库，滚动至下方加载即可自定义编辑！`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5500);
    } catch (e) {
      console.error('Failed to save generated character:', e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfc] text-stone-900 font-sans selection:bg-amber-200">
      {/* Decorative Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-stone-800">
          <Book className="w-6 h-6 text-amber-600" />
          <span className="font-serif font-bold text-xl tracking-tight">D&D 5e Toolkit</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-stone-605 items-center">
          <div className="relative">
            <button
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
                    onClick={() => {
                      setToolboxOpen(false);
                      setOpenDiceModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    🎲 快速骰子掷器
                  </button>
                  <button
                    onClick={() => {
                      setToolboxOpen(false);
                      setOpenPointBuyModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    📊 属性购点速查
                  </button>
                  <button
                    onClick={() => {
                      setToolboxOpen(false);
                      setOpenAiModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    AI 辅助设置
                  </button>
                  <button
                    onClick={() => {
                      setToolboxOpen(false);
                      setOpenXgeModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    XGE 经历生成设置
                  </button>
                  <button
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
          <a href="#" className="hover:text-amber-600 transition-colors font-sans leading-none">致谢</a>
          <a href="https://github.com/littlhMW/DND5eCharacterTools-" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-stone-900 transition-colors font-sans leading-none">
            <Github size={16} /> GitHub
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
            基于 5etools 数据与 FVTT-CN 翻译
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-stone-900 tracking-tight font-serif leading-[1.1]">
            铸就属于你的<br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-500">传奇史诗</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Dungeons & Dragons 5e 角色创建与管理平台。流线型向导设计，包含种族、职业、法术与属性分配的一站式体验。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartCreation}
              className="flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-md font-medium text-lg hover:bg-stone-800 transition-colors shadow-xl shadow-stone-900/10 w-full sm:w-auto justify-center group"
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
              <button onClick={() => setShowToast(false)} className="text-stone-400 hover:text-white ml-2 text-xs">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 本地角色档案库 & 随机快速招募 */}
        <div className="w-full max-w-5xl mt-16 text-left">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-3 border-b border-stone-200 pb-4">
            <User size={24} className="text-amber-600" />
            角色档案库
          </h2>

          {/* Stored Character Cards */}
          {savedChars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {savedChars.map((char: any) => {
                const cls = classes.find(c => c.id === char.classId);
                const race = races.find(r => r.id === char.raceId);
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
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded transition-colors"
                          >
                            确认删除
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeletingId(null);
                            }}
                            className="px-4 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-200 font-medium text-xs rounded transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    )}
                    <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-700">{char.name || '未命名'}</h3>
                    <button 
                      className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-colors p-1 z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeletingId(currentCharId);
                      }}
                      title="删除角色"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                    <p className="text-sm text-stone-500 mt-1 mb-4 flex items-center gap-2">
                       <span className="inline-block bg-stone-100 px-2 py-0.5 rounded text-xs font-mono">Lv {char.level || 1}</span>
                       <span>{race?.name || '未知种族'}</span>
                       <span>{cls?.name || '无职业'}</span>
                    </p>
                    <button className="text-sm font-medium text-amber-600 hover:text-amber-700 w-full bg-amber-50 hover:bg-amber-100 py-2 rounded-lg transition-colors">
                      加载角色卡
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-stone-400 text-sm mb-6 py-8 border border-dashed border-stone-200 rounded-md text-center bg-white/40">
              暂无已保存的角色开发档案
            </div>
          )}

          {/* Random Character Generation Helper */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5 font-serif">
                🎲 随机生成 3级角色
              </h3>
              <p className="text-xs text-stone-605 leading-relaxed">
                掷骰快速生成一名随机种族、职业、子职业及基础属性的 3级 角色。生成完毕后角色将立即被保存在上方的档案库中以便您二次编辑。
              </p>
            </div>
            <button
              onClick={generateRandomCharacter}
              className="bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold px-4.5 py-2.5 rounded transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Swords size={14} />
              随机生成 3级角色
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
            <h3 className="font-serif font-bold text-xl text-stone-900">核心规则全覆盖</h3>
            <p className="text-stone-650 leading-relaxed text-sm">
              内建 5e 玩家手册的核心种族、职业与背景支持。清晰直观的法术筛选及豁免计算。
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-md flex items-center justify-center text-blue-600 border border-blue-100">
              <Wand2 size={24} />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">自动属性推源</h3>
            <p className="text-stone-650 leading-relaxed text-sm">
              掷骰或购点自动计算属性值、调整值以及熟练加值。支持职业特性的智能推送与法术位管理。
            </p>
          </div>
          <div className="bg-stone-50 p-8 rounded-lg border border-dashed border-stone-300 flex flex-col gap-4 opacity-70">
            <div className="w-12 h-12 bg-stone-200 rounded-md flex items-center justify-center text-stone-600 border border-stone-300">
              <Shield size={24} />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-500">即将推出: 导出表格</h3>
            <p className="text-stone-500 leading-relaxed text-sm">
              直接导出可用角色卡，在线调整角色卡等功能将在后续更新中陆续加入。
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
                🎲 快速骰子掷器
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
                  <span>投掷历史 (只在本次存储)</span>
                  {diceLog.length > 0 && (
                    <button onClick={() => setDiceLog([])} className="text-stone-400 hover:text-stone-600 text-[10px] cursor-pointer bg-transparent border-none">
                      清空
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
                        <span className="font-bold text-amber-850">{log.result}</span>
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
                    <th className="py-2 px-2.5 text-left">点数消耗 (Cost)</th>
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
              <p className="text-xs text-stone-500 mt-1">
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
                      className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none font-mono h-[34px]"
                    />
                  </div>

                  {aiConfig.provider === 'custom' && (
                    <div>
                      <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">网关基点 (API Base URL)</label>
                      <input
                        type="text"
                        value={aiConfig.apiBaseUrl}
                        onChange={(e) => handleAiConfigChange('apiBaseUrl', e.target.value)}
                        placeholder="https://api.yourcom.com/v1"
                        className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none text-[10px] h-[34px]"
                      />
                    </div>
                  )}

                  <div className="bg-amber-50/50 border border-amber-200/50 text-[10px] text-amber-800 p-2 rounded leading-relaxed font-sans">
                    * 纯本地存储承诺：所有密钥均存储在您当前浏览器 localStorage 中，绝不离开本地，安全放心。
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
          <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
            <button 
              onClick={() => setOpenXgeModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
              title="关闭"
            >
              ✕
            </button>

            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                XGE "这是你的人生" 配置
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                独立于大语言模型，完全由纯核心规则书表格组成的随机历史投骰计算器。
              </p>
            </div>

            <div className="space-y-4 text-sm font-sans">
              <div className="flex flex-col gap-2.5">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiConfig.xgeEnabled || false}
                    onChange={(e) => handleAiConfigChange('xgeEnabled', e.target.checked)}
                    className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-stone-700">启用 XGE "这是你的人生" 背景故事掷骰</span>
                </label>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-stone-500 leading-relaxed font-sans">
                  《万事指南》(Xanathar's Guide to Everything) 是龙与地下城 5e 的官方补充规则书。其内置「这是你的人生」一节拥有极其庞杂精妙的双亲、出生、故土、兄弟姐妹及生平历险、机缘、创伤和财富遭遇表。
                </p>
                <p className="text-xs text-stone-550 leading-relaxed font-sans">
                  开启此开关后，在通用的「背景故事」输入框右上方，会<strong>额外增加一个独立的「生成生平经历」动作工具</strong>。
                </p>
                <div className="bg-amber-50/50 border border-amber-200/50 text-[11px] text-amber-800 p-3 rounded-md leading-relaxed font-sans">
                  <strong>如何工作：</strong>在写好或为空的背景文字框旁，只需轻点生成，本工具即会按玩家角色的魅力、故事背景等指标计算全套规则表，生成一段戏剧性张力十足的人生历练并<strong>自动安全拼接</strong>到原文本之后，供您跑团使用。
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-end">
              <button
                onClick={() => setOpenXgeModal(false)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
              >
                保存关闭
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
                <p className="text-xs text-stone-500 mt-1 max-w-xl">
                  启用或禁用特定的官方扩展书。禁用后，其包含的额外种族、子职及背景选项将在创建流程中被隐藏。
                  <span className="block mt-1 font-medium text-amber-600">⚠️ 提示：扩展包目前为 Beta 测试版本，内容可能存在翻译或机制错漏，请谨慎参考。</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const allIds = EXPANSIONS.filter(e => !e.isCore).map(e => e.id);
                    setActiveExpansions(allIds);
                    saveActiveExpansions(allIds);
                  }}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded transition-colors border border-stone-200 cursor-pointer"
                >
                  全选非核心
                </button>
                <button
                  onClick={() => {
                    setActiveExpansions([]);
                    saveActiveExpansions([]);
                  }}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded transition-colors border border-stone-200 cursor-pointer"
                >
                  全不选
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {EXPANSIONS.map((exp: ExpansionBook) => (
                <div key={exp.id} className={`p-2.5 rounded-md border transition-all flex flex-col ${activeExpansions.includes(exp.id) || exp.isCore ? 'bg-amber-50/30 border-amber-200/50' : 'bg-stone-50/50 border-stone-200 opacity-70 hover:opacity-100'}`}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="font-bold text-sm text-stone-900">{exp.name}</span>
                      <span className="text-[9px] bg-stone-200 text-stone-600 px-1 py-0.5 rounded font-mono uppercase leading-none">{exp.shortName}</span>
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
                            checked={activeExpansions.includes(exp.id)}
                            onChange={(e) => {
                              const newActive = e.target.checked 
                                ? [...activeExpansions, exp.id]
                                : activeExpansions.filter(id => id !== exp.id);
                              setActiveExpansions(newActive);
                              saveActiveExpansions(newActive);
                            }}
                          />
                          <div className="w-7 h-4 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[12px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-600 space-y-1.5 mt-auto pt-2 border-t border-stone-100">
                    <p className="text-stone-500 leading-relaxed italic mb-1">
                      {exp.description}
                    </p>
                    {exp.races && (
                      <div className="flex items-start gap-1 text-[11px]">
                        <span className="shrink-0 text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded leading-none font-medium">
                          种族
                        </span>
                        <span className="text-stone-700 leading-relaxed">{exp.races}</span>
                      </div>
                    )}
                    {exp.classes && (
                      <div className="flex items-start gap-1 text-[11px]">
                        <span className="shrink-0 text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded leading-none font-medium">
                          职业
                        </span>
                        <span className="text-stone-700 leading-relaxed">{exp.classes}</span>
                      </div>
                    )}
                    {exp.otherFeatures && (
                      <div className="flex items-start gap-1 text-[11px]">
                        <span className="shrink-0 text-[10px] bg-sky-100 text-sky-900 px-1 py-0.5 rounded leading-none font-medium">
                          其他
                        </span>
                        <span className="text-stone-600 leading-relaxed">{exp.otherFeatures}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-end">
              <button
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
          <div className="lg:col-span-2 space-y-4 text-stone-600 text-sm">
            <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-3 mb-2">
              <Info className="text-amber-600" size={20} />
              <h3 className="text-lg font-serif font-bold text-stone-900">版权说明与致谢</h3>
            </div>
            <p className="leading-relaxed">
              本项目由 <strong className="text-stone-900">littlh</strong> 开发维护。工具底层架构与数据库深度参考了 <a href="https://5e.tools/" target="_blank" rel="noreferrer" className="text-amber-700 hover:underline">5etools</a>。中文本地化文本来自于 <a href="https://github.com/fvtt-cn" target="_blank" rel="noreferrer" className="text-amber-700 hover:underline">FVTT-CN Foundry VTT 中文社区翻译组</a>，感谢所有参与过汉化和维护的无偿贡献者们。
            </p>
            <div className="bg-white p-4 rounded-xl border border-stone-200 text-[13px] leading-relaxed relative">
              <strong className="block text-stone-900 mb-1">使用须知:</strong>
              本工具仅作为辅助参考工具。任何最终的规则结算与法术描述冲突，请以实体出版书籍与官方最新出具的勘误文档为准。
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900">支持与反馈</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <a href="https://github.com/littlhMW/DND5eCharacterTools-/issues" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                  <Github size={16} /> 提交 Bug 与建议
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> 服务器状态: 正常
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-stone-900">相关资源</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <a href="https://5e.tools/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                  <ExternalLink size={16} /> 5etools 原库
                </a>
              </li>
              <li>
                <a href="https://github.com/fvtt-cn" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-600 transition-colors">
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
