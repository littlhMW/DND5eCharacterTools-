import React, { useState, useEffect } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Book, Shield, Scroll, Swords, Github, ExternalLink, Info, Wand2, User, Settings, Menu, X, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { classes } from '../data/classes';
import { races, getRaceByIdAndSource } from '../data/races';
import { backgrounds } from '../data/backgrounds';
import { getAIConfig, saveAIConfig, PROVIDERS } from '../utils/aiHelper';
import { EXPANSIONS, getActiveExpansions, saveActiveExpansions, ExpansionBook, getExpansionSettings, saveExpansionSettings, BookSettings, isSourceEnabled } from '../utils/expansionHelper';
import { generateXgeBackstory } from '../utils/xgeLifeGenerator';
import { EncounterCalculator } from './tools/EncounterCalculator';
import { PartyGenerator } from './tools/PartyGenerator';
import { AppearancePersonalityGenerator, RACES_MAPPING, getBestRaceAssetsKey, UNIVERSAL_APPEARANCE_FEATURES, PURE_MASKED_APPEARANCES, EXTRA_PERSON_TRAITS, EXTRA_QUIRKS, LAW_CHAOS_AXIS, GOOD_EVIL_AXIS } from './tools/AppearancePersonalityGenerator';
import { NameGeneratorModal } from './tools/NameGeneratorModal';
import { QuickDiceRoller } from './tools/QuickDiceRoller';
import { generateRandomName } from '../utils/nameGenerator';
import { PartyNameGeneratorModal } from './tools/PartyNameGeneratorModal';
import { AbilityGeneratorTool } from './tools/AbilityGeneratorTool';
import { ExpansionsModal } from './modals/ExpansionsModal';
import { AiConfigModal } from './modals/AiConfigModal';
import { ThemeSettingsModal } from './modals/ThemeSettingsModal';
import { XgeStepSettingsModal } from './modals/XgeStepSettingsModal';
import { XgeModal } from './tools/XgeModal';
import { TitleGeneratorModal } from './tools/TitleGeneratorModal';
import { generateTitle } from '../utils/titleGenerator';

