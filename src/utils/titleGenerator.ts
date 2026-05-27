// ========== 通用辅助函数 ==========
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
const pick = randomItem;
const maybe = (p = 0.5) => Math.random() < p;

function joinSmart(a: string, b: string): string {
  if (a.endsWith("之") && b.startsWith("之")) return a.slice(0, -1) + "的" + b.slice(1);
  if (a.endsWith("的") && b.startsWith("的")) return a.slice(0, -1) + b;
  return a + b;
}

// ========== 风格分类入口 ==========
export function generateTitle(): string {
  const roll = Math.random();
  if (roll < 0.05) return generateFunnyTitle();          // 滑稽
  if (roll < 0.25) return generateSimpleTitle();         // 朴实 0.20
  if (roll < 0.65) return generateAdventurerTitle();     // 冒险者 0.40
  if (roll < 0.90) return generateNotableTitle();        // 知名者 0.25
  if (roll < 0.95) return generateEpicTitle();           // 史诗者 0.05
  return generateSecretOrgTitle();                       // 秘密组织 0.05
}

// ========== 扩充词库（含DND官方内容） ==========

// ---------- 滑稽 ----------
const FUNNY_DEFECTS = [
  "喝醉的", "健忘的", "胆小的", "倒霉的", "迷路的", "结巴的",
  "晕船的", "怕黑的", "半吊子的", "乱来的", "总是迟到的", "掉裤子的", "打喷嚏的"
];
const FUNNY_JOBS = ["法师", "游侠", "演说家", "炼金术师", "骑士", "圣武士", "术士", "盗贼", "诗人", "野蛮人", "武僧"];

// ---------- 朴实 ----------
const SIMPLE_FEATURES = [
  "独臂", "独眼", "疤脸", "光头", "灰发", "瘦高", "矮胖", "瘸腿", "缺耳", "少指",
  "高个", "驼背", "红鼻", "白眉", "麻子", "豁牙", "大胡子", "卷毛", "小眼睛", "宽下巴"
];
const SIMPLE_OCCUPATIONS = [
  "铁匠", "猎人", "佣兵", "农夫", "守卫", "酒保", "商人", "水手", "抄写员", "裁缝",
  "渔夫", "樵夫", "牧人", "马夫", "厨子", "信差", "脚夫", "药剂师", "面包师", "陶匠",
  "矿工", "船工", "车夫", "更夫"
];
const SIMPLE_ORIGINS = [
  "南方", "北地", "海边", "山里", "沼泽", "东边", "沙漠", "高原", "岛上",
  "河湾", "石桥", "磨坊", "橡木镇", "深水城", "无冬城", "博德之门", "银月城", "烛堡",
  "三猪镇", "红松镇", "路斯坎", "阿斯卡特拉"
];
const SIMPLE_CLOTHING = [
  "灰斗篷", "铁靴", "木盾", "短刀", "黑皮帽", "红围巾", "铁手套", "破甲", "锁子甲",
  "麻绳腰带", "补丁披风", "旧皮靴", "铜扣腰带", "毛皮背心", "帆布包"
];

// ---------- 冒险者 ----------
const ADVENTURER_ACTIONS = [
  "碎颅", "破盾", "裂骨", "噬血", "疾风", "闪电", "暗影", "铁拳", "钢牙", "狂怒",
  "猎魔", "斩首", "刺心", "断骨", "碎门", "破城", "屠龙", "斩妖", "噬魂", "影步"
];
const ADVENTURER_ANIMALS = [
  "灰狼", "黑熊", "毒蛇", "野猪", "狮鹫", "猎鹰", "战马", "公牛", "夜枭", "火狐",
  "巨鹰", "凶暴狼", "鲨鱼", "蟒蛇", "恐狼", "座狼", "冬狼", "鳄鱼"
];
const ADVENTURER_WEAPONS = [
  "战斧", "长剑", "钉锤", "长弓", "重弩", "短矛", "匕首", "皮鞭", "巨剑", "链枷",
  "手斧", "弯刀", "细剑", "巨斧", "晨星", "短剑", "手弩", "双刃剑", "戟", "长枪"
];
const ADVENTURER_FEATS = [
  "屠兽者", "巨人杀手", "宝藏猎人", "密林追踪者", "地城探险家", "盗墓者", "赏金猎人",
  "捕奴人", "走私客", "陷阱大师", "怪物猎人", "龙穴探索者", "废墟掠夺者", "恶魔猎手"
];
const ADVENTURER_ORIGINS = [
  "废墟", "边境", "废土", "远海", "地下", "山地", "密林", "冻土", "火山区",
  "旧战场", "地下城", "剑湾", "月影岛", "谷地", "埃诺奥克沙漠", "冰风谷"
];
const ADVENTURER_TITLES = [
  "血斧", "影步", "狂刃", "铁拳", "夜风", "冰手", "雷牙", "钢心", "灰烬", "骨锯",
  "风暴", "黑箭", "快刀", "鹰眼", "蛇吻", "破晓", "霜燃", "暗火"
];

