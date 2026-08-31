import { DndClass, TraitOption } from "../../types/dnd";

export const bloodCurseOptions: TraitOption[] = [
  {
    id: "curse-anxious",
    name: "焦虑血咒",
    description: "以一个附赠动作，你破坏30尺内一个你能看见的生物的身体或思想，使其更容易受到影响。直到你的下一回合结束，对该生物进行的魅力（威吓）检定具有优势。增幅：此诅咒结束前，该生物下次进行的感知豁免具有劣势。",
  },
  {
    id: "curse-binding",
    name: "捆缚血咒",
    description: "以一个附赠动作，你尝试束缚30尺内一个你能看见的大型或更小体型的生物。该生物必须通过一次力量豁免，豁免失败则其速度降至0，且无法使用反应，直到你的下一回合结束。增幅：此诅咒持续1分钟，且可影响任意体型的生物。该生物可以在每个自己回合结束时重新进行豁免，成功则终止诅咒。",
  },
  {
    id: "curse-bloated",
    name: "胀痛血咒",
    description: "以一个附赠动作，你诅咒30尺内一个你能看见的生物，令其痛苦地膨胀直到你的下一回合结束。持续时间内，该生物在力量检定和敏捷检定上具有劣势，且若它在自己回合内进行多于一次攻击，则受到1d8黯蚀伤害。增幅：此诅咒持续1分钟。受诅咒生物可以在每个自己回合结束时进行一次体质豁免，成功则终止诅咒。",
  },
  {
    id: "curse-corrosive",
    name: "腐蚀血咒",
    description: "以一个附赠动作，你使30尺内一个你能看见的生物中毒。受诅咒生物可以在每个自己回合结束时进行一次体质豁免，成功则终止诅咒。增幅：当你施加此诅咒时，该生物受到4d6黯蚀伤害，且每次它未能通过终止诅咒的体质豁免时，会再次受到此伤害。",
    level: 15,
    subclassId: "mutant",
  },
  {
    id: "curse-exorcism",
    name: "驱魔血咒",
    description: "以一个附赠动作，选择30尺内一个你能看见的、陷入魅惑、恐慌或支配效果下的生物，强制终止其身上的这些效果。增幅：如果该效果是由30尺内你能看见的另一个生物施加的，则该施加者受到3d6心灵伤害，且必须通过一次感知豁免，否则陷入震慑直到你的下一回合结束。",
    level: 15,
    subclassId: "ghostslayer",
  },
  {
    id: "curse-exposure",
    name: "暴露血咒",
    description: "当30尺内一个你能看见的生物受到攻击或法术的伤害时，你可以使用反应暂时削弱其抗力，使其失去对该伤害类型的抗性（仅针对触发此反应的攻击或法术）。增幅：如果该生物对该伤害类型免疫，则其免疫临时变为抗性，直到其下一回合结束。",
  },
  {
    id: "curse-eyeless",
    name: "盲目血咒",
    description: "当30尺内一个你能看见的生物进行攻击检定时，你可以使用反应掷一颗血魔法骰，并从其攻击检定结果中减去该值。你可以在攻击检定宣告命中后、确定是否生效前使用此反应。增幅：除了这次攻击检定外，该生物当前回合结束前进行的所有额外攻击检定也减去相同的数值。",
  },
  {
    id: "curse-fallen",
    name: "傀儡血咒",
    description: "当30尺内一个除你之外的生物生命值降至0时，你可以使用反应立即驱使其对身边另一个生物发动一次武器攻击。增幅：在受害者发动攻击前，你可以让其移动至多15尺，且其攻击检定和伤害掷骰额外加上你的血魔法关键属性调整值（最少+1）。",
  },
  {
    id: "curse-howl",
    name: "怒号血咒",
    description: "以一个动作，你释放出一声毛骨悚然的超自然狼嚎。30尺内每个能听见你的敌人必须进行一次感知豁免，否则陷入恐慌，直到你的下一回合结束。豁免失败5点或以上的生物还将额外陷入震慑，直到你的下一回合结束。此后该生物在24小时内免疫此血咒。你可以选择任意数量你能看见的生物不受影响。增幅：此诅咒的范围增加至60尺。",
    level: 18,
    subclassId: "lycan",
  },
  {
    id: "curse-marked",
    name: "印记血咒",
    description: "以一个附赠动作，你标记30尺内一个你能看见的生物。直到你的回合结束，每当你以激活了猩红仪式的武器命中该生物时，额外掷一颗血魔法骰来决定仪式的额外伤害。增幅：你在回合结束前对该目标进行的下一次攻击检定具有优势。",
  },
  {
    id: "curse-muddled",
    name: "乱心血咒",
    description: "以一个附赠动作，你诅咒30尺内一个你能看见的、正专注于法术或需要专注特性的生物。该生物在直到你的下一回合结束前为维持专注进行的下一次体质豁免中具有劣势。增幅：该生物在此期间为维持专注进行的所有体质豁免均具有劣势。",
  },
  {
    id: "curse-souleater",
    name: "噬魂血咒",
    description: "当30尺内一个非构装体也非不死生物的生命值降至0时，你可以使用反应将其生命能量献给你的宗主以换取力量。直到你的下一回合结束，你的攻击具有优势，且你对所有伤害具有抗性。增幅：此外，你恢复一个已消耗的邪术师法术位。一旦你增幅了此血咒，必须完成一次长休才能再次增幅。",
    level: 18,
    subclassId: "profanesoul",
  }
];

