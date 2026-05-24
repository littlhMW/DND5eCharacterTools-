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
    source: 'mtf',
    subraces: [
      {
        id: 'githyanki',
        name: '吉斯洋基人',
        description: '吉斯洋基人是崇尚征服、定居星界的银刃军功铁卫。在女王维拉基斯的号召下，他们驾驶飞艇跨过万千位面，掌握毁灭极高的跳跃与心灵跃迁灵能，誓死剿灭世间所有夺心魔。',
        abilityBonuses: [{ ability: 'STR', bonus: 2 }],
        traits: [
          { name: '业余爱好', description: '你学会一门你的自选语言，并且你熟练于一项你自选的技能或工具。', choices: [
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
          { name: '尚武奇才', description: '你熟练于轻甲和中甲，并且熟练于短剑、长剑和巨剑。' },
          { name: '吉斯洋基灵能：法师之手', description: '你知晓法师之手戏法，且当你使用此特性施放这个戏法时，这只手是隐形的。你施展此法术的施法属性为智力。', level: 0 },
          { name: '吉斯洋基灵能：跳跃术', description: '当你升至3级时，你可以使用此特性施放一次跳跃术，且在完成一次长休后才能恢复再次施放的能力。你施展该法术的施法属性为智力，且无需材料构材。', level: 3 },
          { name: '吉斯洋基灵能：迷踪步', description: '当你升至5级时，你可以使用此特性施放一次迷踪步，且在完成一次长休后才能恢复再次施放的能力。你施展该法术的施法属性为智力，且无需材料构材。', level: 5 }
        ],
        spells: [
          { level: 0, spellId: 'mage-hand' },
          { level: 3, spellId: 'jump' },
          { level: 5, spellId: 'misty-step' }
        ],
        armorProficiencies: ['轻甲', '中甲'],
        weaponProficiencies: ['短剑', '长剑', '巨剑'],
        source: 'mtf'
      },
      {
        id: 'githzerai',
        name: '吉斯泽莱人',
        description: '吉斯泽莱人是心智如磐石、追求极致自律与禅意克制的心灵苦修者。他们隐遁于多元宇宙最混乱动荡、物质规则时刻溃灭的混沌之海，凭借钢铁般的精神秩序凝聚出一座座高耸的磐石隐修院，并以此牢固抵御灵吸怪与无尽怪物的疯狂侵袭。吉斯泽莱人坚信真正不受奴役的自由始于内心的绝对澄明；他们不喜冲突但身手矫健，擅长空手格斗，并掌握防御邪恶、筑起“护盾术”与“侦测思想”的本属灵能。当吉斯泽莱人踏足世间时，这些沉静的智者正用永不退缩、无欲无求的澄澈心灵，抚平多元宇宙中的混沌与疯狂。',
        abilityBonuses: [{ ability: 'WIS', bonus: 2 }],
        traits: [
          { name: '心智纪律', description: '你在对抗魅惑和恐惧状态的豁免检定中具有优势。' },
          { name: '吉斯泽莱灵能：法师之手', description: '你知晓法师之手戏法，且当你使用此特性施放这个戏法时，这只手是隐形的。你施展此法术的施法属性为感知。', level: 0 },
          { name: '吉斯泽莱灵能：护盾术', description: '当你升至3级时，你可以使用此特性施放一次护盾术，且在完成一次长休后才能恢复再次施放的能力。你施展该法术的施法属性为感知，且无需材料构材。', level: 3 },
          { name: '吉斯泽莱灵能：侦测思想', description: '当你升至5级时，你可以使用此特性施放一次侦测思想，且在完成一次长休后才能恢复再次施放的能力。你施展该法术的施法属性为感知，且无需材料构材。', level: 5 }
        ],
        spells: [
          { level: 0, spellId: 'mage-hand' },
          { level: 3, spellId: 'shield' },
          { level: 5, spellId: 'detect-thoughts' }
        ],
        source: 'mtf'
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
    source: 'mtf',
    subraces: [
      {
        id: 'duergar',
        name: '灰矮人',
        description: '灰矮人是栖居于无光幽暗地域、怀揣刻骨怨恨的阴郁锻造师。他们不单习得反制毒素和魅惑的钢筋铁骨，更能使用神秘灵能巨大化自身，或在阳光的刺痛中悄然遁入暗影。',
        abilityBonuses: [{ ability: 'STR', bonus: 1 }],
        traits: [
          { name: '高级黑暗视觉', description: '习惯了地底的生活，你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你120尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
          { name: '灰矮人韧性', description: '你在对抗毒素、幻术、以及魅惑和麻痹状态的豁免检定中具有优势，并且你对毒素伤害具有抗性。' },
          { name: '灰矮人魔法：变巨/缩小术', description: '当你升至3级，你每天可以使用此特性对你自己施放一次变巨/缩小术，但只能使用变巨的选项。你不需要为该法术提供材料构材，且不能在暴露于阳光下时施放。施法属性为智力。你在完成一次长休后才能恢复再次使用的能力。', level: 3 },
          { name: '灰矮人魔法：隐形术', description: '当你升至5级，你每天可以使用此特性对你自己施放一次隐形术。你不需要为该法术提供材料构材，且不能在暴露于阳光下时施放。施法属性为智力。你在完成一次长休后才能恢复再次使用的能力。', level: 5 },
          { name: '日光敏感', description: '当你、你的攻击目标、或你尝试感知的东西直接暴露在阳光下，则你依赖于视觉的攻击检定以及感知（察觉）检定具有劣势。' }
        ],
        spells: [
          { level: 3, spellId: 'enlarge-reduce' },
          { level: 5, spellId: 'invisibility' }
        ],
        source: 'mtf'
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
    source: 'mtf',
    subraces: [
      {
        id: 'sea-elf',
        name: '海精灵',
        description: '海精灵是在碧蓝深海与海底珊瑚堡垒中建立文明的灵动精灵。他们拥有与生俱来的强悍游泳天赋，能用三叉戟刺穿潜伏巨兽，并能跨越物种界限、自如同海洋生灵轻松交流。',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }],
        traits: [
          { name: '海精灵武器训练', description: '你熟练于长矛、三叉戟、轻弩和网。' },
          { name: '海洋之子', description: '你具备30尺的游泳速度，并且你可以同时在空气和水中呼吸。' },
          { name: '海洋之友', description: '使用手势和声音，你可以与拥有基础游泳速度的水生野兽交流简单的概念。' }
        ],
        spells: [],
        weaponProficiencies: ['长矛', '三叉戟', '轻弩', '网'],
        source: 'mtf'
      },
      {
        id: 'eladrin-mtf',
        name: '雅灵 (季节)',
        description: '雅灵是将饱满的四季情绪直接转化为狂野魔力的妖精精灵。他们的情感常如气候般急剧跃迁，能随兴释放引发恐惧、魅惑或灼烧情绪的妖精步，是不可多得的万象眷顾者。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '妖精步', description: '以一个附赠动作，你可以魔法性的传送最多30尺距离到一处未被占据的可见空间。一旦你使用此特性，直到你完成一次短休或长休之前都无法再使用它。', level: 0 },
          { name: '妖精步效果提升', description: '当你升至3级，你的妖精步将根据你的季节获得一个额外效果；若该效果需要豁免，则DC等同8+你的熟练加值+你的魅力调整值：【秋】紧接在传送后，最多两个距离你10尺内的可见生物必须进行成功感知豁免，否则被魅惑1分钟（或受伤害结算）。【冬】传送前，距离你5尺内一个可见生物感知豁免失败则对你恐惧至下个回合结束。【春】传送时可触碰一个5尺内自愿生物替代你传送。【夏】紧接在传送后，落点5尺内每个可见生物受到等同你魅力调整值的火焰伤害。', level: 3 }
        ],
        spells: [],
        source: 'mtf'
      },
      {
        id: 'shadar-kai',
        name: '影灵',
        description: '影灵是鸦后侍奉在凋零、苍凉堕影荒野的最坚决卫士。他们饱经黯蚀风暴淬炼，能够化身为幽魂薄雾在阴影间魔法闪烁，以极境的身姿捍卫死亡的永恒秩序。',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }],
        traits: [
          { name: '黯蚀抗性', description: '你具有对黯蚀伤害的抗性。' },
          { name: '鸦后的祝福', description: '以一个附赠动作，你可以魔法性的传送最多30尺距离到一处未被占据的可见空间。一旦你使用此特性，直到你完成一次长休之前都无法再使用它。', level: 0 },
          { name: '鸦后的祝福效果提升', description: '从3级开始，当你使用鸦后的祝福传送时，你也获得对所有伤害的抗性。这个抗性持续到你的下个回合开始。在这段期间，你变得朦胧且半透明。', level: 3 }
        ],
        spells: [],
        source: 'mtf'
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
    source: 'mtf',
    subraces: [
      {
        id: 'deep-gnome-mtf',
        name: '斯奈布力',
        description: '斯奈布力，又称地底侏儒，生活在深邃的幽暗地域中。他们通过巧妙的回避和岩石的伪装颜彩，在充满捕食者的地底求存。生存的关键取决于避免树敌，因此他们偏好中立阵营，很少为了亲近者以外的人冒险。',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '高级黑暗视觉', description: '习惯了地底的生活，你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你120尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
          { name: '侏儒狡黠', description: '你在所有对抗魔法的智力、感知和魅力豁免中具有优势。' },
          { name: '岩地伪装', description: '你在岩石地形为躲藏所进行的敏捷（隐匿）检定中具有优势。' }
        ],
        spells: [],
        source: 'mtf'
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
    source: 'mtf',
    subraces: [
      {
        id: 'baalzebul',
        name: '巴力西卜血脉',
        description: '被赋予了这层地狱血脉的子嗣，其深红血液里流淌着巴力西卜地狱之主的影响力。由于魔网被蝇王力量污染，其后代能从指缝释放具有衰竭极高威胁的致病射线与疯狂冠冕，用阴诡的衰弱印记削弱敢于冒犯之敌。',
        abilityBonuses: [{ ability: 'INT', bonus: 1 }],
        traits: [
          { name: '马拉多米尼之遗赠：奇术', description: '你知晓奇术戏法。你施展此法术的施法属性为魅力。', level: 0 },
          { name: '马拉多米尼之遗赠：致病射线', description: '当你升至3级，你能够以2环法术施放一次致病射线，你必须完成一次长休才能再次使用此特性施放该法术。施法属性为魅力。', level: 3 },
          { name: '马拉多米尼之遗赠：疯狂冠冕', description: '当你升至5级，你可以施放一次疯狂冠冕，你必须完成一次长休才能再次使用此特性施放该法术。施法属性为魅力。', level: 5 }
        ],
        spells: [
          { level: 0, spellId: 'thaumaturgy' },
          { level: 3, spellId: 'ray-of-sickness' },
          { level: 5, spellId: 'crown-of-madness' }
        ],
        source: 'mtf'
      },
      {
        id: 'dispater',
        name: '狄斯帕特血脉',
        description: '这系提夫林子嗣受了铁城之主狄斯帕特那过度警惕与窥探世间的深谋远虑浸染。流淌此血之人不仅敏锐过人，更习得最杰出的谍报诡术，擅用幻象面容掩盖本来面目，并在不经意间窃听旁者心中的碎屑秘密。',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '迪斯之遗赠：奇术', description: '你知晓奇术戏法。你施展此戏法的施法属性为魅力。', level: 0 },
          { name: '迪斯之遗赠：易容术', description: '当你升至3级，你可以施放一次易容术，你必须完成一次长休才能再次使用此特性施放该法术。施法属性为魅力。', level: 3 },
          { name: '迪斯之遗赠：侦测思想', description: '当你升至5级，你可以施放一次侦测思想，你必须完成一次长休才能再次使用此特性施放该法术。施法属性为魅力。', level: 5 }
        ],
        spells: [
          { level: 0, spellId: 'thaumaturgy' },
          { level: 3, spellId: 'disguise-self' },
          { level: 5, spellId: 'detect-thoughts' }
        ],
        source: 'mtf'
      },
      {
        id: 'fierna',
        name: '菲尔娜血脉',
        description: '被第四狱情色领主菲尔娜的炽热交际手段所影响。其血液的传承者天生极富吸引力且善用言辞魅力操弄情绪，口吐带有神圣欺瞒诱惑的交友戏法，能轻描淡写地魅惑、暗示他人走入其预设的陷阱之中。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '福莱格索斯之遗赠：交友术', description: '你知晓交友术戏法。你施展此戏法的施法属性为魅力。', level: 0 },
          { name: '福莱格索斯之遗赠：魅惑人类', description: '当你升至3级，你能够以2环法术施放一次魅惑人类，你必须完成一次长休才能再次施放该法术。施法属性为魅力。', level: 3 },
          { name: '福莱格索斯之遗赠：暗示术', description: '当你升至5级，你可以施放一次暗示术，你必须完成一次长休才能再次使用此特性施放该法术。施法属性为魅力。', level: 5 }
        ],
        spells: [
          { level: 0, spellId: 'friends' },
          { level: 3, spellId: 'charm-person' },
          { level: 5, spellId: 'suggestion' }
        ],
        source: 'mtf'
      },
      {
        id: 'glasya',
        name: '格莱希亚血脉',
        description: '得益于第六狱盗贼女王格莱希亚在阴影中的照拂。他们体内寄宿着无与伦比的窃贼天赋和欺诈戏法底色，行踪如幻，能利用次级幻象蒙蔽视听，并能使用易容术与数刻隐形，于蛛丝马迹中窃取珍藏。',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '马尔伯吉之遗赠：次级幻象', description: '你知晓次级幻象戏法。施法属性为魅力。', level: 0 },
          { name: '马尔伯吉之遗赠：易容术', description: '当你升至3级，你可以施放一次易容术，你必须完成一次长休才能再次使用此特性施放该法术。施法属性为魅力。', level: 3 },
          { name: '马尔伯吉之遗赠：隐形术', description: '当你升至5级，你可以施放一次隐形术，你必须完成一次长休才能再次使用此特性施放该法术。施法属性为魅力。', level: 5 }
        ],
        spells: [
          { level: 0, spellId: 'minor-illusion' },
          { level: 3, spellId: 'disguise-self' },
          { level: 5, spellId: 'invisibility' }
        ],
        source: 'mtf'
      },
      {
        id: 'levistus',
        name: '莱维斯图斯血脉',
        description: '与无底冰川主宰莱维斯图斯的冷冽血液共鸣。此地狱传承不仅保留了恶魔的邪炎抗性，更使得使用者能从掌心凝聚凛冬冰霜施放冰雨，并披上凝聚极寒冰晶的艾嘉西斯之铠，让炽热之敌折戟于无情冰墙之前。',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }],
        traits: [
          { name: '斯泰吉亚之遗赠：冷冻射线', description: '你知晓冷冻射线戏法。施法属性为魅力。', level: 0 },
          { name: '斯泰吉亚之遗赠：艾嘉西斯之铠', description: '当你升至3级，你能够以2环法术施放一次艾嘉西斯之铠，你必须完成一次长休才能再次施放该法术。施法属性为魅力。', level: 3 },
          { name: '斯泰吉亚之遗赠：黑暗术', description: '当你升至5级，你可以施放一次黑暗术，你必须完成一次长休才能再次使用此特性施放该法术。施法属性为魅力。', level: 5 }
        ],
        spells: [
          { level: 0, spellId: 'ray-of-frost' },
          { level: 3, spellId: 'armor-of-agathys' },
          { level: 5, spellId: 'darkness' }
        ],
        source: 'mtf'
      },
      {
        id: 'mammon',
        name: '玛门血脉',
        description: '深受第三狱贪婪死神玛门那种金币诱惑和财富收集贪欲的影响。他们被赋予了无声虚空操物的法师之手，更得其神恩降下谭森浮碟术以运送赃物，以及强效的秘法锁，严密守望着自己荒淫收集的大量财富。',
        abilityBonuses: [{ ability: 'INT', bonus: 1 }],
        traits: [
          { name: '弥瑙洛斯之遗赠：法师之手', description: '你知晓法师之手戏法。施法属性为魅力。', level: 0 },
          { name: '弥瑙洛斯之遗赠：谭森浮碟术', description: '当你升至3级，你可以施放一次谭森浮碟术，你必须完成一次短休或长休才能再次施放（或消耗资源）。施法属性为魅力。', level: 3 },
          { name: '弥瑙洛斯之遗赠：秘法锁', description: '当你升至5级，你可以施放一次秘法锁，无须材料构材，你必须完成一次长休才能再次施放该法术。施法属性为魅力。', level: 5 }
        ],
        spells: [
          { level: 0, spellId: 'mage-hand' },
          { level: 3, spellId: 'tenser-floating-disk' },
          { level: 5, spellId: 'arcane-lock' }
        ],
        source: 'mtf'
      },
      {
        id: 'mephistopheles',
        name: '梅菲斯托费勒斯血脉',
        description: '这支血脉扎根于第八狱奥术大公弗勒斯那狂暴而冷酷的魔能真理之中。梅菲斯托的继承者能轻盈地利用法师之手续指浮尘，更擅使灭世烈火般的燃烧之手与致命的火焰魔法，在指尖舞动出收割生命的原初之火。',
        abilityBonuses: [{ ability: 'INT', bonus: 1 }],
        traits: [
          { name: '卡尼亚之遗赠：法师之手', description: '你知晓法师之手戏法。施法属性为魅力。', level: 0 },
          { name: '卡尼亚之遗赠：燃烧之手', description: '当你升至3级，你能够以2环法术施放一次燃烧之手，你必须完成一次长休才能再次施放该法术。施法属性为魅力。', level: 3 },
          { name: '卡尼亚之遗赠：火焰刀', description: '当你升至5级，你可以施放一次火焰刀，你必须完成一次长休才能再次施放该法术。施法属性为魅力。', level: 5 }
        ],
        spells: [
          { level: 0, spellId: 'mage-hand' },
          { level: 3, spellId: 'burning-hands' },
          { level: 5, spellId: 'flame-blade' }
        ],
        source: 'mtf'
      },
      {
        id: 'zariel',
        name: '扎瑞尔血脉',
        description: '流淌着第一狱堕落大天使扎瑞尔狂烈热血的兵刃传承。这赋予了这些提夫林超越常态的肌肉筋骨，并点燃了名为阿弗纳斯的炽热神威，能使挥舞的刀兵附上纯粹的地狱火焰印记，在肉搏中爆发出极具战勋的大捷摧毁敌人。',
        abilityBonuses: [{ ability: 'STR', bonus: 1 }],
        traits: [
          { name: '阿弗纳斯之遗赠：奇术', description: '你知晓奇术戏法。施展戏法属性为魅力。', level: 0 },
          { name: '阿弗纳斯之遗赠：炽炎斩', description: '当你升至3级，你能够以2环法术施放一次炽炎斩，你必须完成一次长休才能再次使用此特性施放该法术。施法属性为魅力。', level: 3 },
          { name: '阿弗纳斯之遗赠：烙印斩', description: '当你升至5级，你可以施放一次烙印斩，你必须完成一次长休才能再次使用此特性施放该法术。施法属性为魅力。', level: 5 }
        ],
        spells: [
          { level: 0, spellId: 'thaumaturgy' },
          { level: 3, spellId: 'searing-smite' },
          { level: 5, spellId: 'branding-smite' }
        ],
        source: 'mtf'
      }
    ]
  }
];