// ---------- 知名者 ----------
const NOTABLE_PLACES = [
  "冰风隘口", "高崖城", "幽暗密林", "毒蛇沼泽", "白骨荒原", "铁水河", "灰塔废墟",
  "黑曜石之门", "星辰海", "巨人之踵", "风暴角", "龙眠谷", "无光深渊", "破帆港",
  "深水城", "无冬城", "博德之门", "银月城", "烛堡", "米拉巴", "散提尔堡",
  "巨魔山脉", "迷雾森林", "坠星海", "咆哮之骨", "龙湖", "剑湾"
];
const NOTABLE_DEEDS = [
  "屠龙者", "猎魔人", "巨人杀手", "巫妖之敌", "龙之友", "渡鸦使者", "灰袍智者",
  "光之剑", "暗夜行者", "破晓者", "迷宫行者", "火海余生者", "诅咒解除者", "紫龙骑士"
];
const NOTABLE_ROLES = [
  "游侠", "法师", "术士", "骑士", "圣武士", "牧师", "德鲁伊", "盗贼大师",
  "密探", "刺客", "导师", "守护者", "守望者", "大法师", "高阶祭司", "战斗诗人"
];
const NOTABLE_EPITHETS = [
  "银手", "火发", "夜风", "寒冰", "血玫瑰", "铁面", "石心", "金瞳", "影翼", "霜语",
  "黑杖", "鹰风", "明焰", "炽心", "静水", "破誓者", "信风"
];

// ---------- 史诗者 ----------
const EPIC_FEATS = [
  "屠龙者", "弑神者", "裂天者", "深渊征服者", "缚链者", "末日使者", "救世主",
  "天启骑士", "永恒守望者", "地狱之鞭", "混沌征服者", "星辰破碎者", "命运重塑者"
];
const EPIC_TITLES = [
  "不朽的巫王", "远古的巨龙", "天界的审判官", "星海的旅者", "灭世者", "创世余烬"
];

// ---------- 秘密组织 ----------
const SECRET_ORGS = [
  "影网", "黑石会", "锈锚兄弟会", "血誓团", "银手联盟", "渡鸦之眼", "石之心",
  "暗流会", "铁王座", "灰手", "乌鸦会", "毒刺", "静默修会",
  "竖琴手同盟", "散塔林会", "红袍法师", "领主联盟", "影贼", "铁王座",
  "龙巫教", "翠绿闲庭", "银月骑士团", "坚盾骑士团", "至热之心"
];
const SECRET_ROLES = [
  "密探", "刺客", "信使", "执行者", "守卫", "间谍", "导师", "司库", "联络人",
  "信差", "影子", "哨兵", "渗透者", "猎手", "裁判官", "守门人"
];

// ========== 各风格生成器 ==========
function generateFunnyTitle(): string {
  const templates = [
    () => `${pick(FUNNY_DEFECTS)}${pick(FUNNY_JOBS)}`,
    () => `${pick(FUNNY_DEFECTS)}的${pick(ADVENTURER_TITLES)}`,
    () => pick(["倒霉蛋", "糊涂虫", "半吊子", "吹牛大王", "迷路专家", "永远的新兵", "酒馆传奇"]),
    () => `${pick(FUNNY_DEFECTS)}的${pick(["汤勺", "破锅", "漏水的靴子", "断弦的琴", "生锈的剑", "空钱包"])}`,
    () => `${pick(FUNNY_DEFECTS)}的${pick(["屠龙者", "大法师", "圣武士", "国王", "剑圣"])}`,
  ];
  const result = pick(templates)();
  return result.length > 8 ? generateFunnyTitle() : result;
}

