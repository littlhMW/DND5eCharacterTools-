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
        description: '习惯了微光森林与夜空，有着精灵血统。',
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
    description: '阿斯莫通常是善良的。然而，有些阿斯莫会堕入邪恶，拒绝他们的血脉天性。',
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
        description: '习惯了地底的生活。',
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
    description: '非玩家角色选项。',
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
    description: '非玩家角色选项。',
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
    description: '非玩家角色选项。',
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
    description: '非玩家角色选项。',
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
    description: '非玩家角色选项。',
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
