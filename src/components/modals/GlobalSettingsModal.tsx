import React, { useState } from 'react';
import { PROVIDERS } from '../../utils/aiHelper';

interface GlobalSettingsModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: TabType;
  appGenEnabledInRandom: boolean;
  setAppGenEnabledInRandom: (val: boolean) => void;
  nameGenEnabledInRandom: boolean;
  setNameGenEnabledInRandom: (val: boolean) => void;
  appGenEnabledInDetails: boolean;
  setAppGenEnabledInDetails: (val: boolean) => void;
  nameGenEnabledInTools: boolean;
  setNameGenEnabledInTools: (val: boolean) => void;
  useExpandedXge: boolean;
  setUseExpandedXge: (val: boolean) => void;
  useNonPhbSupportXge: boolean;
  setUseNonPhbSupportXge: (val: boolean) => void;
  titleEnabledInRandom: boolean;
  setTitleEnabledInRandom: (val: boolean) => void;
  showTitleOnSheet: boolean;
  setShowTitleOnSheet: (val: boolean) => void;
  showXpOnSheet: boolean;
  setShowXpOnSheet: (val: boolean) => void;
  
  // Decoupled detailed states
  traitGenEnabledInDetails: boolean;
  setTraitGenEnabledInDetails: (val: boolean) => void;
  titleGenEnabledInDetails: boolean;
  setTitleGenEnabledInDetails: (val: boolean) => void;
  partyNameGenEnabled: boolean;
  setPartyNameGenEnabled: (val: boolean) => void;
  partyAppGenEnabled: boolean;
  setPartyAppGenEnabled: (val: boolean) => void;
  partyTitleGenEnabled: boolean;
  setPartyTitleGenEnabled: (val: boolean) => void;
  xgeEnabledInDetails: boolean;
  setXgeEnabledInDetails: (val: boolean) => void;

  aiConfig: any;
  setAiConfig: (config: any) => void;
  saveAIConfig: (config: any) => any;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  allowNewerExpansionOverride: boolean;
  setAllowNewerExpansionOverride: (val: boolean) => void;
}

type TabType = 'wizard' | 'story' | 'helpers' | 'title' | 'theme' | 'ai';