function generateSimpleTitle(): string {
  const templates = [
    () => `${pick(SIMPLE_FEATURES)}的${pick(SIMPLE_OCCUPATIONS)}`,
    () => `来自${pick(SIMPLE_ORIGINS)}的${pick(SIMPLE_OCCUPATIONS)}`,
    () => pick(SIMPLE_CLOTHING),
    () => pick(["老实人", "急性子", "大个子", "小不点", "哑巴", "幸运儿"]),
    () => `${pick(SIMPLE_ORIGINS)}人`,
    () => `老${pick(SIMPLE_OCCUPATIONS)}`,
    () => `${pick(SIMPLE_FEATURES)}${pick(["铁匠", "猎人", "守卫", "水手"])}`,
  ];
  const result = pick(templates)();
  return result.length > 6 ? generateSimpleTitle() : result;
}

function generateAdventurerTitle(): string {
  const templates = [
    () => `${pick(ADVENTURER_ACTIONS)}者`,
    () => `${pick(ADVENTURER_ACTIONS)}手`,
    () => `${pick(ADVENTURER_WEAPONS)}${pick(["手", "大师", "客"])}`,
    () => `${pick(ADVENTURER_ANIMALS)}${pick(["杀手", "猎手", "盟友", "之影"])}`,
    () => pick(ADVENTURER_FEATS),
    () => `${pick(ADVENTURER_ORIGINS)}的${pick(["剑客", "游侠", "佣兵", "弓箭手", "盗贼"])}`,
    () => `${pick(ADVENTURER_WEAPONS)}人`,
    () => pick(ADVENTURER_ANIMALS),
    () => pick(ADVENTURER_TITLES),
    () => `${pick(ADVENTURER_ORIGINS)}${pick(ADVENTURER_ANIMALS)}${pick(["杀手", "猎手", "之子"])}`,
    () => `${pick(ADVENTURER_ACTIONS)}${pick(["者", "人", "狂", "鬼"])}`,
    () => `${pick(ADVENTURER_WEAPONS)}之${pick(["舞", "雨", "风", "牙"])}`,
  ];
  const result = pick(templates)();
  return result.length > 7 ? generateAdventurerTitle() : result;
}

function generateNotableTitle(): string {
  const templates = [
    () => `${pick(NOTABLE_PLACES)}的${pick(NOTABLE_ROLES)}`,
    () => pick(NOTABLE_DEEDS),
    () => pick(NOTABLE_EPITHETS),
    () => `${pick(["沉默的", "不眠的", "最后的", "无名的", "锈蚀的", "孤独的", "放逐的", "受诅的"])}${pick(NOTABLE_ROLES)}`,
    () => `${pick(SECRET_ORGS)}的${pick(NOTABLE_ROLES)}`,
    () => `${pick(NOTABLE_PLACES)}之${pick(["光", "影", "盾", "剑", "火", "风", "霜", "星"])}`,
    () => `${pick(NOTABLE_EPITHETS)}${pick(NOTABLE_ROLES)}`,  // 如“黑杖法师”
  ];
  const result = pick(templates)();
  return result.length > 8 ? generateNotableTitle() : result;
}

function generateEpicTitle(): string {
  const templates = [
    () => pick(EPIC_FEATS),
    () => `${pick(["不朽的", "永恒的", "远古的", "最后的", "天启的"])}${pick(["巫王", "圣者", "龙骑士", "守望者", "先知", "审判官"])}`,
    () => `${pick(["深渊", "天界", "地狱", "星海", "混沌"])}的${pick(["征服者", "救赎者", "旅者", "封印者"])}`,
    () => pick(["灭世者", "创世余烬", "天启", "浩劫", "终焉"]),
  ];
  const result = pick(templates)();
  return result.length > 8 ? generateEpicTitle() : result;
}

function generateSecretOrgTitle(): string {
  const templates = [
    () => `${pick(SECRET_ORGS)}的${pick(SECRET_ROLES)}`,
    () => pick(SECRET_ORGS),
    () => `${pick(["红", "黑", "灰", "铁", "血", "影", "暗", "银"])}${pick(["袍会", "手会", "网", "兄弟会", "之眼", "之环", "匕首"])}`,
    () => pick(["联络人", "哨兵", "影子", "守密人", "潜伏者"]),
  ];
  const result = pick(templates)();
  return result.length > 6 ? generateSecretOrgTitle() : result;
}