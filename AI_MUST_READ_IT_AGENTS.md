# AI Agent Handover Guide (合并版)

接手本应用（Littlh的DND5E角色创建工具）开发时，请严格遵守以下原则。

## 一、 项目定位与语言规范
- **纯中文**：用户可见内容**不得**中英对照（如“力量 Strength”）。JSON `id`、`source` 等代码标识除外。
- **术语与译名**：采用官方/公认中文译名。扩展书中文名与缩写（小写）必须严格对应。
- **禁止在描述中使用**：Markdown 表格、无序列表（`- `）、加粗（`**`）。平铺直述，用全角分号或括号分隔。
- **`choices` 仅用于明确选择**：额外语言直接写在基础属性的 `languages` 数组中，切勿放入 `choices`。
- **字数与描述长度管理 (严格限制)**：
  - 职业/种族/背景的核心 `description` 须控制在 **80~120 字** 内，极简概括其定位、背景与扮演核心，**坚决不写废话**。
  - 长列表、变体规则、掷骰表、生平轶事等，**一律提供外置超链接**，不要塞入 `description` 或 `choices` 中。
  - 特性（Traits）描述力求精准，去除罗嗦的叙述词，直接讲明机制（动作类型、伤害骰、豁免属性、距离范围）。
- **分阶解锁**：不同等级解锁的能力必须拆分为独立特性（每个带 `level` 属性），不可合并为长文本。
- **PHB 内容保护**：除非明确要求，否则**禁止修改** `phb` 任何数据。
- **非玩家种族**：源自 DMG 的 NPC 种族（如僵尸），`description` 开头加 `（非玩家种族）\n`。

## 二、 模块调用、扩展与工具规范
- **一键开关与精细化管理**：系统支持以“书(Expansion)”或“单个种族/职业/背景子项(Item)”为维度的开关管理。优先使用统一的 `isSourceEnabled(source, category, settings, itemId)`，确保 UI 可以动态识别其显隐。
- **Agent 工具规范 (Tool Calls)**：
  - 代码复用：在添加新功能前，优先查阅并复用 `utils/` 下的帮助函数（如 `getAvailableRaces`，`dataHelper.ts`），禁止在 UI 侧重新手写相同的筛选 `filter` 逻辑。
  - 路径与文件：编辑或创建文件前**必须**先后调用 `view_file` 或 `list_dir` 熟悉原有依赖结构，严防导入路径错误。
  - 并发限制：涉及到复杂重构（如 `App.tsx`，`LandingPage.tsx`，`types/dnd.ts` 等入口文件）时，请一步步按顺序执行编辑，拒绝大跨度并发覆盖造成状态异常。
- **数据来源与目录结构**：
  - 唯一来源：各书数据严格放在 `src/data/<扩展包缩写>/` 下，统一通过入口文件聚合。请务必参考同包里已知数据（如 `src/data/phb/races.ts`）的结构类型。

## 三、 代码实现规范
- **法术自选**：特性要求从职业法术列表选法术时，使用 `choices` 中 `dynamic: "spell"`，配合 `spellType` 和 `spellList`，**禁止手动列出法术**。
- **超链接格式**：统一用 Markdown `[名称](https://5e.dickytwister.org/...)`。

## 四、 主题配色与 Tailwind 语义（高阶设计规范与部件字典）

系统采用高级的 **「CSS 变量 + Tailwind CSS V4 语义反射」** 架构进行全局动态配色，**严禁硬编码色值**（如自定义 `#333`、`bg-blue-600`等）。
所有样式均通过 CSS 变量绑定在 `src/index.css` 内，并在 HTML 的 `document.documentElement` 上通过 `data-theme` 属性实现动态切换。

### 1. 核心设计语义与颜色映射表

通过映射 `--color-stone-XX` 与 `--color-amber-XX` 语义，系统的 Tailwind 预设颜色类直接被转换为当前激活主题的调色板。