export function GlobalSettingsModal({
  open,
  onClose,
  initialTab = 'wizard',
  appGenEnabledInRandom,
  setAppGenEnabledInRandom,
  nameGenEnabledInRandom,
  setNameGenEnabledInRandom,
  appGenEnabledInDetails,
  setAppGenEnabledInDetails,
  nameGenEnabledInTools,
  setNameGenEnabledInTools,
  useExpandedXge,
  setUseExpandedXge,
  useNonPhbSupportXge,
  setUseNonPhbSupportXge,
  titleEnabledInRandom,
  setTitleEnabledInRandom,
  showTitleOnSheet,
  setShowTitleOnSheet,
  showXpOnSheet,
  setShowXpOnSheet,
  
  traitGenEnabledInDetails,
  setTraitGenEnabledInDetails,
  titleGenEnabledInDetails,
  setTitleGenEnabledInDetails,
  partyNameGenEnabled,
  setPartyNameGenEnabled,
  partyAppGenEnabled,
  setPartyAppGenEnabled,
  partyTitleGenEnabled,
  setPartyTitleGenEnabled,
  xgeEnabledInDetails,
  setXgeEnabledInDetails,
  aiConfig,
  setAiConfig,
  saveAIConfig,
  currentTheme,
  setCurrentTheme,
  allowNewerExpansionOverride,
  setAllowNewerExpansionOverride
}: GlobalSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [showOverrideExplanation, setShowOverrideExplanation] = useState(false);

  React.useEffect(() => {
    if (open) setActiveTab(initialTab);
  }, [open, initialTab]);

  if (!open) return null;

  const tabsData: Record<TabType, { name: string; icon: string; desc: string }> = {
    wizard: { name: '基础建卡设置', icon: '⚔️', desc: '配置基础的随机生成与建卡偏好。' },
    story: { name: '扩展身世经历', icon: '📜', desc: '开启或关闭《万事指南》(XGE) 等扩展经历生成模块。' },
    helpers: { name: '快速工具配置', icon: '🎲', desc: '配置如属性购点等独立计算工具的偏好项。' },
    title: { name: '更多设置', icon: '🎖️', desc: '其他细微的系统选项。' },
    theme: { name: '外观与主题', icon: '🎨', desc: '选择系统所用的配色方案与视觉主题。' },
    ai: { name: 'AI 辅助配置', icon: '🤖', desc: '配置自定义大语言模型接口与自动润色开关。' }
  };

  const currentTabInfo = tabsData[activeTab];

  const handleAiConfigChange = (key: string, value: any) => {
    const updated = saveAIConfig({ [key]: value });
    setAiConfig(updated);
  };

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

  return (
    <div id="modal-global-settings" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-lg max-w-xl w-full max-h-[90vh] overflow-hidden shadow-xl p-0 relative flex flex-col animate-in zoom-in-95 duration-200 text-left font-sans">
        <button 
          id="btn-close-global-settings"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
          title="关闭"
        >
          ✕
        </button>

        <div className="border-b border-stone-200 pt-5 pb-3 px-6">
          <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
            {currentTabInfo.icon} {currentTabInfo.name}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {currentTabInfo.desc}
          </p>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[180px] text-sm text-stone-700">
          
          {/* TAB 1: WIZARD RANDOM HELPER BUTTONS */}
          {activeTab === 'wizard' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="chk-name-gen-tools"
                  checked={nameGenEnabledInTools}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setNameGenEnabledInTools(val);
                    localStorage.setItem('nameGenEnabledInTools', String(val));
                  }}
                  className="w-4 h-4 mt-0.5 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                />
                <label htmlFor="chk-name-gen-tools" className="text-xs font-semibold text-stone-700 cursor-pointer flex-1 select-none">
                  在角色细节中启用「姓名」随机生成
                  <span className="block text-[11px] text-stone-500 font-normal mt-1 leading-normal">
                    开启后，将在建卡“细节”输入名字旁边增加随机生成姓名按钮。
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-2.5 border-t border-stone-100 pt-3">
                <input
                  type="checkbox"
                  id="chk-app-gen-details"
                  checked={appGenEnabledInDetails}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setAppGenEnabledInDetails(val);
                    localStorage.setItem('appGenEnabledInDetails', String(val));
                  }}
                  className="w-4 h-4 mt-0.5 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                />
                <label htmlFor="chk-app-gen-details" className="text-xs font-semibold text-stone-700 cursor-pointer flex-1 select-none">
                  在角色细节中启用「外貌」随机生成
                  <span className="block text-[11px] text-stone-500 font-normal mt-1 leading-normal">
                    开启后，在“细节”步骤中的外貌输入框旁增加随机生成外貌按钮。（非官方 自制内容）
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-2.5 border-t border-stone-100 pt-3">
                <input
                  type="checkbox"
                  id="chk-trait-gen-details"
                  checked={traitGenEnabledInDetails}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setTraitGenEnabledInDetails(val);
                    localStorage.setItem('traitGenEnabledInDetails', String(val));
                  }}
                  className="w-4 h-4 mt-0.5 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                />
                <label htmlFor="chk-trait-gen-details" className="text-xs font-semibold text-stone-700 cursor-pointer flex-1 select-none">
                  在角色细节中启用「性格特质」随机生成
                  <span className="block text-[11px] text-stone-500 font-normal mt-1 leading-normal">
                    开启后，在“细节”步骤的背景文本栏旁增加随机生成特质按钮。（非官方 自制内容）
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-2.5 border-t border-stone-100 pt-3">
                <input
                  type="checkbox"
                  id="chk-title-gen-details"
                  checked={titleGenEnabledInDetails}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setTitleGenEnabledInDetails(val);
                    localStorage.setItem('titleGenEnabledInDetails', String(val));
                  }}
                  className="w-4 h-4 mt-0.5 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                />
                <label htmlFor="chk-title-gen-details" className="text-xs font-semibold text-stone-700 cursor-pointer flex-1 select-none">
                  在角色细节中启用「专属称号」随机生成
                  <span className="block text-[11px] text-stone-500 font-normal mt-1 leading-normal">
                    开启后，如果显示了专属称号字段，将在专属称号输入框旁增加随机生成特质按钮。（非官方 自制内容）
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-2.5 border-t border-stone-100 pt-3 flex-col text-left">
                <div className="flex items-start gap-2.5 w-full">
                  <input
                    type="checkbox"
                    id="chk-allow-newer-override"
                    checked={allowNewerExpansionOverride}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setAllowNewerExpansionOverride(val);
                      localStorage.setItem('allowNewerExpansionOverride', String(val));
                    }}
                    className="w-4 h-4 mt-0.5 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                  />
                  <div className="text-xs font-semibold text-stone-700 select-none flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 leading-normal">
                    <label htmlFor="chk-allow-newer-override" className="cursor-pointer">
                      重名种族/职业以最新扩展自动覆盖
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowOverrideExplanation(true)}
                      className="text-[10px] text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 transition-colors h-5.5 font-sans flex items-center justify-center cursor-pointer w-fit"
                    >
                      💡 查看解释小窗口
                    </button>
                  </div>
                </div>
                <span className="block text-[11px] text-stone-500 font-normal pl-6 leading-normal">
                  开启后，同名原案完全由发行的最新图书覆盖（隐藏切换缩写）；关闭后，可通过点击缩写自由切换。
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: LIFE STORY SETTINGS (XGE) */}
          {activeTab === 'story' && (
            <div className="space-y-4 animate-in fade-in duration-150">
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
                  细节页启用《万事指南》(XGE) 经历身世生成
                  <span className="block text-[11px] text-stone-500 font-normal mt-1 leading-normal">
                    开启后，在“细节”步骤的背景文本栏旁增加 XGE 这是你的人生 生成按钮。
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-2.5 border-t border-stone-100 pt-3">
                <input
                  type="checkbox"
                  id="chk-xge-nonphb"
                  checked={useNonPhbSupportXge}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setUseNonPhbSupportXge(val);
                    localStorage.setItem('useNonPhbSupportXge', String(val));
                  }}
                  className="w-4 h-4 mt-0.5 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                />
                <label htmlFor="chk-xge-nonphb" className="text-xs font-semibold text-stone-700 cursor-pointer flex-1 select-none">
                  支持非 PHB 背景及职业的奇遇经历计算
                  <span className="block text-[11px] text-stone-500 font-normal mt-1 leading-normal">
                    不仅限于官方玩家手册，能基于用户扩展包中的自定义职业背景进行逻辑匹配计算。（非官方 自制内容）（beta）
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-2.5 border-t border-stone-100 pt-3">
                <input
                  type="checkbox"
                  id="chk-xge-expanded"
                  checked={useExpandedXge}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setUseExpandedXge(val);
                    localStorage.setItem('useExpandedXge', String(val));
                  }}
                  className="w-4 h-4 mt-0.5 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                />
                <label htmlFor="chk-xge-expanded" className="text-xs font-semibold text-stone-700 cursor-pointer flex-1 select-none">
                  拓展更多随机经历
                  <span className="block text-[11px] text-stone-500 font-normal mt-1 leading-normal">
                    在标准《万事指南》内容外增加更多平凡夸张详细的经历。（非官方 自制内容）
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: ONE-CLICK & PARTY GENERATORS (HELPERS) */}
          {activeTab === 'helpers' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* TOP SECTION */}
              <div>
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2.5">
                  🎲 快速生成角色 相关配置
                </h4>
                <div className="space-y-3 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="chk-name-gen-random"
                      checked={nameGenEnabledInRandom}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setNameGenEnabledInRandom(val);
                        localStorage.setItem('nameGenEnabledInRandom', String(val));
                      }}
                      className="w-4 h-4 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                    />
                    <label htmlFor="chk-name-gen-random" className="text-xs font-semibold text-stone-700 cursor-pointer">
                      随机生成姓名 (默认)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="chk-app-gen-random"
                      checked={appGenEnabledInRandom}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setAppGenEnabledInRandom(val);
                        localStorage.setItem('appGenEnabledInRandom', String(val));
                      }}
                      className="w-4 h-4 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                    />
                    <label htmlFor="chk-app-gen-random" className="text-xs font-semibold text-stone-700 cursor-pointer">
                      随机生成外貌 (默认)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="chk-title-gen-random"
                      checked={titleEnabledInRandom}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setTitleEnabledInRandom(val);
                        localStorage.setItem('titleEnabledInRandom', String(val));
                      }}
                      className="w-4 h-4 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                    />
                    <label htmlFor="chk-title-gen-random" className="text-xs font-semibold text-stone-700 cursor-pointer">
                      随机生成称号 (默认选项)
                    </label>
                  </div>
                </div>
              </div>

              {/* MIDDLE DIVIDER */}
              <div className="border-t border-stone-200 my-4 pt-1"></div>

              {/* BOTTOM SECTION */}
              <div>
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2.5">
                  👥 快速生成小队 生成配置
                </h4>
                <div className="space-y-3 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="chk-party-name"
                      checked={partyNameGenEnabled}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setPartyNameGenEnabled(val);
                        localStorage.setItem('partyNameGenEnabled', String(val));
                      }}
                      className="w-4 h-4 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                    />
                    <label htmlFor="chk-party-name" className="text-xs font-semibold text-stone-700 cursor-pointer">
                      随机生成姓名 (默认)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="chk-party-app"
                      checked={partyAppGenEnabled}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setPartyAppGenEnabled(val);
                        localStorage.setItem('partyAppGenEnabled', String(val));
                      }}
                      className="w-4 h-4 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                    />
                    <label htmlFor="chk-party-app" className="text-xs font-semibold text-stone-700 cursor-pointer">
                      随机生成外貌 (默认)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="chk-party-title"
                      checked={partyTitleGenEnabled}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setPartyTitleGenEnabled(val);
                        localStorage.setItem('partyTitleGenEnabled', String(val));
                      }}
                      className="w-4 h-4 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                    />
                    <label htmlFor="chk-party-title" className="text-xs font-semibold text-stone-700 cursor-pointer flex-1 leading-normal">
                      随机生成称号
                      <span className="block text-[10px] text-stone-500 font-normal mt-0.5 leading-normal">
                        勾选后会展示随机生成的称号，取消后不再展示
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADVENTURER TITLE DISPLAY ON SHEET */}
          {activeTab === 'title' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="chk-show-title-sheet"
                  checked={showTitleOnSheet}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setShowTitleOnSheet(val);
                    localStorage.setItem('showTitleOnSheet', String(val));
                  }}
                  className="w-4 h-4 mt-0.5 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                />
                <label htmlFor="chk-show-title-sheet" className="text-xs font-semibold text-stone-700 cursor-pointer flex-1 select-none">
                  允许在“细节”输入称号
                  <span className="block text-[11px] text-stone-500 font-normal mt-1 leading-normal">
                    开启后，可以在细节输入称号，称号也会显示在角色卡（若隐藏本框，则不展示称号和输入框）。
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-2.5 pt-4 border-t border-stone-200">
                <input
                  type="checkbox"
                  id="chk-show-xp-sheet"
                  checked={showXpOnSheet}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setShowXpOnSheet(val);
                    localStorage.setItem('showXpOnSheet', String(val));
                  }}
                  className="w-4 h-4 mt-0.5 text-amber-600 border-stone-350 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
                />
                <label htmlFor="chk-show-xp-sheet" className="text-xs font-semibold text-stone-700 cursor-pointer flex-1 select-none">
                  在角色卡中启用“经验与等级晋升”模块
                  <span className="block text-[11px] text-stone-500 font-normal mt-1 leading-normal">
                    开启后，在角色卡（生命值下方）展示经验值仪表盘、晋升阶层信息，以及快速增减、输入经验的调试工具栏。
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: THEME SETTINGS */}
          {activeTab === 'theme' && (
            <div className="space-y-4 pb-2 pt-2 animate-in fade-in duration-150">
              {(() => {
                const themesList = [
                  { id: 'dndmanual', name: '📕 龙与地下城手册', group: '📚 规则书与通用排版', desc: '官方规则书经典配色：温润黄铜配深红，还原古朴优雅暗金色泽。' },
                  { id: 'candlekeep', name: '🕯️ 烛堡：静谧繁花', group: '🌍 奇幻地志与世界风貌', desc: '修筑之家护眼配色：静谧森林绿搭配粉黄与柔桃粉卡面，温馨舒雅。' },
                  { id: 'swordcoast', name: '⚓ 剑湾：蓝墨古卷', group: '🌍 奇幻地志与世界风貌', desc: '复古航海图纸风格：褪角焦黄底页与斑驳蓝墨水，尽显探索气息。' },
                  { id: 'waterdeep', name: '🏰 深水城：蔚蓝金冕', group: '🌍 奇幻地志与世界风貌', desc: '皇家海湾奢华蓝金：深邃蔚蓝碧波搭配闪耀王政饰金，尊贵高雅。' },
                  { id: 'shadowfell', name: '💀 堕影冥界：暗影无声', group: '🌍 奇幻地志与世界风貌', desc: '冷色静谧迷雾天幕：晨雾中灰底盘，搭配精致碑刻炭黑字与冷灰蓝。' },
                  { id: 'feywild', name: '🌸 妖精荒野：幻境花海', group: '🌍 奇幻地志与世界风貌', desc: '春日荒野樱草霓幻：落樱暖粉与薰衣草紫相印，富有妖精秘法感。' },
                  { id: 'astral', name: '🌌 星界星海：太虚天盘', group: '🌍 奇幻地志与世界风貌', desc: '星海太虚神秘蓝紫：深邃太虚墨蓝与紫荧恒星折光，璀璨且深邃。' },
                  { id: 'icewind', name: '❄️ 冰风谷的孤木林', group: '🌍 奇幻地志与世界风貌', desc: '苔绿与冷蓝：骨白、冰蓝与坚韧苔绿交织的中性荒野色。' },
                  { id: 'sigil', name: '⚙️ 环印城：石头与奥秘', group: '🌍 奇幻地志与世界风貌', desc: '多元宇宙的中心门扉：中性石灰配以奥法蓝紫与优雅金色。' },
                  { id: 'baldursgate', name: '🌇 博德之门：暮色降临', group: '🌍 奇幻地志与世界风貌', desc: '黄昏的城市阴影：暮色蓝夜空、建筑暗棕与昏黄街灯的暗色交响。' },
                  { id: 'neverwinter', name: '🛡️ 无冬城：冰雪与坚石', group: '🌍 奇幻地志与世界风貌', desc: '北地之珠：清冷暗蓝夜色下，映照出冰雪亮色与坚固岩石的暗调。' },
                  { id: 'mistyvale', name: '🌲 迷雾谷地：森冷木棕', group: '🌍 奇幻地志与世界风貌', desc: '隐秘溪谷：浓重的木质暗棕与冰冷幽绿，构筑迷雾森林暗调。' },
    
                  { id: 'parchment', name: '📜 人类：兼爱羊皮纸', group: '👥 种族血统与先民记忆', desc: '经典复古羊皮古卷：暖铜与深褐相映，字迹清晰且高度护眼。' },
                  { id: 'highforest', name: '🏹 精灵：高深绿野', group: '👥 种族血统与先民记忆', desc: '瑞文戴尔温情河谷：圣洁白理石、林间嫩绿搭配晨曦金，清雅柔和。' },
                  { id: 'dwarf', name: '⛏️ 矮人：巨石熔炉', group: '👥 种族血统与先民记忆', desc: '重金属与玄武岩层：暗炭钢铁底色，搭配熊熊熔炉金与坚固赤铜。' },
                  { id: 'avernus', name: '🔥 提夫林：九域惩击', group: '👥 种族血统与先民记忆', desc: '深渊魔法邪曜九域：极夜黑紫底，点缀瑰丽血红与魅紫色魔法星辉。' },
                  { id: 'gnome', name: '⚙️ 侏儒：日曜旅程', group: '👥 种族血统与先民记忆', desc: '机工古铜日曜旅行：古铜色与明朗日光金交织，灵动活泼。' },
                  { id: 'dragonborn', name: '🪙 龙裔：火山岩浆', group: '👥 种族血统与先民记忆', desc: '火山岩层熔岩烈焰：焦红重土大底配合红龙吐息，威赫而浑厚。' },
                  { id: 'underdark', name: '🔮 卓尔：荧光深邃', group: '👥 种族血统与先民记忆', desc: '幽暗绝地紫萤矿脉：极深曜石底屏，泛着高反差地牢夜行荧光。' },
                  { id: 'golddragon', name: '🐉 金龙：崇高耀金', group: '👥 种族血统与先民记忆', desc: '正义与财富的耀光：纯正夺目的黄金色调，极致亮丽温暖。' },
                  { id: 'halfling', name: '🥧 半身人：南瓜与清茶', group: '👥 种族血统与先民记忆', desc: '舒适惬意的农乡生活：田园茶绿搭配烘焙南瓜香橙，护眼舒适。' },
                  { id: 'orc', name: '🪓 兽人：战狂绿血', group: '👥 种族血统与先民记忆', desc: '格乌什的怒火：灰绿坚忍的兽人肌体底色与狂暴鲜血红相撞。' },
                  { id: 'underdark_shroom', name: '🍄 幽暗地域：迷幻巨蕈', group: '👥 种族血统与先民记忆', desc: '斑斓如荧光的蕈人林：中性紫灰底盘，搭配迷幻亮紫与宝石荧光。' },
    
                  { id: 'fiveetools', name: '🔵 5etools 钴蓝排版', group: '🎁 跑团工具站联动彩蛋', desc: '跑团工具站怀旧排版：纯白底搭配标志性钴蓝标题，清爽洗练。' },
                  { id: 'cocgreen', name: '🐙 Call of Cthulhu 邪神墨绿', group: '🎁 跑团工具站联动彩蛋', desc: '邪神复苏太古黑绿：深邃绿底和古卷纸金，缀以耀眼克眼荧光。' }
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
          )}

          {/* TAB 6: AI CONFIG */}
          {activeTab === 'ai' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-4 text-sm font-sans">
                <div className="flex flex-col gap-2.5 bg-stone-50 p-4 rounded-lg border border-stone-200">
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

                  <label className="flex items-center gap-1.5 cursor-pointer border-t border-stone-200 pt-3 mt-1.5">
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

                <p className="text-[11px] text-stone-500 leading-relaxed font-sans mt-2 px-1">
                  细节书写与小队故事撰写现已完全独立运作。开启后，对应的界面中会出现魔法闪光润色按钮。
                </p>

                {(aiConfig.detailsEnabled || aiConfig.partyBioEnabled) ? (
                  <div className="space-y-3 pt-2 animate-in slide-in-from-top-1 duration-150">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 mb-1">接口提供商</label>
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
                        <label className="block text-[10px] font-semibold text-stone-500 mb-1">模型名</label>
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
                      <label className="block text-[10px] font-semibold text-stone-500 mb-1">
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
                    <div className="text-[10px] text-stone-400 italic mt-1 pb-1">
                      * 所有配置和 API 密钥均保存在您的本地浏览器中，绝不上传至任何服务器，安全放心。
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-stone-200 rounded-lg p-5 bg-stone-50/50 text-stone-400 text-[11px] text-center flex flex-col justify-center items-center py-7 font-sans">
                    AI 功能目前已全部关闭，不显示配置输入框。若需启用角色卡或小队的 AI 撰稿能力，请勾选上方开关并配置 API。
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        <div className="border-t border-stone-200 pt-3 flex justify-end px-6 pb-4 bg-stone-50/50">
          <button
            id="btn-save-global-settings"
            onClick={onClose}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded shadow-sm cursor-pointer border-none transition-colors"
          >
            保存配置
          </button>
        </div>
      </div>

      {showOverrideExplanation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-lg shadow-xl max-w-sm w-full p-5 relative animate-in zoom-in-95 duration-200 text-left">
            <h3 className="text-sm font-serif font-bold text-stone-900 border-b border-stone-200 pb-2 mb-3 flex items-center gap-1.5 justify-start">
              ⚖️ 多版本同名覆盖规则详解
            </h3>
            <div className="text-xs text-stone-600 space-y-2.5 leading-relaxed font-sans">
              <p>在 D&D 5e WIKI 里，多个扩展设定集常常包含了同一种族（如人类、阿斯莫）或职业。系统提供了以下两种调度方案：</p>
              <div className="border border-stone-100 bg-stone-50 p-2 rounded flex flex-col gap-2">
                <div className="flex gap-1">
                  <span className="font-bold text-amber-700 flex-shrink-0">🟢 启用覆盖：</span>
                  <span className="flex-1">重名原案直接按最新出版书作准，只展示一版并隐藏切换缩写。</span>
                </div>
                <div className="flex gap-1 border-t border-stone-200/50 pt-1.5">
                  <span className="font-bold text-stone-700 flex-shrink-0">⚪ 关闭覆盖：</span>
                  <span className="flex-1">所有版本并列可选。您可以随时在建卡时点击卡片旁的缩写（如 PHB / VGM / MPMM）来循环切换版本。</span>
                </div>
              </div>
              <p className="text-[10px] text-stone-400">※ 此选项状态会与扩展管理面板保持永久性共通反馈。</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowOverrideExplanation(false)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold cursor-pointer shadow transition-colors border-none"
              >
                我已了解
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
