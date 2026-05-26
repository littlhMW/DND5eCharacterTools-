import React, { useState, useEffect } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Book, Shield, Scroll, Swords, Github, ExternalLink, Info, Wand2, User, Settings, Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { classes } from '../data/classes';
import { races, getRaceByIdAndSource } from '../data/races';
import { backgrounds } from '../data/backgrounds';
import { getAIConfig, saveAIConfig, PROVIDERS } from '../utils/aiHelper';
import { EXPANSIONS, getActiveExpansions, saveActiveExpansions, ExpansionBook, getExpansionSettings, saveExpansionSettings, BookSettings, isSourceEnabled } from '../utils/expansionHelper';
import { generateXgeBackstory } from '../utils/xgeLifeGenerator';
import { EncounterCalculator } from './tools/EncounterCalculator';
import { PartyGenerator } from './tools/PartyGenerator';
import { AppearancePersonalityGenerator } from './tools/AppearancePersonalityGenerator';
import { NameGeneratorModal } from './tools/NameGeneratorModal';
import { generateRandomName } from '../utils/nameGenerator';
import { PartyNameGeneratorModal } from './tools/PartyNameGeneratorModal';
import { AbilityGeneratorTool } from './tools/AbilityGeneratorTool';

export function LandingPage() {
  const { dispatch } = useCharacter();
  const [savedChars, setSavedChars] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // States for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

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
  const [openEncounterModal, setOpenEncounterModal] = useState(false);
  const [openPartyModal, setOpenPartyModal] = useState(false);
  const [openNameModal, setOpenNameModal] = useState(false);
  const [openDetailGenModal, setOpenDetailGenModal] = useState(false);
  const [openPartyNameModal, setOpenPartyNameModal] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openThemeModal, setOpenThemeModal] = useState(false);
  const [openXgeStepSettingsModal, setOpenXgeStepSettingsModal] = useState(false);
  const [xgeEnabledInDetails, setXgeEnabledInDetails] = useState(() => localStorage.getItem('xgeEnabledInDetails') === 'true');
  const [xgeUseExpandedInDetails, setXgeUseExpandedInDetails] = useState(() => localStorage.getItem('xgeUseExpandedInDetails') === 'true');
  const [xgeUseNonPhbInDetails, setXgeUseNonPhbInDetails] = useState(() => localStorage.getItem('xgeUseNonPhbInDetails') !== 'false');
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('dndTheme') || 'dndmanual');
  const [activeExpansions, setActiveExpansions] = useState<string[]>(() => getActiveExpansions());
  const [expansionSettings, setExpansionSettings] = useState<Record<string, BookSettings>>(() => getExpansionSettings());
  const [xgePreviewBg, setXgePreviewBg] = useState('');
  const [xgePreviewClass, setXgePreviewClass] = useState('');
  const [xgePreviewAge, setXgePreviewAge] = useState<number | ''>('');
  const [xgePreviewChaMod, setXgePreviewChaMod] = useState<number | ''>('');
  const [xgePreviewText, setXgePreviewText] = useState('');

  const [diceLog, setDiceLog] = useState<{ time: string, result: string }[]>([]);

  const TOOLBOX_ITEMS = [
    {
      id: 'dice',
      icon: '🎲',
      title: '快速骰子掷器',
      desc: '模拟 D20, D8 等各种骰子掷点',
      onClick: () => setOpenDiceModal(true)
    },
    {
      id: 'pointbuy',
      icon: '📊',
      title: '属性数值生成器',
      desc: '标准阵列、属性购点、骰决数值与手动设定',
      onClick: () => setOpenPointBuyModal(true)
    },
    {
      id: 'xge',
      icon: '📜',
      title: 'XGE 经历生成',
      desc: 'Xanathar 的随机身世表格',
      onClick: () => setOpenXgeModal(true)
    },
    {
      id: 'encounter',
      icon: '🧮',
      title: '5e 遭遇规模',
      desc: '基于队伍计算推荐怪物难度',
      onClick: () => setOpenEncounterModal(true)
    },
    {
      id: 'party',
      icon: '👥',
      title: '随机小队生成器',
      desc: '生成经典搭配的冒险队伍',
      onClick: () => setOpenPartyModal(true)
    },
    {
      id: 'detail-gen',
      icon: '🎭',
      title: '外貌与性格生成',
      desc: '随机外貌与性格特征',
      onClick: () => setOpenDetailGenModal(true)
    },
    {
      id: 'name',
      icon: '🔤',
      title: '名字生成器',
      desc: '按文化和种族智能生成名字',
      onClick: () => setOpenNameModal(true)
    },
    {
      id: 'party-name',
      icon: '🛡️',
      title: '小队名字生成',
      desc: '根据词库生成冒险队伍名字',
      onClick: () => setOpenPartyNameModal(true)
    }
  ];

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
    
    // 6. Generate Name
    const generatedName = generateRandomName(randomRace.name);

    const newChar = {
      id: crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: generatedName,
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
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 font-sans selection:bg-amber-200">
      {/* Decorative Navbar */}
      <nav id="landing-navbar" className="w-full px-4 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center border-b border-stone-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-1.5 sm:gap-2 text-amber-800">
          <Book className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
          <span className="font-serif font-bold text-base sm:text-lg md:text-xl tracking-tight text-amber-805">
            <span className="hidden sm:inline">Littlh的DND5E角色创建工具</span>
            <span className="sm:hidden">DND5E角色创建</span>
          </span>
        </div>
        
        {/* Desktop menu */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-stone-600 items-center">
          <div className="relative">
            <button
              id="btn-toolbox-toggle"
              onClick={(e) => {
                e.preventDefault();
                setToolboxOpen(!toolboxOpen);
              }}
              className="hover:text-amber-600 transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 font-medium text-sm text-stone-600 outline-none"
            >
              <Wand2 size={16} />
              工具箱
              <span className="text-[10px] opacity-60">▼</span>
            </button>
            {toolboxOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setToolboxOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100 text-left font-sans">
                  {TOOLBOX_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      id={`lnk-toolbox-${item.id}`}
                      onClick={() => {
                        setToolboxOpen(false);
                        item.onClick();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                    >
                      {item.icon} {item.title}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <span className="text-stone-300">|</span>
          <div className="relative">
            <button
              id="btn-settings-toggle"
              onClick={(e) => {
                e.preventDefault();
                setSettingsOpen(!settingsOpen);
              }}
              className="hover:text-amber-600 transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 font-medium text-sm text-stone-600 outline-none"
            >
              <Settings size={16} /> 设置
              <span className="text-[10px] opacity-60">▼</span>
            </button>
            {settingsOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setSettingsOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100 text-left font-sans">
                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      setOpenAiModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    🤖 AI 辅助书写配置
                  </button>
                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      setOpenThemeModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    🎨 网页配色方案
                  </button>
                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      setOpenXgeStepSettingsModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    📜 XGE 经历生成设置
                  </button>
                </div>
              </>
            )}
          </div>
          
          <button
              onClick={() => {
                  setOpenExpModal(true);
              }}
              className="hover:text-amber-600 transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 font-medium text-sm text-stone-600 outline-none"
          >
              <Book size={16} /> 扩展管理
          </button>

          <span className="text-stone-300">|</span>
          <a href="https://github.com/littlhMW/DND5eCharacterTools-" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-stone-900 text-stone-600 transition-colors font-sans leading-none no-underline">
            <Github size={16} /> GitHub 开源
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center p-2 text-stone-600 hover:text-amber-800 focus:outline-none bg-transparent border-none cursor-pointer"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-white border-b border-stone-200 py-3 pb-4 px-4 shadow-lg absolute top-[100%] left-0 z-50 flex flex-col gap-2 font-sans animate-in slide-in-from-top-1 duration-150">
            {/* Toolbox accordion */}
            <div className="border-b border-stone-100 pb-2 pt-1">
              <button
                onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                className="w-full text-left py-1 text-sm font-semibold text-stone-700 hover:text-amber-600 flex justify-between items-center border-none bg-transparent cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Wand2 size={16} className="text-amber-600" /> 快速工具箱
                </span>
                <span className="text-[10px] text-stone-400">{mobileToolsOpen ? '▲' : '▼'}</span>
              </button>
              {mobileToolsOpen && (
                <div className="pl-4 mt-2 border-l-2 border-amber-200/60 flex flex-col gap-1 bg-stone-50/50 py-1.5 rounded-r">
                  {TOOLBOX_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        item.onClick();
                      }}
                      className="w-full text-left py-2 px-1 text-xs text-stone-600 hover:text-amber-800 transition-colors flex items-center gap-2 border-none bg-transparent cursor-pointer"
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings accordion */}
            <div className="border-b border-stone-100 pb-2 pt-1">
              <button
                onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}
                className="w-full text-left py-1 text-sm font-semibold text-stone-700 hover:text-amber-600 flex justify-between items-center border-none bg-transparent cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Settings size={16} className="text-amber-600" /> 系统设置
                </span>
                <span className="text-[10px] text-stone-400">{mobileSettingsOpen ? '▲' : '▼'}</span>
              </button>
              {mobileSettingsOpen && (
                <div className="pl-4 mt-2 border-l-2 border-amber-200/60 flex flex-col gap-1 bg-stone-50/50 py-1.5 rounded-r">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenAiModal(true);
                    }}
                    className="w-full text-left py-2 px-1 text-xs text-stone-600 hover:text-amber-800 transition-colors flex items-center gap-1.5 border-none bg-transparent cursor-pointer"
                  >
                    🤖 AI 辅助书写配置
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenThemeModal(true);
                    }}
                    className="w-full text-left py-2 px-1 text-xs text-stone-600 hover:text-amber-800 transition-colors flex items-center gap-1.5 border-none bg-transparent cursor-pointer"
                  >
                    🎨 网页配色方案
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenXgeStepSettingsModal(true);
                    }}
                    className="w-full text-left py-2 px-1 text-xs text-stone-600 hover:text-amber-800 transition-colors flex items-center gap-1.5 border-none bg-transparent cursor-pointer"
                  >
                    📜 XGE 经历生成设置
                  </button>
                </div>
              )}
            </div>

            {/* Expansion manager */}
            <div className="border-b border-stone-100 pb-2 pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setOpenExpModal(true);
                }}
                className="w-full text-left py-1 text-sm font-semibold text-stone-700 hover:text-amber-600 flex items-center gap-1.5 border-none bg-transparent cursor-pointer"
              >
                <Book size={16} className="text-amber-600" /> 扩展管理
              </button>
            </div>

            {/* GitHub */}
            <div className="pb-1 pt-1">
              <a
                href="https://github.com/littlhMW/DND5eCharacterTools-"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-stone-900 no-underline py-1"
              >
                <Github size={16} className="text-amber-600" /> GitHub 开源
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 flex flex-col items-center px-4 py-12 relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center -z-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }} />

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

        <div className="w-full max-w-7xl relative text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-amber-600/30 pb-4">
            <h2 className="text-2xl font-serif font-bold text-amber-600 flex items-center gap-3 m-0">
              <User size={24} className="text-amber-600" />
              已保存的角色卡
            </h2>
            <button
              id="btn-hero-start"
              onClick={handleStartCreation}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-md font-medium text-sm hover:bg-amber-700 transition-colors shadow-md w-full sm:w-auto justify-center group border-none cursor-pointer"
            >
              <Swords className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              创建新角色
            </button>
          </div>

          {/* Stored Character Cards */}
          {savedChars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
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
          <div className={`rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-8 transition-colors ${
            currentTheme === 'fiveetools'
              ? 'bg-[#f0f7fe] border border-blue-200'
              : currentTheme === 'dndmanual'
              ? 'bg-[#fdf3f3] border border-red-200'
              : 'bg-amber-50/40 border border-amber-200/50'
          }`}>
            <div className="space-y-1 text-left">
              <h3 className={`text-base font-bold flex items-center gap-1.5 font-serif ${
                currentTheme === 'fiveetools'
                  ? 'text-blue-900'
                  : currentTheme === 'dndmanual'
                  ? 'text-red-900'
                  : 'text-stone-900'
              }`}>
                🎲 快速随机生成 (Lv. 3)
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                遵循标准属性购点与规则库，随机生成包含种族、子种族、职业、子职、背景在内的 3 级角色并加入。
              </p>
            </div>
            <button
              id="btn-fast-random"
              onClick={generateRandomCharacter}
              className={`text-xs font-semibold px-4.5 py-2.5 rounded transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-sm border-none active:scale-95 ${
                currentTheme === 'fiveetools'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : currentTheme === 'dndmanual'
                  ? 'bg-red-700 hover:bg-red-800 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <Swords size={14} />
              随机生成
            </button>
          </div>
        </div>

        {/* 工具箱组块 */}
        <div className="w-full max-w-7xl relative text-left mt-12 mb-8">
          <h2 className="text-2xl font-serif font-bold text-amber-600 mb-6 flex items-center gap-3 border-b border-amber-600/30 pb-4">
            <Wand2 size={24} className="text-amber-600" />
            快速工具箱
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TOOLBOX_ITEMS.map((item) => (
              <button key={item.id} onClick={item.onClick} className="flex flex-col items-start text-left gap-2 p-4 bg-white border border-stone-200 rounded-xl shadow-sm hover:border-amber-400 hover:shadow-md transition-all cursor-pointer border-solid">
                <span className="text-3xl mb-1">{item.icon}</span>
                <span className="font-bold text-stone-900 text-sm">{item.title}</span>
                <span className="text-[10px] text-stone-500 leading-tight">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>
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
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Point Buy Modal */}
      {openPointBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-lg max-w-4xl w-full shadow-xl p-3 sm:p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left max-h-[95vh] overflow-y-auto">
            <button 
              onClick={() => setOpenPointBuyModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
              title="关闭"
            >
              ✕
            </button>

            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
                📊 属性数值生成器
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                选择你的属性生成方案，并在需要时预览种族与职业属性加成和定位评估。
              </p>
            </div>

            <AbilityGeneratorTool onClose={() => setOpenPointBuyModal(false)} />
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
                    checked={!!aiConfig.detailsEnabled}
                    onChange={(e) => {
                      const val = e.target.checked;
                      const updated = saveAIConfig({ detailsEnabled: val, enabled: val || !!aiConfig.partyBioEnabled });
                      setAiConfig(updated);
                    }}
                    className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-stone-700">启用 AI 角色细节书写与生平润色 （角色栏位）</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer border-t border-stone-150 pt-2.5 mt-1">
                  <input
                    type="checkbox"
                    checked={!!aiConfig.partyBioEnabled}
                    onChange={(e) => {
                      const val = e.target.checked;
                      const updated = saveAIConfig({ partyBioEnabled: val, enabled: val || !!aiConfig.detailsEnabled });
                      setAiConfig(updated);
                    }}
                    className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-stone-700">启用 AI 冒险队小队故事撰写 （小队生成器）</span>
                </label>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed font-sans">
                细节书写与小队故事撰写现已完全**独立隔离**运作。系统允许您根据需要，单独开启/关闭其中任意一项。
                <br />
                - 开启「细节书写」后，自定义单个角色的「外观」与「背景故事」中会出现闪光专属润色按钮。
                <br />
                - 开启「小队故事撰写」后，联袂 4 人小队生成器中会展现专属小队故事选项卡，为您编撰富有宿命羁绊的关系故事。
              </p>

              {(aiConfig.detailsEnabled || aiConfig.partyBioEnabled) ? (
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
                      <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">模型名</label>
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
                      API 密钥
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
                  AI 功能已全部关闭。若需启用角色卡或小队的 AI 撰稿能力，请勾选上方开关并配置 API。
                </div>
              )}
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-end">
              <button
                onClick={() => setOpenAiModal(false)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
              >
                保存关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Select Modal */}
      {openThemeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-lg max-w-sm w-full shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
            <button 
              onClick={() => setOpenThemeModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
              title="关闭"
            >
              ✕
            </button>

            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                🎨 网页配色方案
              </h2>
              <p className="text-xs text-stone-505 mt-1">
                选择您偏好的主题背景风格。该设置将保存在本地并自动应用。
              </p>
            </div>

            <div className="space-y-4 pb-2 pt-2 max-h-[60vh] overflow-y-auto pr-1">
              {(() => {
                const themesList = [
                  { id: 'dndmanual', name: '📕 龙与地下城手册', group: '经典地志与人文', desc: '根据官方 D&D 规则手册/怪物图鉴排版提取：暖象牙卡纸色底、深邃炭黑字迹与龙与地下城经典暗血红主标题交织（默认）' },
                  { id: 'fiveetools', name: '🔵 5etools 蓝配色', group: '经典地志与人文', desc: '高度还原官方 5etools 中文双栏工具站排版结构：纯白纸感背景配以微黄、暖象牙纸张色底作为部件容器，点缀以经典的 5etools 标志性钴蓝标题与炭黑文字' },
                  { id: 'parchment', name: '📜 人类：兼爱羊皮纸', group: '经典地志与人文', desc: '经典复古人族黄铜与深褐暖色羊皮纸张，护眼且优雅' },
                  { id: 'candlekeep', name: '🌲 烛堡：书卷绿林', group: '经典地志与人文', desc: '宁静沉稳的墨竹翠羽与书桌红木褐，墨卷留香书香门第首选' },
                  { id: 'swordcoast', name: '⚓ 剑湾：蓝墨古卷', group: '经典地志与人文', desc: '航海图纸的淡雅褪色蓝与羊皮墨水蓝，辅以低饱和海盐绿，呈现经典桌面冒险地图风格' },
                  { id: 'waterdeep', name: '🏰 深水城：繁华商贸', group: '经典地志与人文', desc: '中性明亮的石板灰白背景，搭配彰显财富的奢华亮金交互色，呈现自由之城的繁盛气派' },
                  { id: 'shadowfell', name: '💀 堕影冥界：灰白视界', group: '经典地志与人文', desc: '褪离色彩的中性黑白灰调，以纯粹的高阶老旧文本质感呈现极简护眼结构' },
                  { id: 'feywild', name: '🌸 妖精荒野：幻境花海', group: '经典地志与人文', desc: '轻盈霓幻的樱草粉与野生薰衣草紫，富有迷迭香魔力的春意幻境' },
                  { id: 'astral', name: '🌌 星际星海：太虚天盘', group: '经典地志与人文', desc: '深海太虚墨蓝与紫荧恒星折光，璀璨梦幻的高阶玄秘星盘色彩' },
                  { id: 'dark', name: '🌙 核心：深幽夜幕', group: '经典地志与人文', desc: '更广明度范围的高对比度冷灰深色模式，不带任何环境光晕的经典明快黑暗底色' },

                  { id: 'highforest', name: '🏹 精灵：高深绿野', group: '种族与血统特色', desc: '古树绿梢：温润的常青松针绿与原宿林木金，充满自然植物气息与灵动' },
                  { id: 'dwarf', name: '⛏️ 矮人：深山秘银', group: '种族与血统特色', desc: '秘银大堂：稳重炭黑玄武岩体，缀以秘银纯亮银与锻造炉膛赤金色' },
                  { id: 'avernus', name: '🔥 提夫林：九域惩击', group: '种族与血统特色', desc: '炼狱邪曜：余烬微粒黑，衬托焦黑阿弗纳斯熔岩爆炎与亮丽邪魅明橙' },
                  { id: 'gnome', name: '⚙️ 侏儒：日曜旅程', group: '种族与血统特色', desc: '黄金周日：古铜与明黄色交织的复古日曜日光泽，呈现灵动活泼的探索旅程' },
                  { id: 'dragonborn', name: '🪙 龙裔：火山洗礼', group: '种族与血统特色', desc: '火山吐息：赤火铜与红宝石鳞片折光质感，气势雄浑，威严夺目' },
                  { id: 'underdark', name: '🔮 卓尔：荧光深邃', group: '种族与血统特色', desc: '幽暗地下：深邃黑曜石，泛着秘法紫玛瑙莹光，契合地牢夜间体验' }
                ];

                const groups = themesList.reduce((acc, current) => {
                  if (!acc[current.group]) {
                    acc[current.group] = [];
                  }
                  acc[current.group].push(current);
                  return acc;
                }, {} as Record<string, typeof themesList>);

                return Object.entries(groups).map(([groupName, items]) => (
                  <div key={groupName} className="space-y-2">
                    <div className="text-xs font-bold font-sans text-stone-500 uppercase tracking-wider border-l-2 border-amber-500 pl-2 py-0.5 mt-4">
                      {groupName}
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {items.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setCurrentTheme(theme.id);
                            localStorage.setItem('dndTheme', theme.id);
                            document.documentElement.setAttribute('data-theme', theme.id);
                          }}
                          className={`w-full text-left p-3 rounded border transition-all cursor-pointer flex flex-col gap-1 ${
                            currentTheme === theme.id 
                              ? 'border-amber-500 bg-amber-50/50 shadow-sm' 
                              : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className={`font-semibold text-sm ${currentTheme === theme.id ? 'text-amber-800' : 'text-stone-800'}`}>
                              {theme.name}
                            </span>
                            {currentTheme === theme.id && <span className="text-amber-600">✓</span>}
                          </div>
                          <span className="text-[11px] text-stone-500">{theme.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-end">
              <button
                onClick={() => setOpenThemeModal(false)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* XGE Step Settings Modal */}
      {openXgeStepSettingsModal && (
        <div id="modal-xge-step-settings" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
            <button 
              id="btn-close-xge-step-settings"
              onClick={() => setOpenXgeStepSettingsModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
              title="关闭"
            >
              ✕
            </button>

            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                📜 XGE 经历生成设置
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                配置角色创建中「5.细节」步骤里的 Xanathar 经历生成选项。
              </p>
            </div>

            <div className="space-y-4 text-sm font-sans">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="chk-xge-enabled-details"
                    checked={xgeEnabledInDetails}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setXgeEnabledInDetails(val);
                      localStorage.setItem('xgeEnabledInDetails', String(val));
                    }}
                    className="w-4 h-4 mt-0.5 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                  />
                  <label htmlFor="chk-xge-enabled-details" className="text-xs font-semibold text-stone-700 cursor-pointer flex-1 select-none">
                    在「细节」面板中启用 XGE 经历生成功能
                    <span className="block text-[11px] text-stone-550 font-normal mt-1 leading-normal">
                      开启后，在角色创建第 5 步「细节」中的“背景故事”栏位旁会激活「生成生平经历」按钮。默认关闭。
                    </span>
                  </label>
                </div>

                <div className="flex items-start gap-2.5 border-t border-stone-150 pt-3">
                  <input
                    type="checkbox"
                    id="chk-xge-use-nonphb-details"
                    checked={xgeUseNonPhbInDetails}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setXgeUseNonPhbInDetails(val);
                      localStorage.setItem('xgeUseNonPhbInDetails', String(val));
                    }}
                    className="w-4 h-4 mt-0.5 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                  />
                  <label htmlFor="chk-xge-use-nonphb-details" className="text-xs font-semibold text-stone-700 cursor-pointer flex-1 select-none">
                    在「细节」中进行经历生成时启用非 PHB 职业与背景映射
                    <span className="block text-[11px] text-stone-550 font-normal mt-1 leading-normal">
                      若启用，当检测到或指定扩展背景与职业时（如血猎、奇艺发明家或自设背景），程序会给予支持和智能匹配，不再报错或回退。
                    </span>
                  </label>
                </div>

                <div className="flex items-start gap-2.5 border-t border-stone-150 pt-3">
                  <input
                    type="checkbox"
                    id="chk-xge-use-expanded-details"
                    checked={xgeUseExpandedInDetails}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setXgeUseExpandedInDetails(val);
                      localStorage.setItem('xgeUseExpandedInDetails', String(val));
                    }}
                    className="w-4 h-4 mt-0.5 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                  />
                  <label htmlFor="chk-xge-use-expanded-details" className="text-xs font-semibold text-stone-700 cursor-pointer flex-1 select-none">
                    在「细节」中进行经历生成时默认使用额外扩展内容描述
                    <span className="block text-[11px] text-stone-550 font-normal mt-1 leading-normal">
                      若启用，在掷骰宿命或变数时，将会额外合并并加载各种特殊传奇奇遇、不测命运及波澜表。
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-end">
              <button
                id="btn-save-xge-step-settings"
                onClick={() => setOpenXgeStepSettingsModal(false)}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
              >
                保存并关闭
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
              <div className="flex flex-col gap-2 bg-amber-50/50 p-2 rounded border border-amber-200">
                <div className="flex items-start gap-2">
                  <input 
                    type="checkbox"
                    id="xgeNonPhbSupportToggle"
                    checked={localStorage.getItem('useNonPhbSupportXge') !== 'false'}
                    onChange={(e) => {
                      localStorage.setItem('useNonPhbSupportXge', String(e.target.checked));
                      setXgePreviewText(xgePreviewText + ' ');
                      setTimeout(() => setXgePreviewText((prev) => prev.trim()), 0);
                    }}
                    className="w-4 h-4 mt-0.5 text-amber-600 rounded bg-white border-stone-300 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="xgeNonPhbSupportToggle" className="text-xs font-semibold text-amber-900 cursor-pointer flex-1">
                    开启非 PHB 背景/职业支持
                    <span className="block text-[10px] text-amber-700/80 font-normal mt-0.5">
                      不仅支持 PHB，还解锁所有扩展包中的职业与背景的故事支持。
                    </span>
                  </label>
                </div>
                <div className="flex items-start gap-2 border-t border-amber-200/50 pt-2">
                  <input 
                    type="checkbox"
                    id="xgeExpandedToggle"
                    checked={localStorage.getItem('useExpandedXge') === 'true'}
                    onChange={(e) => {
                      localStorage.setItem('useExpandedXge', String(e.target.checked));
                      setXgePreviewText(xgePreviewText + ' ');
                      setTimeout(() => setXgePreviewText((prev) => prev.trim()), 0);
                    }}
                    className="w-4 h-4 mt-0.5 text-amber-600 rounded bg-white border-stone-300 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="xgeExpandedToggle" className="text-xs font-semibold text-amber-900 cursor-pointer flex-1">
                    启用个人故事扩展（非官方内容）
                    <span className="block text-[10px] text-amber-700/80 font-normal mt-0.5">
                      解锁数倍于原版的自制随机背景、奇遇、命运波澜。
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    选择职业：
                  </label>
                  <select
                    value={xgePreviewClass}
                    onChange={(e) => setXgePreviewClass(e.target.value)}
                    className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none cursor-pointer h-[34px]"
                  >
                    <option value="">(空缺则随机)</option>
                    {localStorage.getItem('useNonPhbSupportXge') !== 'false' 
                      ? classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                      : [
                          {id: 'barbarian', name: '野蛮人'},
                          {id: 'bard', name: '吟游诗人'},
                          {id: 'cleric', name: '牧师'},
                          {id: 'druid', name: '德鲁伊'},
                          {id: 'fighter', name: '战士'},
                          {id: 'monk', name: '武僧'},
                          {id: 'paladin', name: '圣武士'},
                          {id: 'ranger', name: '游侠'},
                          {id: 'rogue', name: '游荡者'},
                          {id: 'sorcerer', name: '术士'},
                          {id: 'warlock', name: '邪术师'},
                          {id: 'wizard', name: '法师'}
                        ].map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                    }
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    选择背景：
                  </label>
                  <select
                    value={xgePreviewBg}
                    onChange={(e) => setXgePreviewBg(e.target.value)}
                    className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none cursor-pointer h-[34px]"
                  >
                    <option value="">(空缺则随机)</option>
                    {localStorage.getItem('useNonPhbSupportXge') !== 'false' 
                      ? backgrounds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                      : [
                          {id: 'acolyte', name: '侍祭'},
                          {id: 'charlatan', name: '骗子'},
                          {id: 'criminal', name: '罪犯'},
                          {id: 'entertainer', name: '艺人'},
                          {id: 'folk-hero', name: '平民英雄'},
                          {id: 'guild-artisan', name: '工匠行会'},
                          {id: 'hermit', name: '隐士'},
                          {id: 'noble', name: '贵族'},
                          {id: 'outlander', name: '荒野隐士'},
                          {id: 'sage', name: '贤者'},
                          {id: 'sailor', name: '水手'},
                          {id: 'soldier', name: '士兵'},
                          {id: 'urchin', name: '孤儿'}
                        ].map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                    }
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    年龄：
                  </label>
                  <input
                    type="number"
                    placeholder="随机"
                    value={xgePreviewAge}
                    onChange={(e) => setXgePreviewAge(e.target.value ? parseInt(e.target.value, 10) : '')}
                    className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none h-[34px]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    魅力调整值：
                  </label>
                  <input
                    type="number"
                    placeholder="默认 +0"
                    value={xgePreviewChaMod}
                    onChange={(e) => setXgePreviewChaMod(e.target.value ? parseInt(e.target.value, 10) : '')}
                    className="w-full text-xs bg-white border border-stone-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none h-[34px]"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center bg-stone-50 border border-stone-200 rounded p-3">
                <span className="text-[11px] text-stone-600">
                  生成人生经历：
                </span>
                <button
                  onClick={() => {
                    const useExpanded = localStorage.getItem('useExpandedXge') === 'true';
                    const useNonPhbSupport = localStorage.getItem('useNonPhbSupportXge') !== 'false';
                    const ctx = { 
                      backgroundId: xgePreviewBg, 
                      classId: xgePreviewClass,
                      age: typeof xgePreviewAge === 'number' ? xgePreviewAge : undefined,
                      chaMod: typeof xgePreviewChaMod === 'number' ? xgePreviewChaMod : undefined
                    };
                    const text = generateXgeBackstory(ctx, { useExpanded, useNonPhbSupport });
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
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
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
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded transition-colors shadow-xs border-none cursor-pointer flex items-center gap-1 font-sans"
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
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded transition-colors shadow-sm cursor-pointer border-none"
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

      {/* Toolbox Modals */}
      {openEncounterModal && <EncounterCalculator onClose={() => setOpenEncounterModal(false)} />}
      {openPartyModal && (
        <PartyGenerator 
          onClose={() => {
            setOpenPartyModal(false);
            const saved = localStorage.getItem('dndChars');
            if (saved) setSavedChars(JSON.parse(saved));
          }} 
          onSaveCharacter={() => {
            const saved = localStorage.getItem('dndChars');
            if (saved) setSavedChars(JSON.parse(saved));
          }}
        />
      )}
      {openNameModal && <NameGeneratorModal onClose={() => setOpenNameModal(false)} />}
      {openPartyNameModal && <PartyNameGeneratorModal onClose={() => setOpenPartyNameModal(false)} />}
      {openDetailGenModal && <AppearancePersonalityGenerator onClose={() => setOpenDetailGenModal(false)} />}
    </div>
  );
}
