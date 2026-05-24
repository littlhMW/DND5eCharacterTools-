import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'elf',
    name: '精灵',
    description: '',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'dmg',
    subraces: [
      {
        id: 'eladrin-dmg',
        name: '雅灵',
        description: '（非玩家种族）\n雅灵是源于奔放妖精荒野的精类精灵。他们完美展现了妖精魔力的四季律动，能轻易穿越空间缝隙实现妖精步短距离传送，天生美丽、感性且有些神秘变幻无常。',
        abilityBonuses: [{ ability: 'INT', bonus: 1 }],
        traits: [
          { name: '妖精步', description: '你可以使用此特性施放一次迷踪步。当你完成一次短休或长休重新获得此能力。' },
          { name: '精灵武器训练', description: '你熟练于长剑、短剑、短弓和长弓。' }
        ],
        spells: [{ level: 2, spellId: 'misty-step' }],
        source: 'dmg'
      }
    ]
  },
  {
    id: 'aasimar',
    name: '阿斯莫',
    description: '（非玩家种族）\n阿斯莫是凡世间承载着天界神圣灵光的眷顾之子。他们生而高贵，背负着守卫正义的至高宿命，但也在尘世诱惑下拥有堕入黑暗的自主意志，其周身洋溢着璀璨圣力。',
    abilityBonuses: [{ ability: 'CHA', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60尺',
    languages: ['通用语', '天界语'],
    traits: [
      { name: '黑暗视觉', description: '多亏于你的天界血脉，你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '天界抗性', description: '你具有对黯蚀和光耀伤害的抗性。' },
      { name: '天界传承：光亮术', description: '你知晓光亮术戏法。你施展此术的施法属性为魅力。', level: 0 },
      { name: '天界传承：次级复原术', description: '当你升至3级，你可以使用此特性施放一次次级复原术，且在完成一次长休后才能再次施放。你施展此术的施法属性为魅力。', level: 3 },
      { name: '天界传承：昼明术', description: '当你升至5级，你可以使用此特性以3环法术施放一次昼明术，且在完成一次长休后才能再次施放。你施展此术的施法属性为魅力。', level: 5 }
    ],
    spells: [
      { level: 0, spellId: 'light' },
      { level: 3, spellId: 'lesser-restoration' },
      { level: 5, spellId: 'daylight' }
    ],
    source: 'dmg',
  },
  {
    id: 'gnome',
    name: '侏儒',
    description: '',
    abilityBonuses: [],
    size: 'Small',
    speed: 25,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'dmg',
    subraces: [
      {
        id: 'deep-gnome-dmg',
        name: '地底侏儒',
        description: '（非玩家种族）\n地底侏儒是锤炼于幽暗幽域的机巧求生者。他们常年与无光岩石和黑暗旷野为伴，精通泥石避世魔法以及探查矿脉才能，能自如踏在峭壁间，是地底最沉稳的隐士。',
        abilityBonuses: [{ ability: 'STR', bonus: 1 }],
        traits: [
          { name: '高级黑暗视觉', description: '习惯了地底的生活，你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你120尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
          { name: '天生施法', description: '你天生就具备施放以下法术的能力，且无需任何材料构材；随意：回避侦测（限定自身）；各项1/每日：目盲/耳聋术，朦胧术，易容术。你施展这些法术的施法属性为智力。' }
        ],
        spells: [
          { level: 1, spellId: 'nondetection' },
          { level: 1, spellId: 'blindness-deafness' },
          { level: 1, spellId: 'blur' },
          { level: 1, spellId: 'disguise-self' }
        ],
        source: 'dmg'
      }
    ]
  },
  {
    id: 'gnoll',
    name: '豺狼人',
    description: '（非玩家种族）\n豺狼人是游荡在荒原中、饱含狂暴杀戮直觉的掠食狂。他们秉承狂暴之神耶诺古的冷酷意志，渴求血肉盛宴，其暴走和撕咬冲锋是荒野商队心中极其可怕的梦魇。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'INT', bonus: -2 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60尺',
    languages: ['通用语', '豺狼人语'],
    traits: [
      { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '啃咬', description: '你长满獠牙的血盆大口是一种天生武器，且你可以用它来进行徒手打击。如果你以它命中目标，则你造成等同1d4 + 你的力量调整值的穿刺伤害，而非一般徒手打击的钝击伤害。' },
      { name: '暴走', description: '当你在你的回合以一次近战攻击将一个生物的生命值归零，你可以采取一个附赠动作以移动最多等同于你移动速度一半的距离，并进行一次啃咬攻击。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'hobgoblin',
    name: '大地精',
    description: '（非玩家种族）\n大地精是地精类群落中极其推崇铁军纪律、酷爱严整战阵的军国战士。他们长于多人联防与成军优势，在战场上调度严密且攻城拔寨，坚决贯彻冷酷的铁腕军规。',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60尺',
    languages: ['通用语', '地精语'],
    traits: [
      { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '成军优势', description: '每回合一次，当你以一次武器攻击命中一个生物时，若你有一个盟友距离该生物5尺内且该盟友并未无力，则你可以对它造成额外的2d6伤害。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'goblin',
    name: '地精',
    description: '（非玩家种族）\n地精是体型矮小、生存才能强悍的狡黠生灵。生活在险恶边缘的他们深信卑微即是生路，极擅敏捷撤逃，能在混乱中凭借出奇不意的诡诈战术与强运艰难存活。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'STR', bonus: -2 }],
    size: 'Small',
    speed: 30,
    vision: '黑暗视觉 60尺',
    languages: ['通用语', '地精语'],
    traits: [
      { name: '灵敏脱逃', description: '你可以在每次你的回合以一个附赠动作来采取撤离或躲藏动作。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'kobold',
    name: '狗头人',
    description: '（非玩家种族）\n狗头人是疯狂崇拜巨龙血脉、终生忙碌于地下迷宫的爬行小鬼。他们常年对抗日光，惯用惊人的群体战术和连环地底陷阱痛击来犯之敌，用微弱的身躯苟活延续古老龙裔神话。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'STR', bonus: -4 }],
    size: 'Small',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '龙语'],
    traits: [
      { name: '群体战术', description: '若你有至少一个盟友距离目标生物5尺内且该盟友并未无力，则你在对该生物进行的攻击检定中具有优势。' },
      { name: '日光敏感', description: '当你、你的攻击目标、或你尝试感知的东西直接暴露在阳光下，则你依赖于视觉的攻击检定以及感知（察觉）检定具有劣势。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'orc',
    name: '兽人',
    description: '（非玩家种族）\n兽人是尊崇野性与纯粹物理压迫感的铁血战士。在独眼战神的力量感召之下，他们崇武尚勇，在战斗中爆发出无人能挡的一往无前的侵略性，甘愿在浴血中续写原野传奇。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'INT', bonus: -2 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60尺',
    languages: ['通用语', '兽人语'],
    traits: [
      { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '侵略性', description: '以一个附赠动作，你可以向一个你所能看见的敌意生物移动最多等同你移动速度的距离。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'zombie',
    name: '僵尸',
    description: '（非玩家种族）\n僵尸是被死灵魔法唤醒的无心尸骸，他们不知恐惧与疲倦，只会遵循创造者的简单指令而行动，身上萦绕着令人不安的死亡气息。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }, { ability: 'STR', bonus: 1 }, { ability: 'WIS', bonus: -4 }, { ability: 'CHA', bonus: -4 }, { ability: 'INT', bonus: -6 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60尺',
    languages: ['理解你生前所知的语言但无法说话'],
    traits: [
      { name: '不死本质', description: '你免疫于毒素伤害和力竭状态，且你不会陷入中毒状态。你不再需要呼吸、进食、饮水、或睡眠。' },
      { name: '不死韧性', description: '若伤害将你的生命值归零，除非该伤害为光耀伤害或来自重击，否则你必须进行一次DC为 5 + 所受伤害值的体质豁免。若豁免成功，则你改为将生命值减少至1。' },
      { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'kuo-toa',
    name: '寇涛鱼人',
    description: '（非玩家种族）\n寇涛鱼人是疯狂而怪异的水生狂热者，他们长年蛰伏在幽暗地域深处的漆黑水域里，沉溺于自我创造的狂热神祇倒影之中。',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '高级黑暗视觉 120尺',
    languages: ['地底通用语'],
    traits: [
      { name: '两栖', description: '你可以在空气和水中呼吸。' },
      { name: '异界感知', description: '你可以感知到任何距离你30尺内处于隐形状态或在乙太位面的生物。你可以准确知道这类生物在移动时的确切位置。' },
      { name: '滑溜', description: '你在为逃离擒抱所进行的属性检定和豁免检定中具有优势。' },
      { name: '日光敏感', description: '当处于日光照耀下时，你在攻击检定，以及依赖视觉的感知（察觉）检定中具有劣势。' },
      { name: '高级黑暗视觉', description: '你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你120尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'skeleton',
    name: '骷髅',
    description: '（非玩家种族）\n骷髅是一堆被黯蚀魔法驱动的活动骸骨。它们没有任何生前的智慧与渴望，仅保留着最基本的战斗技巧与服从创造者的本能。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'INT', bonus: -4 }, { ability: 'CHA', bonus: -4 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60尺',
    languages: ['理解你生前所知的语言但无法说话'],
    traits: [
      { name: '不死本质', description: '你免疫于毒素伤害和力竭状态，且你不会陷入中毒状态。你不再需要呼吸、进食、饮水、或睡眠。' },
      { name: '易碎骸骨', description: '你具有对钝击伤害的易伤。' },
      { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'bullywug',
    name: '狂蛙人',
    description: '（非玩家种族）\n狂蛙人是贪婪好斗的沼泽住民，他们鄙视外来者，凭借优异的伪装和弹跳能力在泥泞湿地里称王称霸。',
    abilityBonuses: [{ ability: 'INT', bonus: -2 }, { ability: 'CHA', bonus: -2 }],
    size: 'Medium',
    speed: 20,
    vision: '普通视觉',
    languages: ['狂蛙人语'],
    traits: [
      { name: '两栖', description: '你可以在空气和水中呼吸。附加40尺游泳速度。' },
      { name: '蛙类交谈', description: '你可以使用狂蛙人语对青蛙与蟾蜍进行简单概念的沟通。' },
      { name: '沼泽伪装', description: '你在沼泽地形为躲藏所进行的敏捷（隐匿）检定中具有优势。' },
      { name: '立定跳跃', description: '你的跳远距离最多20尺、且跳高距离最多10尺，无论有没有助跑都一样。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'merfolk',
    name: '人鱼',
    description: '（非玩家种族）\n人鱼是美丽且神秘的海洋主宰，拥有人形的上半身和鱼的下半身，他们的王国常年隐藏在深海或隐秘的珊瑚礁地带。',
    abilityBonuses: [],
    size: 'Medium',
    speed: 10,
    vision: '普通视觉',
    languages: ['通用语', '水族语'],
    traits: [
      { name: '两栖', description: '你可以在空气和水中呼吸。附加40尺游泳速度。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'grimlock',
    name: '石盲蛮族',
    description: '（非玩家种族）\n石盲蛮族是长年栖居于幽暗地底而退化去双眼的残酷肉食者，他们利用高度敏锐的听嗅觉和惊人的岩地伪装本能猎杀猎物。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CHA', bonus: -2 }],
    size: 'Medium',
    speed: 30,
    vision: '盲视 30尺',
    languages: ['地底通用语'],
    traits: [
      { name: '盲视', description: '你没有双眼，且不会陷入目盲状态。你可以察觉你周遭30尺范围内的环境，或在耳聋时则为10尺范围。你对超过这个半径范围外的事物被视作目盲。' },
      { name: '敏锐听觉和嗅觉', description: '你在依赖听觉和嗅觉的感知（察觉）检定中具有优势。' },
      { name: '岩地伪装', description: '你在岩石地形为躲藏所进行的敏捷（隐匿）检定中具有优势。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'kenku',
    name: '天狗',
    description: '（非玩家种族）\n天狗是失去了羽翼与原创力的流浪鸦人。他们只能凭借近乎完美的拟声天赋和模仿记忆在城市的阴影和地下城边缘勉强找寻立足之地。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '气族语 (只能透过拟声表达)'],
    traits: [
      { name: '伏击者', description: '在战斗的第一轮中，你对任何被突袭的生物所进行的攻击检定具有优势。' },
      { name: '拟声', description: '你可以模仿任何你曾听过的声音，包括人的嗓音。一个听到这类声音的生物可以通过成功通过一次感知（洞悉）检定来对抗你的魅力（欺瞒）检定以辨别出它是否被模仿。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'lizardfolk',
    name: '蜥蜴人',
    description: '（非玩家种族）\n蜥蜴人是在温暖的沼泽与雨林中建立古老图腾部落的务实肉食者，他们情感冷漠，凭借与生俱来的厚鳞与屏息狩猎直觉纵横环境。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'INT', bonus: -2 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['龙语'],
    traits: [
      { name: '水性', description: '附加30尺游泳速度。' },
      { name: '屏息', description: '你可以屏住呼吸长达15分钟。' },
      { name: '天生护甲', description: '你的鳞片作为天生护甲发挥作用，让你的护甲等级获得+3加值。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'troglodyte',
    name: '战蜥人',
    description: '（非玩家种族）\n战蜥人是游荡在地底深处、凶暴且极度落后的野蛮掠食者。它们散发着令人作呕的标志性腐臭味，凭借变色伪装躲藏在黑暗中伺机而动。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 2 }, { ability: 'INT', bonus: -4 }, { ability: 'CHA', bonus: -4 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60尺',
    languages: ['战蜥人语'],
    traits: [
      { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '变色皮肤', description: '你在为躲藏所进行的敏捷（隐匿）检定中具有优势。' },
      { name: '恶臭', description: '任何除了战蜥人以外在距离你5尺内开始它的回合的生物都必须成功通过一次DC 12的体质豁免，否则陷入中毒状态直到该生物的下个回合开始。若此豁免成功，该生物将免疫于所有战蜥人的恶臭长达1小时。' },
      { name: '日光敏感', description: '当处于日光照耀下时，你在攻击检定，以及依赖视觉的感知（察觉）检定中具有劣势。' },
      { name: '天生护甲', description: '你的厚皮让你的护甲等级获得+1加值。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'aarakocra',
    name: '阿兰寇拉鹰人',
    description: '（非玩家种族）\n阿兰寇拉鹰人是源自风元素位面的高空守望者。他们体态纤细轻盈，并拥有极快的飞翔速度。在主神殿和风之国度，这些敏捷的精锐斥候长年用敏锐的感知和锐利的禽爪守望着任何可能的跨界入侵。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
    size: 'Medium',
    speed: 25,
    vision: '普通视觉',
    languages: ['通用语', '阿兰寇拉语', '气族语'],
    traits: [
      { name: '飞行', description: '你拥有50尺的飞行速度。要使用此移动速度，你不能穿着中甲或重甲。' },
      { name: '禽爪', description: '你熟练于你的徒手打击，并在命中时造成1d4挥砍伤害。' }
    ],
    spells: [],
    source: 'dmg'
  }
];

