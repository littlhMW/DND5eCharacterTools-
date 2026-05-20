import { Race } from '../types/dnd';

export const races: Race[] = [
  {
    id: 'dwarf',
    name: '矮人',
    description: '矮人的王国建藏于大山腹地的深处，他们在那里开采宝石和贵金属，并锻造着那些绝妙的物品。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }],
    size: 'Medium',
    speed: 25,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '矮人语'],
    traits: [
      { name: '矮人抗性', description: '你对毒素的豁免检定具有优势，并且你对毒素伤害具有抗性。' },
      { name: '矮人战斗训练', description: '你熟练于战斧、手斧、轻锤和战锤。' },
      { name: '移动速度', description: '你的移动速度并不会因为穿着重甲而减少。' },
      { name: '工具熟练', description: '你熟练于下列其中一个你所选择的工匠工具：铁匠工具、酿酒工具或泥瓦匠工具。', choices: [
        {
          id: 'dwarf-tool',
          name: '选择一个工具',
          chooseNumber: 1,
          options: [
            { id: 'smithsTools', name: '铁匠工具' },
            { id: 'brewersSupplies', name: '酿酒工具' },
            { id: 'masonsTools', name: '泥瓦匠工具' }
          ]
        }
      ] },
      { name: '石工技巧', description: '进行与岩石构造相关的历史检定时，你视为具有熟练项，且加值翻倍。' }
    ],
    spells: [],
    weaponProficiencies: ['战斧', '手斧', '轻锤', '战锤'],
    source: 'phb',
    subraces: [
      {
        id: 'hill-dwarf',
        name: '丘陵矮人',
        description: '作为一名丘陵矮人，你拥有敏锐的感官、深刻的直觉和非凡的韧性。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '矮人坚韧', description: '你的生命值上限增加1，并且每次你提升等级时，它都会再增加1。' }
        ],
        spells: []
      },
      {
        id: 'mountain-dwarf',
        name: '山地矮人',
        description: '作为一名山地矮人，你身体强壮而结实，习惯了崎岖地形中艰难的生活。',
        abilityBonuses: [{ ability: 'STR', bonus: 2 }],
        traits: [
          { name: '矮人护甲训练', description: '你熟练于轻甲和中甲。' }
        ],
        spells: [],
        armorProficiencies: ['轻甲', '中甲']
      }
    ]
  },
  {
    id: 'elf',
    name: '精灵',
    description: '精灵是一个充满魔力且拥有超凡优雅的种族，他们生活在这个世界上，却并不完全属于它。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '精灵语'],
    traits: [
      { name: '敏锐感官', description: '你拥有察觉技能的熟练项。' },
      { name: '精类血统', description: '你对魅惑的豁免检定具有优势，并且魔法无法让你陷入沉睡。' },
      { name: '传思', description: '精灵不需要睡眠。取代而之每天进行4小时保留潜意识的深度冥想。' }
    ],
    spells: [],
    skillProficiencies: ['perception'],
    source: 'phb',
    subraces: [
      {
        id: 'high-elf',
        name: '高等精灵',
        description: '作为一名高等精灵，你拥有敏锐的头脑，并掌握了至少最基础的魔法。',
        abilityBonuses: [{ ability: 'INT', bonus: 1 }],
        traits: [
          { name: '精灵武器训练', description: '你熟练于长剑、短剑、短弓和长弓。' },
          { name: '额外语言', description: '你可以额外说、读、写一种你选择的语言。' },
          {
  name: '戏法',
  description: '你知晓一个从法师法术列表中自选的戏法。智力是你施展该戏法的施法属性。',
  choices: [
    {
      id: 'high-elf-cantrip',
      name: '选择一个法师戏法',
      chooseNumber: 1,
      dynamic: 'spell',
      spellType: 'cantrip',
      spellList: 'wizard'
    }
  ]
}
        ],
        spells: [{ level: 0, spellId: '自选法师戏法' }],
        weaponProficiencies: ['长剑', '短剑', '短弓', '长弓']
      },
      {
        id: 'wood-elf',
        name: '木精灵',
        description: '作为一名木精灵，你拥有敏锐的感官和直觉。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '精灵武器训练', description: '你熟练于长剑、短剑、短弓和长弓。' },
          { name: '轻捷步伐', description: '你的基础步行速度提升到35尺。' },
          { name: '荒野隐蔽', description: '当你处于树丛、大雨、落雪、雾气或其他自然现象所造成的轻度遮蔽时，你可以尝试进行躲藏。' }
        ],
        spells: [],
        weaponProficiencies: ['长剑', '短剑', '短弓', '长弓']
      },
      {
        id: 'drow',
        name: '卓尔精灵',
        description: '被放逐到了地表世界之外的幽暗地域深处，带有着黑暗的本性。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '高级黑暗视觉', description: '你在看距离你120尺范围内的事物时视为明亮或微光状态。' },
          { name: '日光敏感', description: '暴露在阳光下，则你依赖于视觉的攻击检定以及感知（察觉）检定具有劣势。' },
          { name: '卓尔武器训练', description: '你拥有刺剑、短剑和手弩的熟练项。' },
        { name: '卓尔魔法：舞光术', description: '你知晓舞光术戏法。', level: 0 }, // 实际不需要 level，但可以保留
{ name: '卓尔魔法：妖火术', description: '从3级开始，你可以每日施展一次妖火术。', level: 3 },
{ name: '卓尔魔法：黑暗术', description: '从5级开始，你可以每日施展一次黑暗术，使用魅力作为施法属性。', level: 5 }
        ],
        weaponProficiencies: ['刺剑', '短剑', '手弩'],
        spells: [
          { level: 0, spellId: 'dancing-lights' },
          { level: 3, spellId: 'faerie-fire' },
          { level: 5, spellId: 'darkness' }
        ]
      }
    ]
  },
  {
    id: 'human',
    name: '人类',
    description: '人类是常见的种族中最为年轻的种族，起步得晚，也是寿命最短的族裔。',
    abilityBonuses: [
      { ability: 'STR', bonus: 1 }, { ability: 'DEX', bonus: 1 }, { ability: 'CON', bonus: 1 },
      { ability: 'INT', bonus: 1 }, { ability: 'WIS', bonus: 1 }, { ability: 'CHA', bonus: 1 }
    ],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '自选一门语言'],
    traits: [],
    spells: [],
    source: 'phb',
    subraces: [
      {
        id: 'human-normal',
        name: '人类 (本相)',
        description: '人类的标准本相，在各方面都有均衡的发展。',
        abilityBonuses: [],
        traits: [],
        spells: []
      },
      {
        id: 'human-variant',
        name: '人类 (变体)',
        description: '专长人类变体，拥有灵活的天赋。',
        abilityBonuses: [], 
        traits: [
{
  name: '技能熟练',
  description: '你获得一项你选择的技能的熟练项。',
  choices: [
    {
      id: 'human-variant-skill',
      name: '选择一项技能',
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
  ]
},
{
  name: '专长',
  description: '你获得一个你选择的专长。',
  choices: [
    {
      id: 'human-variant-feat',
      name: '选择一个专长',
      chooseNumber: 1,
      dynamic: 'feat'
    }
  ]
}
        ],
        spells: []
      }
    ]
  },
{
    id: 'dragonborn',
    name: '龙裔',
    description: '龙裔有着巨龙的血统，他们骄傲地展现着类似巨龙的外观。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CHA', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '龙语'],
    traits: [
      { name: '龙族血统', description: '你具有与你龙族血统相应伤害类型的抗性。' },
      { name: '喷吐武器', description: '你可以使用你的动作以呼出毁灭性的能量，其尺寸、形状、以及伤害类型由你的血统决定。' }
    ],
    spells: [],
    source: 'phb',
    subraces: [
      {
        id: 'black',
        name: '黑龙龙裔',
        description: '关联伤害类型：强酸；喷吐武器：5乘30尺线形（敏捷豁免）。',
        abilityBonuses: [],
        traits: [{ name: '强酸抗性', description: '你具有对强酸伤害的抗性。' }],
        spells: []
      },
      {
        id: 'blue',
        name: '蓝龙龙裔',
        description: '关联伤害类型：闪电；喷吐武器：5乘30尺线形（敏捷豁免）。',
        abilityBonuses: [],
        traits: [{ name: '闪电抗性', description: '你具有对闪电伤害的抗性。' }],
        spells: []
      },
      {
        id: 'brass',
        name: '黄铜龙龙裔',
        description: '关联伤害类型：火焰；喷吐武器：5乘30尺线形（敏捷豁免）。',
        abilityBonuses: [],
        traits: [{ name: '火焰抗性', description: '你具有对火焰伤害的抗性。' }],
        spells: []
      },
      {
        id: 'bronze',
        name: '青铜龙龙裔',
        description: '关联伤害类型：闪电；喷吐武器：5乘30尺线形（敏捷豁免）。',
        abilityBonuses: [],
        traits: [{ name: '闪电抗性', description: '你具有对闪电伤害的抗性。' }],
        spells: []
      },
      {
        id: 'copper',
        name: '赤铜龙龙裔',
        description: '关联伤害类型：强酸；喷吐武器：5乘30尺线形（敏捷豁免）。',
        abilityBonuses: [],
        traits: [{ name: '强酸抗性', description: '你具有对强酸伤害的抗性。' }],
        spells: []
      },
      {
        id: 'gold',
        name: '金龙龙裔',
        description: '关联伤害类型：火焰；喷吐武器：15尺锥形（敏捷豁免）。',
        abilityBonuses: [],
        traits: [{ name: '火焰抗性', description: '你具有对火焰伤害的抗性。' }],
        spells: []
      },
      {
        id: 'green',
        name: '绿龙龙裔',
        description: '关联伤害类型：毒素；喷吐武器：15尺锥形（体质豁免）。',
        abilityBonuses: [],
        traits: [{ name: '毒素抗性', description: '你具有对毒素伤害的抗性。' }],
        spells: []
      },
      {
        id: 'red',
        name: '红龙龙裔',
        description: '关联伤害类型：火焰；喷吐武器：15尺锥形（敏捷豁免）。',
        abilityBonuses: [],
        traits: [{ name: '火焰抗性', description: '你具有对火焰伤害的抗性。' }],
        spells: []
      },
      {
        id: 'silver',
        name: '银龙龙裔',
        description: '关联伤害类型：寒冷；喷吐武器：15尺锥形（体质豁免）。',
        abilityBonuses: [],
        traits: [{ name: '寒冷抗性', description: '你具有对寒冷伤害的抗性。' }],
        spells: []
      },
      {
        id: 'white',
        name: '白龙龙裔',
        description: '关联伤害类型：寒冷；喷吐武器：15尺锥形（体质豁免）。',
        abilityBonuses: [],
        traits: [{ name: '寒冷抗性', description: '你具有对寒冷伤害的抗性。' }],
        spells: []
      }
    ]
  },
  {
    id: 'half-elf',
    name: '半精灵',
    description: '半精灵分享了来自他们精灵血统的混乱天性。',
    abilityBonuses: [
      { ability: 'CHA', bonus: 2 },
      { ability: 'DEX', bonus: 1 },
      { ability: 'CON', bonus: 1 }
    ],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '精灵语', '自选一门语言'],
    traits: [
      { name: '精类血统', description: '你在对抗魅惑的豁免检定中具有优势，且魔法无法让你入睡。' },
      { name: '多才多艺', description: '你获得两个自选技能的熟练项。', choices: [
        {
          id: 'half-elf-skills',
          name: '选择两个技能',
          chooseNumber: 2,
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
      ] }
    ],
    spells: [],
    source: 'phb',
    subraces: []
  },
  {
    id: 'tiefling',
    name: '提夫林',
    description: '有着魔鬼的血统，外貌带有些许魔鬼的特质。',
    abilityBonuses: [{ ability: 'CHA', bonus: 2 }, { ability: 'INT', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '炼狱语'],
    traits: [
      { name: '炼狱抗性', description: '你具有对火焰伤害的抗性。' },
      { name: '炼狱传承', description: '你知晓奇术。3级时可施展炼狱斥喝。5级时可施展黑暗术。' }
    ],
    spells: [
      { level: 0, spellId: 'thaumaturgy' },
      { level: 3, spellId: 'hellish-rebuke' },
      { level: 5, spellId: 'darkness' }
    ],
    source: 'phb',
    subraces: []
  },
  {
    id: 'halfling',
    name: '半身人',
    description: '半身人总是希望在平稳的地方生活，喜爱安逸的乡间生活。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }],
    size: 'Small',
    speed: 25,
    vision: '普通视觉',
    languages: ['通用语', '半身人语'],
    traits: [
      { name: '幸运', description: '当你在攻击检定、属性检定、或豁免检定中骰出了1，你可以重骰且必须使用新结果。' },
      { name: '勇敢', description: '你在对抗恐惧的豁免检定中具有优势。' },
      { name: '半身人灵巧', description: '你可以移动穿过任何体型大于你的生物所在的空间。' }
    ],
    spells: [],
    source: 'phb',
    subraces: [
      {
        id: 'stout',
        name: '强魄半身人',
        description: '比一般半身人更加坚韧，有着一丝矮人血统。',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }],
        traits: [
          { name: '强魄韧性', description: '你在对抗毒素的豁免检定中具有优势，且你对毒素伤害具有抗性。' }
        ],
        spells: []
      },
      {
        id: 'lightfoot',
        name: '轻足半身人',
        description: '轻易隐藏自己，非常敏捷。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '天生善匿', description: '即使你只处于体型至少大你一级的生物遮蔽后，也可以尝试隐藏。' }
        ],
        spells: []
      }
    ]
  },
  {
    id: 'half-orc',
    name: '半兽人',
    description: '有着兽人的血统，狂野而强壮。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '兽人语'],
    traits: [
      { name: '凶恶', description: '你熟练于威吓技能。' },
      { name: '顽强耐性', description: '生命值降至0但未当场死亡时，可以改为降至1（每日一次）。' },
      { name: '野蛮攻击', description: '近战武器攻击造成重击时，可额外骰一颗伤害骰计入伤害。' }
    ],
    spells: [],
    skillProficiencies: ['intimidation'],
    source: 'phb',
    subraces: []
  },
  {
    id: 'gnome',
    name: '侏儒',
    description: '侏儒大部分都是活泼、好奇、甚至有些疯狂的发明家或幻术师。',
    abilityBonuses: [{ ability: 'INT', bonus: 2 }],
    size: 'Small',
    speed: 25,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '侏儒语'],
    traits: [
      { name: '侏儒狡黠', description: '你在所有对抗魔法的智力、感知和魅力豁免中具有优势。' }
    ],
    spells: [],
    source: 'phb',
    subraces: [
      {
        id: 'forest-gnome',
        name: '林侏儒',
        description: '擅长幻术和与小动物交谈。',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '自然幻术师', description: '你知晓次级幻象戏法。' },
          { name: '小型野兽沟通', description: '通过声音和手势，你可以和小型或更小的野兽交流简单想法。' }
        ],
        spells: [{ level: 0, spellId: 'minor-illusion' }]
      },
      {
        id: 'rock-gnome',
        name: '岩侏儒',
        description: '岩石侏儒以其出色的工程技术而著名。',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }],
        traits: [
          { name: '巧匠学识', description: '关于炼金术、科技装置等历史检定可使用两倍熟练加值。' },
          { name: '修补匠', description: '你可以消耗材料和1小时创造微型的发条装置。' }
        ],
        spells: []
      }
    ]
  }
];