export const MODIFIERS = {
  metal: ["铁", "钢", "银", "金", "铜"],
  color: ["红", "黑", "白", "灰", "苍", "翠", "绯", "霜"],
  naturePower: ["焰", "雷", "风", "影", "光", "星", "月", "日"],
  time: ["夜", "晨", "暮", "春", "夏", "秋", "冬"],
  status: ["老", "新", "古", "旧", "野", "荒", "静", "烈"],
  broken: ["碎", "破", "断", "沉", "浮", "隐"],
  temp: ["冷", "暖", "炽", "寒", "枯", "荣", "暗", "明"],
  scene: ["碧空", "晴空", "苍穹", "云霄", "天穹", "烈阳", "落日", "残阳", "新月", "满月", "朔月", "孤星", "流星", "陨星", "晨星", "极光", "虹桥", "雷云", "风暴", "骤雨", "冰雹", "薄雾", "浓雾", "霜天", "雪夜", "凛冬", "深秋", "初春", "盛夏"],
  atmosphere: ["暗影", "幽影", "幻影", "虚影", "寂静", "沉默", "无眠", "不眠", "永夜", "长夜", "破晓", "黎明", "黄昏", "薄暮", "余晖", "残光", "寒霜", "冷焰", "静水", "止水", "深渊", "深窟", "远山", "孤峰", "荒原", "旷野", "密林", "幽谷"],
  material: ["黑铁", "精金", "秘银", "青铜", "黄铜", "赤铜", "乌金", "白铁", "铸铁", "锻钢", "淬火", "熔岩", "燧石", "花岗", "黑曜", "琉璃", "翡翠", "玛瑙", "琥珀", "紫晶"],
  double: ["黑铁", "赤铜", "白银", "黄金", "青铜", "乌金", "精金", "秘银", "白钢", "暗钢", "血铁", "霜铁", "灰烬铁", "熔火钢"]
};

export const NOUNS = {
  weapon: ["剑", "盾", "矛", "弓", "锤", "斧", "刃", "戟", "矢", "弩", "甲", "盔"],
  beast: ["狼", "狮", "虎", "熊", "鹰", "隼", "鸦", "枭", "狐", "猎犬", "野猪", "公牛", "蝙蝠"],
  bird: ["渡鸦", "夜莺", "百灵", "燕", "鹭", "鹤"],
  myth: ["龙", "凤", "狮鹫", "独角兽", "飞马", "骏鹰", "巨魔"],
  bug: ["蛇", "蝎", "蜘蛛"],
  plant: ["玫瑰", "荆棘", "藤", "叶", "根", "松", "柏", "橡", "桦", "柳", "杉"],
  nature: ["星", "月", "日", "山", "石", "丘", "谷", "河", "湖", "海", "泉", "沙", "尘", "灰", "烬", "余烬"],
  abstract: ["心", "魂", "影", "光", "火", "焰", "霜", "雪", "风", "雷", "歌", "誓", "约", "盟", "印", "徽", "旗", "冠", "环", "塔", "城", "堡", "门", "路", "途"]
};

