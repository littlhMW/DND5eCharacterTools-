import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'aarakocra',
    name: '阿兰寇拉鹰人',
    description: '阿兰寇拉鹰人大约5尺高。他们有着体重介于80到100磅之间，纤细而轻盈的身体。',
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
    source: 'ee'
  },
  {
    id: 'genasi',
    name: '元素裔',
    description: '独立而自信，元素裔倾向中立阵营。元素裔有着原初血脉。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '原初语'],
    traits: [],
    spells: [],
    source: 'ee',
    subraces: [
      {
        id: 'fire-genasi',
        name: '火元素裔',
        description: '你与火元素位面有着强烈联系。',
        abilityBonuses: [{ ability: 'INT', bonus: 1 }],
        traits: [
          { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。任何你在黑暗中所看到的事物都有着红色的轮廓。' },
          { name: '火焰抗性', description: '你具有对火焰伤害的抗性。' },
          { name: '触及烈焰', description: '你知晓燃火术戏法。当你升至3级，你可以使用此特性以一环法术施放一次燃烧之手。' }
        ],
        spells: [
          { level: 0, spellId: 'produce-flame' },
          { level: 3, spellId: 'burning-hands' }
        ],
        source: 'ee'
      },
      {
        id: 'air-genasi',
        name: '气元素裔',
        description: '你与气元素位面有着强烈联系。',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '无尽气息', description: '当你并未处于无力时，你就可以无限期的屏住呼吸。' },
          { name: '与风相混', description: '你可以使用此特性施放一次浮空术。' }
        ],
        spells: [{ level: 1, spellId: 'levitate' }],
        source: 'ee'
      },
      {
        id: 'water-genasi',
        name: '水元素裔',
        description: '你与水元素位面有着强烈联系。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '强酸抗性', description: '你具有对强酸伤害的抗性。' },
          { name: '两栖', description: '你可以在空气和水中呼吸。并且你拥有30尺的游泳速度。' },
          { name: '呼唤波涛', description: '你知晓戏法塑水。3级时你可施放一次造水/枯水术。' }
        ],
        spells: [
          { level: 0, spellId: 'shape-water' },
          { level: 3, spellId: 'create-or-destroy-water' }
        ],
        source: 'ee'
      },
      {
        id: 'earth-genasi',
        name: '土元素裔',
        description: '你与土元素位面有着强烈联系。',
        abilityBonuses: [{ ability: 'STR', bonus: 1 }],
        traits: [
          { name: '大地步行', description: '你可以移动穿越由土或石构成的困难地形而不会消耗额外的移动速度。' },
          { name: '与石交融', description: '你可以使用此特性施放一次行踪无迹。' }
        ],
        spells: [{ level: 1, spellId: 'pass-without-trace' }],
        source: 'ee'
      }
    ]
  }
];
