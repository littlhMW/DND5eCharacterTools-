/**
 * AI Helper for D&D 5e Character Background & Appearance Generator
 * Supports client-side OpenAI-compatible API configurations.
 */

export interface AIConfig {
  enabled: boolean;
  provider: string; // 'deepseek' | 'gemini' | 'openai' | 'qwen' | 'kimi' | 'custom'
  apiKey: string;
  apiBaseUrl: string;
  model: string;
  xgeEnabled?: boolean;
}

export const PROVIDERS = [
  {
    id: 'deepseek',
    name: 'DeepSeek (深度求索)',
    defaultBaseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
  },
  {
    id: 'qwen',
    name: '通义千问 (Qwen)',
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
  },
  {
    id: 'gemini',
    name: 'Google Gemini (OpenAI兼容接口)',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-1.5-flash',
  },
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    defaultBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
  },
  {
    id: 'kimi',
    name: '月之暗面 Kimi',
    defaultBaseUrl: 'https://api.moonshot.cn/v1',
    defaultModel: 'moonshot-v1-8k',
  },
  {
    id: 'custom',
    name: '自定义 (Custom API)',
    defaultBaseUrl: '',
    defaultModel: '',
  },
];

const LOCAL_STORAGE_KEY = 'dnd_ai_config';

const defaultSettings: AIConfig = {
  enabled: false,
  provider: 'deepseek',
  apiKey: '',
  apiBaseUrl: 'https://api.deepseek.com',
  model: 'deepseek-chat',
  xgeEnabled: false,
};

export function getAIConfig(): AIConfig {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse AI Config:', e);
  }
  return defaultSettings;
}

export function saveAIConfig(config: Partial<AIConfig>): AIConfig {
  const current = getAIConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save AI Config:', e);
  }
  return updated;
}

export interface AIResult {
  appearance: string;
  backstory: string;
}

/**
 * Call the configured LLM API to generate a backstory and appearance.
 */