export const mutantFormulaOptions: TraitOption[] = [
  {
    id: "mnt-celerity",
    name: "迅捷",
    description: "你的敏捷值增加3，该属性的上限也相应提升。副作用：感知豁免具有劣势。11级时敏捷值增加4，18级时增加5。",
  },
  {
    id: "mnt-potency",
    name: "潜能",
    description: "你的力量值增加3，该属性的上限也相应提升。副作用：敏捷豁免具有劣势。11级时力量值增加4，18级时增加5。",
  },
  {
    id: "mnt-sagacity",
    name: "睿智",
    description: "你的智力值增加3，该属性的上限也相应提升。副作用：魅力豁免具有劣势。11级时智力值增加4，18级时增加5。",
  },
  {
    id: "mnt-conversant",
    name: "精通",
    description: "你在感知检定上具有优势。副作用：魅力检定具有劣势。",
  },
  {
    id: "mnt-deftness",
    name: "灵敏",
    description: "你在敏捷检定上具有优势。副作用：感知检定具有劣势。",
  },
  {
    id: "mnt-alluring",
    name: "幻惑",
    description: "你的皮肤与声音变得可塑，你在魅力检定上具有优势。副作用：先攻检定具有劣势。",
  },
  {
    id: "mnt-mobile",
    name: "流动",
    description: "你对擒抱及束缚状态免疫。11级起，同时对麻痹状态免疫。副作用：力量检定具有劣势。",
  },
  {
    id: "mnt-nighteye",
    name: "夜视",
    description: "你获得60尺黑暗视觉，若你已有黑暗视觉则其范围增加60尺。副作用：日光敏感。",
  },
  {
    id: "mnt-rapidity",
    name: "急速",
    description: "你的速度增加10尺。副作用：智力检定具有劣势。15级时速度再额外增加5尺。",
  },
  {
    id: "mnt-cruelty",
    name: "残虐",
    description: "当你使用攻击动作时，可以用一个附赠动作额外进行一次武器攻击。副作用：智力、感知和魅力豁免具有劣势。",
    level: 11,
  },
  {
    id: "mnt-precision",
    name: "精准",
    description: "你的武器攻击在掷出19或20时造成重击。副作用：力量豁免具有劣势。",
    level: 11,
  },
  {
    id: "mnt-reconstruction",
    name: "再生",
    description: "在你的每个回合开始时，若你的生命值大于0且小于上限的一半，你恢复等于熟练加值的生命值。副作用：速度减少10尺。",
    level: 7,
  },
  {
    id: "mnt-aether",
    name: "升腾",
    description: "你获得20尺飞行速度，持续1小时。副作用：力量检定和敏捷检定具有劣势。",
    level: 11,
  },
  {
    id: "mnt-shielded",
    name: "庇护",
    description: "你获得挥砍伤害抗性。副作用：具有钝击伤害易伤。",
  },
  {
    id: "mnt-unbreakable",
    name: "不破",
    description: "你获得钝击伤害抗性。副作用：具有穿刺伤害易伤。",
  },
  {
    id: "mnt-impermeable",
    name: "不穿",
    description: "你获得穿刺伤害抗性。副作用：具有挥砍伤害易伤。",
  },
  {
    id: "mnt-gelid",
    name: "凛冽",
    description: "你获得寒冷伤害抗性。副作用：具有火焰伤害易伤。",
  },
  {
    id: "mnt-embers",
    name: "余烬",
    description: "你获得火焰伤害抗性。副作用：具有寒冷伤害易伤。",
  },
  {
    id: "mnt-vermilion",
    name: "红莲",
    description: "你额外获得一次鲜血恶戾特性的使用次数。副作用：你的死亡豁免具有劣势。",
  }
];

