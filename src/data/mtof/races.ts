import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'gith',
    name: '吉斯人',
    description: '吉斯人曾饱受夺心魔残酷奴役，最终在一场史诗起义中挣断枷锁，唤醒了体内强横的心灵灵能。此后，起义军因不同理念决裂为洋基人与泽莱人，在星界与混沌海各树旗帜。',
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
        description: '吉斯洋基人是崇尚征服、定居星界的银刃军功铁卫。在女王维拉基斯的号召下，他们驾驶飞艇跨过万千位面，掌握毁灭极高的跳跃与心灵跃迁灵能，誓死剿灭世间所有夺心魔。',
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
        description: '吉斯泽莱人是心智如磐石、追求极致自律与禅意克制的心灵苦修者。他们隐遁于多元宇宙最混乱动荡、物质规则时刻溃灭的混沌之海，凭借钢铁般的精神秩序凝聚出一座座高耸的磐石隐修院，并以此牢固抵御灵吸怪与无尽怪物的疯狂侵袭。吉斯泽莱人坚信真正不受奴役的自由始于内心的绝对澄明；他们不喜冲突但身手矫健，擅长空手格斗，并掌握防御邪恶、筑起“护盾术”与“侦测思想”的本属灵能。当吉斯泽莱人踏足世间时，这些沉静的智者正用永不退缩、无欲无求的澄澈心灵，抚平多元宇宙中的混沌与疯狂。',
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
        description: '灰矮人是栖居于无光幽暗地域、怀揣刻骨怨恨的阴郁锻造师。他们不单习得反制毒素和魅惑的钢筋铁骨，更能使用神秘灵能巨大化自身，或在阳光的刺痛中悄然遁入暗影。',
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
        description: '海精灵是在碧蓝深海与海底珊瑚堡垒中建立文明的灵动精灵。他们拥有与生俱来的强悍游泳天赋，能用三叉戟刺穿潜伏巨兽，并能跨越物种界限、自如同海洋生灵轻松交流。',
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
        description: '雅灵是将饱满的四季情绪直接转化为狂野魔力的妖精精灵。他们的情感常如气候般急剧跃迁，能随兴释放引发恐惧、魅惑或灼烧情绪的妖精步，是不可多得的万象眷顾者。',
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
        description: '影灵是鸦后侍奉在凋零、苍凉堕影荒野的最坚决卫士。他们饱经黯蚀风暴淬炼，能够化身为幽魂薄雾在阴影间魔法闪烁，以极境的身姿捍卫死亡的永恒秩序。',
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
        description: '源于巴力西卜地狱之主的血脉。由于魔网被蝇王力量污染，其后代能从指缝释放具有衰竭极高威胁的致病射线与疯狂冠冕，用阴诡的衰弱印记削弱敢于冒犯之敌。',
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
        description: '自铁城之主狄斯帕特渗透出的警觉血系。流淌此血之人不仅敏捷过人，更习得最杰出的谍报诡术，擅用幻象面容掩盖本来面目，并在不经意间窃听旁者心中的碎屑秘密。',
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
        description: '受惑于第四狱情色领主菲尔娜的炽热血系。他们天生极富吸引力，口吐带有神圣欺瞒诱惑的交友戏法，能轻描淡写地魅惑、暗示人类走入其预设的极乐或绝望深渊。',
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
        description: '得益于第六狱盗贼女王格莱希亚照拂的气息。他们体内寄宿着无与伦比的窃贼天赋，行踪如幻，能利用镜面幻象和长达数刻的完全隐形，于蛛丝马迹中窃取真知。',
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
        description: '受缚于无底冰川的莱维斯图斯的冷冽血脉。此地狱传承不仅御防霜冻，更能从掌心凝聚凛冬冰霜，并降下凝聚冰晶盾甲的艾嘉西斯之铠，让炽热之敌折戟于冰墙。',
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
        description: '深受第三狱贪婪死神玛门金币低语污染的吝啬血系。他们被赋予了无声虚空操物的法师之手，更得其神恩降下谭森浮碟术与秘法锁，严密守望着生命中荒淫收集的财富。',
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
        description: '根源于第八狱奥术大公弗勒斯那狂暴而冷酷的魔能真理。此血脉能轻驭法师之手驾驭浮尘，更擅使灭世烈火般的燃烧之手，在指尖舞动出收割生命的原初火焰刀。',
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
        description: '来自第一狱堕落大天使扎瑞尔的狂烈兵刃热血。这赋予了提夫林无双的筋骨，并点燃了名为阿弗纳斯的炽热神威，能使刀兵附上纯粹火焰，爆发出极具战勋的大捷。',
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
