import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'gith',
    name: '吉斯人',
    description: '受到灵吸怪奴役但如今挣脱并具有灵能天赋的一族。',
    abilityBonuses: [{ ability: 'INT', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '吉斯语'],
    traits: [],
    spells: [],
    source: 'mtof',
    subraces: [
      {
        id: 'githyanki',
        name: '吉斯洋基人',
        description: '好战而傲慢。',
        abilityBonuses: [{ ability: 'STR', bonus: 2 }],
        traits: [
          { name: '业余爱好', description: '学会一门自选语言，熟练一个自选技能。', choices: [
            {
              id: 'githyanki-skill',
              name: '选择一个技能熟练项',
              chooseNumber: 1,
              options: [
                { id: 'acrobatics', name: '特技' },
                { id: 'animalHandling', name: '驯兽' },
                { id: 'arcana', name: '奥秘' },
                { id: 'athletics', name: '运动' },
                { id: 'deception', name: '欺瞒' },
                { id: 'history', name: '历史' },
                { id: 'insight', name: '洞悉' },
                { id: 'intimidation', name: '威吓' },
                { id: 'investigation', name: '调查' },
                { id: 'medicine', name: '医药' },
                { id: 'nature', name: '自然' },
                { id: 'perception', name: '察觉' },
                { id: 'performance', name: '表演' },
                { id: 'persuasion', name: '说服' },
                { id: 'religion', name: '宗教' },
                { id: 'sleightOfHand', name: '巧手' },
                { id: 'stealth', name: '隐匿' },
                { id: 'survival', name: '生存' }
              ]
            }
          ] },
          { name: '军事人才', description: '熟练轻甲、中甲和长短剑、巨剑。' },
          { name: '吉斯洋基灵能', description: '掌握法师之手(隐形)。3级跳跃术，5级迷踪步。' }
        ],
        spells: [
          { level: 0, spellId: 'mage-hand' },
          { level: 3, spellId: 'jump' },
          { level: 5, spellId: 'misty-step' }
        ],
        armorProficiencies: ['轻甲', '中甲'],
        weaponProficiencies: ['短剑', '长剑', '巨剑'],
        source: 'mtof'
      },
      {
        id: 'githzerai',
        name: '吉斯泽莱人',
        description: '修心而克制。',
        abilityBonuses: [{ ability: 'WIS', bonus: 2 }],
        traits: [
          { name: '心灵纪律', description: '对抗魅惑和恐惧有优势。' },
          { name: '吉斯泽莱灵能', description: '掌握法师之手(隐形)。3级护盾术，5级侦测思想。' }
        ],
        spells: [
          { level: 0, spellId: 'mage-hand' },
          { level: 3, spellId: 'shield' },
          { level: 5, spellId: 'detect-thoughts' }
        ],
        source: 'mtof'
      }
    ]
  },
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
    source: 'mtof',
    subraces: [
      {
        id: 'duergar',
        name: '灰矮人',
        description: '生存在无光幽暗地域中的凶残矮人。',
        abilityBonuses: [{ ability: 'STR', bonus: 1 }],
        traits: [
          { name: '高级黑暗视觉', description: '120尺黑暗视觉。' },
          { name: '灰矮人韧性', description: '对抗毒素/幻术/魅惑/麻痹优势，毒素抗性。' },
          { name: '灰矮人魔法', description: '3级可施放变巨/缩小术，5级可施放隐形术。' },
          { name: '日光敏感', description: '暴露在阳光下攻击检定和察觉具有劣势。' }
        ],
        spells: [
          { level: 3, spellId: 'enlarge-reduce' },
          { level: 5, spellId: 'invisibility' }
        ],
        source: 'mtof'
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
    source: 'mtof',
    subraces: [
      {
        id: 'sea-elf',
        name: '海精灵',
        description: '在海洋深处游泳的精灵。',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }],
        traits: [
          { name: '海精灵武器训练', description: '熟练于长矛/三叉戟/轻弩/网。' },
          { name: '海洋之子', description: '30尺游泳速度，在水流和空气都可以呼吸。' },
          { name: '海洋之友', description: '和水生野兽简易交流。' }
        ],
        spells: [],
        weaponProficiencies: ['长矛', '三叉戟', '轻弩', '网'],
        source: 'mtof'
      },
      {
        id: 'eladrin-mtf',
        name: '雅灵 (季节)',
        description: '拥有变换季节情绪的精灵。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '妖精步', description: '以一个附赠动作，你可以魔法性的传送最多30尺距离到一处未被占据的可见空间。不同季节还能触发不同效果。' }
        ],
        spells: [],
        source: 'mtof'
      },
      {
        id: 'shadar-kai',
        name: '影灵',
        description: '鸦后的忠实仆从。',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }],
        traits: [
          { name: '黯蚀抗性', description: '你具有对黯蚀伤害的抗性。' },
          { name: '鸦后的祝福', description: '可以用附赠动作魔法性传送30尺。3级后还可在传送后一回合内获得全额抗性。' }
        ],
        spells: [],
        source: 'mtof'
      }
    ]
  },
  {
    id: 'tiefling',
    name: '提夫林',
    description: '',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'mtof',
    subraces: [
      {
        id: 'baalzebul',
        name: '巴力西卜血脉',
        description: '',
        abilityBonuses: [],
        traits: [{ name: '马拉多米尼之遗赠', description: '奇术。3级致病射线，5级疯狂冠冕。' }],
        spells: [
          { level: 0, spellId: 'thaumaturgy' },
          { level: 3, spellId: 'ray-of-sickness' },
          { level: 5, spellId: 'crown-of-madness' }
        ],
        source: 'mtof'
      },
      {
        id: 'dispater',
        name: '狄斯帕特血脉',
        description: '',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }, { ability: 'INT', bonus: -1 }],
        traits: [{ name: '迪斯之遗赠', description: '奇术。3级易容术，5级侦测思想。' }],
        spells: [
          { level: 0, spellId: 'thaumaturgy' },
          { level: 3, spellId: 'disguise-self' },
          { level: 5, spellId: 'detect-thoughts' }
        ],
        source: 'mtof'
      },
      {
        id: 'fierna',
        name: '菲尔娜血脉',
        description: '',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }, { ability: 'INT', bonus: -1 }],
        traits: [{ name: '福莱格索斯之遗赠', description: '交友术。3级魅惑人类，5级暗示术。' }],
        spells: [
          { level: 0, spellId: 'friends' },
          { level: 3, spellId: 'charm-person' },
          { level: 5, spellId: 'suggestion' }
        ],
        source: 'mtof'
      },
      {
        id: 'glasya',
        name: '格莱希亚血脉',
        description: '',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }, { ability: 'INT', bonus: -1 }],
        traits: [{ name: '马尔伯吉之遗赠', description: '次级幻象。3级易容术，5级隐形术。' }],
        spells: [
          { level: 0, spellId: 'minor-illusion' },
          { level: 3, spellId: 'disguise-self' },
          { level: 5, spellId: 'invisibility' }
        ],
        source: 'mtof'
      },
      {
        id: 'levistus',
        name: '莱维斯图斯血脉',
        description: '',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }, { ability: 'INT', bonus: -1 }],
        traits: [{ name: '斯泰吉亚之遗赠', description: '冷冻射线。3级艾嘉西斯之铠，5级黑暗术。' }],
        spells: [
          { level: 0, spellId: 'ray-of-frost' },
          { level: 3, spellId: 'armor-of-agathys' },
          { level: 5, spellId: 'darkness' }
        ],
        source: 'mtof'
      },
      {
        id: 'mammon',
        name: '玛门血脉',
        description: '',
        abilityBonuses: [],
        traits: [{ name: '弥瑙洛斯之遗赠', description: '法师之手。3级谭森浮碟术，5级秘法锁。' }],
        spells: [
          { level: 0, spellId: 'mage-hand' },
          { level: 3, spellId: 'tenser-floating-disk' },
          { level: 5, spellId: 'arcane-lock' }
        ],
        source: 'mtof'
      },
      {
        id: 'mephistopheles',
        name: '梅菲斯托费勒斯血脉',
        description: '',
        abilityBonuses: [],
        traits: [{ name: '卡尼亚之遗赠', description: '法师之手。3级燃烧之手，5级火焰刀。' }],
        spells: [
          { level: 0, spellId: 'mage-hand' },
          { level: 3, spellId: 'burning-hands' },
          { level: 5, spellId: 'flame-blade' }
        ],
        source: 'mtof'
      },
      {
        id: 'zariel',
        name: '扎瑞尔血脉',
        description: '',
        abilityBonuses: [{ ability: 'STR', bonus: 1 }, { ability: 'INT', bonus: -1 }],
        traits: [{ name: '阿弗纳斯之遗赠', description: '奇术。3级炽炎斩，5级烙印斩。' }],
        spells: [
          { level: 0, spellId: 'thaumaturgy' },
          { level: 3, spellId: 'searing-smite' },
          { level: 5, spellId: 'branding-smite' }
        ],
        source: 'mtof'
      }
    ]
  }
];
