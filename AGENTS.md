# AI Agent Handover Guide

这份文档旨在为接手本应用（DND5e 角色创建 Wiki）开发的后续 AI 助手提供指导。为了保证维基的一致性和代码质量，请在处理相关任务时，严格遵守以下原则和代码结构规范。

## 一、 项目定位与语言规范
1. **纯中文 Wiki**：
   - 本项目定位于纯中文用户的 DND 5e 维基。
   - **绝不采用中英对照**（例如：不能写 "力量 Strength" 或是 "精灵 Elf"），除部分 JSON 数据 `id` 属性或特殊标识符（如 `source: "phb"`）需要保持英文以便代码逻辑调用外，用户可见文本必须仅有**纯中文**。
2. **术语与译名规范**：
   - 专有名词请尽量采用官方/公认中文译名。
   - 常见的扩展书名缩写应保持为纯小写作为 `source` 标识。参考以下正确缩写（严格比对）：
     - 《玩家手册》 = `phb`
     - 《地下城主指南》 = `dmg`
     - 《珊娜萨的万事指南》 = `xge`
     - 《塔莎的万象坩埚》 = `tce` 
     - 《剑湾冒险指南》 = `scag`
     - 《瓦罗的怪物指南》 = `vgm`
     - 《魔邓肯的众敌卷册》 = `mtf`
     - 《艾伯伦:从终末战争复苏》 = `erlw`
     - 《荒洲探险家指南》 = `egw`
     - 《拉尼卡的公会长指南》 = `ggr`
     - 《塞洛斯的神话奥德赛》 = `mot`
     - 《范·里希腾的鸦阁指南》 = `vrgr`
     - 《费资本的巨龙宝库》 = `fod` 
     - 《邪恶元素玩家指南》 = `eepc`
     - 《湮灭之墓》 = `toa`
3. **文本排版与表格**：
   - **不要在描述字段里使用 Markdown 表格** （`| ... | ... |`），也**不要使用** Markdown 的无序列表（`- `）与加粗（`**`）。参考 `phb` 中的数据结构：所有文本应尽可能平铺直述。
   - 遇到多选一或列举的情况，可以直接在段落中使用全角分号隔开（例如：`...；...；...`）或使用括号简述说明（例如：`选项A（效果）、选项B（效果）`）。
   - **选项（Choices）与描述（Description）的分野**：
     - **必须使用 `choices` 数组（分页选择器）的场景**：当玩家在建卡或升级时必须做出**明确选择**（例如等级提升给予的属性值提升、战斗风格N选1、某些种族随等级解锁的法术/属性选项、星辰德鲁伊形态等），务必将选项置于特性对象的 `choices` 数组中，以便触发前端的交互式选择与结果保存。
     - **简单列出（描述）**：如果只是对该特性的数个效果进行罗列说明（例如图腾勇士在描述中概述熊、鹰、狼的效果），可以直接在 `description` 中列举。
     - **使用超链接列表**：如果列表非常详长，且不需要玩家在建卡期间选定（例如狂野术士需要随机骰的狂野魔法浪涌表），请不要将列表强塞进 `description` 或 `choices` 中，应当直接提供指向该表格的**超链接**。
     - 包含投骰判定的较短纯文本列表（如无前缀连写），同样只写在 `description` 内，不加粗。
4. **描述字数与文字深度规范**：
   - **职业与子职业**：核心描述字数应当精炼，建议维持在 **80 字左右**（不宜超过 100 字 ），在前端展现时能快速传达设计理念与战斗定位。
   - **种族与血统/亚种**：核心描述可参考《玩家手册》(PHB) 标准种族文字样式，建议维持在 **80 字左右**，侧重刻画起源背景、生理特征与扮演引导，维持维基厚重的角色塑造氛围。

## 二、 代码目录与数据结构构造
项目的主要数据和逻辑代码存放在 `src` 目录下，其中需要特别注意的是 `src/data` 目录。
- `src/data/phb/`、`src/data/tce/` 等目录按规则扩展包书籍划分。
- 法术数据：存放于 `spells.ts` 之中。不同源的法术存放在对应的目录下（如 `tce/spells.ts`）。
  - 添加法术后，如果属于某个特定职业使用，需要在 `src/data/spellLists.ts` 以对应职业（如 `artificer`）的数组中注册法术的 `id`。
- 职业数据：存放于 `classes.ts`。所有新职业/子职业需要遵循 `types/dnd.ts` 中定义的 `DndClass` 联合结构。

### 主要参考模板：
新增种族、职业、法术等特性时，**强制参考** `src/data/phb/` 目录下的相关文件结构：
- `phb` 提供了核心模板。
- 特性（traits）里面如果附带链接指向维基中的其他地方，请参照以下内部超链接格式。

