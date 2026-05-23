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
        description: '雅灵是源于奔放妖精荒野的精类精灵。他们完美展现了妖精魔力的四季律动，能轻易穿越空间缝隙实现妖精步短距离传送，天生美丽、感性且有些神秘变幻无常。',
        abilityBonuses: [{ ability: 'INT', bonus: 1 }],
        traits: [
          { name: '妖精步', description: '你可以使用此特性施放一次迷踪步。当你完成一次短休或长休重新获得此能力。' }
        ],
        spells: [{ level: 2, spellId: 'misty-step' }],
        source: 'dmg'
      }
    ]
  },
  {
    id: 'aasimar',
    name: '阿斯莫',
    description: '阿斯莫是凡世间承载着天界神圣灵光的眷顾之子。他们生而高贵，背负着守卫正义的至高宿命，但也在尘世诱惑下拥有堕入黑暗的自主意志，其周身洋溢着璀璨圣力。',
    abilityBonuses: [{ ability: 'CHA', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '天界语'],
    traits: [
      { name: '天界抗性', description: '你具有对黯蚀和光耀伤害的抗性。' },
      { name: '天界传承', description: '你知晓光亮术戏法。3级可施放次级复原术。5级可施放昼明术。' }
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
    size: 'Medium',
    speed: 30,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'dmg',
    subraces: [
      {
        id: 'deep-gnome-dmg',
        name: '地底侏儒',
        description: '地底侏儒是锤炼于幽暗幽域的机巧求生者。他们常年与无光岩石和黑暗旷野为伴，精通泥石避世魔法以及探查矿脉才能，能自如踏在峭壁间，是地底最沉稳的隐士。',
        abilityBonuses: [{ ability: 'STR', bonus: 1 }],
        traits: [
          { name: '天生施法', description: '随意：回避侦测（限定自身）。每日一次：目盲/耳聋术，朦胧术，易容术。' },
          { name: '高级黑暗视觉', description: '你在看距离你120尺范围内的事物时，视为明亮或微光状态。' }
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
    description: '豺狼人是游荡在荒原中、饱含狂暴杀戮直觉的掠食狂。他们秉承狂暴之神耶诺古的冷酷意志，渴求血肉盛宴，其暴走和撕咬冲锋是荒野商队心中极其可怕的梦魇。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'INT', bonus: -2 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: [],
    traits: [
      { name: '啃咬', description: '你的大口是一种天生武器，造成1d4+力量调整值的穿刺伤害。' },
      { name: '暴走', description: '当你在回合以一次近战攻击将生物生命值归零，可采取一个附赠动作移动一半距离并啃咬。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'hobgoblin',
    name: '大地精',
    description: '大地精是地精类群落中极其推崇铁军纪律、酷爱严整战阵的军国战士。他们长于多人联防与成军优势，在战场上调度严密且攻城拔寨，坚决贯彻冷酷的铁腕军规。',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '地精语'],
    traits: [{ name: '成军优势', description: '每回合一次，如果有未无力盟友距目标5尺内，你攻击命中时造成额外2d6伤害。' }],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'goblin',
    name: '地精',
    description: '地精是体型矮小、生存才能强悍的狡黠生灵。生活在险恶边缘的他们深信卑微即是生路，极擅敏捷撤逃，能在混乱中凭借出奇不意的诡诈战术与强运艰难存活。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'STR', bonus: -2 }],
    size: 'Small',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '地精语'],
    traits: [{ name: '灵敏脱逃', description: '每个回合可以采取撤离或躲藏附赠动作。' }],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'kobold',
    name: '狗头人',
    description: '狗头人是疯狂崇拜巨龙血脉、终生忙碌于地下迷宫的爬行小鬼。他们常年对抗日光，惯用惊人的群体战术和连环地底陷阱痛击来犯之敌，用微弱的身躯苟活延续古老龙裔神话。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'STR', bonus: -4 }],
    size: 'Small',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '龙语'],
    traits: [
      { name: '群体战术', description: '有盟友距目标5尺内你在攻击检定中具有优势。' },
      { name: '日光敏感', description: '处于日光照耀下时，攻击和视觉察觉劣势。' }
    ],
    spells: [],
    source: 'dmg'
  },
  {
    id: 'orc',
    name: '兽人',
    description: '兽人是尊崇野性与纯粹物理压迫感的铁血战士。在独眼战神的力量感召之下，他们崇武尚勇，在战斗中爆发出无人能挡的一往无前的侵略性，甘愿在浴血中续写原野传奇。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'INT', bonus: -2 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '兽人语'],
    traits: [{ name: '侵略性', description: '以一个附赠动作，你可以向一个可见敌意生物移动最多等同你速度的距离。' }],
    spells: [],
    source: 'dmg'
  }
];