import { getAvailableRaces } from '../utils/raceHelper';

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
  const [themeOpen, setThemeOpen] = useState(false);
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
  const [openTitleModal, setOpenTitleModal] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openThemeModal, setOpenThemeModal] = useState(false);
  const [openXgeStepSettingsModal, setOpenXgeStepSettingsModal] = useState(false);
  const [xgeEnabledInDetails, setXgeEnabledInDetails] = useState(() => {
    const val = localStorage.getItem('xgeEnabledInDetails');
    if (val === null) {
      localStorage.setItem('xgeEnabledInDetails', 'true');
      return true;
    }
    return val === 'true';
  });
  const [useExpandedXge, setUseExpandedXge] = useState(() => localStorage.getItem('useExpandedXge') === 'true');
  const [useNonPhbSupportXge, setUseNonPhbSupportXge] = useState(() => localStorage.getItem('useNonPhbSupportXge') === 'true');
  const [appGenEnabledInRandom, setAppGenEnabledInRandom] = useState(() => localStorage.getItem('appGenEnabledInRandom') !== 'false');
  const [nameGenEnabledInRandom, setNameGenEnabledInRandom] = useState(() => localStorage.getItem('nameGenEnabledInRandom') !== 'false');
  const [titleEnabledInRandom, setTitleEnabledInRandom] = useState(() => localStorage.getItem('titleEnabledInRandom') !== 'false');
  const [showTitleOnSheet, setShowTitleOnSheet] = useState(() => localStorage.getItem('showTitleOnSheet') !== 'false');
  const [showXpOnSheet, setShowXpOnSheet] = useState(() => localStorage.getItem('showXpOnSheet') !== 'false');
  const [appGenEnabledInDetails, setAppGenEnabledInDetails] = useState(() => localStorage.getItem('appGenEnabledInDetails') !== 'false');
  const [nameGenEnabledInTools, setNameGenEnabledInTools] = useState(() => localStorage.getItem('nameGenEnabledInTools') !== 'false');
  
  // Decoupled detailed states
  const [traitGenEnabledInDetails, setTraitGenEnabledInDetails] = useState(() => localStorage.getItem('traitGenEnabledInDetails') !== 'false');
  const [titleGenEnabledInDetails, setTitleGenEnabledInDetails] = useState(() => localStorage.getItem('titleGenEnabledInDetails') !== 'false');
  const [partyNameGenEnabled, setPartyNameGenEnabled] = useState(() => localStorage.getItem('partyNameGenEnabled') !== 'false');
  const [partyAppGenEnabled, setPartyAppGenEnabled] = useState(() => localStorage.getItem('partyAppGenEnabled') !== 'false');
  const [partyTitleGenEnabled, setPartyTitleGenEnabled] = useState(() => localStorage.getItem('partyTitleGenEnabled') === 'true');
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('dndTheme') || 'dndmanual');

  const getThemeName = (themeId: string) => {
    const names: Record<string, string> = {
      dndmanual: '龙与地下城手册',
      candlekeep: '烛堡：静谧繁花',
      swordcoast: '剑湾：蓝墨古卷',
      waterdeep: '深水城：蔚蓝金冕',
      shadowfell: '堕影冥界：暗影无声',
      feywild: '妖精荒野：幻境花海',
      astral: '星界星海：太虚天盘',
      parchment: '人类：兼爱羊皮纸',
      highforest: '精灵：高深绿野',
      dwarf: '矮人：巨石熔炉',
      avernus: '提夫林：九域惩击',
      gnome: '侏儒：日曜旅程',
      dragonborn: '龙裔：火山岩浆',
      underdark: '卓尔：荧光深邃',
      golddragon: '金龙：崇高耀金',
      halfling: '半身人：南瓜与清茶',
      orc: '兽人：战狂绿血',
      underdark_shroom: '幽暗地域：迷幻巨蕈',
      icewind: '冰风谷的孤木林',
      sigil: '环印城：石头与奥秘',
      baldursgate: '博德之门：暮色降临',
      neverwinter: '无冬城：冰雪与坚石',
      mistyvale: '迷雾谷地：森冷木棕',
      fiveetools: '5etools 钴蓝排版',
      cocgreen: '克苏鲁邪神墨绿'
    };
    return names[themeId] || themeId;
  };

  const selectRandomTheme = () => {
    const themeIds = [
      'dndmanual', 'candlekeep', 'swordcoast', 'waterdeep', 'shadowfell', 'feywild',
      'astral', 'parchment', 'highforest', 'dwarf', 'avernus', 'gnome',
      'dragonborn', 'underdark', 'golddragon', 'halfling', 'orc', 'underdark_shroom', 'icewind', 'sigil', 'baldursgate', 'neverwinter', 'mistyvale', 'fiveetools', 'cocgreen'
    ];
    const options = themeIds.filter(id => id !== currentTheme);
    const randomTheme = options[Math.floor(Math.random() * options.length)];
    setCurrentTheme(randomTheme);
    localStorage.setItem('dndTheme', randomTheme);
    document.documentElement.setAttribute('data-theme', randomTheme);
    
    setToastText(`已随机切换配色方案！当前为：${getThemeName(randomTheme)}`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const [activeExpansions, setActiveExpansions] = useState<string[]>(() => getActiveExpansions());
  const [expansionSettings, setExpansionSettings] = useState<Record<string, BookSettings>>(() => getExpansionSettings());
  const [xgePreviewBg, setXgePreviewBg] = useState('');
  const [xgePreviewClass, setXgePreviewClass] = useState('');
  const [xgePreviewAge, setXgePreviewAge] = useState<number | ''>('');
  const [xgePreviewChaMod, setXgePreviewChaMod] = useState<number | ''>('');
  const [xgePreviewText, setXgePreviewText] = useState('');

  const TOOLBOX_ITEMS = [
    {
      id: 'dice',
      icon: '🎲',
      title: '快速掷骰',
      desc: '支持d4-d100及自定义组合',
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
    },
    {
      id: 'title-gen',
      icon: '🎖️',
      title: '冒险者称号生成',
      desc: '生成极具跑团代入感的专属称号',
      onClick: () => setOpenTitleModal(true)
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

  const getCharacterCardStyles = (themeId: string) => {
    switch (themeId) {
      case 'swordcoast':
        return {
          card: "bg-[#2d2218] border-[#4a3424] hover:border-[#ffd499] text-[#f9f2e5] shadow-md",
          title: "text-[#ffd499] font-serif font-bold",
          metaText: "text-[#d6c9ba]",
          levelBadge: "bg-[#3e2e21] text-[#ffd499]",
          button: "bg-[#7c4d2d] hover:bg-[#915b37] text-white"
        };
      case 'cocgreen':
        return {
          card: "bg-[#0c1813] border-[#00ff88]/35 hover:border-[#00ff88] text-[#fcdd93] shadow-md",
          title: "text-[#00ff88] font-serif font-bold",
          metaText: "text-[#fcdd93]/70",
          levelBadge: "bg-[#254a3c]/35 text-[#00ff88]",
          button: "bg-[#00ff88]/80 hover:bg-[#00ff88] text-[#07120e] font-bold"
        };
      case 'dark':
        return {
          card: "bg-[#161922] border-stone-700/80 hover:border-amber-450 text-stone-100 shadow-md",
          title: "text-white font-serif font-bold",
          metaText: "text-[#ced3df]",
          levelBadge: "bg-[#252a3a] text-amber-500",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-semibold"
        };
      case 'shadowfell':
        return {
          card: "bg-[#efeff5] border-[#b3b3cb] hover:border-[#5c5c7d] text-[#0a0a12] shadow-md",
          title: "text-[#0a0a12] font-serif font-bold",
          metaText: "text-[#5c5c7d]",
          levelBadge: "bg-[#dcdce6] text-[#3a3a52]",
          button: "bg-[#5c5c7d] hover:bg-[#3a3a52] text-white"
        };
      case 'underdark':
        return {
          card: "bg-[#130E20] border-[#3D3554] hover:border-[#D946EF] text-[#F4EEFF] shadow-md",
          title: "text-[#F4EEFF] font-serif font-bold",
          metaText: "text-[#A497C6]",
          levelBadge: "bg-[#2E2841] text-[#D946EF]",
          button: "bg-[#9D32AF] hover:bg-[#BB3CCF] text-white"
        };
      case 'avernus':
        return {
          card: "bg-[#1a0f15] border-[#38232e] hover:border-[#ff3d71] text-[#f0e2ea] shadow-md",
          title: "text-[#ff7da7] font-serif font-bold",
          metaText: "text-[#cca9bc]",
          levelBadge: "bg-[#330a21] text-[#ff3d71]",
          button: "bg-[#ff3d71] hover:bg-[#ff5e97] text-white"
        };
      case 'astral':
        return {
          card: "bg-[#0a0714] border-[#2c2354] hover:border-[#bf5bfa] text-[#ccc4fa] shadow-md",
          title: "text-[#db9eff] font-serif font-bold",
          metaText: "text-[#9c8df2]",
          levelBadge: "bg-[#1c0d3a] text-[#bf5bfa]",
          button: "bg-[#5c2ba6] hover:bg-[#aa40e6] text-[#faf5ff]"
        };
      case 'dwarf':
        return {
          card: "bg-[#1d1612] border-[#3d3229] hover:border-[#d35400] text-[#e6ded8] shadow-md",
          title: "text-[#ffb780] font-serif font-bold",
          metaText: "text-[#cbbcb0]",
          levelBadge: "bg-[#3d3229] text-[#d35400]",
          button: "bg-[#d35400] hover:bg-[#e35a16] text-white"
        };
      case 'dragonborn':
        return {
          card: "bg-[#2a0405] border-[#4a0f0e] hover:border-[#ff4444] text-[#fbbfbf] shadow-md",
          title: "text-[#ffeacc] font-serif font-bold",
          metaText: "text-[#fbbfbf]",
          levelBadge: "bg-[#4a0f0e] text-[#ff4444]",
          button: "bg-[#ff4444] hover:bg-[#e65100] text-white"
        };
      case 'candlekeep':
        return {
          card: "bg-[#edf0e2] border-[#dae2cb] hover:border-[#ff3c63] text-stone-900 shadow-sm",
          title: "text-stone-950 font-serif font-bold",
          metaText: "text-stone-700",
          levelBadge: "bg-[#dae2cb] text-[#515931]",
          button: "bg-[#ff3c63] hover:bg-[#e61a43] text-white font-semibold"
        };
      case 'gnome':
        return {
          card: "bg-[#dbd7d1] border-[#B3ADA5] hover:border-[#DFB746] text-stone-900 shadow-sm",
          title: "text-stone-950 font-bold",
          metaText: "text-stone-800",
          levelBadge: "bg-[#c6c0b9] text-stone-900",
          button: "bg-[#DFB746] hover:bg-[#C29B40] text-stone-950 font-medium"
        };
      case 'underdark_shroom':
        return {
          card: "bg-[#f4f2f8] border-[#cfc7e0] hover:border-[#c32ef0] text-[#29203a] shadow-sm",
          title: "text-[#413557] font-serif font-bold",
          metaText: "text-[#50406b]",
          levelBadge: "bg-[#e7e3f0] text-[#c32ef0]",
          button: "bg-[#c32ef0] hover:bg-[#a120cb] text-white"
        };
      case 'icewind':
        return {
          card: "bg-[#f6f8fb] border-[#d0d9e5] hover:border-[#568866] text-[#202733] shadow-sm",
          title: "text-[#3d4a5c] font-serif font-bold",
          metaText: "text-[#48576c]",
          levelBadge: "bg-[#e8ecf3] text-[#568866]",
          button: "bg-[#568866] hover:bg-[#3e664b] text-white"
        };
      case 'sigil':
        return {
          card: "bg-[#f5f5f5] border-[#d4d4d4] hover:border-[#d2831c] text-[#0a0a0a] shadow-sm",
          title: "text-[#171717] font-serif font-bold",
          metaText: "text-[#262626]",
          levelBadge: "bg-[#e5e5e5] text-[#d2831c]",
          button: "bg-[#d2831c] hover:bg-[#b06a12] text-white"
        };
      case 'baldursgate':
        return {
          card: "bg-[#161821] border-[#2e3348] hover:border-[#f29a50] text-[#f2f4fa] shadow-md",
          title: "text-[#f2f4fa] font-serif font-bold",
          metaText: "text-[#c2c9e0]",
          levelBadge: "bg-[#1f2230] text-[#f29a50]",
          button: "bg-[#f29a50] hover:bg-[#e08638] text-[#1f2230]"
        };
      case 'neverwinter':
        return {
          card: "bg-[#141b21] border-[#293a4a] hover:border-[#94cbf0] text-[#f4f7fb] shadow-md",
          title: "text-[#f4f7fb] font-serif font-bold",
          metaText: "text-[#c1d5ea]",
          levelBadge: "bg-[#1c2731] text-[#94cbf0]",
          button: "bg-[#94cbf0] hover:bg-[#7db4db] text-[#1c2731]"
        };
      case 'mistyvale':
        return {
          card: "bg-[#191817] border-[#3b3732] hover:border-[#5dc391] text-[#f5f3f0] shadow-md",
          title: "text-[#f5f3f0] font-serif font-bold",
          metaText: "text-[#cec8bd]",
          levelBadge: "bg-[#262421] text-[#5dc391]",
          button: "bg-[#5dc391] hover:bg-[#4aa578] text-[#191817]"
        };
      case 'golddragon':
        return {
          card: "bg-[#fdfaf0] border-[#fae4a7] hover:border-[#faa307] text-[#462208] shadow-sm",
          title: "text-[#864614] font-serif font-bold",
          metaText: "text-[#a45a13]",
          levelBadge: "bg-[#fdf5e0] text-[#faa307]",
          button: "bg-[#faa307] hover:bg-[#d68b00] text-white"
        };
      case 'halfling':
        return {
          card: "bg-[#f8f9f5] border-[#d7e0c9] hover:border-[#ec6d10] text-[#212915] shadow-sm",
          title: "text-[#3f4c2c] font-serif font-bold",
          metaText: "text-[#516137]",
          levelBadge: "bg-[#eef2e7] text-[#ec6d10]",
          button: "bg-[#ec6d10] hover:bg-[#ce5d00] text-white"
        };
      case 'orc':
        return {
          card: "bg-[#f6f8f5] border-[#ccd8ca] hover:border-[#d44d57] text-[#1b241a] shadow-sm",
          title: "text-[#364434] font-serif font-bold",
          metaText: "text-[#425340]",
          levelBadge: "bg-[#e7ece5] text-[#d44d57]",
          button: "bg-[#d44d57] hover:bg-[#b53a43] text-white"
        };
      default:
        return {
          card: "bg-white border border-stone-200 text-stone-900 hover:border-amber-300 shadow-sm",
          title: "text-stone-900 font-serif font-bold group-hover:text-amber-700",
          metaText: "text-stone-500",
          levelBadge: "bg-stone-100 text-stone-700 font-mono",
          button: "text-amber-600 hover:text-amber-700 w-full bg-amber-50 hover:bg-amber-100 py-2 rounded-lg transition-colors border-none cursor-pointer"
        };
    }
  };

  const getRandomGenModuleStyles = () => {
    switch (currentTheme) {
      // 1. 深色/特定主题：需要高度对比、柔和发光的极高可读面盘和配字
      case 'dark':
        return {
          container: "bg-[#1e212b] border-[#2c2f3b] text-neutral-200 shadow-md",
          title: "text-white font-serif font-bold",
          desc: "text-[#ced3df] opacity-90",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'shadowfell':
        return {
          container: "bg-[#efeff5] border-[#b3b3cb] text-[#0a0a12] shadow-md",
          title: "text-[#0a0a12] font-serif font-bold",
          desc: "text-[#5c5c7d] opacity-90",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'underdark':
        return {
          container: "bg-[#130E20] border-[#3D3554] text-[#ECE6FC] shadow-md",
          title: "text-[#D946EF] font-serif font-bold",
          desc: "text-[#A497C6] opacity-90",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'avernus':
        return {
          container: "bg-[#1E1219] border-[#38232e] text-[#f0e2ea] shadow-md",
          title: "text-[#ff3d71] font-serif font-bold",
          desc: "text-[#cca9bc] opacity-90",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'astral':
        return {
          container: "bg-[#120e24] border-[#2c2354] text-[#ccc4fa] shadow-md",
          title: "text-[#bf5bfa] font-serif font-bold",
          desc: "text-[#9c8df2] opacity-90",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'dwarf':
        return {
          container: "bg-[#1d1612] border-[#3d3229] text-[#e6ded8] shadow-md",
          title: "text-[#d35400] font-serif font-bold",
          desc: "text-[#cbbcb0] opacity-90",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'dragonborn':
        return {
          container: "bg-[#2a0405] border-[#4a0f0e] text-[#fbbfbf] shadow-md",
          title: "text-[#ff4444] font-serif font-bold",
          desc: "text-[#fbbfbf] opacity-90",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      
      // 2. 中性色主题
      case 'candlekeep':
        return {
          container: "bg-[#dae2cb] border-[#c1cca3] text-stone-900 shadow-inner",
          title: "text-stone-950 font-serif font-bold",
          desc: "text-stone-800",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'gnome':
        return {
          container: "bg-[#CBC6C0] border-[#B3ADA5] text-stone-900 shadow-inner",
          title: "text-stone-950 font-bold",
          desc: "text-stone-800",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'cocgreen':
        return {
          container: "bg-[#0c1813] border-[#00ff88]/30 shadow-md text-[#fcdd93]",
          title: "text-[#00ff88] font-serif font-bold",
          desc: "text-[#fcdd93] opacity-90",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'swordcoast':
        return {
          container: "bg-[#2d2218] border-[#4a3424] shadow-md text-[#f9f2e5]",
          title: "text-[#ffd499] font-serif font-bold",
          desc: "text-[#d6c9ba]",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'baldursgate':
        return {
          container: "bg-[#161821] border-[#2e3348] text-[#f2f4fa] shadow-md",
          title: "text-[#f29a50] font-serif font-bold",
          desc: "text-[#c2c9e0] opacity-90",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'neverwinter':
        return {
          container: "bg-[#141b21] border-[#293a4a] text-[#f4f7fb] shadow-md",
          title: "text-[#94cbf0] font-serif font-bold",
          desc: "text-[#c1d5ea] opacity-90",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'mistyvale':
        return {
          container: "bg-[#191817] border-[#3b3732] text-[#f5f3f0] shadow-md",
          title: "text-[#5dc391] font-serif font-bold",
          desc: "text-[#cec8bd] opacity-90",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'underdark_shroom':
        return {
          container: "bg-[#f4f2f8] border-[#cfc7e0] text-[#29203a] shadow-inner",
          title: "text-[#413557] font-serif font-bold",
          desc: "text-[#50406b]",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'icewind':
        return {
          container: "bg-[#f6f8fb] border-[#d0d9e5] text-[#202733] shadow-inner",
          title: "text-[#3d4a5c] font-serif font-bold",
          desc: "text-[#48576c]",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'sigil':
        return {
          container: "bg-[#f5f5f5] border-[#d4d4d4] text-[#0a0a0a] shadow-inner",
          title: "text-[#171717] font-serif font-bold",
          desc: "text-[#262626]",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'golddragon':
        return {
          container: "bg-[#fdfaf0] border-[#fae4a7] text-[#462208] shadow-inner",
          title: "text-[#864614] font-serif font-bold",
          desc: "text-[#a45a13]",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'halfling':
        return {
          container: "bg-[#f8f9f5] border-[#d7e0c9] text-[#212915] shadow-inner",
          title: "text-[#3f4c2c] font-serif font-bold",
          desc: "text-[#516137]",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
      case 'orc':
        return {
          container: "bg-[#f6f8f5] border-[#ccd8ca] text-[#1b241a] shadow-inner",
          title: "text-[#364434] font-serif font-bold",
          desc: "text-[#425340]",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };

      // 3. 浅色主题
      case 'dndmanual':
      case 'fiveetools':
      case 'parchment':
      case 'highforest':
      case 'feywild':
      default:
        return {
          container: "bg-amber-100/80 border-amber-300/75 shadow-md text-amber-950",
          title: "text-amber-900 font-serif font-bold",
          desc: "text-stone-800",
          button: "bg-amber-600 hover:bg-amber-700 text-white font-medium"
        };
    }
  };

  // Generate starting adventurers
  const generateRandomCharacter = () => {
    if (races.length === 0 || classes.length === 0) return;

    // 1. Filter valid races, classes, and backgrounds under active sourcebooks
    const validRaces = getAvailableRaces();
    const validClasses = classes.filter(c => isSourceEnabled(c.source || 'phb', 'classes'));
    const validBackgrounds = backgrounds.filter(b => isSourceEnabled(b.source || 'phb', 'backgrounds'));

    if (validRaces.length === 0 || validClasses.length === 0) return;

    // 2. Pick random race and subrace
    const randomRace = validRaces[Math.floor(Math.random() * validRaces.length)];
    let randomSubraceId = '';
    if (randomRace.subraces && randomRace.subraces.length > 0) {
      const validSubraces = randomRace.subraces;
      if (validSubraces.length > 0) {
        const randomSub = validSubraces[Math.floor(Math.random() * validSubraces.length)];
        randomSubraceId = randomSub.id;
      }
    }
    
    // 3. Pick random class and random subclass (since it's Lv. 3, subclass is always available/chosen)
    const randomClass = validClasses[Math.floor(Math.random() * validClasses.length)];
    let randomSubclassId = '';
    const subclassLevel = randomClass.subclassAvailableAtLevel || 3;
    if (subclassLevel <= 3 && randomClass.subclasses && randomClass.subclasses.length > 0) {
      const validSubclasses = randomClass.subclasses.filter(sc => isSourceEnabled(sc.source || randomClass.source || 'phb', 'classes'));
      if (validSubclasses.length > 0) {
        const randomSubclass = validSubclasses[Math.floor(Math.random() * validSubclasses.length)];
        randomSubclassId = randomSubclass.id;
      }
    }

    // 4. Smart ability point distribution (Standard Array [15,14,13,12,10,8] representing the optimal 27-point point-buy)
    // Allocates high scores to prime class stats according to DND 5e rulebook classes logic
    const stdScores = [15, 14, 13, 12, 10, 8];
    const abilities: Record<string, number> = {
      STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8
    };

    const primaryAbilities: string[] = randomClass.primaryAbility || [];
    const castAbility: string = randomClass.spellcasting?.ability || '';
    
    // Construct attribute priorities for this class
    const priorityList: string[] = [];
    primaryAbilities.forEach(ab => {
      if (!priorityList.includes(ab)) priorityList.push(ab);
    });
    if (castAbility && !priorityList.includes(castAbility)) {
      priorityList.push(castAbility);
    }
    // High con and dex are universally critical for hitpoints and AC
    if (!priorityList.includes('CON')) priorityList.push('CON');
    if (!priorityList.includes('DEX')) priorityList.push('DEX');
    
    // Add remaining stats
    const ALL_STATS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    ALL_STATS.forEach(stat => {
      if (!priorityList.includes(stat)) {
        priorityList.push(stat);
      }
    });

    // Match priorities to the ordered Standard Array scores
    priorityList.forEach((stat, idx) => {
      abilities[stat] = stdScores[idx];
    });

    // 5. Pick random alignment
    const ALIGNMENTS = [
      '守序善良', '中立善良', '混乱善良',
      '守序中立', '绝对中立', '混乱中立',
      '守序邪恶', '中立邪恶', '混乱邪恶'
    ];
    const randomAlignment = ALIGNMENTS[Math.floor(Math.random() * ALIGNMENTS.length)];

    // 6. Pick random background and suggested characteristics
    let randomBackgroundId = '';
    let randomBg = null;
    let personality = '';
    let ideals = '';
    let bonds = '';
    let flaws = '';

    if (validBackgrounds && validBackgrounds.length > 0) {
      randomBg = validBackgrounds[Math.floor(Math.random() * validBackgrounds.length)];
      randomBackgroundId = randomBg.id;
      
      if (randomBg.suggestedCharacteristics) {
        const pTraits = randomBg.suggestedCharacteristics.personalityTraits || [];
        const idls = randomBg.suggestedCharacteristics.ideals || [];
        const bnds = randomBg.suggestedCharacteristics.bonds || [];
        const flws = randomBg.suggestedCharacteristics.flaws || [];

        if (pTraits.length > 0) personality = pTraits[Math.floor(Math.random() * pTraits.length)];
        if (idls.length > 0) ideals = idls[Math.floor(Math.random() * idls.length)];
        if (bnds.length > 0) bonds = bnds[Math.floor(Math.random() * bnds.length)];
        if (flws.length > 0) flaws = flws[Math.floor(Math.random() * flws.length)];
      }
    }
    
    // 7. Generate random Name
    const generatedName = nameGenEnabledInRandom ? generateRandomName(randomRace.name) : '新角色';
    const randomAge = (Math.floor(Math.random() * (60 - 18 + 1)) + 18).toString();

    let generatedAppearance = '';
    let generatedBackstory = `一位性格鲜明的 Lv. 3 ${randomClass.name}。冒险正等待着此人！`;

    if (appGenEnabledInRandom) {
      const raceNameKey = randomSubraceId ? `${randomRace.name}：${randomRace.subraces?.find(s => s.id === randomSubraceId)?.name || ''}` : randomRace.name;
      const raceAssetsKey = getBestRaceAssetsKey(raceNameKey);
      const raceAssets = RACES_MAPPING[raceAssetsKey];
      
      const randSkin = raceAssets.skin[Math.floor(Math.random() * raceAssets.skin.length)];
      const randHair = raceAssets.hair[Math.floor(Math.random() * raceAssets.hair.length)];
      const randEye = raceAssets.eye[Math.floor(Math.random() * raceAssets.eye.length)];
      const randFeature = raceAssets.features[Math.floor(Math.random() * raceAssets.features.length)];
      
      const hasUniFeature = Math.random() < 0.35; // 35% chance to have a unique specific feature
      let uniFeatures = '';
      if (hasUniFeature) {
        const numUniFeatures = Math.random() < 0.4 ? 2 : 1;
        const shuffledUni = [...UNIVERSAL_APPEARANCE_FEATURES].sort(() => Math.random() - 0.5);
        uniFeatures = shuffledUni.slice(0, numUniFeatures).join('；') + '。';
      }

      const genders: Array<'male' | 'female' | 'none'> = ['male', 'female', 'none'];
      const randomGender = genders[Math.floor(Math.random() * genders.length)];
      const pWord = randomGender === 'male' ? '他' : (randomGender === 'female' ? '她' : '其');
      
      const isPureMasked = Math.random() < 0.08; // 8% chance to be completely masked
      if (isPureMasked) {
        generatedAppearance = PURE_MASKED_APPEARANCES[Math.floor(Math.random() * PURE_MASKED_APPEARANCES.length)];
      } else {
        generatedAppearance = `${pWord}拥有${randSkin}，${randHair}，${randEye}。${pWord}${randFeature}。${uniFeatures}`;
      }
    }

    // 8. Select starting skills matching background and class proficiencies
    const skillSelections: string[] = [];
    if (randomBg && randomBg.skillProficiencies) {
      randomBg.skillProficiencies.forEach(s => {
        if (!skillSelections.includes(s)) skillSelections.push(s);
      });
    }
    if (randomClass && randomClass.skills) {
      const clsChoices = randomClass.skills.choices || [];
      const clsCount = randomClass.skills.count || 2;
      const availableClsSkills = clsChoices.filter(s => !skillSelections.includes(s));
      const shuffledClsSkills = [...availableClsSkills].sort(() => 0.5 - Math.random());
      const selected = shuffledClsSkills.slice(0, Math.min(clsCount, shuffledClsSkills.length));
      selected.forEach(s => skillSelections.push(s));
    }

    const newChar = {
      id: crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: generatedName,
      title: titleEnabledInRandom ? generateTitle() : '',
      alignment: randomAlignment,
      deity: '',
      age: randomAge,
      appearance: generatedAppearance,
      specialty: '',
      personality: personality,
      ideals: ideals,
      bonds: bonds,
      flaws: flaws,
      backstory: generatedBackstory,
      level: 3,
      xp: 900,
      raceId: randomRace.id,
      raceSource: randomRace.source,
      subraceId: randomSubraceId || undefined,
      classId: randomClass.id,
      subclassId: randomSubclassId || undefined,
      backgroundId: randomBackgroundId,
      baseAbilities: abilities,
      skillSelections: skillSelections,
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
      
      const subObj = randomRace.subraces?.find(s => s.id === randomSubraceId);
      const subNameStr = subObj ? (subObj.name.includes('本相') ? '' : ` (${subObj.name})`) : '';
      const subclassStr = randomSubclassId ? ` (${randomClass.subclasses?.find(s => s.id === randomSubclassId)?.name || ''})` : '';
      
      setToastText(`已自动创建 3级 ${randomRace.name}${subNameStr} ${randomClass.name}${subclassStr} 并存入角色库。`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5500);
    } catch (e) {
      console.error('Failed to save generated character:', e);
    }
  };

  const getNavbarStyles = () => {
    switch (currentTheme) {
      case 'dndmanual':
        return {
          nav: "bg-[#7e0c0d] border-b border-[#620a0b] text-white shadow-md",
          logoText: "text-white",
          logoIcon: "text-amber-100",
          menuText: "text-stone-100 hover:text-white hover:opacity-100 opacity-90",
          divider: "text-[#a22b2d]/50",
          itemHover: "hover:bg-[#9c0c0d]/70 hover:text-white",
          dropdownBg: "bg-[#7e0c0d] border border-[#620a0b]",
          dropdownText: "text-stone-100 hover:text-white",
          mobileLinkText: "text-stone-100 hover:text-white",
          mobileBorder: "border-stone-100/10",
          mobileAccordionBg: "border-amber-200/20 bg-stone-900/15",
          mobileSubText: "text-stone-200 hover:text-white",
          iconColor: "text-amber-300",
          isDark: true
        };
      case 'fiveetools':
        return {
          nav: "bg-[#004d80] border-b border-[#003a61] text-white shadow-md",
          logoText: "text-white",
          logoIcon: "text-sky-300",
          menuText: "text-stone-100 hover:text-white hover:opacity-100 opacity-90",
          divider: "text-sky-100/20",
          itemHover: "hover:bg-[#005e9c]/70 hover:text-white",
          dropdownBg: "bg-[#004d80] border border-[#003a61]",
          dropdownText: "text-stone-100 hover:text-white",
          mobileLinkText: "text-stone-100 hover:text-white",
          mobileBorder: "border-stone-100/10",
          mobileAccordionBg: "border-sky-200/20 bg-stone-900/15",
          mobileSubText: "text-stone-200 hover:text-white",
          iconColor: "text-sky-300",
          isDark: true
        };
      case 'cocgreen':
        return {
          nav: "bg-[#07120e] border-b border-[#00ff88]/50 text-[#fcdd93] shadow-md",
          logoText: "text-[#fcdd93]",
          logoIcon: "text-[#00ff88]",
          menuText: "text-[#d0f7e8] hover:text-[#00ff88] hover:opacity-100 opacity-90",
          divider: "text-[#254a3c]",
          itemHover: "hover:bg-[#112d22] hover:text-[#fcdd93]",
          dropdownBg: "bg-[#07120e] border border-[#00ff88]/50",
          dropdownText: "text-[#fcdd93] hover:text-[#00ff88]",
          mobileLinkText: "text-[#fcdd93] hover:text-[#00ff88]",
          mobileBorder: "border-emerald-500/10",
          mobileAccordionBg: "border-emerald-500/20 bg-emerald-950/25",
          mobileSubText: "text-stone-500 hover:text-[#00ff88]",
          iconColor: "text-[#00ff88]",
          isDark: true
        };
      case 'candlekeep':
        return {
          nav: "bg-[#adbc9f] border-b border-[#9db08d] text-stone-900 shadow-md",
          logoText: "text-stone-900 font-serif font-bold",
          logoIcon: "text-[#e61a43]",
          menuText: "text-stone-800 hover:text-stone-950 font-bold opacity-100",
          divider: "text-[#9db08d]/50",
          itemHover: "hover:bg-[#9db08d]/40 hover:text-stone-910",
          dropdownBg: "bg-[#adbc9f] border border-[#9db08d]",
          dropdownText: "text-stone-800 hover:text-stone-950 hover:bg-[#9db08d]/30",
          mobileLinkText: "text-stone-850 hover:text-stone-910",
          mobileBorder: "border-[#9db08d]/40",
          mobileAccordionBg: "border-[#e61a43]/20 bg-[#9db08d]/30",
          mobileSubText: "text-stone-800 hover:text-[#e61a43]",
          iconColor: "text-[#e61a43]",
          isDark: false
        };
      case 'waterdeep':
        return {
          nav: "bg-[#0d276b] border-b border-[#12245b] text-[#fccd5d] shadow-md",
          logoText: "text-[#ffe59e] font-serif font-extrabold",
          logoIcon: "text-[#fccd5d]",
          menuText: "text-[#f0f4ff] hover:text-[#fccd5d] opacity-100 font-bold",
          divider: "text-[#12245b]/50",
          itemHover: "hover:bg-[#12245b] hover:text-[#fccd5d]",
          dropdownBg: "bg-[#0d276b] border border-[#12245b]",
          dropdownText: "text-[#ffe59e] hover:text-[#fccd5d] hover:bg-[#12245b]",
          mobileLinkText: "text-[#ffe59e] hover:text-[#fccd5d]",
          mobileBorder: "border-[#12245b]/40",
          mobileAccordionBg: "border-amber-500/20 bg-[#12245b]/30",
          mobileSubText: "text-white hover:text-[#fccd5d]",
          iconColor: "text-[#fccd5d]",
          isDark: true
        };
      case 'dark':
        return {
          nav: "bg-[#2a2e38] border-b border-[#1f222b] text-white shadow-md",
          logoText: "text-white font-bold",
          logoIcon: "text-amber-400",
          menuText: "text-white hover:text-amber-400 font-bold opacity-100",
          divider: "text-stone-700",
          itemHover: "hover:bg-[#333845] hover:text-white",
          dropdownBg: "bg-[#2a2e38] border border-[#1f222b]",
          dropdownText: "text-[#ededf2] hover:text-amber-400 hover:bg-[#333845]",
          mobileLinkText: "text-[#ededf2] hover:text-amber-400",
          mobileBorder: "border-stone-700",
          mobileAccordionBg: "border-stone-700 bg-[#1f222b]/50",
          mobileSubText: "text-stone-200 hover:text-white",
          iconColor: "text-amber-400",
          isDark: true
        };
      case 'underdark':
        return {
          nav: "bg-[#1F1B2E] border-b border-[#13101d] text-[#F4EEFF] shadow-md",
          logoText: "text-[#F4EEFF] font-serif font-extrabold",
          logoIcon: "text-[#D946EF]",
          menuText: "text-[#ECE6FC] hover:text-[#D946EF] font-bold opacity-100",
          divider: "text-[#3D3554]",
          itemHover: "hover:bg-[#2E2841] hover:text-[#F4EEFF]",
          dropdownBg: "bg-[#1F1B2E] border border-[#13101d]",
          dropdownText: "text-[#F4EEFF] hover:text-[#D946EF] hover:bg-[#2E2841]",
          mobileLinkText: "text-[#F4EEFF] hover:text-[#D946EF]",
          mobileBorder: "border-[#3D3554]",
          mobileAccordionBg: "border-fuchsia-500/20 bg-[#13101d]/50",
          mobileSubText: "text-[#ECE6FC] hover:text-[#D946EF]",
          iconColor: "text-[#D946EF]",
          isDark: true
        };
      case 'avernus':
        return {
          nav: "bg-[#1e1219] border-b border-[#38232e] text-[#f0e2ea] shadow-md",
          logoText: "text-[#ffe6ee] font-serif font-extrabold",
          logoIcon: "text-[#ff5e97]",
          menuText: "text-[#fff5f8] hover:text-[#ff7da7] font-bold opacity-100",
          divider: "text-[#38232e]/50",
          itemHover: "hover:bg-[#38232e] hover:text-white",
          dropdownBg: "bg-[#1e1219] border border-[#38232e]",
          dropdownText: "text-[#ffe6ee] hover:text-[#ff7da7] hover:bg-[#38232e]",
          mobileLinkText: "text-[#ffe6ee] hover:text-[#ff7da7]",
          mobileBorder: "border-[#38232e]/40",
          mobileAccordionBg: "border-[#ff5e97]/20 bg-[#1e1219]/30",
          mobileSubText: "text-white hover:text-[#ff7da7]",
          iconColor: "text-[#ff5e97]",
          isDark: true
        };
      case 'astral':
        return {
          nav: "bg-[#120e24] border-b border-[#2c2354] text-[#ccc4fa] shadow-md",
          logoText: "text-[#f3e5ff] font-serif font-extrabold",
          logoIcon: "text-[#bf5bfa]",
          menuText: "text-[#faf5ff] hover:text-[#db9eff] font-bold opacity-100",
          divider: "text-[#2c2354]/50",
          itemHover: "hover:bg-[#2c2354] hover:text-white",
          dropdownBg: "bg-[#120e24] border border-[#2c2354]",
          dropdownText: "text-[#f3e5ff] hover:text-[#db9eff] hover:bg-[#2c2354]",
          mobileLinkText: "text-[#f3e5ff] hover:text-[#db9eff]",
          mobileBorder: "border-[#2c2354]/40",
          mobileAccordionBg: "border-[#bf5bfa]/20 bg-[#120e24]/30",
          mobileSubText: "text-white hover:text-[#db9eff]",
          iconColor: "text-[#bf5bfa]",
          isDark: true
        };
      case 'shadowfell':
        return {
          nav: "bg-[#111114]/95 border-b border-[#ffffff]/10 text-white shadow-md backdrop-blur",
          logoText: "text-white font-serif font-extrabold tracking-widest",
          logoIcon: "text-[#7c70a8] animate-pulse",
          menuText: "text-stone-300 hover:text-white hover:opacity-100 font-medium transition-colors opacity-90",
          divider: "text-[#ffffff]/15",
          itemHover: "hover:bg-[#1a1a20]/85 hover:text-white",
          dropdownBg: "bg-[#111114] border border-[#ffffff]/15 shadow-2xl",
          dropdownText: "text-stone-200 hover:text-[#7c70a8]",
          mobileLinkText: "text-white hover:text-[#7c70a8]",
          mobileBorder: "border-[#ffffff]/10",
          mobileAccordionBg: "border-[#7c70a8]/20 bg-[#1a1a20]/45",
          mobileSubText: "text-stone-300 hover:text-white",
          iconColor: "text-[#7c70a8]",
          isDark: true
        };
      case 'parchment':
        return {
          nav: "bg-[#e5d9c2] border-b border-[#bcab8f] text-[#241e1a] shadow-sm",
          logoText: "text-[#241e1a]",
          logoIcon: "text-[#8b1a1a]",
          menuText: "text-[#5c4b3f] hover:text-[#241e1a] hover:opacity-100 font-semibold opacity-90",
          divider: "text-[#d4c4a8]",
          itemHover: "hover:bg-[#f4ece2] hover:text-[#241e1a]",
          dropdownBg: "bg-[#f4ece2] border border-[#bcab8f]",
          dropdownText: "text-[#33281c] hover:text-[#8b1a1a]",
          mobileLinkText: "text-[#241e1a] hover:text-[#8b1a1a]",
          mobileBorder: "border-[#bcab8f]/40",
          mobileAccordionBg: "border-[#d4c4a8]/50 bg-[#fafaf5]/40",
          mobileSubText: "text-[#5c4b3f] hover:text-[#241e1a]",
          iconColor: "text-[#8b1a1a]",
          isDark: false
        };
      case 'highforest':
        return {
          nav: "bg-[#dfebd8] border-b border-[#c5dbba] text-[#1d3314] shadow-sm",
          logoText: "text-[#1d3314] font-serif font-extrabold",
          logoIcon: "text-[#a37d1a]",
          menuText: "text-[#314d27] hover:text-[#1d3314] hover:opacity-100 opacity-100 font-bold",
          divider: "text-[#c5dbba]",
          itemHover: "hover:bg-[#cbdbcb]/75 hover:text-[#1d3314]",
          dropdownBg: "bg-[#fafdfa] border border-[#c5dbba]",
          dropdownText: "text-[#314d27] hover:text-[#1d3314]",
          mobileLinkText: "text-[#314d27] hover:text-[#1d3314]",
          mobileBorder: "border-[#c5dbba]/40",
          mobileAccordionBg: "border-[#c5dbba]/30 bg-[#fafdfa]/40",
          mobileSubText: "text-[#314d27] hover:text-[#1d3314]",
          iconColor: "text-[#a37d1a]",
          isDark: false
        };
      case 'dwarf':
        return {
          nav: "bg-[#2b231d] border-b border-[#3d3229] text-[#e6ded8] shadow-md",
          logoText: "text-[#ffd9c2] font-serif font-extrabold",
          logoIcon: "text-[#d35400]",
          menuText: "text-[#fff4ed] hover:text-[#ffb780] font-bold opacity-100",
          divider: "text-[#3d3229]/50",
          itemHover: "hover:bg-[#3d3229] hover:text-[#ffffff]",
          dropdownBg: "bg-[#2b231d] border border-[#3d3229]",
          dropdownText: "text-[#ffd9c2] hover:text-[#ffb780] hover:bg-[#3d3229]",
          mobileLinkText: "text-[#ffd9c2] hover:text-[#ffb780]",
          mobileBorder: "border-[#3d3229]/40",
          mobileAccordionBg: "border-[#d35400]/20 bg-[#2b231d]/30",
          mobileSubText: "text-white hover:text-[#ffb780]",
          iconColor: "text-[#d35400]",
          isDark: true
        };
      case 'feywild':
        return {
          nav: "bg-[#4a2c4d] border-b border-[#301a33] text-white shadow-md",
          logoText: "text-white",
          logoIcon: "text-[#f472b6]",
          menuText: "text-[#f2eaf7] hover:text-white hover:opacity-100 opacity-90",
          divider: "text-[#654369]/50",
          itemHover: "hover:bg-[#654369] hover:text-white",
          dropdownBg: "bg-[#4a2c4d] border border-[#301a33]",
          dropdownText: "text-[#f2eaf7] hover:text-white",
          mobileLinkText: "text-[#f2eaf7] hover:text-white",
          mobileBorder: "border-[#301a33]",
          mobileAccordionBg: "border-[#c9b0cf]/20 bg-[#301a33]/30",
          mobileSubText: "text-[#c9b0cf] hover:text-white",
          iconColor: "text-[#f472b6]",
          isDark: true
        };
      case 'gnome':
        return {
          nav: "bg-[#56524A] border-b border-[#3F3D38] text-[#F7F6F5] shadow-md",
          logoText: "text-[#F7F6F5]",
          logoIcon: "text-[#DFB746]",
          menuText: "text-[#E2DFDB] hover:text-[#F7F6F5] hover:opacity-100 opacity-90",
          divider: "text-[#6D665C]/50",
          itemHover: "hover:bg-[#6D665C] hover:text-[#F7F6F5]",
          dropdownBg: "bg-[#56524A] border border-[#3F3D38]",
          dropdownText: "text-[#E2DFDB] hover:text-white",
          mobileLinkText: "text-[#E2DFDB] hover:text-white",
          mobileBorder: "border-[#3F3D38]",
          mobileAccordionBg: "border-[#DFB746]/10 bg-[#3F3D38]/30",
          mobileSubText: "text-[#CBC6C0] hover:text-white",
          iconColor: "text-[#DFB746]",
          isDark: true
        };
      case 'dragonborn':
        return {
          nav: "bg-[#3c0a0a] border-b border-[#4a0f0e] text-white shadow-md",
          logoText: "text-[#ffeacc] font-serif font-extrabold",
          logoIcon: "text-[#ff9800]",
          menuText: "text-[#fffaf0] hover:text-[#ffc107] font-bold opacity-100",
          divider: "text-[#4a0f0e]/50",
          itemHover: "hover:bg-[#4a0f0e] hover:text-white",
          dropdownBg: "bg-[#3c0a0a] border border-[#4a0f0e]",
          dropdownText: "text-[#ffeacc] hover:text-[#ffc107] hover:bg-[#4a0f0e]",
          mobileLinkText: "text-[#ffeacc] hover:text-[#ffc107]",
          mobileBorder: "border-[#4a0f0e]/40",
          mobileAccordionBg: "border-[#ff9800]/20 bg-[#3c0a0a]/30",
          mobileSubText: "text-white hover:text-[#ffc107]",
          iconColor: "text-[#ff9800]",
          isDark: true
        };
      case 'swordcoast':
        return {
          nav: "bg-[#183038] border-b border-[#0f2025] text-[#fbf7ee] shadow-md",
          logoText: "text-[#fbf7ee] font-serif",
          logoIcon: "text-[#257e8a]",
          menuText: "text-[#c5d6da] hover:text-white hover:opacity-100 opacity-90",
          divider: "text-[#0f2025]/50",
          itemHover: "hover:bg-[#25414b] hover:text-white",
          dropdownBg: "bg-[#183038] border border-[#0f2025]",
          dropdownText: "text-[#fbf7ee] hover:text-[#7BC8D6]",
          mobileLinkText: "text-[#fbf7ee] hover:text-[#7BC8D6]",
          mobileBorder: "border-[#0f2025]/40",
          mobileAccordionBg: "border-[#5cb5bf]/20 bg-[#0f2025]/30",
          mobileSubText: "text-[#c5d6da] hover:text-white",
          iconColor: "text-[#257e8a]",
          isDark: true
        };
      case 'golddragon':
        return {
          nav: "bg-[#fdf5e0] border-b border-[#fae4a7] text-[#462208] shadow-sm",
          logoText: "text-[#864614] font-serif font-extrabold",
          logoIcon: "text-[#faa307]",
          menuText: "text-[#a45a13] hover:text-[#462208] font-bold opacity-100",
          divider: "text-[#f4cf6a]",
          itemHover: "hover:bg-[#fae4a7] hover:text-[#462208]",
          dropdownBg: "bg-[#fdfaf0] border border-[#fae4a7]",
          dropdownText: "text-[#864614] hover:text-[#462208]",
          mobileLinkText: "text-[#864614] hover:text-[#462208]",
          mobileBorder: "border-[#fae4a7]/50",
          mobileAccordionBg: "border-[#faa307]/20 bg-[#fae4a7]/30",
          mobileSubText: "text-[#a45a13] hover:text-[#462208]",
          iconColor: "text-[#faa307]",
          isDark: false
        };
      case 'halfling':
        return {
          nav: "bg-[#eef2e7] border-b border-[#d7e0c9] text-[#212915] shadow-sm",
          logoText: "text-[#3f4c2c] font-serif font-extrabold",
          logoIcon: "text-[#ec6d10]",
          menuText: "text-[#516137] hover:text-[#212915] font-bold opacity-100",
          divider: "text-[#bccba5]",
          itemHover: "hover:bg-[#d7e0c9] hover:text-[#212915]",
          dropdownBg: "bg-[#f8f9f5] border border-[#d7e0c9]",
          dropdownText: "text-[#3f4c2c] hover:text-[#212915]",
          mobileLinkText: "text-[#3f4c2c] hover:text-[#212915]",
          mobileBorder: "border-[#d7e0c9]/50",
          mobileAccordionBg: "border-[#ec6d10]/20 bg-[#d7e0c9]/30",
          mobileSubText: "text-[#516137] hover:text-[#212915]",
          iconColor: "text-[#ec6d10]",
          isDark: false
        };
      case 'orc':
        return {
          nav: "bg-[#e7ece5] border-b border-[#ccd8ca] text-[#1b241a] shadow-sm",
          logoText: "text-[#364434] font-serif font-extrabold",
          logoIcon: "text-[#d44d57]",
          menuText: "text-[#425340] hover:text-[#1b241a] font-bold opacity-100",
          divider: "text-[#aabda7]",
          itemHover: "hover:bg-[#ccd8ca] hover:text-[#1b241a]",
          dropdownBg: "bg-[#f6f8f5] border border-[#ccd8ca]",
          dropdownText: "text-[#364434] hover:text-[#1b241a]",
          mobileLinkText: "text-[#364434] hover:text-[#1b241a]",
          mobileBorder: "border-[#ccd8ca]/50",
          mobileAccordionBg: "border-[#d44d57]/20 bg-[#ccd8ca]/30",
          mobileSubText: "text-[#425340] hover:text-[#1b241a]",
          iconColor: "text-[#d44d57]",
          isDark: false
        };
      case 'underdark_shroom':
        return {
          nav: "bg-[#e7e3f0] border-b border-[#cfc7e0] text-[#29203a] shadow-sm",
          logoText: "text-[#413557] font-serif font-extrabold",
          logoIcon: "text-[#c32ef0]",
          menuText: "text-[#50406b] hover:text-[#29203a] font-bold opacity-100",
          divider: "text-[#b0a4cc]",
          itemHover: "hover:bg-[#cfc7e0] hover:text-[#29203a]",
          dropdownBg: "bg-[#f4f2f8] border border-[#cfc7e0]",
          dropdownText: "text-[#413557] hover:text-[#29203a]",
          mobileLinkText: "text-[#413557] hover:text-[#29203a]",
          mobileBorder: "border-[#cfc7e0]/50",
          mobileAccordionBg: "border-[#c32ef0]/20 bg-[#cfc7e0]/30",
          mobileSubText: "text-[#50406b] hover:text-[#29203a]",
          iconColor: "text-[#c32ef0]",
          isDark: false
        };
      case 'icewind':
        return {
          nav: "bg-[#e8ecf3] border-b border-[#d0d9e5] text-[#202733] shadow-sm",
          logoText: "text-[#3d4a5c] font-serif font-extrabold",
          logoIcon: "text-[#568866]",
          menuText: "text-[#48576c] hover:text-[#202733] font-bold opacity-100",
          divider: "text-[#aebfd1]",
          itemHover: "hover:bg-[#d0d9e5] hover:text-[#202733]",
          dropdownBg: "bg-[#f6f8fb] border border-[#d0d9e5]",
          dropdownText: "text-[#3d4a5c] hover:text-[#202733]",
          mobileLinkText: "text-[#3d4a5c] hover:text-[#202733]",
          mobileBorder: "border-[#d0d9e5]/50",
          mobileAccordionBg: "border-[#568866]/20 bg-[#d0d9e5]/30",
          mobileSubText: "text-[#48576c] hover:text-[#202733]",
          iconColor: "text-[#568866]",
          isDark: false
        };
      case 'sigil':
        return {
          nav: "bg-[#e5e5e5] border-b border-[#d4d4d4] text-[#0a0a0a] shadow-sm",
          logoText: "text-[#171717] font-serif font-extrabold",
          logoIcon: "text-[#d2831c]",
          menuText: "text-[#262626] hover:text-[#0a0a0a] font-bold opacity-100",
          divider: "text-[#a3a3a3]",
          itemHover: "hover:bg-[#d4d4d4] hover:text-[#0a0a0a]",
          dropdownBg: "bg-[#f5f5f5] border border-[#d4d4d4]",
          dropdownText: "text-[#171717] hover:text-[#0a0a0a]",
          mobileLinkText: "text-[#171717] hover:text-[#0a0a0a]",
          mobileBorder: "border-[#d4d4d4]/50",
          mobileAccordionBg: "border-[#d2831c]/20 bg-[#d4d4d4]/30",
          mobileSubText: "text-[#262626] hover:text-[#0a0a0a]",
          iconColor: "text-[#d2831c]",
          isDark: false
        };
      case 'baldursgate':
        return {
          nav: "bg-[#1f2230] border-b border-[#2e3348] text-[#f2f4fa] shadow-md",
          logoText: "text-[#f2f4fa] font-serif font-extrabold",
          logoIcon: "text-[#f29a50]",
          menuText: "text-[#c2c9e0] hover:text-[#f29a50] font-bold opacity-100",
          divider: "text-[#414763]",
          itemHover: "hover:bg-[#2e3348] hover:text-[#f2f4fa]",
          dropdownBg: "bg-[#161821] border border-[#2e3348]",
          dropdownText: "text-[#f2f4fa] hover:text-[#f29a50] hover:bg-[#2e3348]",
          mobileLinkText: "text-[#f2f4fa] hover:text-[#f29a50]",
          mobileBorder: "border-[#2e3348]/50",
          mobileAccordionBg: "border-[#f29a50]/20 bg-[#2e3348]/30",
          mobileSubText: "text-[#c2c9e0] hover:text-[#f29a50]",
          iconColor: "text-[#f29a50]",
          isDark: true
        };
      case 'neverwinter':
        return {
          nav: "bg-[#1c2731] border-b border-[#293a4a] text-[#f4f7fb] shadow-md",
          logoText: "text-[#f4f7fb] font-serif font-extrabold",
          logoIcon: "text-[#94cbf0]",
          menuText: "text-[#c1d5ea] hover:text-[#94cbf0] font-bold opacity-100",
          divider: "text-[#3a5068]",
          itemHover: "hover:bg-[#293a4a] hover:text-[#f4f7fb]",
          dropdownBg: "bg-[#141b21] border border-[#293a4a]",
          dropdownText: "text-[#f4f7fb] hover:text-[#94cbf0] hover:bg-[#293a4a]",
          mobileLinkText: "text-[#f4f7fb] hover:text-[#94cbf0]",
          mobileBorder: "border-[#293a4a]/50",
          mobileAccordionBg: "border-[#94cbf0]/20 bg-[#293a4a]/30",
          mobileSubText: "text-[#c1d5ea] hover:text-[#94cbf0]",
          iconColor: "text-[#94cbf0]",
          isDark: true
        };
      case 'mistyvale':
        return {
          nav: "bg-[#262421] border-b border-[#3b3732] text-[#f5f3f0] shadow-md",
          logoText: "text-[#f5f3f0] font-serif font-extrabold",
          logoIcon: "text-[#5dc391]",
          menuText: "text-[#cec8bd] hover:text-[#5dc391] font-bold opacity-100",
          divider: "text-[#544f47]",
          itemHover: "hover:bg-[#3b3732] hover:text-[#f5f3f0]",
          dropdownBg: "bg-[#191817] border border-[#3b3732]",
          dropdownText: "text-[#f5f3f0] hover:text-[#5dc391] hover:bg-[#3b3732]",
          mobileLinkText: "text-[#f5f3f0] hover:text-[#5dc391]",
          mobileBorder: "border-[#3b3732]/50",
          mobileAccordionBg: "border-[#5dc391]/20 bg-[#3b3732]/30",
          mobileSubText: "text-[#cec8bd] hover:text-[#5dc391]",
          iconColor: "text-[#5dc391]",
          isDark: true
        };
      default:
        return {
          nav: "bg-white border-b border-stone-200 text-stone-900 shadow-sm",
          logoText: "text-amber-800",
          logoIcon: "text-amber-600",
          menuText: "text-stone-600 hover:text-amber-600",
          divider: "text-stone-300",
          itemHover: "hover:bg-stone-50 hover:text-stone-900",
          dropdownBg: "bg-white border border-stone-200",
          dropdownText: "text-stone-700 hover:text-amber-600",
          mobileLinkText: "text-stone-700 hover:text-amber-600",
          mobileBorder: "border-stone-200",
          mobileAccordionBg: "border-amber-200/60 bg-stone-50/50",
          mobileSubText: "text-stone-600 hover:text-stone-900",
          iconColor: "text-amber-600",
          isDark: false
        };
    }
  };
  const nv = getNavbarStyles();
  const isDarkNav = nv.isDark;

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 font-sans selection:bg-amber-200">
      {/* Decorative Navbar */}
      <nav id="landing-navbar" className={`w-full px-4 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-200 ${nv.nav}`}>
        <div className={`flex items-center gap-1 sm:gap-2 ${nv.logoText}`}>
          <Book className={`w-4 h-4 sm:w-5 sm:h-5 ${nv.logoIcon}`} />
          <span className="font-serif font-bold text-xs xs:text-sm sm:text-base md:text-lg tracking-tight leading-tight whitespace-nowrap">
            Littlh的DND5E角色创建工具
          </span>
        </div>
        
        {/* Desktop menu */}
        <div className="hidden md:flex gap-3 text-sm font-medium items-center">
          <div className="relative">
            <button
              id="btn-toolbox-toggle"
              onClick={(e) => {
                e.preventDefault();
                setToolboxOpen(!toolboxOpen);
                setThemeOpen(false);
                setSettingsOpen(false);
              }}
              className={`transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 font-medium text-sm outline-none ${nv.menuText}`}
            >
              <Wand2 size={16} />
              工具箱
              <span className="text-[10px] opacity-60">▼</span>
            </button>
            {toolboxOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setToolboxOpen(false)} />
                <div className={`absolute right-0 mt-2 w-48 rounded shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100 text-left font-sans ${nv.dropdownBg}`}>
                  {TOOLBOX_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      id={`lnk-toolbox-${item.id}`}
                      onClick={() => {
                        setToolboxOpen(false);
                        item.onClick();
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent ${nv.dropdownText} ${nv.itemHover}`}
                    >
                      {item.icon} {item.title}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <span className={nv.divider}>|</span>
          {/* Theme Dropdown */}
          <div className="relative">
            <button
              id="btn-nav-theme-dropdown"
              onClick={(e) => {
                e.preventDefault();
                setThemeOpen(!themeOpen);
                setToolboxOpen(false);
                setSettingsOpen(false);
              }}
              title="配色方案"
              className={`transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 font-medium text-sm outline-none ${nv.menuText}`}
            >
              <Palette size={16} />
              <span className="text-[10px] opacity-60">▼</span>
            </button>
            {themeOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setThemeOpen(false)} />
                <div className={`absolute right-0 mt-2 w-56 rounded shadow-lg py-1 z-50 max-h-[70vh] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100 text-left font-sans ${nv.dropdownBg}`}>
                  <button
                    onClick={() => {
                      setThemeOpen(false);
                      selectRandomTheme();
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent ${nv.dropdownText} ${nv.itemHover} border-b border-dashed border-stone-200/50 text-amber-500`}
                  >
                    🎲 随机切换主题 / 配色
                  </button>
                  {[
                    { id: 'dndmanual', name: '📕 龙与地下城手册' },
                    { id: 'candlekeep', name: '🕯️ 烛堡：静谧繁花' },
                    { id: 'swordcoast', name: '⚓ 剑湾：蓝墨古卷' },
                    { id: 'waterdeep', name: '🏰 深水城：蔚蓝金冕' },
                    { id: 'shadowfell', name: '💀 堕影冥界：暗影无声' },
                    { id: 'feywild', name: '🌸 妖精荒野：幻境花海' },
                    { id: 'astral', name: '🌌 星界星海：太虚天盘' },
                    { id: 'icewind', name: '❄️ 冰风谷的孤木林' },
                    { id: 'sigil', name: '⚙️ 环印城：石头与奥秘' },
                    { id: 'baldursgate', name: '🌇 博德之门：暮色降临' },
                    { id: 'neverwinter', name: '🛡️ 无冬城：冰雪与坚石' },
                    { id: 'mistyvale', name: '🌲 迷雾谷地：森冷木棕' },
                    { id: 'parchment', name: '📜 人类：兼爱羊皮纸' },
                    { id: 'highforest', name: '🏹 精灵：高深绿野' },
                    { id: 'dwarf', name: '⛏️ 矮人：巨石熔炉' },
                    { id: 'avernus', name: '🔥 提夫林：九域惩击' },
                    { id: 'gnome', name: '⚙️ 侏儒：日曜旅程' },
                    { id: 'dragonborn', name: '🪙 龙裔：火山岩浆' },
                    { id: 'underdark', name: '🔮 卓尔：荧光深邃' },
                    { id: 'golddragon', name: '🐉 金龙：崇高耀金' },
                    { id: 'halfling', name: '🥧 半身人：南瓜与清茶' },
                    { id: 'orc', name: '🪓 兽人：战狂绿血' },
                    { id: 'underdark_shroom', name: '🍄 幽暗地域：迷幻巨蕈' },
                    { id: 'fiveetools', name: '🔵 5etools 钴蓝排版' },
                    { id: 'cocgreen', name: '🐙 克苏鲁邪神墨绿' }
                  ].map((themeOpt) => (
                    <button
                      key={themeOpt.id}
                      onClick={() => {
                        setThemeOpen(false);
                        setCurrentTheme(themeOpt.id);
                        localStorage.setItem('dndTheme', themeOpt.id);
                        document.documentElement.setAttribute('data-theme', themeOpt.id);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer border-none bg-transparent ${nv.dropdownText} ${nv.itemHover} ${currentTheme === themeOpt.id ? 'font-bold bg-black/5' : ''}`}
                    >
                      <span>{themeOpt.name}</span>
                      {currentTheme === themeOpt.id && <span className="text-[10px]">✔</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className={nv.divider}>|</span>
          <div className="relative">
            <button
              id="btn-settings-toggle"
              onClick={(e) => {
                e.preventDefault();
                setSettingsOpen(!settingsOpen);
                setToolboxOpen(false);
                setThemeOpen(false);
              }}
              title="设置"
              className={`transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 font-medium text-sm outline-none ${nv.menuText}`}
            >
              <Settings size={16} />
              <span className="text-[10px] opacity-60">▼</span>
            </button>
            {settingsOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setSettingsOpen(false)} />
                <div className={`absolute right-0 mt-2 w-48 rounded shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100 text-left font-sans ${nv.dropdownBg}`}>
                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      setOpenAiModal(true);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent ${nv.dropdownText} ${nv.itemHover}`}
                  >
                    🤖 AI 辅助书写配置
                  </button>
                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      setOpenXgeStepSettingsModal(true);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent ${nv.dropdownText} ${nv.itemHover}`}
                  >
                    ⚙️ 扩展角色功能
                  </button>
                </div>
              </>
            )}
          </div>
          
          <span className={nv.divider}>|</span>
          <button
              onClick={() => {
                  setOpenExpModal(true);
              }}
              title="扩展管理"
              className={`transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 font-medium text-sm outline-none ${nv.menuText}`}
          >
              <Book size={16} />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden flex items-center justify-center p-2 focus:outline-none bg-transparent border-none cursor-pointer ${nv.mobileLinkText}`}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className={`md:hidden w-full border-b py-3 pb-4 px-4 shadow-lg absolute top-[100%] left-0 z-50 flex flex-col gap-2 font-sans animate-in slide-in-from-top-1 duration-150 ${nv.dropdownBg}`}>
            {/* Toolbox accordion */}
            <div className={`border-b pb-2 pt-1 ${nv.mobileBorder}`}>
              <button
                onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                className={`w-full text-left py-1 text-sm font-semibold flex justify-between items-center border-none bg-transparent cursor-pointer ${nv.mobileLinkText}`}
              >
                <span className="flex items-center gap-1.5">
                  <Wand2 size={16} className={nv.iconColor} /> 快速工具箱
                </span>
                <span className={`text-[10px] opacity-60`}>{mobileToolsOpen ? '▲' : '▼'}</span>
              </button>
              {mobileToolsOpen && (
                <div className={`pl-4 mt-2 border-l-2 flex flex-col gap-1 py-1.5 rounded-r ${nv.mobileBorder} ${nv.mobileAccordionBg}`}>
                  {TOOLBOX_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        item.onClick();
                      }}
                      className={`w-full text-left py-2 px-1 text-xs transition-colors flex items-center gap-2 border-none bg-transparent cursor-pointer ${nv.mobileSubText}`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings accordion */}
            <div className={`border-b pb-2 pt-1 ${nv.mobileBorder}`}>
              <button
                onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}
                className={`w-full text-left py-1 text-sm font-semibold flex justify-between items-center border-none bg-transparent cursor-pointer ${nv.mobileLinkText}`}
              >
                <span className="flex items-center gap-1.5">
                  <Settings size={16} className={nv.iconColor} /> 系统设置
                </span>
                <span className={`text-[10px] opacity-60`}>{mobileSettingsOpen ? '▲' : '▼'}</span>
              </button>
              {mobileSettingsOpen && (
                <div className={`pl-4 mt-2 border-l-2 flex flex-col gap-1 py-1.5 rounded-r ${nv.mobileBorder} ${nv.mobileAccordionBg}`}>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenAiModal(true);
                    }}
                    className={`w-full text-left py-2 px-1 text-xs transition-colors flex items-center gap-1.5 border-none bg-transparent cursor-pointer ${nv.mobileSubText}`}
                  >
                    🤖 AI 辅助书写配置
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenThemeModal(true);
                    }}
                    className={`w-full text-left py-2 px-1 text-xs transition-colors flex items-center gap-1.5 border-none bg-transparent cursor-pointer ${nv.mobileSubText}`}
                  >
                    🎨 网页配色方案
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setOpenXgeStepSettingsModal(true);
                    }}
                    className={`w-full text-left py-2 px-1 text-xs transition-colors flex items-center gap-1.5 border-none bg-transparent cursor-pointer ${nv.mobileSubText}`}
                  >
                    ⚙️ 生成器选项
                  </button>
                </div>
              )}
            </div>

            {/* Expansion manager */}
            <div className={`border-b pb-2 pt-1 ${nv.mobileBorder}`}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setOpenExpModal(true);
                }}
                className={`w-full text-left py-1 text-sm font-semibold flex items-center gap-1.5 border-none bg-transparent cursor-pointer ${nv.mobileLinkText}`}
              >
                <Book size={16} className={nv.iconColor} /> 扩展管理
              </button>
            </div>

            {/* GitHub */}
            <div className="pb-1 pt-1">
              <a
                href="https://github.com/littlhMW/DND5eCharacterTools-"
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-1.5 text-sm font-semibold no-underline py-1 transition-colors ${nv.mobileLinkText}`}
              >
                <Github size={16} className={nv.iconColor} /> GitHub 开源
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
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-md font-medium text-sm hover:bg-amber-700 transition-all shadow-md w-full sm:w-auto justify-center group border-none cursor-pointer active:scale-95"
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
                const cardStyles = getCharacterCardStyles(currentTheme);
                return (
                  <div key={char.id} className={`p-5 rounded-md border transition-all group cursor-pointer relative ${cardStyles.card}`} onClick={() => dispatch({ type: 'LOAD_CHARACTER', payload: char })}>
                    {deletingId === currentCharId && (
                      <div className="absolute inset-0 bg-neutral-900/95 text-white flex flex-col items-center justify-center p-5 rounded-md z-30 shadow-2xl border border-stone-800" onClick={(e) => e.stopPropagation()}>
                        <span className="text-sm font-semibold mb-3 text-neutral-100">确定要删除这个角色吗？</span>
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
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded transition-colors border-none cursor-pointer shadow"
                          >
                            确认删除
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeletingId(null);
                            }}
                            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs rounded transition-colors border-none cursor-pointer shadow"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    )}
                    <h3 className={`font-serif font-bold text-lg ${cardStyles.title}`}>{char.name || '未命名'}</h3>
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
                    <p className={`text-sm mt-1 mb-4 flex items-center gap-2 ${cardStyles.metaText}`}>
                       <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${cardStyles.levelBadge}`}>Lv {char.level || 3}</span>
                       <span>{race?.name || '未知种族'}</span>
                       <span>{cls?.name || '无职业'}</span>
                    </p>
                    <button className={`text-sm font-medium w-full py-2 rounded-lg transition-colors border-none cursor-pointer ${cardStyles.button}`}>
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
          {(() => {
            const blockStyles = getRandomGenModuleStyles();
            return (
              <div 
                id="container-random-generation-helper"
                className={`rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border transition-all ${blockStyles.container}`}
              >
                <div className="space-y-1 text-left">
                  <h3 className={`text-base font-bold flex items-center gap-1.5 font-serif ${blockStyles.title}`}>
                    🎲 快速随机生成 (Lv. 3)
                  </h3>
                  <p className={`text-xs leading-relaxed ${blockStyles.desc}`}>
                    遵循标准属性购点与规则库，随机生成包含种族、子种族、职业、子职、背景在内的 3 级角色并加入。
                  </p>
                </div>
                <button
                  id="btn-fast-random"
                  onClick={generateRandomCharacter}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium text-sm transition-all shadow-md w-full sm:w-auto justify-center group border-none cursor-pointer active:scale-95 shrink-0 ${blockStyles.button}`}
                >
                  <Swords size={16} className="group-hover:rotate-12 transition-transform" />
                  随机生成
                </button>
              </div>
            );
          })()}
        </div>

        {/* 工具箱组块 */}
        <div className="w-full max-w-7xl relative text-left mt-12 mb-8">
          <h2 className={`text-2xl font-serif font-bold mb-6 flex items-center gap-3 pb-4 border-b ${
            currentTheme === 'shadowfell' ? 'text-stone-900/90 border-stone-300/40' : 'text-amber-600 border-amber-600/30'
          }`}>
            <Wand2 size={24} className={currentTheme === 'shadowfell' ? 'text-stone-800' : 'text-amber-600'} />
            快速工具箱
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TOOLBOX_ITEMS.map((item) => {
              const cardBg = currentTheme === 'shadowfell'
                ? 'bg-stone-800 border-stone-700/80 text-stone-100 hover:bg-stone-700 hover:border-amber-400'
                : 'bg-white border-stone-200 text-stone-900 hover:border-amber-400 hover:shadow-md';
              const titleColor = currentTheme === 'shadowfell' ? 'text-stone-50' : 'text-stone-900';
              const descColor = currentTheme === 'shadowfell' ? 'text-stone-300' : 'text-stone-500';
              
              return (
                <button 
                  key={item.id} 
                  onClick={item.onClick} 
                  className={`flex flex-col items-start text-left gap-2 p-4 rounded-xl shadow-sm transition-all cursor-pointer border-solid border ${cardBg}`}
                >
                  <span className="text-3xl mb-1">{item.icon}</span>
                  <span className={`font-bold text-sm ${titleColor}`}>{item.title}</span>
                  <span className={`text-[10px] leading-tight ${descColor}`}>{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Quick Dice Roller Modal */}
      {openDiceModal && <QuickDiceRoller onClose={() => setOpenDiceModal(false)} />}

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

      <AiConfigModal
        open={openAiModal}
        onClose={() => setOpenAiModal(false)}
        aiConfig={aiConfig}
        setAiConfig={setAiConfig}
        saveAIConfig={saveAIConfig}
      />

      <ThemeSettingsModal
        open={openThemeModal}
        onClose={() => setOpenThemeModal(false)}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
      />

      <XgeStepSettingsModal
        open={openXgeStepSettingsModal}
        onClose={() => setOpenXgeStepSettingsModal(false)}
        appGenEnabledInRandom={appGenEnabledInRandom}
        setAppGenEnabledInRandom={setAppGenEnabledInRandom}
        nameGenEnabledInRandom={nameGenEnabledInRandom}
        setNameGenEnabledInRandom={setNameGenEnabledInRandom}
        appGenEnabledInDetails={appGenEnabledInDetails}
        setAppGenEnabledInDetails={setAppGenEnabledInDetails}
        nameGenEnabledInTools={nameGenEnabledInTools}
        setNameGenEnabledInTools={setNameGenEnabledInTools}
        useExpandedXge={useExpandedXge}
        setUseExpandedXge={setUseExpandedXge}
        useNonPhbSupportXge={useNonPhbSupportXge}
        setUseNonPhbSupportXge={setUseNonPhbSupportXge}
        titleEnabledInRandom={titleEnabledInRandom}
        setTitleEnabledInRandom={setTitleEnabledInRandom}
        showTitleOnSheet={showTitleOnSheet}
        setShowTitleOnSheet={setShowTitleOnSheet}
        showXpOnSheet={showXpOnSheet}
        setShowXpOnSheet={setShowXpOnSheet}
        
        traitGenEnabledInDetails={traitGenEnabledInDetails}
        setTraitGenEnabledInDetails={setTraitGenEnabledInDetails}
        titleGenEnabledInDetails={titleGenEnabledInDetails}
        setTitleGenEnabledInDetails={setTitleGenEnabledInDetails}
        partyNameGenEnabled={partyNameGenEnabled}
        setPartyNameGenEnabled={setPartyNameGenEnabled}
        partyAppGenEnabled={partyAppGenEnabled}
        setPartyAppGenEnabled={setPartyAppGenEnabled}
        partyTitleGenEnabled={partyTitleGenEnabled}
        setPartyTitleGenEnabled={setPartyTitleGenEnabled}
        xgeEnabledInDetails={xgeEnabledInDetails}
        setXgeEnabledInDetails={setXgeEnabledInDetails}
      />

      <XgeModal
        open={openXgeModal}
        onClose={() => setOpenXgeModal(false)}
        xgePreviewText={xgePreviewText}
        setXgePreviewText={setXgePreviewText}
        xgePreviewClass={xgePreviewClass}
        setXgePreviewClass={setXgePreviewClass}
        xgePreviewBg={xgePreviewBg}
        setXgePreviewBg={setXgePreviewBg}
        xgePreviewAge={xgePreviewAge}
        setXgePreviewAge={setXgePreviewAge}
        xgePreviewChaMod={xgePreviewChaMod}
        setXgePreviewChaMod={setXgePreviewChaMod}
        classes={classes}
        backgrounds={backgrounds}
      />

      {/* Expansion Books Modal */}
      <ExpansionsModal 
        open={openExpModal} 
        onClose={() => setOpenExpModal(false)}
        expansionSettings={expansionSettings}
        setExpansionSettings={setExpansionSettings}
        saveExpansionSettings={saveExpansionSettings}
        setActiveExpansions={setActiveExpansions}
        handleBookMasterToggle={handleBookMasterToggle}
        handleCategoryToggle={handleCategoryToggle}
        handleExportConfig={handleExportConfig}
        handleImportConfig={handleImportConfig}
        showImportInput={showImportInput}
        setShowImportInput={setShowImportInput}
        importString={importString}
        setImportString={setImportString}
        expMsg={expMsg}
      />

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
      {openTitleModal && <TitleGeneratorModal onClose={() => setOpenTitleModal(false)} />}
    </div>
  );
}