| Tailwind 预制类 | 绑定的 CSS 属性变量 | 对应逻辑部件与页面位置说明 | 用户可见映射与关系 |
| :--- | :--- | :--- | :--- |
| `bg-stone-50` | `var(--app-stone-50)` | **次级背景层/步骤辅助背景**：用在不突出的容器区域，如表单侧栏背景、历史卡片详情页、已折叠项。 | 整体界面的第二视觉层级。 |
| `bg-stone-100` | `var(--app-stone-100)` | **全页主容器底层**：整个页面的基础网页大背景（如 `min-h-screen bg-[#fafaf5]` 或暗底深黑灰）。 | 确定网页整体温婉书卷气或地牢夜间风的最底层。 |
| `border-stone-200`| `var(--app-stone-200)` | **基准分割线与常规边框**：表格线、折叠标题下划线、主卡片轻度描边。 | 规划界面物理框架关系的关键灰线。 |
| `text-stone-300` | `var(--app-stone-300)` | **弱化/禁用或默认占位符**：未填属性点时的占位数、未选步骤前的点划连接线、辅助指示器。 | 辅助低对比度边缘视觉。 |
| `text-stone-400` | `var(--app-stone-400)` | **边缘辅助文本 / 图标修饰**：如“关闭 (✕)”符号颜色、等级Lv勋章底版字、不重要小提示。 | 保证足够阅读差异性的不惹眼说明。 |
| `text-stone-500` | `var(--app-stone-500)` | **副描述/普通辅助说明**：每项规则源自哪本书的说明、种族特性的简要背景旁白（Italic 字体）。 | 用于非强调部分的正常规则注释。 |
| `text-stone-600` | `var(--app-stone-600)` | **正文常规墨书字体**：最基本的描述段落字、长篇详细规则描述、熟练技能文本。 | 必须保证最高对比度和高阅读舒适度的核心文字。 |
| `text-stone-800` | `var(--app-stone-800)` | **加粗文本与小标题**：特性选择项大字、卡片内加粗标注标题、主要标签文字。 | 引导段落呼吸的硬质骨架文本。 |
| `text-stone-900` | `var(--app-stone-900)` | **最高级页面大标题 / 暗遮罩**：大卡片顶部标题（2xl / 3xl ）、模态框遮罩层最深主黑（用于高对比度）。 | 页面的绝对视觉焦点文字。 |
| `bg-white` | `var(--app-white)` | **主卡片内胆/漂浮卡纸底**：卡片的主面板背景（如 `bg-white border border-stone-200 shadow-md` 中的白纸卡底板）。 | 即使在深色主题下，该类也可使卡片正确渲染成长夜灰影底。 |
| `bg-amber-50` | `var(--app-amber-50)` | **微点缀衬色底/气泡高亮背景**：选中某个种族/职业时的金框内胆背景、激活状态标签纸高亮背景。 | 提示“此处已被我点击选中”的高雅色块。 |
| `border-amber-500`| `var(--app-amber-500)`| **激活态高亮轮廓**：选中的卡片大描边、焦点步骤下方长横线、骰子点数弹跳外圆圈。 | 强烈的行为反馈外壳。 |
| `bg-amber-600` | `var(--app-amber-600)` | **主操作/召唤动作按钮**：如“开启旅程”、“保存角色”、“筛掷(Roll!)” 按钮底色。 | 促进玩家进行“下一步”点击。 |
| `hover:bg-amber-700`| `var(--app-amber-700)`| **主操作按钮悬停态**：鼠标指针放置在主动作按钮上的高对比渐变反馈。 | 提升桌面端操作连贯性。 |
| `text-amber-700` | `var(--app-amber-700)` | **页面链接/强调重点文案**：指向跑团工具站的跳转超链接、高亮提示文字（如“选择已满”）。| 提供在正文中打破常规单色系的耀眼标记。 |

---

### 2. 网页具体部件对应关系及层级架构 (Widget Dictionary)

以下针对页面核心组件，标明其对应的功能部件位置、变量渲染模式以及相互交互关系：

