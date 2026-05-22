export interface ExpansionBook {
  id: string;
  name: string;
  shortName: string;
  description: string;
  races?: string;
  classes?: string;
  otherFeatures?: string;
  enabled: boolean;
  isCore?: boolean;
}

const STORAGE_KEY = 'dnd_toolkit_expansions';

export const EXPANSIONS: ExpansionBook[] = [
  {
    id: 'phb',
    name: '玩家手册',
    shortName: 'PHB',
    description: '核心规则书，包含所有玩家进行游戏所需的基础法则。',
    races: '矮人 (丘陵/山地)、精灵 (高等/木/卓尔)、人类 (本相/变体)、龙裔 (10种巨龙血统)、半精灵、提夫林 (本相/变体)、半身人 (强魄/轻足)、半兽人、侏儒 (林/岩)',
    classes: '野蛮人 (狂战士/图腾战士)、吟游诗人 (轶闻/勇气学院)、牧师 (知识/生命/光明/自然/风暴/诡术/战争领域)、德鲁伊 (大地/月亮结社)、战士 (战斗大师/勇士/魔能骑士)、武僧 (四象/散打/暗影宗)、圣骑士 (奉献/远古/复仇之誓)、游侠 (猎人/兽王)、游荡者 (刺客/诡术师/窃贼)、术士 (龙族血脉/狂野魔法)、邪术师 (大恶魔/至高妖精/旧日支配者)、法师 (防护/咒法/预言/惑控/塑能/幻术/死灵/变化学派)',
    otherFeatures: '基础背景、基础装备、核心战斗及施法规则、核心法术与天赋专长。',
    enabled: true,
    isCore: true
  },
  {
    id: 'dmg',
    name: '地下城主指南',
    shortName: 'DMG',
    description: '地下城主不可或缺的指导手册，提供战役设计与世界构建的变体工具。',
    races: '精灵 (雅灵亚种)、阿斯莫 (本相)、侏儒 (地底侏儒亚种)、豺狼人、大地精、地精、狗头人、兽人、寇涛鱼人、骷髅、狂蛙人、人鱼、石盲蛮族、天狗、蜥蜴人、战蜥人',
    classes: '牧师 (死亡领域)、圣骑士 (破誓者) 等特殊城主专属子职业扩展',
    otherFeatures: '地下城与世界生成表、庞大的魔法物品库与神兵利器、变体属性规则。',
    enabled: false
  },
  {
    id: 'xge',
    name: '珊娜萨的万事指南',
    shortName: 'XGE',
    description: '为玩家和城主提供的大型综合扩展规则，极大地开拓了生平与选项。',
    races: '（未提供新增种族）',
    classes: '野蛮人 (风暴先驱/狂热者/先祖守卫)、吟游诗人 (低语/剑舞/迷惑学院)、牧师 (锻造/坟墓领域)、德鲁伊 (梦境/牧人结社)、战士 (魔射手/骑兵/武士)、武僧 (剑圣/日魂/醉拳宗)、圣骑士 (救赎/征服之誓)、游侠 (怪物杀手/境界行者/幽域追踪者)、游荡者 (策士/斥侯/风流剑客/审讯者)、术士 (暴风术法/神圣之魂/幽影魔法)、邪术师 (天界宗主/咒剑士)、法师 (战争魔法) 等27个以上新子职',
    otherFeatures: '「这是你的人生」生平背景事件生成表、大量通用新专长、海量实用各级法术。',
    enabled: true
  },
  {
    id: 'tce',
    name: '塔莎的万象坩埚',
    shortName: 'TCE',
    description: '包含了对游戏规则的前沿变革，提供前所未有的自定义和战力扩展选项。',
    races: '「自定血统」选项（允许不限外表，自由分配属性和任选起始专长）',
    classes: '野蛮人 (狂野魔法/野兽道途)、吟游诗人 (创造/雄辩学院)、牧师 (和平/暮光/秩序领域)、德鲁伊 (孢子/星辰/野火结社)、战士 (符文骑士/灵能武士)、武僧 (命流宗/星我宗)、圣骑士 (荣耀/守望之誓)、游侠 (集群守卫/妖精漫游者)、游荡者 (鬼魅/魂刃)、术士 (畸变心智/时械之魂)、邪术师 (巨灵宗主/深海意志)、法师 (剑咏传承/书士会) 以及独立职业奇械师 (炼金术师/炮兵师/装甲师/战匠)',
    otherFeatures: '团契赞助人系统、魔法解谜与自然异象法则、超炫的魔法印记及契约。',
    enabled: false
  },
  {
    id: 'scag',
    name: '剑湾冒险指南',
    shortName: 'SCAG',
    description: '被遗忘的国度中最著名的「剑湾」设定集，深度融合当地地理与公会势力。',
    races: '半精灵 (木精灵/月日精灵/卓尔血脉变体)、半身人 (鬼智半身人)、提夫林 (地狱之火/飞翔之翼/炼狱传承/魔鬼之舌特殊传承亚种)、侏儒 (地底/斯奈布力)',
    classes: '野蛮人 (战狂道途)、牧师 (奥秘领域)、战士 (紫龙骑士)、武僧 (永亡宗)、圣骑士 (王冠之誓)、邪术师 (不朽者)、法师 (剑咏传承)',
    otherFeatures: '剑湾势力公会专属背景设定、标志性强力近战戏法（如绿焰斩、雷鸣斩）。',
    enabled: false
  },
  {
    id: 'vgm',
    name: '瓦罗的怪物指南',
    shortName: 'VGM',
    description: '怪物生态的猎奇典籍，为玩家开启扮演非人怪物或异域生灵的大门。',
    races: '阿斯莫 (堕落/守护者/天谴)、斑猫人、纯血蛇人、费尔伯格、歌利亚、天狗、蜥蜴人、熊地精、地精、大地精、狗头人、兽人',
    classes: '（未提供新增子职业）',
    otherFeatures: '怪物诸部落背景、怪物相关的特色风俗与起源解构。',
    enabled: false
  },
  {
    id: 'mtf',
    name: '魔邓肯的众敌卷册',
    shortName: 'MTF',
    description: '探索多元宇宙最古老的血战与冲突，并提供星界或异域的传说物种。',
    races: '吉斯人 (吉斯洋基人/吉斯泽莱人)、矮人 (灰矮人)、精灵 (海精灵/雅灵/影灵)、提夫林 (九种大魔鬼血统)、侏儒 (地底)',
    classes: '（未提供新增子职业）',
    otherFeatures: '万渊平原与九层地狱领主契约、种族敌对史诗传说。',
    enabled: false
  },
  {
    id: 'erlw',
    name: '艾伯伦:从终末战争复苏',
    shortName: 'ERLW',
    description: '神秘且科技感十足的魔导朋克世界，充斥着飞空艇与魔法轨道车。',
    races: '机关人、半变形怪、半兽化人 (野性之魂/长牙/疾步/荒野猎手)、矮人 (警戒龙纹)、半精灵 (暴风/侦测龙纹)、半身人 (医疗/招待龙纹)、半兽人 (探索龙纹)、精灵 (阴影龙纹)、人类 (畜牧/创造/守护/通行龙纹)、地精、大地精、熊地精、兽人、侏儒 (抄录龙纹)',
    classes: '独立职业「奇械师」(Artificer) 及其实装子职业（炼金术士、炮兵技师、装甲师、战斗铁匠）',
    otherFeatures: '龙纹契约机制、庞大魔导奇珍装备、萨恩万桥之城势力设定。',
    enabled: false
  },
  {
    id: 'egw',
    name: '荒洲探险家指南',
    shortName: 'EGW',
    description: '艾克桑德利亚中荒凉神秘的荒洲大陆，操纵重力与时光流逝的奇幻之所。',
    races: '半身人 (莲源半身人)、精灵 (苍白天命精灵)、龙裔 (龙血龙裔/掠鸦龙裔)、兽人',
    classes: '法师 (时间魔法/重力魔法传承)',
    otherFeatures: '地域专属奇物、荒洲探险背景、时间流逝变体规则。',
    enabled: false
  },
  {
    id: 'ggr',
    name: '拉尼卡的公会长指南',
    shortName: 'GGR',
    description: '万智牌联动设定集。拉尼卡是一个被无限城市建筑物覆盖的宏伟位面，由十个行事极端的公会统治。',
    races: '半人马、米诺陶、维多肯、析米克混合体、象族、地精',
    classes: '牧师 (秩序领域)、德鲁伊 (孢子结社)',
    otherFeatures: '各公会的声望与进阶头衔体系、公会盟约法术与公会内部组织背景。',
    enabled: false
  },
  {
    id: 'mot',
    name: '塞洛斯的神话奥德赛',
    shortName: 'MOT',
    description: '万智牌联动设定集。受希腊神话启发的塞洛斯人，受星界神明和超凡恩赐指引。',
    races: '半人马、狮族、米诺陶、羊人、梭螺鱼人',
    classes: '吟游诗人 (雄辩学院)、圣骑士 (荣耀之誓)',
    otherFeatures: '「超神恩赐」机制、十五位塞洛斯神祇的奉献值和信仰恩赐。',
    enabled: false
  },
  {
    id: 'vrgr',
    name: '范·里希腾的鸦阁指南',
    shortName: 'VRGR',
    description: '惊悚刺激的哥特恐怖、黑暗梦魇和怪谈传说。',
    races: '半血裔、巫咒之子、重生者',
    classes: '吟游诗人 (灵魂学院)、邪术师 (不死宗主)',
    otherFeatures: '「黑暗礼物」机制、数十个独具特色的恐惧领域、哥特惊悚叙事技巧。',
    enabled: false
  },
  {
    id: 'ftod',
    name: '菲兹班的巨龙宝库',
    shortName: 'FToD',
    description: '巨龙巨匠菲兹班亲撰，颠覆传统的巨龙百科，探索巨龙族裔的深层血脉。',
    races: '金属龙裔 (黄铜/青铜/红铜/金/银)、色彩龙裔 (黑/蓝/绿/红/白)、宝石龙裔 (紫晶/水晶/翡翠/蓝宝石/黄玉)',
    classes: '武僧 (龙星流)、游侠 (龙兽守卫)',
    otherFeatures: '龙之魔法与强大新法术、巨龙魔导器和巨龙赐福、巨龙巢穴生存与劫掠规则。',
    enabled: false
  },
  {
    id: 'eepc',
    name: '邪恶元素玩家指南',
    shortName: 'EEPC',
    description: '释放气、土、火、水四大元素狂怒能量。',
    races: '阿兰寇拉鹰人、元素裔 (气/土/火/水)',
    classes: '（未提供新增子职业）',
    otherFeatures: '数十个耳熟能详的狂暴自然元素法术。',
    enabled: false
  },
  {
    id: 'ai',
    name: '艾奎兹玄有限责任公司',
    shortName: 'AI',
    description: '充满荒诞与恶搞幽默的官方商业大作战，玩家可以开设属于自己的「跑团外包公司」。',
    races: '韦尔丹人',
    classes: '4个公司职务子职（文书/决策/独狼/行政）',
    otherFeatures: '特殊的公司员工团队专长、契约商务法术、特许经营权公司升级规则。',
    enabled: false
  },
  {
    id: 'rot',
    name: '冰风谷:冰霜少女的雾凇',
    shortName: 'ROT',
    description: '极寒环境之下的孤绝求生冒险，玩家需直面可怕的永夜和极寒诅咒。',
    races: '（未提供新增种族）',
    classes: '（未提供新增子职业）',
    otherFeatures: '雪地暴风生存机制、狂雪遭遇野兽、极光神眷特殊能力。',
    enabled: false
  },
  {
    id: 'gos',
    name: '盐沼幽魂',
    shortName: 'GoS',
    description: '波澜壮阔的航海、探险和海岸线防守大集锦。',
    races: '（未提供新增种族）',
    classes: '（未提供新增子职业）',
    otherFeatures: '港口独特背景、航海与风暴机制、海战变体遭遇、水下废墟探索。',
    enabled: false
  },
  {
    id: 'bgdia',
    name: '博德之门: 坠入阿弗纳斯',
    shortName: 'BGDIA',
    description: '体验在战场上狂飙地狱战车的疯狂。玩家将深入九层地狱的第一层，直面残酷的炼狱血战。',
    races: '（未提供新增种族）',
    classes: '（未提供新增子职业）',
    otherFeatures: '「魔鬼契约」系统、地狱战车载具改装和燃料规则、终极灵魂钱币。',
    enabled: true
  },
  {
    id: 'cos',
    name: '施特拉德的诅咒',
    shortName: 'CoS',
    description: 'DND历史上最经典的传奇吸血鬼古堡哥特战役。玩家将被迷雾困在巴洛维亚，直面施特拉德王。',
    races: '（未提供新增种族）',
    classes: '（未提供新增子职业）',
    otherFeatures: '「哥特式猎人」等灰暗背景、龙卡卡牌神准占卜占星表、特殊心魔恐惧机制。',
    enabled: false
  },
  {
    id: 'toa',
    name: '湮灭之墓',
    shortName: 'ToA',
    description: '酷热、致命且被死亡诅咒笼罩的丘尔特雨林。任何死去的生物都无法复活，全世界的复活者正逐渐腐烂。',
    races: '（未提供新增种族）',
    classes: '（未提供新增子职业）',
    otherFeatures: '「死亡指引」规则、雨林极端野外求生探险机制、失落的蛇神殿与古机关设计。',
    enabled: false
  }
];

export function getActiveExpansions(): string[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return EXPANSIONS.filter(e => e.enabled).map(e => e.id);
  try {
    return JSON.parse(saved);
  } catch {
    return EXPANSIONS.filter(e => e.enabled).map(e => e.id);
  }
}

export function saveActiveExpansions(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function isSourceEnabled(sourceId: string): boolean {
  const active = getActiveExpansions();
  // Always allow core
  if (sourceId === 'phb') return true;
  return active.includes(sourceId.toLowerCase());
}