export const classes: DndClass[] = [
  {
    id: "blood-hunter",
    name: "血猎者",
    description: "血猎者是聪明的战士，受永无止境的决心驱使，誓要消灭古老与新生邪恶。凭借神秘的血魔法仪式，和愿意为事业牺牲生命与人性的决心，他们保护诸界免于阴影的侵害——而他们始终保持警惕，即使足以吞噬怪物的黑暗向他们呼唤。",
    hitDie: 10,
    primaryAbility: ["DEX", "STR", "INT"],
    saves: ["DEX", "INT"],
    armorProficiencies: ["轻甲", "中甲", "盾牌"],
    weaponProficiencies: ["简易武器", "军用武器"],
    toolProficiencies: ["炼金用品"],
    skills: {
      count: 3,
      choices: ["特技", "奥秘", "运动", "历史", "洞悉", "调查", "宗教", "生存"],
    },
    startingEquipment: [
      "(a)一件军用武器 或 (b)两把简易武器",
      "(a)轻弩与20支弩箭",
      "(a)镶嵌皮甲 或 (b)鳞甲",
      "一套探索者套装和一套炼金用品",
    ],
    multiclass: {
      requirements: [
        { group: "OR", options: [{ ability: "STR", min: 13 }, { ability: "DEX", min: 13 }] },
        { ability: "INT", min: 13 }
      ],
      proficiencies: {
        armor: ["轻甲", "中甲", "盾牌"],
        weapons: ["简易武器", "军用武器"],
        tools: ["炼金用品"],
      },
    },
    traits: [
      {
        name: "猎人之苦",
        description: "第1级起，你从猎人之苦中生还——一项危险且久经守护的仪式，它扭曲了你的生命之血，使你与黑暗永远为伴，并磨砺你的感官以对抗它们。你在为追踪精类、邪魔或不死生物而进行的感知（生存）检定，以及为回忆关于此类生物信息而进行的智力检定上具有优势。猎人之苦也赋予你身体控制和塑造血魔法术的能力，以你自己的血液和生命精华作为燃料。你的血魔法关键属性为智力（可选感知），血魔法豁免DC = 8 + 熟练加值 + 属性调整值。血魔法骰的大小随等级提升（1级1d4，5级1d6，11级1d8，17级1d10）。",
        level: 1,
      },
      {
        name: "鲜血恶戾",
        description: "第1级起，你获得引导并牺牲部分生命精华来以血魔法诅咒和操纵生物的能力。你习得一个自选血咒。施展诅咒前，你可以选择承受等于一次血魔法骰结果的黯蚀伤害来增幅该诅咒以触发额外效果。你的血魔法关键属性决定诅咒豁免DC。没有血液的生物免疫鲜血诅咒，除非被增幅。使用后需完成短休或长休才能再次使用（6/13/17级时增加使用次数）。",
        level: 1,
        choices: [{ id: "blood-hunter-curses-1", name: "选择一个鲜血诅咒", chooseNumber: 1, options: bloodCurseOptions }],
      },
      {
        name: "战斗风格",
        description: "第2级起，选择一种你擅长的战斗风格。",
        level: 2,
        choices: [{
          id: "blood-hunter-fighting-style", name: "选择一种战斗风格", chooseNumber: 1,
          options: [
            { id: "archery", name: "箭术", description: "使用远程武器攻击时攻击检定+2。" },
            { id: "dueling", name: "对决", description: "单手持近战武器且未持其他武器时，伤害掷骰+2。" },
            { id: "great-weapon", name: "巨武器战斗", description: "双手持近战武器攻击时，伤害骰掷出1或2可重掷，必须接受新结果。" },
            { id: "two-weapon", name: "双武器战斗", description: "双武器战斗时，可将属性调整值加入追加攻击的伤害中。" },
          ],
        }],
      },
      {
        name: "猩红仪式",
        description: "第2级起，你学会消耗自身活力对武器释放猩红仪式。以附赠动作激活，需承受一次血魔法骰结果的黯蚀伤害（不可减免）。仪式生效期间，该武器攻击视为魔法攻击，额外造成等于血魔法骰的能量伤害。一柄武器同时仅能维持一个仪式。你在7级和14级时会习得更多的仪式。",
        level: 2,
        choices: [{
          id: "blood-hunter-rite-2", name: "选择你的第一个猩红仪式", chooseNumber: 1,
          options: [
            { id: "rite-flame", name: "烈焰血仪", description: "造成额外火焰伤害。" },
            { id: "rite-frozen", name: "冻结血仪", description: "造成额外寒冷伤害。" },
            { id: "rite-storm", name: "风暴血仪", description: "造成额外闪电伤害。" },
          ],
        }],
      },
      {
        name: "血猎手圣约",
        description: "第3级起，你投身于一个将以其理念指引你一生的血猎手圣约。你的选择将在7级、11级、15级和18级时赋予你特性。",
        level: 3,
      },
      {
        name: "属性值提升",
        description: "第4级起，你可以增加一项属性值2点，或两项各1点，不能超过20。",
        level: 4,
        choices: [{ id: "bh-asi-4", name: "选择提升属性或专长", chooseNumber: 1, dynamic: "asi" }],
      },
      {
        name: "额外攻击",
        description: "第5级起，你在自己回合内执行攻击动作时可以攻击两次而非一次。",
        level: 5,
      },
      {
        name: "惩戒烙印",
        description: "第6级起，当你用激活了猩红仪式的武器伤害一个生物时，可为其烙上奥术烙印。你始终知道烙印者相对于你的方向。每当烙印生物伤害你或你5尺内的盟友时，它承受等同于你血魔法调整值的心灵伤害。同一时间仅能烙印一个生物，使用后需短休或长休恢复。",
        level: 6,
      },
      {
        name: "额外鲜血恶戾",
        description: "第6级起，你再习得一个自选血咒。",
        level: 6,
        choices: [{ id: "blood-hunter-curses-6", name: "选择一门额外的鲜血诅咒", chooseNumber: 1, options: bloodCurseOptions }],
      },
      {
        name: "猩红仪式（7级）",
        description: "第7级起，你学会一种额外的猩红仪式。",
        level: 7,
        choices: [{
          id: "blood-hunter-rite-7", name: "选择你的第二个猩红仪式", chooseNumber: 1,
          options: [
            { id: "rite-flame", name: "烈焰血仪", description: "造成额外火焰伤害。" },
            { id: "rite-frozen", name: "冻结血仪", description: "造成额外寒冷伤害。" },
            { id: "rite-storm", name: "风暴血仪", description: "造成额外闪电伤害。" },
          ],
        }],
      },
      {
        name: "属性值提升",
        description: "第8级起，你可以增加一项属性值2点，或两项各1点，不能超过20。",
        level: 8,
        choices: [{ id: "bh-asi-8", name: "选择提升属性或专长", chooseNumber: 1, dynamic: "asi" }],
      },
      {
        name: "阴暗灵卜",
        description: "第9级起，你获得超自然能力，可感知神秘遗物或被邪恶触及之地的秘密。你在为回忆所触碰物体或地点相关的悲剧历史而进行的智力（历史）检定中具有优势。",
        level: 9,
      },
      {
        name: "黑暗增幅",
        description: "第10级起，血魔法充盈你的身体，永久增强韧性。你的步行速度增加5尺，且在力量、敏捷和体质豁免上获得等同于你血魔法调整值的加值（最少+1）。",
        level: 10,
      },
      {
        name: "额外鲜血恶戾",
        description: "第10级起，你再习得一个自选血咒。",
        level: 10,
        choices: [{ id: "blood-hunter-curses-10", name: "选择一门额外的鲜血诅咒", chooseNumber: 1, options: bloodCurseOptions }],
      },
      {
        name: "属性值提升",
        description: "第12级起，你可以增加一项属性值2点，或两项各1点，不能超过20。",
        level: 12,
        choices: [{ id: "bh-asi-12", name: "选择提升属性或专长", chooseNumber: 1, dynamic: "asi" }],
      },
      {
        name: "束缚烙印",
        description: "第13级起，你的惩戒烙印造成的心灵伤害提升至你血魔法调整值的两倍（至少2点）。此外，烙印生物不能执行疾走动作，且若它尝试传送或离开当前位面，则受到4d6心灵伤害且必须通过感知豁免，否则传送失败。",
        level: 13,
      },
      {
        name: "刚毅灵魂",
        description: "第14级起，你在对抗魅惑和恐慌的豁免检定中具有优势。",
        level: 14,
      },
      {
        name: "猩红仪式（14级）",
        description: "第14级起，你掌握一门强大的猩红仪式（或此前未选择过的初阶仪式）。",
        level: 14,
        choices: [{
          id: "blood-hunter-rite-14", name: "选择你的末日猩红仪式", chooseNumber: 1,
          options: [
            { id: "rite-flame", name: "烈焰血仪", description: "造成额外火焰伤害。" },
            { id: "rite-frozen", name: "冻结血仪", description: "造成额外寒冷伤害。" },
            { id: "rite-storm", name: "风暴血仪", description: "造成额外闪电伤害。" },
            { id: "rite-dead", name: "死亡血仪", description: "造成额外黯蚀伤害。" },
            { id: "rite-oracle", name: "神谕血仪", description: "造成额外心灵伤害。" },
            { id: "rite-roar", name: "轰鸣血仪", description: "造成额外雷鸣伤害。" },
          ],
        }],
      },
      {
        name: "额外鲜血恶戾",
        description: "第14级起，你再习得一个自选血咒。",
        level: 14,
        choices: [{ id: "blood-hunter-curses-14", name: "选择一门额外的鲜血诅咒", chooseNumber: 1, options: bloodCurseOptions }],
      },
      {
        name: "属性值提升",
        description: "第16级起，你可以增加一项属性值2点，或两项各1点，不能超过20。",
        level: 16,
        choices: [{ id: "bh-asi-16", name: "选择提升属性或专长", chooseNumber: 1, dynamic: "asi" }],
      },
      {
        name: "额外鲜血恶戾",
        description: "第18级起，你再习得一个自选血咒。",
        level: 18,
        choices: [{ id: "blood-hunter-curses-18", name: "选择一门额外的鲜血诅咒", chooseNumber: 1, options: bloodCurseOptions }],
      },
      {
        name: "属性值提升",
        description: "第19级起，你可以增加一项属性值2点，或两项各1点，不能超过20。",
        level: 19,
        choices: [{ id: "bh-asi-19", name: "选择提升属性或专长", chooseNumber: 1, dynamic: "asi" }],
      },
      {
        name: "胸有成竹",
        description: "第20级时，你对血魔法的掌控达到顶峰。每回合一次，当你需要掷血魔法骰时，你可以重掷并任选其一。此外，每当你用激活了猩红仪式的武器造成重击时，你恢复一次已消耗的鲜血恶戾使用次数。",
        level: 20,
      },
    ],
    subclasses: [
      {
        id: "ghostslayer",
        name: "弑灵圣约",
        description: "弑灵圣约是血猎手圣约中最古老的一支，其成员精炼鲜血秘法对抗亡灵。弑灵者们寻找生与死间的奥秘，将消灭亡灵视为己任。",
        source: "dndb",
        traits: [
          { name: "破晓血仪", description: "第3级起，你习得破晓血仪。你的猩红仪式造成的额外伤害变为光耀伤害。此外，激活时武器发出20尺半径明亮光照，你获得黯蚀伤害抗性，命中亡灵时额外造成一颗血魔法骰的伤害。", level: 3 },
          { name: "诅咒专家", description: "第3级起，你的鲜血恶戾使用次数增加1次。此外，你的血咒可以以任何生物为目标，无论其是否有血液。", level: 3 },
          { name: "以太步", description: "第7级起，你可在自己回合开始时虚体化移动穿透物体，持续等同智力调整值轮数。短休或长休恢复一次，15级起两次。", level: 7 },
          { name: "分离烙印", description: "第11级起，你的惩戒烙印暴露敌人本质。对被烙印生物用仪式武器命中时额外多掷一颗血魔法骰，且烙印期间其无法虚体穿透物体或传送。", level: 11 },
          { name: "驱魔血咒", description: "第15级起，你自动习得驱魔血咒（不计入已知）。以一个附赠动作，移除30尺内生物的魅惑、恐慌或支配效果。增幅可对源头造成3d6心灵伤害并震慑。", level: 15 },
          { name: "血仪重生", description: "第18级时，若你在激活血仪期间生命值降至0且未立即死亡，可结束所有血仪并将生命值降至1。", level: 18 },
        ],
      },
      {
        id: "lycan",
        name: "化狼圣约",
        description: "化狼圣约的血猎手接受兽化诅咒，通过鲜血魔法驾驭体内野兽的力量，化身为狼人般的混合形态。",
        source: "dndb",
        traits: [
          { name: "增强感官", description: "第3级起，你在依赖听觉或嗅觉的感知（察觉）检定上具有优势。", level: 3 },
          { name: "混种变形", description: "第3级起，以附赠动作转化为混合形态1小时。获得：力量检定优势，徒手打击伤害1d6挥砍（11级1d8），对非银质非魔法钝击、穿刺、挥砍抗性，不穿重甲时AC+1，可将猩红仪式施于徒手。半血以下需过DC8感知豁免否则攻击最近生物。短休或长休恢复一次。", level: 3 },
          { name: "追猎造诣", description: "第7级起，你的速度增加10尺。混种形态下徒手攻击检定+1（11级+2，18级+3），且视为魔法武器。", level: 7 },
          { name: "高等变形", description: "第11级起，混种变形可用两次，且半血以下每回合开始恢复1+体质调整值生命值。", level: 11 },
          { name: "饕餮烙印", description: "第15级起，混种形态下为控制嗜血进行的感知豁免具有优势，且你对烙印生物的攻击具有优势。", level: 15 },
          { name: "精通混种变形", description: "第18级时，可无限次使用混种变形，并自动习得怒号血咒（不计入已知）。", level: 18 },
        ],
      },
      {
        id: "mutant",
        name: "突变圣约",
        description: "突变圣约使用腐败的炼金灵药与血魔法暂时重组生理结构，通过改变自身实现强大的抗性与属性加成。",
        source: "dndb",
        traits: [
          { name: "诱变技艺", description: "第3级起，你掌握配制诱变剂的炼金公式。短休或长休后可制作一定数量（3级1个，7级2个，11级2个，15级3个，18级3个），已知公式随等级增加（3级4门，7级5门，11级6门，15级7门，18级8门）。服用后效果持续到下次休息。", level: 3 },
          { name: "诱变配方选择 (3级)", description: "选择3级时已知的4门诱变配方。", level: 3, choices: [{ id: "mutant-formulas-3", name: "学得的诱变配方 (选择4门)", chooseNumber: 4, options: mutantFormulaOptions }] },
          { name: "奇异代谢", description: "第7级起，获得毒素伤害与中毒状态免疫。此外，以附赠动作可忽略一种诱变剂的副作用1分钟，长休重置。", level: 7 },
          { name: "诱变配方选择 (7级)", description: "第7级起再学会1种诱变公式。", level: 7, choices: [{ id: "mutant-formulas-7", name: "学得的诱变配方 (选择1门)", chooseNumber: 1, options: mutantFormulaOptions }] },
          { name: "真理烙印", description: "第11级起，惩戒烙印压制目标的隐形或幻术，并迫使变形生物恢复真实形态且被震慑。", level: 11 },
          { name: "诱变配方选择 (11级)", description: "第11级起再学会1种诱变公式。", level: 11, choices: [{ id: "mutant-formulas-11", name: "学得的诱变配方 (选择1门)", chooseNumber: 1, options: mutantFormulaOptions }] },
          { name: "腐蚀血咒", description: "第15级起，你自动学会腐蚀血咒（不计入已知）。", level: 15 },
          { name: "诱变配方选择 (15级)", description: "第15级起再学会1种诱变公式。", level: 15, choices: [{ id: "mutant-formulas-15", name: "学得的诱变配方 (选择1门)", chooseNumber: 1, options: mutantFormulaOptions }] },
          { name: "高等突变", description: "第18级时，以附赠动作切换一种正在生效的诱变剂，可用次数等于血魔法调整值（最少1次），长休重置。", level: 18 },
          { name: "诱变配方选择 (18级)", description: "第18级起再学会1种诱变公式。", level: 18, choices: [{ id: "mutant-formulas-18", name: "学得的诱变配方 (选择1门)", chooseNumber: 1, options: mutantFormulaOptions }] },
        ],
      },
      {
        id: "profanesoul",
        name: "渎魂圣约",
        description: "渎魂圣约的血猎手与异界宗主签订契约，将邪术师法术与鲜血秘法相融，以对抗更大的邪恶。",
        source: "dndb",
        spellcasting: {
          type: "known",
          ability: "INT",
          cantripsKnown: [2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3],
          spellsKnown: [0,0,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,11],
          spellSlots: [[],[],[1],[1],[1],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2]],
          spellList: "warlock",
        },
        traits: [
          {
            name: "契约魔法",
            description: "第3级起，你获得邪术师施法能力。习得两个戏法与两个已知法术，短休或长休恢复法术位。施法关键属性为智力（可选感知）。",
            level: 3,
            choices: [
              {
                id: "profane-soul-ability",
                name: "施法关键属性",
                chooseNumber: 1,
                options: [
                  { id: "INT", name: "智力", description: "使用智力作为你的施法关键属性。" },
                  { id: "WIS", name: "感知", description: "使用感知作为你的施法关键属性。" }
                ]
              },
              {
                id: "spells-step-cantrips",
                name: "选择两个邪术师戏法",
                chooseNumber: 2,
                dynamic: "spell",
                spellType: "cantrip",
                spellList: "warlock"
              },
              {
                id: "spells-step-leveled",
                name: "选择两个一环邪术师法术",
                chooseNumber: 2,
                dynamic: "spell",
                spellType: "known",
                spellList: "warlock",
                maxLevel: 1
              }
            ]
          },
          { name: "血仪法器", description: "第3级起，持握激活猩红仪式的武器时，可作为施法法器并获得宗主恩惠（如至高妖精使目标无法隐形，天界可治疗等）。", level: 3 },
          { name: "神秘狂乱", description: "第7级起，当你以动作施放一个戏法时，可用附赠动作进行一次武器攻击。", level: 7 },
          { name: "奥秘揭示", description: "第7级起，宗主授予一个特殊法术（如朦胧术、灼热射线等），可用契约法术位施展，长休一次。", level: 7 },
          { name: "痂痕烙印", description: "第11级起，你的惩戒烙印使目标在对抗你的邪术师法术时豁免具有劣势。", level: 11 },
          { name: "奥秘展露", description: "第15级起，宗主再授予一个法术（如缓慢术、火球术等），可不消耗法术位施展一次，长休重置。", level: 15 },
          { name: "噬魂血咒", description: "第18级起，你自动学会噬魂血咒（不计入已知）。", level: 18 },
        ],
      },
    ],
    subclassAvailableAtLevel: 3,
    source: "dndb",
  },
];