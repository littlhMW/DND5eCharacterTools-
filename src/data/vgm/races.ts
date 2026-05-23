import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'aasimar',
    name: '阿斯莫',
    description: '阿斯莫是灵魂深处承载着天堂山光辉的天界裔。他们面容超凡、纯洁高贵，并拥有神明指派的天使向导。哪怕流浪于黑暗尘世，他们也誓要挥舞璀璨的炽白双翼捍卫世间公义。',
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
    source: 'vgm',
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
        source: 'vgm'
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
        source: 'vgm'
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
        source: 'vgm'
      }
    ]
  },
  {
    id: 'tabaxi',
    name: '斑猫人',
    description: '斑猫人是身手极度敏捷、步伐轻盈的猫科人。受猫之主的低语感召，他们怀着无法遏制的好奇心游历五湖四海，只为寻觅失落的古代秘宝与奇妙传说，是天生的浪客与学者。',
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
    source: 'vgm'
  },
  {
    id: 'yuan-ti-pureblood',
    name: '纯血蛇人',
    description: '纯血蛇人是融合了邪恶蛇神血脉的冷酷后代。他们最接近人类凡貌，内心极致理智而虚伪。蛇人将感情视为软弱，精于伪装与蛊惑，时刻用致命阴谋在暗影中操弄凡人世界。',
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
    source: 'vgm'
  },
  {
    id: 'firbolg',
    name: '费尔伯格',
    description: '费尔伯格是高大温和的森林隐修士。流淌着原初巨人与精类血脉的他们，能自如施展神隐步及调和秘法。作为森林的守护者，他们离群索居，始终默默维护着自然界的圣洁平衡。',
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
    source: 'vgm'
  },
  {
    id: 'goliath',
    name: '歌利亚',
    description: '歌利亚是锤炼于极寒危峰的高山之子。他们坚毅的身躯宛如风化磐石，具有惊人的神力与抗寒体质。歌利亚社会不解复杂的权谋，唯尊公平竞争、武勇求精和对自然铁律的敬畏。',
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
    source: 'vgm'
  },
  {
    id: 'kenku',
    name: '天狗',
    description: '天狗是背负荒古诅咒的鸦形人。他们失去了双翼、创造力与嗓音，只能以惊人的拟音天赋和抄写伪造之技活在边缘，渴望有朝一日能解开诅咒，重温飞向天空的梦想。',
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
    source: 'vgm'
  },
  {
    id: 'lizardfolk',
    name: '蜥蜴人',
    description: '蜥蜴人是生息在黑暗沼泽的冷血猎手。他们冷漠理智，情感仅围绕生存所迫。但在实用主义支配下，这些身披强甲、生存技能卓绝的猎手也是冒险旅途中最可靠的盾牌。',
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
    source: 'vgm'
  },
  {
    id: 'hobgoblin',
    name: '大地精',
    description: '大地精是纪律严明、体格魁梧的地精类军国主义者。他们视荣誉与严格的兵规为生命基石，整个社会宛如一部战术机器。在失败中哪怕挽回颜面，也能激发起惊人的反扑潜能。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }, { ability: 'INT', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '地精语'],
    traits: [
      { name: '军武训练', description: '你熟练于轻甲以及两件由你选择的军用武器。' },
      { name: '挽回颜面', description: '倘若你未能在一次攻击检定、属性检定或豁免检定中成功，你可以获得等同于你30尺内能看见的盟友数量的加值（最大值为加5）。一旦使用此特性，必须在完成一次短休或长休后方可再次使用。' }
    ],
    spells: [],
    source: 'vgm'
  },
  {
    id: 'goblin',
    name: '地精',
    description: '地精是体型矮小、生存力极强的狡黠族裔。长期处于底层让他们精通敏捷撤逃，极擅在暗影中蛰伏，当面对强敌时，他们能凭借狂野直觉爆发出弱者发怒的恐怖反击。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Small',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '地精语'],
    traits: [
      { name: '弱者发怒', description: '当你使用攻击或法术对一个体型大于你的生物造成伤害时，你可以使其承受额外等同于你角色等级的伤害。每完成一次短休或长休限一次。' },
      { name: '敏捷脱逃', description: '你可以在每个你的回合中使用一个附赠动作来进行撤离或躲藏行动。' }
    ],
    spells: [],
    source: 'vgm'
  },
  {
    id: 'kobold',
    name: '狗头人',
    description: '狗头人是崇拜恶龙、擅长坑道作业的敏捷爬行者。由于身单力薄，他们将群体战术作为绝对的核心智慧，擅以摇尾乞怜麻痹敌人，在一生执着的寻龙岁月中书写着血脉传奇。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'STR', bonus: -2 }],
    size: 'Small',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '龙语'],
    traits: [
      { name: '摇尾乞怜', description: '你使用一个动作在敌人面前通过卑微的哀求来分散其注意力，使得你的盟友在对10尺内看到你的敌人进行的攻击检定中拥有优势。每完成一次短休或长休限一次。' },
      { name: '群体战术', description: '当你攻击一个生物时，如果至少有一个非无力的盟友在目标5尺范围内，你的攻击检定具有优势。' },
      { name: '日光敏感', description: '当你或你的攻击目标暴露在直射阳光下，且你试图进行依仗视觉的察觉检定或攻击检定时，你具有劣势。' }
    ],
    spells: [],
    source: 'vgm'
  },
  {
    id: 'orc',
    name: '兽人',
    description: '兽人是体型巍峨、性情狂野的高大族裔。在战神格乌什极具压迫感的力量印记之下，他们具有极强的侵略性与强健体格。当这些原初勇士摆脱嗜血旧俗后，仍是行伍中最可靠的盾。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }, { ability: 'INT', bonus: -2 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '兽人语'],
    traits: [
      { name: '侵略性', description: '你使用一个附赠动作，可以向一个距离你可见且带有敌意的生物移动最多等同你速度的距离。' },
      { name: '原初直觉', description: '你获得以下技能中的两门熟练项：驯兽、直觉、威吓、医疗、自然、察觉、生存。', choices: [
        {
          id: 'orc-skills',
          name: '选择两项技能',
          chooseNumber: 2,
          options: [
            { id: 'animalHandling', name: '驯兽' },
            { id: 'insight', name: '直觉' },
            { id: 'intimidation', name: '威吓' },
            { id: 'medicine', name: '医疗' },
            { id: 'nature', name: '自然' },
            { id: 'perception', name: '察觉' },
            { id: 'survival', name: '生存' }
          ]
        }
      ] },
      { name: '强健体格', description: '在决定你可搬运和托举的负重限额，以及将你的体型视作比实际大一级（属于大型生物）。' }
    ],
    spells: [],
    source: 'vgm'
  }
];