export const SUFFIXES = {
  general: ["骑士团", "佣兵团", "旅团", "兄弟会", "姐妹会", "同盟", "结社", "公会", "战队", "卫队", "守卫", "守望者", "行者", "旅者", "漂泊者", "流浪者", "探索者", "寻路者", "追迹者", "守夜人", "破晓者", "拾荒者", "幸存者", "流亡者", "冒险团", "探险队", "远征队", "游骑", "铁卫", "利刃", "尖兵", "斥候", "先锋", "后卫", "猎团", "护卫队", "商队", "船队", "掠夺者", "掠袭者", "突袭者"],
  job: ["铁卫", "盾卫", "剑卫", "矛卫", "锋卫", "守备", "守军", "守阵", "殿军", "前哨", "斥候", "尖兵", "刀锋", "锋刃", "锋矢", "锐锋", "重锤", "坚盾", "钢翼", "铁翼", "暗翼", "影翼", "飞翼", "疾风", "迅风", "烈风", "暴风", "旋风"],
  longJob: ["暗影守望", "黎明守卫", "黄昏守夜", "寒霜铁卫", "黑铁锋刃", "秘银之盾", "精金之剑", "烈焰之锤", "暴风之翼", "寂静之刃", "深渊守卫", "苍穹之盾"]
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generatePartyNameWithRules(): string {
  const templates = [
    // 模板A：修饰语 + 核心名词
    () => {
      const modifier = randomItem([...MODIFIERS.metal, ...MODIFIERS.color, ...MODIFIERS.naturePower]);
      const noun = randomItem([...NOUNS.weapon, ...NOUNS.beast, ...NOUNS.plant, ...NOUNS.myth]);
      return modifier + noun;
    },
    // 模板B：核心名词 + 之 + 核心名词
    () => {
      const noun1 = randomItem([...NOUNS.beast, ...NOUNS.myth]);
      const noun2 = randomItem([...NOUNS.abstract, "眼", "爪", "翼", "尾", "牙", "角"]);
      return noun1 + "之" + noun2;
    },
    // 模板C：修饰语 + 核心名词 + 后缀
    () => {
      const modifier = randomItem([...MODIFIERS.metal, ...MODIFIERS.color, ...MODIFIERS.naturePower]);
      const noun = randomItem([...NOUNS.weapon, ...NOUNS.beast, ...NOUNS.plant, ...NOUNS.myth]);
      const suffix = randomItem(SUFFIXES.general);
      return modifier + noun + suffix;
    },
    // 模板D：核心名词 + 与 + 核心名词
    () => {
      const g1 = randomItem([...NOUNS.weapon, ...NOUNS.beast]);
      const g2 = randomItem([...NOUNS.weapon, ...NOUNS.beast, "玫瑰", "匕首","蔷薇","琴弦","杖","百合","弓"]);
      return g1 + "与" + g2;
    },
    // 模板E：修饰语 + 核心名词 + 之 + 核心名词
    () => {
      const modifier = randomItem([...MODIFIERS.metal, ...MODIFIERS.color, ...MODIFIERS.naturePower]);
      const noun1 = randomItem([...NOUNS.weapon, ...NOUNS.beast]);
      const noun2 = randomItem(NOUNS.abstract);
      return modifier + noun1 + "之" + noun2;
    },
    // 模板F：修饰语 + 核心名词 + 与 + 修饰语 + 核心名词
    () => {
      const m1 = randomItem([...MODIFIERS.color, ...MODIFIERS.metal]);
      const n1 = randomItem([...NOUNS.beast, ...NOUNS.weapon]);
      const m2 = randomItem([...MODIFIERS.color, ...MODIFIERS.metal]);
      const n2 = randomItem([...NOUNS.beast, ...NOUNS.weapon, "鹿", "狐"]);
      return m1 + n1 + "与" + m2 + n2;
    },
    // 模板G：核心名词 + 后缀
    () => {
      const noun = randomItem([...NOUNS.beast, ...NOUNS.weapon, ...NOUNS.nature]);
      const suffix = randomItem(SUFFIXES.general);
      return noun + suffix;
    },
    // 模板H：修饰语 + 核心名词 + 后缀（沧桑/残缺风）
    () => {
      const modifier = randomItem([...MODIFIERS.status, ...MODIFIERS.broken]);
      const noun = randomItem([...NOUNS.weapon, ...NOUNS.nature, "水", "刃", "戟"]);
      const suffix = randomItem(SUFFIXES.general);
      return modifier + noun + suffix;
    },
    // 模板I：天象/自然 + 后缀
    () => {
      const modifier = randomItem(MODIFIERS.scene);
      const suffix = randomItem([...SUFFIXES.general, "骑士团", "守卫"]);
      return modifier + suffix;
    },
    // 模板J：氛围 + 后缀
    () => {
      const modifier = randomItem(MODIFIERS.atmosphere);
      const suffix = randomItem([...SUFFIXES.general, "守望者", "行者","者"]);
      return modifier + suffix;
    },
    // 模板K：材质 + 职能
    () => {
      const modifier = randomItem(MODIFIERS.material);
      const suffix = randomItem(SUFFIXES.job);
      return modifier + suffix;
    },
    // 模板L：双重修饰 + 职能
    () => {
      const modifier = randomItem(MODIFIERS.double);
      const suffix = randomItem(SUFFIXES.job);
      return modifier + suffix;
    },
    // 模板M：材质 + 之 + 职能 (后缀可加卫、盾等)
    () => {
      const modifier = randomItem(MODIFIERS.material);
      const suffix = randomItem(["卫", "盾", "剑", "锤", "心", "刃", "眼", "光"]);
      return modifier + "之" + suffix;
    },
    // 模板N：氛围 + 之 + 职能
    () => {
      const modifier = randomItem(MODIFIERS.atmosphere);
      const suffix = randomItem(["卫", "刃", "眼", "光", "盾", "哨", "剑", "翼"]);
      return modifier + "之" + suffix;
    },
    // 模板O：天象 + 之 + 后缀
    () => {
      const modifier = randomItem(MODIFIERS.scene);
      const suffix = randomItem(["翼", "盾", "剑", "锤", "矢", "盟", "怒", "心"]);
      return modifier + "之" + suffix;
    }
  ];

  const template = randomItem(templates);
  return template();
}


// ... Wait, instead of typing everything into create_file right now, I'll put it in a file first.
