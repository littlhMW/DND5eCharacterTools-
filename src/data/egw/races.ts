import { Race } from '../../types/dnd';

export const races: Race[] = [
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
    source: 'egw',
    subraces: [
      {
        id: 'lotusden',
        name: '莲源半身人',
        description: '生活在繁茂森林与自然之中，深谙野外生存与自然魔法。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '树林之子', description: '你知晓德鲁伊伎俩戏法。3级能释放一次纠缠术。5级能释放一次荆棘丛生。' },
          { name: '木行', description: '通过由非魔法植物形成的困难地形不需要花费额外移动力，别人追踪你具有劣势。' }
        ],
        spells: [
          { level: 0, spellId: 'druidcraft' },
          { level: 3, spellId: 'entangle' },
          { level: 5, spellId: 'spike-growth' }
        ],
        source: 'egw'
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
    source: 'egw',
    subraces: [
      {
        id: 'pallid-elf',
        name: '苍白精灵',
        description: '在漫长的阴影与地下隔离中演化的精灵。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '锐利感知', description: '你在调查和洞悉检定上具有优势。' },
          { name: '月织者之福', description: '你知晓光亮术。3级可施展睡眠术。5级可对自己施展隐形术（限自身）。' }
        ],
        spells: [
          { level: 0, spellId: 'light' },
          { level: 3, spellId: 'sleep' },
          { level: 5, spellId: 'invisibility' }
        ],
        source: 'egw'
      }
    ]
  },
  {
    id: 'dragonborn',
    name: '龙裔',
    description: '',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'egw',
    subraces: [
      {
        id: 'draconblood',
        name: '龙国血统龙裔',
        description: '在帝国中握有权柄的龙裔，通过智力与口才治国。',
        abilityBonuses: [{ ability: 'INT', bonus: 2 }, { ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。' },
          { name: '强势气场', description: '你可以利用出色的交涉或恐吓在困境中获利。当进行威吓或说服检定时，你可以让自己获得优势（每短休或长休一次）。' }
        ],
        spells: [],
        source: 'egw'
      },
      {
        id: 'ravenite',
        name: '拾荒种龙裔',
        description: '无尾且长期作为奴隶的反叛龙裔。',
        abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
        traits: [
          { name: '黑暗视觉', description: '60尺黑暗视觉。' },
          { name: '复仇打击', description: '当你受到范围内生物的伤害时，你可以使用反应对其进行一次武器攻击（每短休或长休一次）。' }
        ],
        spells: [],
        source: 'egw'
      }
    ]
  },
  {
    id: 'orc',
    name: '兽人',
    description: '有着强壮体魄。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '兽人语'],
    traits: [
      { name: '侵略性', description: '以附赠动作向可见或听见的敌意生物移动速度距离。' },
      { name: '原初直觉', description: '你获得以下两项技能的熟练：驯兽，洞悉，威吓，医疗，察觉，或生存。', choices: [
        {
          id: 'egw-orc-skills',
          name: '选择两项技能',
          chooseNumber: 2,
          options: [
            { id: 'animalHandling', name: '驯兽' },
            { id: 'insight', name: '洞悉' },
            { id: 'intimidation', name: '威吓' },
            { id: 'medicine', name: '医疗' },
            { id: 'perception', name: '察觉' },
            { id: 'survival', name: '生存' }
          ]
        }
      ] },
      { name: '强健体格', description: '决定负重和搬运体重时视作大一级体型。' }
    ],
    spells: [],
    source: 'egw'
  }
];