#### 🎨 部件 A: 网页顶部主导航栏（Header / Deco-Navbar）
*   **具体位置**：首页面最顶部栏（`LandingPage.tsx` 中的 `<nav>`，id: `landing-navbar`）。
*   **渲染关系**：调用 `getNavbarStyles()`，该函数为全部 **16 种主题** 分别注入定制化对象（`nav`, `logoText`, `logoIcon`, `menuText`, `divider`, `itemHover`, `dropdownBg`, `dropdownText`, `mobileLinkText`, `mobileBorder`, `mobileAccordionBg`, `mobileSubText`, `iconColor`）。
*   **核心关联**：在暗底、绿底、紫底、海蓝底等非传统亮白主题中，它会转换成对应的神秘深黑、丛林绿、星界蓝；不因全局 `bg-stone-50` 的变化而影响标题字、链接按钮的极限辨识。

#### 📜 部件 B: 创建主导向卡片组 (Wizard Steps & Cards)
*   **具体位置**：创建角色流程中的各类属性、种族选择方片（`src/components/steps/*`），包括 `OriginStep.tsx`、`ClassStep.tsx`、`BackgroundStep.tsx` 等。
*   **渲染关系**：
    *   **未选中状态卡片**：`bg-stone-50/40 border-stone-200 hover:border-amber-300 text-stone-600 hover:text-stone-800 hover:bg-stone-50 transition`。极高可读。
    *   **已激活状态卡片**：`bg-amber-50/50 border-amber-500 shadow-md text-stone-900 border-2`。会有明亮的边框和更融洽的高亮底衬色。
*   **核心关联**：不要使用硬编码的 `bg-yellow`，否则会在精灵高丽绿、九域炼狱黑主题中显得极其突兀。

#### 📊 部件 C: 属性购点/检定调整器 (Point-Buy Sheet Tools)
*   **具体位置**：在创建角色的第四步“属性”（`AbilitiesStep.tsx`）及 toolbox 的属性微调面板（`AbilityGeneratorTool.tsx`）。
*   **渲染关系**：
    *   **购点底板**：`bg-stone-50/50 border border-stone-200`
    *   **调整器加减控钮 (- / +)**：`bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200`
    *   **属性总分提示圆环**：`bg-amber-50 border border-amber-300 text-amber-800`
*   **核心关联**：在所有配色的重构中，确保减法数字不能因为变成高亮深色而在深褐色背景下看不懂。因此，深褐色矮人/狂暴龙裔中，使用不发暗的中深度岩褐色底座及白灰字配合。

####  部件 D: 对话模态框与遮罩层 (Modals & Backdrop Overlays)
*   **具体位置**：网页内弹出的设置框、扩展源配置框、骰子掷骰面板，如 `ThemeSettingsModal.tsx`，`ExpansionsModal.tsx` 等。
*   **渲染关系**：
    *   **透明大网罩 bg-stone-950/45**：遮盖底层网页交互的不惹眼幕布。
    *   **模态内容背景层 `bg-white` (或主题反射款) 搭配阴影 shadow-xl**：呈现一个凸显在最前方的规则悬浮卡纸。
    *   **关闭小叉字 `text-stone-400 hover:text-stone-600`**：辅助性操作按钮，点击即刻回弹。

---

### 3. 主题的三大分类规范 (Light, Dark & Neutral Classification)

为了让页面排版在各种主题下都具有完美的对比度、护眼性与扮演美感，系统将 16 套经典主题按背景反射和明暗对比分为三大类：

1. **浅色主题 (Light Themes)**：
   - *特点*：背景面板为极浅的暖白、牙米、清绿或纸白色，文字为墨黑或深暗褐色。具有极佳的清晰度和书香感。
   - *成员*：
     - `dndmanual` (📕 龙与地下城手册)
     - `parchment` (📜 人类：兼爱羊皮纸)
     - `fiveetools` (🔵 5etools 钴蓝排版)
     - `highforest` (🏹 精灵：高深绿野) *高洁晨风清亮绿*
     - `shadowfell` (💀 堕影冥界：暗影无声) *冷冽清冷白灰地底，高对比碳黑字*

