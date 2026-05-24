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
        description: '警戒龙纹矮人携带防御与封锁之龙纹。他们精于破解盗贼工具，能施展警报与神圣护甲等护卫秘术，是世间各大家族金库与圣所最值得信赖的终极铁卫。',
        abilityBonuses: [{ ability: 'INT', bonus: 1 }],
        traits: [
          { name: '守卫直觉', description: '进行调查或盗贼工具检定时可以加上1d4。' },
          { name: '保护与封锁：警报术与法师护甲', description: '能够施展警报术和法师护甲，在长休后恢复使用次数。', level: 1 },
          { name: '保护与封锁：秘法锁', description: '从3级起，还能施展一次秘法锁，在长休后恢复使用次数。', level: 3 }
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
        description: '暴风龙纹半精灵携带有控制气候与蔚蓝风暴力量的龙纹。他们抗性卓越，在波涛汹涌的海轮或空艇中能凭借超凡直觉驾驭风向，是用狂风神术御行万里的风雨之子。',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '驭风者直觉', description: '当你进行体操检定或使用领航工具时附加 1d4。' },
          { name: '暴风之祝福', description: '你对闪电伤害有抗性。' },
          { name: '逆风行事：起风术', description: '你能够施展起风术（gust）戏法。', level: 0 },
          { name: '逆风行事：造风术', description: '从3级可施展造风术，在长休后恢复使用次数。', level: 3 }
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
        description: '侦测龙纹半精灵携带有看破迷雾与勘破隐秘力量的龙纹。他们天生具有敏锐的推理直觉，能一眼识破藏匿于暗影中的魔能，是帝国中最杰出的密探与调查大师。',
        abilityBonuses: [{ ability: 'WIS', bonus: 2 }],
        traits: [
          { name: '推理直觉', description: '当你进行调查或洞悉检定可加 1d4。' },
          { name: '魔法侦测：侦测法术', description: '能够施展一次侦测魔法和一次侦测毒素或疾病，在长休后恢复。', level: 1 },
          { name: '魔法侦测：识破隐形', description: '从3级起可施展一次识破隐形，在长休后恢复。', level: 3 }
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
        description: '医疗龙纹半身人携带治愈诸痛与抚平创伤之神秘龙纹。微小的身躯孕育着不凡的草药感知，他们能轻易引导神圣能量使骨肉重生，是苦难旅者心中最温暖的医疗之光。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '医疗直觉', description: '进行医疗技能或草药工具检定时加 1d4。' },
          { name: '医疗之触：治疗伤势', description: '能够施展一次治疗伤势，在长休后恢复。', level: 1 },
          { name: '医疗之触：次级复原术', description: '从第3级起还能施展一次次级复原术，在长休后恢复。', level: 3 }
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
        description: '招待龙纹半身人携带操控食物、引燃炉火与提供隐秘庇护所的招待龙纹。他们生性热诚、手艺卓越，能将简陋酒肆点缀得如家般温馨，是最伟大的酒家与团队润滑剂。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '永远热情好客', description: '进行说服、酿酒工具或厨师工具检定时加 1d4。' },
          { name: '旅店老板的魔法', description: '能够施展魔法技俩戏法，也能施展净化饮食和隐形仆役法术。', level: 1 }
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
        description: '探索龙纹半兽人携带能洞察猎物踪迹、辨明世间方位的追踪之龙纹。他们继承了荒野之子的直觉感知，擅使猎人印记追踪百里，是寻龙点穴、追索逃犯的最强猎犬。',
        abilityBonuses: [{ ability: 'WIS', bonus: 2 }, { ability: 'CON', bonus: 1 }],
        traits: [
          { name: '猎人直觉', description: '进行察觉或生存检定时加 1d4。' },
          { name: '寻者魔法：猎人印记', description: '可施展一次猎人印记，长休后恢复。', level: 1 },
          { name: '寻者魔法：物品定位术', description: '从3级起可施展一次物品定位术，长休后恢复。', level: 3 }
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
        description: '阴影龙纹精灵携带编织幻象、隐匿在星月暗影中的古老龙纹。他们是精妙的幻术师与潜行者，擅长在众目睽睽下隐去身形，用完美的伪装在帷幕后操弄历史的车轮。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '狡诈直觉', description: '进行表演或隐匿检定时加 1d4。' },
          { name: '阴影塑形：次级幻象', description: '能施展次级幻象戏法。', level: 0 },
          { name: '阴影塑形：隐形术', description: '从3级起能施展一次隐形术，长休后恢复。', level: 3 }
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
        description: '畜牧龙纹人类拥有与野生野兽和巨型魔法生物进行心灵链接的特异龙纹。他们极易赢得生灵信任，可轻易驯化智力低下怪兽，是荒野畜牧和自然生态的坚固桥梁。',
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
        description: '创造龙纹人类携带有操控万物结构、点石成金的制造之龙纹。他们是天生的工匠大师与附魔学者，能单手附魔兵刃，用修复术维持精密机关，是工业帝国的魔能枢纽。',
        abilityBonuses: [{ ability: 'INT', bonus: 2 }],
        traits: [
          { name: '工匠直觉', description: '进行奥秘或工匠工具检定时加 1d4。' },
          { name: '匠师天赋', description: '选择一种工匠工具，获得其熟练。' },
          { name: '魔力制造：修复术', description: '习得修复术戏法。', level: 0 },
          { name: '魔力制造：魔化武器', description: '从3级起可施展一次魔化武器（持续1小时且无需专注），长休后恢复。', level: 3 }
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
        description: '守护龙纹人类攜带着坚不可摧之叹息之墙的守卫龙纹。他们直觉感官极其锐利，关键时刻能挺身而出、替换替友承受重创，是用肉躯与护盾捍卫誓言的钢铁人墙。',
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
        description: '通行龙纹人类携带着能操纵空间折叠、运动无阻的移动之龙纹。他们移速如飞，能于战场上踏碎虚空，自如施展迷踪步，是冲锋陷阵、纵横无阻的战地信使。',
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
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-scribing',
        name: '抄录龙纹',
        description: '带有抄录龙纹的侏儒天生就具有沟通和写作的天赋。他们利用这些天赋来促成交流、记录历史以及破译密码。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '天才抄写员', description: '当你进行智力（历史）检定或使用书法工具进行属性检定时，你能掷一个1d4，并把结果加到属性检定的结果上。' },
          { name: '抄写员的领悟：传讯术', description: '你习得传讯术戏法。', level: 0 },
          { name: '抄写员的领悟：通晓语言', description: '你能够施展一次通晓语言。在一场短休或长休后恢复。', level: 1 },
          { name: '抄写员的领悟：魔嘴术', description: '3级起你可以施展一次魔嘴术。在一场长休后恢复。', level: 3 },
          { name: '龙纹法术', description: '如果你拥有施法或契约魔法职业能力，抄录龙纹表中的法术将加入你施法职业的法术列表中。' }
        ],
        spells: [
          { level: 0, spellId: 'message' },
          { level: 1, spellId: 'comprehend-languages' },
          { level: 3, spellId: 'magic-mouth' }
        ],
        source: 'erlw'
      }
    ]
  },
  {
    id: 'bugbear',
    name: '熊地精',
    description: '熊地精是地精类生物中体魄最为巨硕、性情极度贪婪的伏击猎手。他们长肢如猿，悄无声息行动如幽灵，能在首轮袭击中爆发出致命重创，是潜伏在荒林深处的恐怖突袭者。',
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
  },
  {
    id: 'changeling',
    name: '幻身灵',
    description: '幻身灵们通过不断变换的样貌，得以在各个社会中居住而不被察觉。每个幻身灵都可以超自然地变为他们想要的任意样貌。对于一些幻身灵来说，一个新的样貌只是一种伪装；对其他幻身灵来说，一种新的样貌或许能揭示他们灵魂的另一个方面。',
    abilityBonuses: [{ ability: 'CHA', bonus: 2 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '两门自选语言'],
    traits: [
      {
        name: '属性提升',
        description: '你的魅力增加 2，并选择其他一项属性增加 1。',
        choices: [
          {
            id: 'changeling-asi',
            name: '选择一项其他属性提升 1 点 (除魅力)',
            chooseNumber: 1,
            options: [
              { id: 'asi-STR', name: '力量 +1' },
              { id: 'asi-DEX', name: '敏捷 +1' },
              { id: 'asi-CON', name: '体质 +1' },
              { id: 'asi-INT', name: '智力 +1' },
              { id: 'asi-WIS', name: '感知 +1' }
            ]
          }
        ]
      },
      {
        name: '幻身灵本能',
        description: '你从以下技能中选择两个获得熟练项：欺瞒、洞悉、威吓和说服。',
        choices: [
          {
            id: 'changeling-instincts',
            name: '选择两项技能',
            chooseNumber: 2,
            options: [
              { id: 'deception', name: '欺瞒' },
              { id: 'insight', name: '洞悉' },
              { id: 'intimidation', name: '威吓' },
              { id: 'persuasion', name: '说服' }
            ]
          }
        ]
      },
      {
        name: '变形生物',
        description: '以一个动作，你可以改变你的外貌和声音。你可以决定这些改变的细节，包括肤色、毛发长度和性别。你也可以调整自己的身高和体重，但不能改变自己的体型。你能使自己表现得像其他种族的一员，但这不会改变你的任何游戏数据。你不能表现成你从未见过的生物的外貌，并且你必须采用与你目前形态相同的基本肢体构造。你的衣物和装备也不会因为该特性而改变。你将保持该新形态，直到你使用一个动作变回原本的形态，或者直到你死亡。'
      },
      {
        name: '额外语言',
        description: '你可以说、读、写通用语和额外的两门自选语言。'
      }
    ],
    spells: [],
    source: 'erlw'
  },
  {
    id: 'kalashtar',
    name: '半梦灵',
    description: '半梦灵是由人类与来自梦境位面的灵能实体结合而成的独特种族。他们拥有强大的心灵力量，在梦中与先祖的灵体相连。多数半梦灵兼具强大的自律与对所有生灵的慈悲之心。',
    abilityBonuses: [{ ability: 'WIS', bonus: 2 }, { ability: 'CHA', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '库里语', '一门自选语言'],
    traits: [
      { name: '双魂心智', description: '你在所有的感知豁免检定中具有优势。' },
      { name: '精神自律', description: '你对心灵伤害具有抗性。' },
      {
        name: '心灵链接',
        description: '你可以与你视线内并且距离不超过你等级乘以 10 尺的任意生物进行心灵交流。该生物能理解你的话语，即便你们没有共同的语言，但它必须至少能理解一门语言。当你使用此特质与某生物心灵交流时，你可以使用一个动作，赋予该生物与你双向心灵交流的能力。此效果持续 1 小时，或者直到你使用动作结束该效果为止。该生物必须在你视野内并且处于特质范围内才能被赋予此能力。一次只能给一个生物这项能力；赋予给其他生物会取消当前生物所获得的此能力。'
      },
      { name: '断梦者', description: '半梦灵同样需要睡眠，但他们并不像其他生物那样连接到梦境位面。相反，他们在睡眠时是通过心智汲取异界灵体的记忆。因此，你免疫要求你做梦的法术和魔法效果（例如托梦术），但那些直接使你陷入睡眠的法术和魔法效果（如睡眠术）依然对你有效。' },
      {
        name: '额外语言',
        description: '你可以说、读、写通用语、库里语和另外一门自选语言。'
      }
    ],
    spells: [],
    source: 'erlw'
  },
  {
    id: 'shifter',
    name: '变形者',
    description: '变形者有时被称为兽化裔，许多人相信他们是人类和兽化人的后裔。他们拥有类人的形态和野兽的面貌，虽然无法完全变身，但可以暂时强化自己的野兽特质，这种状态被称为“变形”。每个变形者都在荒野与文明世界之间的刀刃上行走。',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语'],
    traits: [
      { name: '黑暗视觉', description: '你在黑暗和微光环境下拥有卓越视觉。你在看距离你 60 尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，只能看到灰黑的轮廓。' },
      {
        name: '变形',
        description: '以一个附赠动作，你可以呈现出更具野性的外貌。此转变持续 1 分钟、直到你死亡、或直到你以一个附赠动作恢复正常外貌。当你变形时，你获得等于你的等级加上你的体质调整值（至少为 1）的临时生命值。同时你还会获得由你的变形者亚种决定的额外增益。一旦你使用了此特性，直到你完成一次短休或长休之前都无法再次使用。'
      }
    ],
    spells: [],
    source: 'erlw',
    subraces: [
      {
        id: 'beasthide',
        name: '兽皮变形者',
        description: '兽皮者常常流露出熊或森林野猪的特质：坚忍、执拗、皮糙肉厚。',
        abilityBonuses: [{ ability: 'CON', bonus: 2 }, { ability: 'STR', bonus: 1 }],
        traits: [
          { name: '天生运动员', description: '你拥有运动技能的熟练项。' },
          { name: '变形强化', description: '每当你变形时，你额外获得 1d6 点临时生命值。在变形状态下，你的护甲等级获得 +1 加值。' }
        ],
        spells: [],
        skillProficiencies: ['athletics']
      },
      {
        id: 'longtooth',
        name: '长牙变形者',
        description: '长牙变形者多拥有狼类的特征，对族群同伴极其忠诚。',
        abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '凶猛', description: '你拥有威吓技能的熟练项。' },
          { name: '变形强化', description: '在变形状态下，你可以使用一个附赠动作利用你伸长的尖牙进行一次徒手打击。如果你命中，你能造成等同于 1d6 + 你的力量调整值大小的穿刺伤害，而非普通徒手打击的钝击伤害。' }
        ],
        spells: [],
        skillProficiencies: ['intimidation']
      },
      {
        id: 'swiftstride',
        name: '迅足变形者',
        description: '迅足变形者身上多带有猫科食肉兽的猎食潜能，或者是能穿梭于暗影中的狡猾鼠类。',
        abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '优雅', description: '你拥有体操技能的熟练项。' },
          { name: '变形强化', description: '在变形状态下，你的步行速度增加 10 尺。此外，当有生物在你 5 尺范围内结束它的回合时，你可以使用反应移动最多 10 尺。此反应移动不会引发借机攻击。' }
        ],
        spells: [],
        skillProficiencies: ['acrobatics']
      },
      {
        id: 'wildhunt',
        name: '野猎变形者',
        description: '野猎者可能是任何追踪猎杀生物的后裔。他们对自然的任何动静了如指掌。',
        abilityBonuses: [{ ability: 'WIS', bonus: 2 }, { ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '天生追踪者', description: '你拥有生存技能的熟练项。' },
          { name: '变形强化', description: '在变形状态下，你在所有感知检定上具有优势，并且距离你 30 尺内的任何生物无法以优势对你进行攻击检定，除非你处于无力状态。' }
        ],
        spells: [],
        skillProficiencies: ['survival']
      }
    ]
  },
  {
    id: 'warforged',
    name: '机关人',
    description: '机关人是专为“终末战争”战斗所需而制造的类人构造体。他们由活化纤维、精钢等有机和无机物混合制成，能够感受情感和痛楚。生来为武器的他们，如今必须去寻找战争之外的目标和意义。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '一门自选语言'],
    traits: [
      {
        name: '属性提升',
        description: '你的体质增加 2，并选择其他一项属性增加 1。',
        choices: [
          {
            id: 'warforged-asi',
            name: '选择一项其他属性提升 1 点 (除体质)',
            chooseNumber: 1,
            options: [
              { id: 'asi-STR', name: '力量 +1' },
              { id: 'asi-DEX', name: '敏捷 +1' },
              { id: 'asi-INT', name: '智力 +1' },
              { id: 'asi-WIS', name: '感知 +1' },
              { id: 'asi-CHA', name: '魅力 +1' }
            ]
          }
        ]
      },
      { name: '免疫衰老', description: '你免疫一切魔法造成的衰老效果。机关人的最大寿命仍然是个谜，他们不会因衰老而出现任何退化迹象。' },
      { name: '构装韧性', description: '你被创造出来时就被赋予了非凡的韧性：你在避免陷入中毒状态的豁免检定中具有优势，且对毒素伤害具有抗性。你不需要进食、饮水或呼吸。你免疫疾病。你不需要睡眠，且魔法无法让你陷入沉睡。' },
      { name: '哨兵休眠', description: '当你进行长休时，你必须至少花费 6 小时保持在不活跃的静止状态来代替睡眠。你在这期间看起来像彻底死寂瘫痪，但这并不会让你陷入昏迷，你能像平常一样运用你的视觉和听觉。' },
      { name: '复合护甲', description: '你身体内置有防护层，你的护甲等级获得 +1 加值。你只能穿戴自己已获得熟练的护甲；要将盾牌以外的可用护甲穿上，你必须花费 1 小时将其与你的身体结合；脱下也同样需要 1 小时。这穿脱的 1 小时计算入休息时间内。只要你还活着，结合在你身上的护甲就不能违背你的意愿被取下。' },
      {
        name: '特殊设计',
        description: '你获得一项自选的技能熟练和一项自选的工具熟练。',
        choices: [
          {
            id: 'warforged-skill',
            name: '选择一项技能',
            chooseNumber: 1,
            dynamic: 'skill'
          },
          {
            id: 'warforged-tool',
            name: '选择一项工具',
            chooseNumber: 1,
            dynamic: 'tool'
          }
        ]
      },
      {
        name: '额外语言',
        description: '你可以说、读、写通用语和另一门自选语言。'
      }
    ],
    spells: [],
    source: 'erlw'
  }
];
