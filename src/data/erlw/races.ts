import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'dwarf',
    name: '矮人',
    description: '',
    abilityBonuses: [],
    size: 'Medium',
    speed: 25,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-warding',
        name: '警戒龙纹矮人',
        description: '携带了防御和密封魔法力量的龙纹。',
        abilityBonuses: [{ ability: 'INT', bonus: 1 }],
        traits: [
          { name: '守卫直觉', description: '进行调查或盗贼工具检定时可以加上1d4。' },
          { name: '保护与封锁', description: '能够施展警报术和法师护甲。从3级起，还能施展秘法锁。' }
        ],
        spells: [
          { level: 1, spellId: 'alarm' },
          { level: 1, spellId: 'mage-armor' },
          { level: 3, spellId: 'arcane-lock' }
        ],
        source: 'erlw'
      }
    ]
  },
  {
    id: 'half-elf',
    name: '半精灵',
    description: '',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-storm',
        name: '暴风龙纹半精灵',
        description: '携带有控制风暴和天气魔法力量的龙纹。',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '驭风者直觉', description: '当你进行体操检定或使用领航工具时附加 1d4。' },
          { name: '暴风之祝福', description: '你对闪电伤害有抗性。' },
          { name: '逆风行事', description: '你能够施展gust戏法。3级可施展造风术。' }
        ],
        spells: [
          { level: 0, spellId: 'gust' },
          { level: 3, spellId: 'gust-of-wind' }
        ],
        source: 'erlw'
      },
      {
        id: 'mark-of-detection',
        name: '侦测龙纹半精灵',
        description: '携带有看破隐秘魔法力量的龙纹。',
        abilityBonuses: [{ ability: 'WIS', bonus: 2 }],
        traits: [
          { name: '推理直觉', description: '当你进行调查或洞悉检定可加 1d4。' },
          { name: '魔法侦测', description: '能够施展侦测魔法和侦测毒素或疾病。3级可施展识破隐形。' }
        ],
        spells: [
          { level: 1, spellId: 'detect-magic' },
          { level: 1, spellId: 'detect-poison-and-disease' },
          { level: 3, spellId: 'see-invisibility' }
        ],
        source: 'erlw'
      }
    ]
  },
  {
    id: 'halfling',
    name: '半身人',
    description: '',
    abilityBonuses: [],
    size: 'Small',
    speed: 25,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-healing',
        name: '医疗龙纹半身人',
        description: '携带治愈和恢复魔法力量的龙纹。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '医疗直觉', description: '进行医疗技能或草药工具检定时加 1d4。' },
          { name: '医疗之触', description: '能够施展治疗伤势，从第3级起还能施展次级复原术。' }
        ],
        spells: [
          { level: 1, spellId: 'cure-wounds' },
          { level: 3, spellId: 'lesser-restoration' }
        ],
        source: 'erlw'
      },
      {
        id: 'mark-of-hospitality',
        name: '招待龙纹半身人',
        description: '携带食物与居所魔法力量的龙纹。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '永远热情好客', description: '进行说服、酿酒工具或厨师工具检定时加 1d4。' },
          { name: '旅店老板的魔法', description: '能够施展魔法技俩，净化饮食和隐形仆役。' }
        ],
        spells: [
          { level: 0, spellId: 'prestidigitation' },
          { level: 1, spellId: 'purify-food-and-drink' },
          { level: 1, spellId: 'unseen-servant' }
        ],
        source: 'erlw'
      }
    ]
  },
  {
    id: 'half-orc',
    name: '半兽人',
    description: '',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-finding',
        name: '探索龙纹半兽人',
        description: '追踪与搜寻。',
        abilityBonuses: [{ ability: 'WIS', bonus: 2 }, { ability: 'CON', bonus: 1 }],
        traits: [
          { name: '猎人直觉', description: '进行察觉或生存检定时加 1d4。' },
          { name: '寻者魔法', description: '可施展猎人印记。3级可施展物品定位术。' }
        ],
        spells: [
          { level: 1, spellId: 'hunters-mark' },
          { level: 3, spellId: 'locate-object' }
        ],
        source: 'erlw'
      }
    ]
  },
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
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-shadow',
        name: '阴影龙纹精灵',
        description: '阴影和幻觉魔法。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '狡诈直觉', description: '进行表演或隐匿检定时加 1d4。' },
          { name: '阴影塑形', description: '能施展次级幻象。3级施展隐形术。' }
        ],
        spells: [
          { level: 0, spellId: 'minor-illusion' },
          { level: 3, spellId: 'invisibility' }
        ],
        source: 'erlw'
      }
    ]
  },
  {
    id: 'human',
    name: '人类',
    description: '',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-handling',
        name: '畜牧龙纹人类',
        description: '掌控动物与魔法生物。',
        abilityBonuses: [{ ability: 'WIS', bonus: 2 }],
        traits: [
          { name: '野性直觉', description: '进行驯兽或自然检定时加 1d4。' },
          { name: '原始链接', description: '可施展化兽为友和动物交谈术。' },
          { name: '它们不过是大了点', description: '你的化兽为友等能对智力3以下怪兽生效。' }
        ],
        spells: [
          { level: 1, spellId: 'animal-friendship' },
          { level: 1, spellId: 'speak-with-animals' }
        ],
        source: 'erlw'
      },
      {
        id: 'mark-of-making',
        name: '创造龙纹人类',
        description: '制造与附魔。',
        abilityBonuses: [{ ability: 'INT', bonus: 2 }],
        traits: [
          { name: '工匠直觉', description: '进行奥秘或工匠工具检定时加 1d4。' },
          { name: '匠师天赋', description: '选择一种工匠工具，获得其熟练。' },
          { name: '魔力制造', description: '习得修复术。可施展魔化武器。' }
        ],
        spells: [
          { level: 0, spellId: 'mending' },
          { level: 3, spellId: 'magic-weapon' }
        ],
        source: 'erlw'
      },
      {
        id: 'mark-of-sentinel',
        name: '守护龙纹人类',
        description: '守护与保护。',
        abilityBonuses: [{ ability: 'CON', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '哨兵直觉', description: '进行洞悉或察觉检定时加 1d4。' },
          { name: '哨兵之盾', description: '可施展护盾术。' },
          { name: '警觉卫士', description: '附近角色受击时你可以互换位置并代替受击。' }
        ],
        spells: [{ level: 1, spellId: 'shield' }],
        source: 'erlw'
      },
      {
        id: 'mark-of-passage',
        name: '通行龙纹人类',
        description: '运动与传送。',
        abilityBonuses: [{ ability: 'DEX', bonus: 2 }],
        traits: [
          { name: '邮差之速', description: '基础步行速度为35尺。' },
          { name: '运动直觉', description: '体操或陆运载具检定加 1d4。' },
          { name: '魔法通道', description: '可施展迷踪步。' }
        ],
        spells: [{ level: 1, spellId: 'misty-step' }],
        source: 'erlw'
      }
    ]
  },
  {
    id: 'bugbear',
    name: '熊地精',
    description: '巨大的地精族类。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'DEX', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60尺',
    languages: ['通用语', '地精语'],
    traits: [
      { name: '长肢', description: '近战攻击范围增加5尺。' },
      { name: '强健体格', description: '决定负重和搬运重量视作大一级体型。' },
      { name: '鬼祟', description: '熟练于隐匿。' },
      { name: '突袭攻击', description: '突袭下第一回合攻击造成额外 2d6 伤害。' }
    ],
    spells: [],
    skillProficiencies: ['stealth'],
    source: 'erlw'
  }
];