2. **深色主题 (Dark Themes)**：
   - *特点*：大背景为曜石黑、深邃极黑、星夜深蓝等高反差低亮度色彩。为保证文字高清阅读，使用对应主题极具发光霓虹感的炫彩亮色（粉紫荧光、星海恒光、克眼荧绿等）。
   - *成员*：
     - `dark` (👤 标准夜间深灰色)
     - `underdark` (🔮 卓尔：荧光深邃)
     - `avernus` (🔥 提夫林：九域惩击)
     - `astral` (🌌 星界星海：太虚天盘)
     - `feywild` (🌸 妖精荒野：幻境花海)
     - `cocgreen` (🐙 邪神太古虚空墨绿)
     - `waterdeep` (🏰 深水城：蔚蓝金冕)

3. **中性色/过渡区主题 (Neutral Themes)**：
   - *特点*：介于明暗之间的中低明度、低饱和色温过渡主题。选用不突兀的森林嫩绿、远洋灰青蓝、火山石烧制石、机工黄铜齿轮金，实现无刺激、无眼部高度紧张的舒适写实式视觉。
   - *成员*
     - `candlekeep` (🕯️ 烛堡：静谧繁花)
     - `swordcoast` (⚓ 剑湾：蓝墨古卷)
     - `gnome` (⚙️ 侏儒：日曜旅程)
     - `dragonborn` (🪙 龙裔：火山岩浆)
     - `dwarf` (⛏️ 矮人：巨石熔炉)


---

## 五、 其他注意事项
- 每次大改动请更新 `README.md`，记录新增扩展源与功能。
- 修改熟练项、法术列表等底层属性时，确保 `hooks`、`CharacterContext` 及相关步骤组件能正常捕获。
- 若需引用内部表格或复杂列表，使用超链接，不内嵌。

---

## 六、 项目文件结构与功能设计图 (Project Directory Structure & Feature Map)

本系统采用高内聚、扁平且模块分明的 React (Vite) + Tailwind 经典奇幻应用架构。以下为全部核心文件夹、文件及对应职责说明：

