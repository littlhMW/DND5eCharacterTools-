import React from 'react';
import { PROVIDERS } from '../../utils/aiHelper';

interface AiConfigModalProps {
  open: boolean;
  onClose: () => void;
  aiConfig: any;
  setAiConfig: (config: any) => void;
  saveAIConfig: (config: any) => any;
}

export function AiConfigModal({ open, onClose, aiConfig, setAiConfig, saveAIConfig }: AiConfigModalProps) {
  if (!open) return null;

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left font-sans">
        <button 
          onClick={onClose}
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
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded transition-colors shadow-sm cursor-pointer border-none"
          >
            保存关闭
          </button>
        </div>
      </div>
    </div>
  );
}
