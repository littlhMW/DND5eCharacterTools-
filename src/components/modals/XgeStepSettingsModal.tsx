import React, { useState } from 'react';

interface XgeStepSettingsModalProps {
  open: boolean;
  onClose: () => void;
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
}

type TabType = 'wizard' | 'story' | 'helpers' | 'title';

export function XgeStepSettingsModal({
  open,
  onClose,
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
  setXgeEnabledInDetails
}: XgeStepSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('wizard');

  if (!open) return null;

  const tabs: { id: TabType; name: string; icon: string }[] = [
    { id: 'wizard', name: '1. 建卡辅助设置', icon: '⚔️' },
    { id: 'story', name: '2. XGE设置', icon: '📜' },
    { id: 'helpers', name: '3. 工具设置', icon: '🎲' },
    { id: 'title', name: '4. 更多设置', icon: '🎖️' }
  ];

  return (
    <div id="modal-xge-step-settings" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
        <button 
          id="btn-close-xge-step-settings"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-sm p-1 cursor-pointer font-sans bg-transparent border-none"
          title="关闭"
        >
          ✕
        </button>

        <div className="border-b border-stone-200 pb-3">
          <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
            ⚙️ 高级设置
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            在此分类进行扩展词库、快速生成模块及各种辅助功能的偏好设置。
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex border-b border-stone-150 gap-1 overflow-x-auto pb-1.5 scrollbar-thin">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded transition-all cursor-pointer border-none flex items-center gap-1 bg-transparent ${
                activeTab === tab.id
                  ? 'text-amber-800 bg-amber-50 shadow-sm border border-amber-200/50'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Settings Body */}
        <div className="min-h-[180px] py-1 text-sm text-stone-700">
          
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
                  允许再“细节”输入称号
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

        </div>

        <div className="border-t border-stone-200 pt-4 flex justify-end">
          <button
            id="btn-save-xge-step-settings"
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
}
