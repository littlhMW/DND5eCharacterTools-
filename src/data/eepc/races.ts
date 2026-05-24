import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'aarakocra',
    name: '阿兰寇拉鹰人',
    description: '阿兰寇拉鹰人是源自风元素位面的高空守望者。他们体态纤细轻盈，渴望在无边天际自由飞翔。作为捕猎与侦察大师，他们怀揣着对大地的警惕，誓死守卫高山巢穴与远古盟约。',
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
    source: 'eepc'
  },
  {
    id: 'genasi',
    name: '元素裔',
    description: '元素裔是凡人与强大巨灵休戚与共的子嗣，其血管中奔涌着水、火、土、气等位面的原初伟力。他们继承了人类的轮廓，却流露着奇异的元素体征，多游离于社会边缘，孤傲而自由。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '原初语'],
    traits: [],
    spells: [],
    source: 'eepc',
    subraces: [
      {
        id: 'fire-genasi',
        name: '火元素裔',
        description: '你与火元素位面有着强烈联系。如果你选择火元素裔，你将拥有在黑暗中看清事物红影并掌控烈焰红莲的力量。',
        abilityBonuses: [{ ability: 'INT', bonus: 1 }],
        traits: [
          { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。任何你在黑暗中所看到的事物都有着红色的轮廓。' },
          { name: '火焰抗性', description: '你具有对火焰伤害的抗性。' },
          { name: '触及烈焰：燃火术', description: '你知晓燃火术戏法。', level: 0 },
          { name: '触及烈焰：燃烧之手', description: '当你升至3级，你可以使用此特性以一环法术施放一次燃烧之手，在长休后恢复。', level: 3 }
        ],
        spells: [
          { level: 0, spellId: 'produce-flame' },
          { level: 3, spellId: 'burning-hands' }
        ],
        source: 'eepc'
      },
      {
        id: 'air-genasi',
        name: '气元素裔',
        description: '你与气元素位面有着强烈联系。气元素裔呼吸不受尘世局限，甚至可以呼唤轻风摆脱重力凭空浮空。',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '无尽气息', description: '当你并未处于无力时，你就可以无限期的屏住呼吸。' },
          { name: '与风相混', description: '你可以使用此特性施放一次浮空术。' }
        ],
        spells: [{ level: 1, spellId: 'levitate' }],
        source: 'eepc'
      },
      {
        id: 'water-genasi',
        name: '水元素裔',
        description: '你与水元素位面有着强烈联系。水元素裔是天生的深海破浪者，完美具有酸液抗性并自由操控水流狂澜。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '强酸抗性', description: '你具有对强酸伤害的抗性。' },
          { name: '两栖', description: '你可以在空气和水中呼吸。并且你拥有30尺的游泳速度。' },
          { name: '呼唤波涛：塑水', description: '你知晓戏法塑水。', level: 0 },
          { name: '呼唤波涛：造水/枯水术', description: '3级时你可以使用此特性施放一次造水/枯水术，在长休后恢复。', level: 3 }
        ],
        spells: [
          { level: 0, spellId: 'shape-water' },
          { level: 3, spellId: 'create-or-destroy-water' }
        ],
        source: 'eepc'
      },
      {
        id: 'earth-genasi',
        name: '土元素裔',
        description: '你与土元素位面有着强烈联系。土元素裔可以无视嶙峋乱石的险峻阻碍，甚至能与石交融掩去自身行踪。',
        abilityBonuses: [{ ability: 'STR', bonus: 1 }],
        traits: [
          { name: '大地步行', description: '你可以移动穿越由土或石构成的困难地形而不会消耗额外的移动速度。' },
          { name: '与石交融', description: '你可以使用此特性施放一次行踪无迹。' }
        ],
        spells: [{ level: 1, spellId: 'pass-without-trace' }],
        source: 'eepc'
      }
    ]
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
    source: 'eepc',
    subraces: []
  },
  {
    id: 'goliath',
    name: '歌利亚',
    description: '歌利亚高大、强壮，且离群索居，他们身上流淌着巨人的血脉。他们生活在山巅之上，在那里，风在狂啸，温度冻入骨髓，空气也无比稀薄。在这些恶劣的环境中，每一个歌利亚都必须竭尽所能地自给自足，以在族群中生存下去。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '巨人语'],
    traits: [
      { name: '天生运动员', description: '你熟练于运动技能。' },
      { name: '石之耐性', description: '你可以通过专注自身以忽视重伤。当你受到伤害时，你可以使用你的反应以骰一颗1d12。将你的体质调整值加入骰出的数字，并将该伤害减少其总和的数值。在你使用此特性之后，直到完成一次短休或长休之前你都不能再使用它。' },
      { name: '强健体格', description: '当决定你的负重以及你可以拖曳、推动、或提举的重量时，你将你的体型视作比原本大一级。' },
      { name: '高山之子', description: '你对冷冻伤害有抗性。你还习惯于高海拔的环境，包括海拔高度20,000尺以上的环境，参见《地下城主指南》第五章的叙述。' }
    ],
    spells: [],
    skillProficiencies: ['athletics'],
    source: 'eepc'
  }
];