| 目录与具体代码文件路径 | 核心挂载组件 / 功能标识 | 文件主要职责与对应关系说明 |
| :--- | :--- | :--- |
| **`src/types/dnd.ts`** | 全局类型定义核心 | 承载角色（`Character`）、种族（`Race`）、职业（`Class`）、背景（`Background`）、法术（`Spell`）、可选扩展包、以及状态流转 Reducer Action 基础类型。 |
| **`src/context/CharacterContext.tsx`** | 全局状态引擎 | 使用 React Context 与 `useReducer` 驱动。控制整个创建流程的状态流、数据的持久加载（localStorage）、历史卡片管理以及状态动作派发。 |
| **`src/components/LandingPage.tsx`** | 首页与生命周期 | 系统大入口，包含角色库列表、主题高悬配置项加载、删除盖板、侧边栏工具箱悬挂，以及通过 `getNavbarStyles()` 动态为十六套主题返回 navbar 配色。 |
| **`src/components/WizardLayout.tsx`** | 创建向导壳体 | 统一的角色创建七步法导向布局容器，协调上下步交互（上一步、继续、完成保存），并动态切换各 Step 的激活样式。 |
| **`src/components/CharacterSummary.tsx`**| 实时审查面板 | 右侧/底部固定挂圈的实时角色构建卡，随属性点消耗、种族选择及法术更动进行多维度数值属性加值、血量换算、熟练度即时渲染。 |
| **`src/components/CharacterSheet.tsx`** | 电子角色卡渲染 | 创建完毕后，渲染一份极其硬核、优雅的纸质风格电子角色卡，支持打印和导出。 |
| **`src/components/steps/`** | **「向导核心构建步骤」** | **具体开发步骤挂载位置**： |
| ├─ `OriginStep.tsx` | 步骤一：种族血统 | 提供种族及子种族挑选，联动数据源扩展开关进行显示。 |
| ├─ `ClassStep.tsx` | 步骤二：职业等级 | 包含职业、子职业、等级滑杆（已实现主题变量绑定高对比）及特性预览。 |
| ├─ `BackgroundStep.tsx`| 步骤三：先民背景 | 配置背景、选择技能熟练项和自定义背景描述。 |
| ├─ `AbilitiesStep.tsx` | 步骤四：属性购点 | 手动加点或预设阵列购点系统，高度对应 CSS 主题颜色变量体系。 |
| ├─ `SpellsStep.tsx` | 步骤五：法术环阶 | 检测对应法术职业（如法师、牧师）动态提供可用法术、戏法卡选取。 |
| ├─ `DetailsStep.tsx` | 步骤六：肖像插画 | 玩家角色名称、阵营设置、内置了**支持裁剪、缩放的玩家卡片头像上传与裁切器**（`ImageUploadWithCrop`）。 |
| ├─ `ReviewStep.tsx` | 步骤七：终极大纲 | 角色总结总览。 |
| **`src/components/modals/`** | **「高悬浮功能弹窗组件」** | **悬浮框部件挂载位置**： |
| ├─ `ThemeSettingsModal.tsx`| 🎨 主题配色弹窗 | 展现 16 套主题选项并持久化对应。已精炼简化全部主题文字描述。 |
| ├─ `ExpansionsModal.tsx` | 📚 扩展源开关弹窗 | 可控 phb、xge、tce、vgm、mtf、scag 等官方书扩展包联动检索。 |
| ├─ `XgeStepSettingsModal.tsx`| 🎲 经历生成设置弹窗| 协调和精调《珊娜萨的万事指南》人生轨迹骰表细节。 |
| **`src/components/tools/`** | **「快速跑团与工具箱面板」**| **悬浮辅助窗与跑团辅助器**（联动下拉菜单快速打开）： |
| ├─ `QuickDiceRoller.tsx` | 🎲 快捷骰子掷骰 | 支持 1d4, 1d6, 1d8, 1d10, 1d12, 1d20, 1d100 弹窗掷骰，带物理动画。 |
| ├─ `AppearancePersonalityGenerator.tsx`| 👤 外貌性格骰表 | 帮助跑团直接生成具有个性的外貌、瑕疵、怪癖描述。 |
| ├─ `AbilityGeneratorTool.tsx`| 📊 属性生成面板 | 快速进行 3d6、4d20 或点数生成计算。 |
| ├─ `EncounterCalculator.tsx`| ⚔️ 遭遇难度换算器| 多玩家、怪物的 CR 与挑战等级算法遭遇。 |
| ├─ `PartyGenerator.tsx` | 👥 小队快速生成器 | 自动组建一队包含各种初始配比、职业、种族名称的完美玩家小队。 |
| ├─ `XgeModal.tsx` | 📜 珊娜萨人生履历袋 | 全自动根据 XGE 设定规则掷出角色的生平事件、父母状况、意外财富及罪行，一键载入详情。 |
| **`src/utils/`** | **「核心纯函数算法」** | **通用与辅助计算：** |
| ├─ `raceHelper.ts` | 种族多扩展提取 | 过滤或查询可用种族，严禁手动直接 `map` 绕过扩展开关。 |
| ├─ `expansionHelper.ts` | 扩展包标志计算 | 提供多本书的数据融合开关判定。 |
| ├─ `proficiencies.ts` | 熟练加值与技能 | 计算熟练加值、语言加值和基础防具、武器。 |
| ├─ `xgeLifeGenerator.ts` | 珊娜萨人生流计算 | 人生经历、童年背景、悲欢离合生成算法骰子引擎。 |
| ├─ `customRollTraits.ts` | 自定义快捷摇骰库 | 控制性格、姓名、跑团初始奖励特征的随机。 |

--- 
*本指南由 AI 助手在 2026年5月27日 彻底整理并合并补全，所有开发规范与16套经典配色设计内核均完整保留。*