export async function generateBackstoryAndAppearance(
  characterContext: {
    characterName?: string;
    age?: string;
    backgroundName?: string;
    raceName: string;
    subraceName?: string;
    className: string;
    subclassName?: string;
    level: number;
    alignment: string;
    appearance: string;
    backstory: string;
    personality: string;
    ideals: string;
    bonds: string;
    flaws: string;
    raceDescription?: string;
    subraceDescription?: string;
    classDescription?: string;
    subclassDescription?: string;
  }
): Promise<AIResult> {
  const config = getAIConfig();

  if (!config.enabled) {
    throw new Error('AI 功能未开启，请先在工具箱配置并勾选启用。');
  }

  if (!config.apiKey.trim()) {
    throw new Error('API Key 未填写，请先在工具箱或界面中填写您的 API Key。');
  }

  if (!config.apiBaseUrl.trim()) {
    throw new Error('API Base URL 未填写。');
  }

  if (!config.model.trim()) {
    throw new Error('AI 模型名称未填写。');
  }

  const systemPrompt = `你是一个资深的 D&D 5e（龙与地下城第五版）地下城主（DM）与奇幻文学创作者。
你的任务是根据玩家提供的角色姓名、年龄、种族、职业、阵营、背景职业、等级和其他零散细节，为玩家润色并扩写符合 D&D 5e 世界观设定、内容朴实自然、适合常模拟跑团的真实外貌描写和背景故事。
请使用中文撰写。

【撰写要求（关键）】
1. **结合已有细节与人生经历**：如果玩家已有的粗略背景故事中包含有类似“这是你的人生”等出身起源、生涯抉择或生命旅途中遭遇的命运事件（如特定的童年回忆、父母情况、曾遭受的悲剧或福运神迹），你必须完美保留这些设定细节，并用典雅克制、合乎逻辑的手法将它们融合整理到一篇润色后的整体生平故事中，绝不能丢失或遗漏这些关键信息。
2. **结合年龄、名字、阵营与背景**：角色的决策动机、语气语调，需要与他们现有的年龄（例如是血气方刚的青年、沉稳的中年还是阅历过人的长者）、背景、阵营（如守序善良或混乱中立）相互照应，不可产生明显的设定冲突。
   - **特别注意（D&D 5e 种族寿命常识）**：有些长寿种族的年龄阶段与人类截然不同！
     * 精灵（Elf）：通常在100岁左右才刚刚成年，生命可达750岁。
     * 矮人（Dwarf）：50岁左右才被视为成年，寿命可达350岁。
     * 侏儒（Gnome）：40岁左右步入成年，寿命在350至500岁之间。
     * 半精灵（Half-Elf）：二十多岁成年，寿命通常超过180岁。
     在撰写外貌与生平故事时，必须严格尊重角色种族对应的年龄周期阶段，不要套用人类的绝对岁数概念。
3. **中性化叙事**：在描写、背景和称谓中，默认采用完全中性、客观的表述（例如除非名字 and 描述带有强烈性别特征，否则避免无根据地假定角色的性别为“他”或“她”）。
4. **朴实自然的文风**：文笔应当平实、公允、克制。避免使用夸大、空洞、过度华丽或救世主式的“天选/传奇/伟大”词藻，不要给角色强加不合常理的宏大宿命。
5. **正常换行/分段**：在内容中，请合理地使用标准的换行符（\\n）来进行清晰的逻辑分段（不要写成一整块连续的长文本），保持文字的可读性与空气感。

【返回格式要求】
1. 必须且只能返回一个包含 "appearance"（外貌描写）和 "backstory"（背景故事）两个字段的 JSON 格式数据。
2. 绝对不能包含任何除 JSON 外的任何说明文字、对话、注释。
3. 请确保返回的是个标准的 JSON，不要带有 markdown 加密格式，如果以 \`\`\`json 开头，请确保其能被正确提取。

【JSON 示例结构】
{
  "appearance": "先简单描述穿着装束与基本体貌（尽量中性化，文字平实），接着按逻辑通过换行 \\n\\n 划分，描述其随身行囊与装备等质感细节。字数大约 200-300 字。",
  "backstory": "描写其如何习得相应职业、选择当冒险者的过程与动机（完美融合已有的背景细节与人生经历事件），文字质朴克制。通过换行 \\n\\n 分成 2-3 个小段落。字数大约 250-350 字。"
}`;

  const raceDescStr = characterContext.raceDescription ? `（种族描述：${characterContext.raceDescription}）` : '';
  const subraceDescStr = characterContext.subraceDescription ? `（亚种描述：${characterContext.subraceDescription}）` : '';
  const subraceStr = characterContext.subraceName ? `（亚种：${characterContext.subraceName}${subraceDescStr}）` : '';
  const classDescStr = characterContext.classDescription ? `（职业描述：${characterContext.classDescription}）` : '';
  const subclassDescStr = characterContext.subclassDescription ? `（子职业描述：${characterContext.subclassDescription}）` : '';
  const subclassStr = characterContext.subclassName ? `（子职业：${characterContext.subclassName}${subclassDescStr}）` : '';

  const userPrompt = `已经选择的角色基础信息如下：
- 角色姓名：${characterContext.characterName || '未命名'}
- 角色年龄：${characterContext.age || '未指定'}
- 种族：${characterContext.raceName}${raceDescStr}${subraceStr}
- 职业：${characterContext.className}${classDescStr}${subclassStr}
- 角色背景：${characterContext.backgroundName || '未指定'}
- 阵营信念：${characterContext.alignment || '偏向中立'}
- 等级：${characterContext.level}级

玩家已经填写的零散细节与随机生平人生经历（请在此基础和框架内进行扩充润色、合理融入，不要删去玩家原有的关键事实）：
- 已有的粗略外貌：${characterContext.appearance || '无'}
- 已有的粗略背景故事：${characterContext.backstory || '无'}
- 性格特质：${characterContext.personality || '无'}
- 理想：${characterContext.ideals || '无'}
- 牵绊：${characterContext.bonds || '无'}
- 缺点：${characterContext.flaws || '无'}

请为我把“外貌描写”以及“背景故事”这两个部分进行极为生动、细节充实、文笔典雅的润色与扩写补充，确保保留、不丢弃原本提供的信息，扩写并自然过渡关联。
直接输出这个 JSON 实体，其含有 "appearance" 和 "backstory" 两个属性。`;

  const baseUrlClean = config.apiBaseUrl.replace(/\/+$/, '');
  const requestUrl = `${baseUrlClean}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey.trim()}`,
  };

  const bodyData = {
    model: config.model.trim(),
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
  };

  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedErr: any;
      try {
        parsedErr = JSON.parse(errText);
      } catch (e) {}
      const errMsg = parsedErr?.error?.message || errText || `HTTP 错误 ${response.status}`;
      throw new Error(`API 请求失败: ${errMsg}`);
    }

    const resJson = await response.json();
    const rawContent = resJson.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error('API 返回的数据中不包含回复内容。');
    }

    let cleanText = rawContent.trim();
    // Clean codeblock formatting if model generates markdown blocks
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    try {
      const parsed: AIResult = JSON.parse(cleanText);
      if (typeof parsed.appearance !== 'string' || typeof parsed.backstory !== 'string') {
        throw new Error('JSON 解析成功，但内容缺少 appearance 或 backstory 属性');
      }
      return parsed;
    } catch (jsonErr) {
      console.warn('Fallback: Regex extraction since LLM output malformed JSON', rawContent);
      // Fallback regex extractor if LLM returned JSON-like description within text
      const appearanceMatch = rawContent.match(/"appearance"\s*:\s*"([\s\S]*?)"\s*(,\s*"backstory"|$)/);
      const backstoryMatch = rawContent.match(/"backstory"\s*:\s*"([\s\S]*?)"/);

      if (appearanceMatch && backstoryMatch) {
        return {
          appearance: appearanceMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
          backstory: backstoryMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
        };
      }
      
      // If regex also failed, treat the entire string as background or report failure
      throw new Error(`未能成功解析为JSON。返回的原始文字：\n${rawContent}`);
    }
  } catch (err: any) {
    throw new Error(err.message || '网络连接异常，无法访问 AI 服务。');
  }
}