## 三、 超链接与交互机制
在 `description` 中引入法术、物品等的外部链接时，使用了统一的 `a` 标签超链接系统，以便跳转到维基对应百科位置（基于 `https://5e.dickytwister.org`）：
- **Markdown 短链接语法**（推荐使用此种）：`[关键词](Url)`
  - 例如装备：`[工匠工具](https://5e.dickytwister.org/items.html#工匠工具_phb)`
  - 法术或基础职业：`https://5e.dickytwister.org/classes.html#中文职业名_资源缩写`（例如 `[术士](https://5e.dickytwister.org/classes.html#术士_phb)`，注意使用中文）。
  - **子职业链接格式**：对于子职业或其特殊表格（如狂野魔法），基础职业名使用中文，需要附加状态参数且子职业名及其缩写需要使用全小写英文：`https://5e.dickytwister.org/classes.html#基础职业中文_资源缩写,state:sub-子职业名英文标识-资源缩写=b1`。
    - 例如狂野魔法术士（需注意其确切对应的系统标识为 wild）：`[狂野魔法浪涌表](https://5e.dickytwister.org/classes.html#术士_phb,state:sub-wild-phb=b1)`。
  - **重要原则：子职业的 ID 标识（全英文标识）必须绝对遵循游戏资料与预定义的短写，否则无法正确跳转**：
    - 术士（Sorcerer）：`storm` (XGE), `aberrant-mind` (TCE), `wild` (PHB - 注意非 wild-magic), `draconic` (PHB), `divine` (XGE), `clockwork-soul` (TCE), `shadow` (XGE)
    - 奇械师（Artificer）：`alchemist` (TCE), `artillerist` (TCE), `battle-smith` (TCE), `armorer` (TCE)
    - 野蛮人（Barbarian）：`storm-herald` (XGE), `zealot` (XGE), `wild-magic` (TCE - 注意非 wild), `berserker` (PHB), `totem-warrior` (PHB), `ancestral-guardian` (XGE), `beast` (TCE), `battlerager` (SCAG)
    - 吟游诗人（Bard）：`creation` (TCE), `whispers` (XGE), `swords` (XGE), `spirits` (VRGR), `glamour` (XGE), `eloquence` (TCE), `lore` (PHB), `valor` (PHB)
    - 牧师（Cleric）：`arcana` (SCAG), `tempest` (PHB), `forge` (XGE), `grave` (XGE), `light` (PHB), `trickery` (PHB), `peace` (TCE), `twilight` (TCE), `life` (PHB), `death` (DMG), `war` (PHB), `knowledge` (PHB), `order` (TCE), `nature` (PHB)
    - 德鲁伊（Druid）：`spores` (TCE), `land` (PHB), `dreams` (XGE), `shepherd` (XGE), `stars` (TCE), `wildfire` (TCE), `moon` (PHB)
    - 战士（Fighter）：`rune-knight` (TCE), `echo-knight` (EGW), `psi-warrior` (TCE), `eldritch-knight` (PHB), `arcane-archer` (XGE), `cavalier` (XGE), `samurai` (XGE), `champion` (PHB), `battle-master` (PHB), `purple-dragon-knight-banneret` (SCAG)
    - 武僧（Monk）：`shadow` (PHB), `kensei` (XGE), `mercy` (TCE - 注意无需 way- 前缀), `sun-soul` (XGE), `open-hand` (PHB), `four-elements` (PHB), `astral-self` (TCE), `long-death` (SCAG), `drunken-master` (XGE)
    - 圣武士（Paladin）：`devotion` (PHB - 注意无需 oath- 前缀), `vengeance` (PHB), `redemption` (XGE), `oathbreaker` (DMG), `glory` (TCE), `watchers` (TCE), `crown` (SCAG), `ancients` (PHB), `conquest` (XGE)
    - 游侠（Ranger）：`monster-slayer` (XGE), `swarmkeeper` (TCE), `horizon-walker` (XGE), `hunter` (PHB), `beast-master` (PHB), `fey-wanderer` (TCE), `gloom-stalker` (XGE)
    - 游荡者（Rogue）：`mastermind` (XGE), `scout` (XGE), `assassin` (PHB), `swashbuckler` (XGE), `arcane-trickster` (PHB), `phantom` (TCE), `soulknife` (TCE), `thief` (PHB), `inquisitive` (XGE)
    - 邪术师（Warlock）：`undying` (SCAG), `great-old-one` (PHB), `genie` (TCE), `fathomless` (TCE), `undead` (VRGR), `celestial` (XGE), `fiend` (PHB), `archfey` (PHB), `hexblade` (XGE)
    - 法师（Wizard）：`transmutation` (PHB - 注意无需 school-of- 前缀), `abjuration` (PHB), `illusion` (PHB), `enchantment` (PHB), `bladesinging` (TCE), `chronurgy` (EGW), `scribes` (TCE), `necromancy` (PHB), `evocation` (PHB), `divination` (PHB), `war` (XGE), `graviturgy` (EGW), `conjuration` (PHB)
- 你可能会看到早期的 `<a target="_blank" href="..."></a>` 格式。现在统一通过 `React-Markdown` 插件覆盖 `<a/>` 的样式，因此你可以放心地直接使用标准的 Markdown 语法（`[名字](链接)`）来实现超链接。

## 四、 后续维护与注意事项
1. **每次大改动或功能突破时，请顺便更新根目录下的 `README.md`**：记录最新的扩展源支持状态和实现的功能列表。
2. 尽量拆分模块。新增一个较大规模的数据块时，请遵循单一职责，单独加在对应书籍的文件下。
3. 如果修改或补充了工具熟练项、法力列表等底层属性，要确定其能被 `hooks` 或是 `CharacterContext` 以及相关步骤组件（如 `ClassStep`, `SpellsStep` 等）捕获和渲染。

祝开发顺利！
