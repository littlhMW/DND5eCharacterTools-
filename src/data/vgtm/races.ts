import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'aasimar',
    name: '阿斯莫',
    description: '由于充盈着天界之力，大部分阿斯莫都是善良的。',
    abilityBonuses: [{ ability: 'CHA', bonus: 2 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '天界语'],
    traits: [
      { name: '黑暗视觉', description: '由于受到光耀之魂的祝福，你的视线可以轻易的穿透黑暗。你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '天界抗性', description: '你具有对黯蚀和光耀伤害的抗性。' },
      { name: '治愈之手', description: '以一个动作，你可以触碰一个生物并让它回复等同于你等级的生命值。一旦你使用这个特性，直到你完成一次长休之前你都不能再使用它。' },
      { name: '光辉掌者', description: '你知晓光亮术戏法。你施展这个法术的施法属性为魅力。' }
    ],
    spells: [{ level: 0, spellId: 'light' }],
    source: 'vgtm',
    subraces: [
      {
        id: 'fallen-aasimar',
        name: '堕落阿斯莫',
        description: '被放逐的阿斯莫。',
        abilityBonuses: [{ ability: 'STR', bonus: 1 }],
        traits: [
          { name: '死灵障幕', description: '3级时可释放神性能量，使身边人恐惧，并造成自身等级额外黯蚀伤害（持续1分钟，每天一次）。' }
        ],
        spells: [],
        source: 'vgtm'
      },
      {
        id: 'protector-aasimar',
        name: '守护者阿斯莫',
        description: '被天界指派的守护者。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '光辉灵魂', description: '3级起长出光翼，30尺飞行速度，并造成自身等级额外光耀伤害（持续1分钟，每天一次）。' }
        ],
        spells: [],
        source: 'vgtm'
      },
      {
        id: 'scourge-aasimar',
        name: '天谴阿斯莫',
        description: '充满摧毁邪恶的神圣能量。',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }],
        traits: [
          { name: '光辉焚化', description: '3级放出光芒散布伤害，并在一次攻击中附加自身等级光耀伤害（持续1分钟，每天一次）。' }
        ],
        spells: [],
        source: 'vgtm'
      }
    ]
  },
  {
    id: 'tabaxi',
    name: '斑猫人',
    description: '像猫一般的类人生物，受好奇心驱使。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'CHA', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '自选一门语言'],
    traits: [
      { name: '猫科迅捷', description: '回合移动时可将速度加倍，直到停止移动一回合后重置。' },
      { name: '猫之利爪', description: '20尺攀爬速度，徒手打击造成1d4+力量的挥砍伤害。' },
      { name: '猫之天赋', description: '熟练于察觉和隐匿技能。' }
    ],
    spells: [],
    skillProficiencies: ['perception', 'stealth'],
    source: 'vgtm'
  },
  {
    id: 'yuan-ti-pureblood',
    name: '纯血蛇人',
    description: '缺乏感情的蛇类。',
    abilityBonuses: [{ ability: 'CHA', bonus: 2 }, { ability: 'INT', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '深渊语', '龙语'],
    traits: [
      { name: '天生施法', description: '知晓毒气喷洒戏法，能对蛇类施放化兽为友。3级可施放暗示术。' },
      { name: '魔法抗性', description: '对抗魔法的豁免具有优势。' },
      { name: '毒素免疫', description: '免疫毒素伤害和中毒。' }
    ],
    spells: [
      { level: 0, spellId: 'poison-spray' },
      { level: 1, spellId: 'animal-friendship' },
      { level: 3, spellId: 'suggestion' }
    ],
    source: 'vgtm'
  },
  {
    id: 'firbolg',
    name: '费尔伯格',
    description: '遵循自然节奏之人，把自己视为自然的照顾者。',
    abilityBonuses: [{ ability: 'WIS', bonus: 2 }, { ability: 'STR', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '精灵语', '巨人语'],
    traits: [
      { name: '费尔伯格魔法', description: '可施放侦测魔法和易容术（可让自己短3尺）。' },
      { name: '神隐步', description: '用附赠动作隐形，直到攻击或施法为止。' },
      { name: '强健体格', description: '负重视作大一级。' },
      { name: '兽与叶之语', description: '可用有限方式与动植物沟通，对它们魅力检定有优势。' }
    ],
    spells: [
      { level: 1, spellId: 'detect-magic' },
      { level: 1, spellId: 'disguise-self' }
    ],
    source: 'vgtm'
  },
  {
    id: 'goliath',
    name: '歌利亚',
    description: '高山之子，崇尚力量与自给自足。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '巨人语'],
    traits: [
      { name: '天生运动员', description: '熟练于运动技能。' },
      { name: '石之耐性', description: '受到伤害时，可用反应该伤害减少1d12+体质调整值。' },
      { name: '强健体格', description: '负重视作大一级。' },
      { name: '高山之子', description: '对冷冻抗性，习惯高海拔。' }
    ],
    spells: [],
    skillProficiencies: ['athletics'],
    source: 'vgtm'
  },
  {
    id: 'kenku',
    name: '天狗',
    description: '被诅咒失去原创声音和飞行能力的鸦类。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '气族语'],
    traits: [
      { name: '专业伪造', description: '拷贝笔迹和手工享有优势。' },
      { name: '天狗训练', description: '熟练于体操、欺瞒、隐匿、巧手中的两个。', choices: [
        {
          id: 'kenku-skills',
          name: '选择两项技能',
          chooseNumber: 2,
          options: [
            { id: 'acrobatics', name: '特技' },
            { id: 'deception', name: '欺瞒' },
            { id: 'stealth', name: '隐匿' },
            { id: 'sleightOfHand', name: '巧手' }
          ]
        }
      ] },
      { name: '拟声', description: '仅能以拟声能力和其他人说话。' }
    ],
    spells: [],
    source: 'vgtm'
  },
  {
    id: 'lizardfolk',
    name: '蜥蜴人',
    description: '冷漠且只受生存本能驱动的爬虫。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '龙语'],
    traits: [
      { name: '游泳速度', description: '拥有30尺游泳速度。' },
      { name: '啃咬', description: '天生武器，1d6+力量穿刺。' },
      { name: '能巧工匠', description: '小休时可用怪物遗骸制作简单武器盾牌。' },
      { name: '屏息', description: '屏息15分钟。' },
      { name: '猎人学识', description: '熟练于二项：驯兽, 自然, 察觉, 隐匿, 生存', choices: [
        {
          id: 'lizardfolk-skills',
          name: '选择两项技能',
          chooseNumber: 2,
          options: [
            { id: 'animalHandling', name: '驯兽' },
            { id: 'nature', name: '自然' },
            { id: 'perception', name: '察觉' },
            { id: 'stealth', name: '隐匿' },
            { id: 'survival', name: '生存' }
          ]
        }
      ] },
      { name: '天生护甲', description: '无甲AC 13+敏捷。' },
      { name: '饥渴之腭', description: '附赠动作啃咬并拿体质等量临时生命。' }
    ],
    spells: [],
    source: 'vgtm'
  }
];
