import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'dwarf',
    name: '矮人',
    description: '古老而庄严的国度，凿入山脉深处的宏伟大厅，回荡于深深矿井和燃烧熔炉中的镐声与锤响，对氏族和传统的绝对忠诚，以及对兽人和地精的深仇大恨──这一切的一切都将所有矮人团结在了一起。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }],
    size: 'Medium',
    speed: 25,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '矮人语'],
    traits: [
      { name: '黑暗视觉', description: '习惯了地底的生活，你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '矮人韧性', description: '你在对抗毒素的豁免检定中具有优势，且你对毒素伤害具有抗性。' },
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
      { name: '岩石熟悉', description: '每当你进行关联于石制品起源的智力（历史）检定时，你被视为熟练于历史技能，并将你二倍的熟练加值代替你原本的熟练加值加入该检定中。' }
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
          { name: '矮人耐性', description: '你的生命值上限增加1点，并且在每次你提升等级时再增加1点。' }
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
    description: '精灵热爱自由、多元和自我表现。他们生活在这个世界上，却并不完全属于它。他们欣赏自然、艺术、音乐、诗歌以及生命中所有美好的事物。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '精灵语'],
    traits: [
      { name: '黑暗视觉', description: '习惯了微光森林与夜空，你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '敏锐感官', description: '你拥有察觉技能的熟练项。' },
      { name: '精类血统', description: '你对魅惑的豁免检定具有优势，并且魔法无法让你陷入沉睡。' },
      { name: '传思', description: '精灵并不需要睡眠。取而代之，他们一天会进行4小时保留潜意识的深度冥想。在冥想时，你勉强算是会作梦；这些梦境实际上是在多年训练下产生的反射性心灵锻炼。在以这种方式休息后，你得到与人类8小时睡眠后相同的益处。' }
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
        description: '作为一名木精灵，你拥有敏锐的感官和直觉，在野外能依靠精巧的伪装和迅速的身手迅速隐蔽起来。',
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
        description: '被放逐到了地表世界之外的幽暗地域深处，卓尔精灵长年处于残酷的环境中，获得了极度细微的感官与黑魔法。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '高级黑暗视觉', description: '习惯了幽暗地域的深处，你在看距离你120尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
          { name: '日光敏感', description: '当你、你的攻击目标或你尝试感知的东西直接暴露在阳光下，则你依赖于视觉的攻击检定以及感知（察觉）检定具有劣势。' },
          { name: '卓尔武器训练', description: '你拥有刺剑、短剑和手弩的熟练项。' },
          { name: '卓尔魔法：舞光术', description: '你知晓舞光术戏法。', level: 0 },
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
    description: '在所有常见的种族中，人类是最年轻但最具多样性的一个种族。他们的野心和极强的适应力使他们在整个多元宇宙站定脚跟，且他们的生活节奏紧凑，通常在极短的寿命中追求卓越。',
    abilityBonuses: [
      { ability: 'STR', bonus: 1 }, { ability: 'DEX', bonus: 1 }, { ability: 'CON', bonus: 1 },
      { ability: 'INT', bonus: 1 }, { ability: 'WIS', bonus: 1 }, { ability: 'CHA', bonus: 1 }
    ],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '自选语言'],
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
        description: '代表了极具天赋发展个性和野心的人类特征。你拥有额外的灵活属性提升、自选一项技能熟练以及一个满足条件的初始专长。',
        abilityBonuses: [], 
        traits: [
          {
            name: '变体属性提升',
            description: '自由选择两项不同的属性增加 1。',
            choices: [
              {
                id: 'human-variant-asi',
                name: '选择属性提升 (自选两项不同属性 +1)',
                chooseNumber: 2,
                dynamic: 'asi'
              }
            ]
          },
          {
            name: '技能熟练',
            description: '你熟练于一项你所选择的技能。',
            choices: [
              {
                id: 'human-variant-skill',
                name: '选择一项技能',
                chooseNumber: 1,
                dynamic: 'skill'
              }
            ]
          },
          {
            name: '专长',
            description: '你获得一个你满足条件的自选专长。',
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
    description: '龙裔行止有着鲜明的巨龙血统痕迹：全身覆盖带有质感的鳞片。他们强壮且高度自给自足，并以此为荣，更将氏族的荣誉摆在生存的首位。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CHA', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '龙语'],
    traits: [
      {
        name: '龙族血统',
        description: '你拥有巨龙的血统。选择一种龙族血统，这会决定你的伤害抗性类型，以及你的喷吐武器的尺寸、形状与豁免属性。',
        choices: [
          {
            id: 'dragonborn-ancestry',
            name: '选择你的龙族血脉',
            chooseNumber: 1,
            options: [
              { id: 'dragon-black', name: '黑龙', description: '强酸，5×30尺线形，敏捷豁免' },
              { id: 'dragon-blue', name: '蓝龙', description: '闪电，5×30尺线形，敏捷豁免' },
              { id: 'dragon-brass', name: '黄铜龙', description: '火焰，5×30尺线形，敏捷豁免' },
              { id: 'dragon-bronze', name: '青铜龙', description: '闪电，5×30尺线形，敏捷豁免' },
              { id: 'dragon-copper', name: '赤铜龙', description: '强酸，5×30尺线形，敏捷豁免' },
              { id: 'dragon-gold', name: '金龙', description: '火焰，15尺锥形，敏捷豁免' },
              { id: 'dragon-green', name: '绿龙', description: '毒素，15尺锥形，体质豁免' },
              { id: 'dragon-red', name: '红龙', description: '火焰，15尺锥形，敏捷豁免' },
              { id: 'dragon-silver', name: '银龙', description: '寒冷，15尺锥形，体质豁免' },
              { id: 'dragon-white', name: '白龙', description: '寒冷，15尺锥形，体质豁免' }
            ]
          }
        ]
      },
      { name: '喷吐武器', description: '你可以使用你的动作呼出毁灭性的能量。你的龙族血统决定了这个吐息的尺寸、形状与伤害类型。处于吐息范围内的生物必须进行拯救检定，失败受到 2d6 伤害，成功则减半。伤害随等级提升：6级3d6，11级4d6，16级5d6。短休或长休后重置。' },
      { name: '伤害抗性', description: '你具有对由你的祖先巨龙血统决定之相应伤害类型的抗性（例如红龙获得火焰抗性）。' }
    ],
    spells: [],
    source: 'phb',
    subraces: [
      {
        id: 'dragonborn-normal',
        name: '龙裔 (本相)',
        description: '标准龙裔，保留最纯正的祖裔传承。',
        abilityBonuses: [],
        traits: [],
        spells: []
      }
    ]
  },
  {
    id: 'half-elf',
    name: '半精灵',
    description: '半精灵分享了来自他们精灵血统的混乱天性。他们游走于两个不同种群的边缘。比起精灵他们拥有人类的适应性，比起人类则保留了优雅、敏锐的感官以及广博长寿的心。',
    abilityBonuses: [
      { ability: 'CHA', bonus: 2 },
      { ability: 'DEX', bonus: 1 },
      { ability: 'CON', bonus: 1 }
    ],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '精灵语', '自选语言'],
    traits: [
      { name: '黑暗视觉', description: '多亏于你的精灵血统，你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '精类血统', description: '你在对抗魅惑的豁免检定中具有优势，且魔法无法让你入睡。' },
      { name: '多才多艺', description: '你熟练于二个你所选择的技能。', choices: [
        {
          id: 'half-elf-skills',
          name: '选择两个技能',
          chooseNumber: 2,
          dynamic: 'skill'
        }
      ] }
    ],
    spells: [],
    source: 'phb',
    subraces: [
      {
        id: 'half-elf-normal',
        name: '半精灵 (本相)',
        description: '标准半精灵，保留了其多才多艺与精妙的精类血统传承。',
        abilityBonuses: [],
        traits: [],
        spells: []
      }
    ]
  },
  {
    id: 'tiefling',
    name: '提夫林',
    description: '提夫林继承了来自深渊或地狱的古老契约血脉。虽然常受世俗偏见对待，但他们拥有坚强不屈的意志和非凡的天生炼狱传承魔法，能在逆境中坚韧生存繁衍。',
    abilityBonuses: [{ ability: 'CHA', bonus: 2 }, { ability: 'INT', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '炼狱语'],
    traits: [
      { name: '黑暗视觉', description: '多亏于你的炼狱血脉，你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '炼狱抗性', description: '你具有对火焰伤害的抗性。' },
      { name: '炼狱传承', description: '你知晓奇术戏法。当你升至3级，你能够以2环法术施放一次炼狱叱喝。当你升至5级，你可以施放一次黑暗术。法术的施法关键属性为魅力。' }
    ],
    spells: [
      { level: 0, spellId: 'thaumaturgy' },
      { level: 3, spellId: 'hellish-rebuke' },
      { level: 5, spellId: 'darkness' }
    ],
    source: 'phb',
    subraces: [
      {
        id: 'tiefling-normal',
        name: '提夫林 (本相)',
        description: '标准提夫林，传承了古老契约带来的炼狱抗性与天生魔法。',
        abilityBonuses: [],
        traits: [],
        spells: []
      }
    ]
  },
  {
    id: 'halfling',
    name: '半身人',
    description: '半身人平和敦厚、乐观善良。他们喜欢舒适的生活，珍视家庭、社群与耕作的快乐，完美避开那些繁杂而虚无的权谋争端。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }],
    size: 'Small',
    speed: 25,
    vision: '普通视觉',
    languages: ['通用语', '半身人语'],
    traits: [
      { name: '幸运', description: '当你在攻击检定、属性检定、或豁免检定中骰出了1，你可以重骰该检定且必须使用新的掷骰结果。' },
      { name: '勇敢', description: '你在对抗恐惧的豁免检定中具有优势。' },
      { name: '半身人灵巧', description: '你可以移动穿过任何体型大于你的生物所在的空间。' }
    ],
    spells: [],
    source: 'phb',
    subraces: [
      {
        id: 'stout',
        name: '强魄半身人',
        description: '比一般半身人更加强壮，不仅擅长抵抗坚韧环境，也比同胞更能包容严寒和毒素，常传闻带有矮人的血统。',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }],
        traits: [
          { name: '强魄韧性', description: '你在对抗毒素的豁免检定中具有优势，且你对毒素伤害具有抗性。' }
        ],
        spells: []
      },
      {
        id: 'lightfoot',
        name: '轻足半身人',
        description: '身手轻盈、欢快机敏。他们可以非常轻易地躲藏在人影或巨大生物的身后。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '天生善匿', description: '即使当你只处于体型至少大你一级的生物所造成的遮蔽后，你也可以尝试进行躲藏。' }
        ],
        spells: []
      }
    ]
  },
  {
    id: 'half-orc',
    name: '半兽人',
    description: '半兽人拥有狂野、激昂的血脉。他们强壮坚毅，在战场上，他们的野性怒火会让最无畏的战士感到颤栗。他们通过惊人的耐力以及暴烈的打击在荒原与险境中捍卫自身的尊严。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '兽人语'],
    traits: [
      { name: '黑暗视觉', description: '多亏于你的兽人血统，你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '凶恶', description: '你拥有威吓技能的熟练项。' },
      { name: '顽强耐性', description: '当你的生命值被归零但没有当场被杀死时，你可以改为使生命值减少至1。直到完成一次长休之前，你都不能再使用这个特性。' },
      { name: '野蛮攻击', description: '当你以一次近战武器攻击造成重击时，你可以额外骰一次该武器的其中一颗伤害骰，并将之加入重击的额外伤害中。' }
    ],
    spells: [],
    skillProficiencies: ['intimidation'],
    source: 'phb',
    subraces: [
      {
        id: 'half-orc-normal',
        name: '半兽人 (本相)',
        description: '标准半兽人，将永不退缩的顽强耐性与暴烈力量融于一身。',
        abilityBonuses: [],
        traits: [],
        spells: []
      }
    ]
  },
  {
    id: 'gnome',
    name: '侏儒',
    description: '侏儒热爱钻研、充满激情。他们对新事物有着无止境的好奇心，大部分都是出色的发明家、工匠、炼金术师或精深的幻术师。因此，他们的语言和记录中充斥着对世界细微和复杂规律的总结。',
    abilityBonuses: [{ ability: 'INT', bonus: 2 }],
    size: 'Small',
    speed: 25,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '侏儒语'],
    traits: [
      { name: '黑暗视觉', description: '习惯了地底的生活，你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '侏儒狡黠', description: '你在所有对抗魔法的智力、感知和魅力豁免中具有优势。' }
    ],
    spells: [],
    source: 'phb',
    subraces: [
      {
        id: 'forest-gnome',
        name: '林侏儒',
        description: '隐居在微光的荒野林间，林侏儒擅长借自然之势编织精致伪装，并精通简单的小巧幻术。',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '天生幻术', description: '你知晓次级幻象戏法。你施展该法术的施法属性为智力。' },
          { name: '小型野兽沟通', description: '透过声音和手势，你可以和体型为小型或更小的野兽交流简单的想法。' }
        ],
        spells: [{ level: 0, spellId: 'minor-illusion' }]
      },
      {
        id: 'rock-gnome',
        name: '岩侏儒',
        description: '擅长机械结构与精密发明。他们通常以顽强的求知欲、出众的手艺和修补小玩具的极高热情着称。',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }],
        traits: [
          { name: '巧匠学识', description: '每当你进行与魔法物品、炼金物体、或科技装置有关的智力（历史）检定时，你可以加入你两倍的熟练加值以取代任何你原有的熟练加值。' },
          { name: '修补匠', description: '你熟练于工匠工具（修理工具）。你可以使用这些工具，花费 1 小时时间以及价值 10 金币的材料创造一个微型的发条装置（如发条动物、打火机或音乐盒）。该装置在 24 小时后停止运作（除非再修理），最高可同时运作三个此类装置。' }
        ],
        spells: []
      }
    ]
  }
];
