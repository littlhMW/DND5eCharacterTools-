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
      { name: '黑暗视觉', description: '由于受到光耀之魂的祝福，你的视线可以轻易地穿透黑暗。你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '天界抗性', description: '你具有对黯蚀和光耀伤害的抗性。' },
      { name: '治愈之手', description: '以一个动作，你可以触碰一个生物并让它回复等同于你等级的生命值。一旦你使用这个特性，直到你完成一次长休之前你都不能再使用它。' },
      { name: '光辉掌者', description: '你知晓光亮术戏法。你施展这个法术的施法属性为魅力。', level: 0 }
    ],
    spells: [{ level: 0, spellId: 'light' }],
    source: 'vgm',
    subraces: [
      {
        id: 'fallen-aasimar',
        name: '堕落阿斯莫',
        description: '被放逐的阿斯莫。传承了因某种原因堕落的暗淡天界血脉，内心燃着冰冷仇火。',
        abilityBonuses: [{ ability: 'STR', bonus: 1 }],
        traits: [
          { name: '死灵障幕', description: '从3级开始，你可以使用你的动作以释放你体内的神性能量，这将使你的双眼转变为一团黑暗，并从你的背上长出一对幽灵般，无法飞行的骨翼。在你转变的瞬间，所有距离你10尺内且可以看见你的其他生物必须成功通过一次魅力豁免（DC为8 + 你的熟练加值 + 你的魅力调整值），否则将因你陷入恐惧直到你的下个回合结束。你的转变将会持续1分钟，或直到你以一个附赠动作结束它。在转变期间，在你的每个回合一次，你可以在以一次攻击或法术对一个目标造成伤害时对它造成额外的黯蚀伤害。这个额外的黯蚀伤害等同于你的等级。一旦你使用这个特性，直到你完成一次长休之前你都不能再使用它。', level: 3 }
        ],
        spells: [],
        source: 'vgm'
      },
      {
        id: 'protector-aasimar',
        name: '守护者阿斯莫',
        description: '被天界指派的守护者。顺从天界的指引者，被赋予光华之翼去庇护善良。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '光辉灵魂', description: '从3级开始，你可以使用你的动作以释放你体内的神性能量，这将使你的双眼绽放光芒，并从你的背上长出一对辉煌的无实体羽翼。你的转变将会持续1分钟，或直到你以一个附赠动作结束它。在转变期间，你具有30尺的飞行速度，且在你的每个回合一次，你可以在以一次攻击或法术对一个目标造成伤害时对它造成额外的光耀伤害。这个额外的光耀伤害等同于你的等级。一旦你使用这个特性，直到你完成一次长休之前你都不能再使用它。', level: 3 }
        ],
        spells: [],
        source: 'vgm'
      },
      {
        id: 'scourge-aasimar',
        name: '天谴阿斯莫',
        description: '充满摧毁邪恶的神圣能量。充盈着炽烈圣力并随时将其辐射于尘世的毁灭者。',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }],
        traits: [
          { name: '光辉焚化', description: '从3级开始，你可以使用你的动作以释放你体内的神性能量，这将使灼热的光芒从你身上辐射而出，并从你的双眼和口中涌出，威胁着就你焚烧殆尽。你的转变将会持续1分钟，或直到你以一个附赠动作结束它。在转变期间，你将散发出10尺半径 of 的明亮光照和再延伸10尺的微光光照，且在你的每个回合结束时，你和每个距离你10尺内的生物都将受到等同于你等级一半（向上取整）的光耀伤害。此外，在你的每个回合一次，你可以在以一次攻击或法术对一个目标造成伤害时对它造成额外的光耀伤害。这个额外的光耀伤害等同于你的等级。一旦你使用这个特性，直到你完成一次长休之前你都不能再使用它。', level: 3 }
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
      { name: '黑暗视觉', description: '你拥有猫的敏锐感官，特别是在黑暗中。你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '猫科迅捷', description: '你的反射神经和敏捷性让你能够以爆发性的速度移动。当你在战斗中于你的回合移动时，你可以将你的移动速度变为二倍，持续直到该回合结束。一旦你使用此特性，直到你在你的其中一个回合移动0尺之前，你都不能再使用它。' },
      { name: '猫之利爪', description: '由于你的利爪，你拥有20尺的攀爬速度。此外，你的利爪是一种天生武器，且你可以用它来进行徒手打击。如果你以它们命中目标，则你造成等同1d4 + 你的力量调整值的挥砍伤害，而非一般徒手打击的钝击伤害。' },
      { name: '猫之天赋', description: '你熟练于察觉和隐匿技能。' }
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
      { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '天生施法：毒气喷洒与化兽为友', description: '你知晓毒气喷洒戏法。你能够使用此特性无限次的施放化兽为友，但你只能指定蛇类作为它的目标。你施展这些法术的施法属性为魅力。', level: 0 },
      { name: '天生施法：暗示术', description: '从3级开始，你也可以使用此特性施放暗示术。一旦你施放它，直到你完成一次长休之前你都不能再这么做。你施展该法术的施法属性为魅力。', level: 3 },
      { name: '魔法抗性', description: '你在对抗法术和其他魔法效果的豁免检定中具有优势。' },
      { name: '毒素免疫', description: '你免疫于毒素伤害和中毒状态。' }
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
      { name: '费尔伯格魔法', description: '可以使用此特性施放侦测魔法和易容术，使用感知作为你施放它们的施法属性。一旦你施放其中一个法术，直到你完成一次短休或长休之前你都不能再施放它。当你使用这个版本的易容术时，你可以让自己看起来比原本再矮3尺，使你更容易融入人类和精灵之中。', level: 1 },
      { name: '神隐步', description: '以一个附赠动作，你可以用魔法变得隐形直到你的下个回合开始，或直到你攻击、掷伤害骰，或强迫某人进行一次豁免检定。一旦你使用此特性，直到你完成一次短休或长休之前你都不能再使用它。' },
      { name: '强健体格', description: '当决定你的负重以及你可以拖曳、推动、或提举的重量时，你将你的体型视作比原本大一级。' },
      { name: '兽与叶之语', description: '你拥有与野兽和植物以有限方式进行沟通的能力。它们可以理解你话语的意思，然而你并没有特殊能力以理解它们的回复。你在用于影响它们所进行的所有魅力检定中具有优势。' }
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
      { name: '天生运动员', description: '你熟练于运动技能。' },
      { name: '石之耐性', description: '你可以通过专注自身以忽视重伤。当你受到伤害时，你可以使用你的反应以掷一颗1d12。将你的体质调整值加入骰出的数字，并将该伤害减少其总和的数值。在你使用此特性之后，直到完成一次短休或长休之前你都不能再使用它。' },
      { name: '强健体格', description: '当决定你的负重以及你可以拖曳、推动、或提举的重量时，你将你的体型视作比原本大一级。' },
      { name: '高山之子', description: '你对冷冻伤害有抗性。你还习惯于高海拔的环境，包括海拔高度20,000尺以上的环境，参见《地下城主指南》第五章的叙述。' }
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
      { name: '专业伪造', description: '你可以拷贝其他生物的笔迹和手艺。你在用于伪造文书或拷贝既存物体所进行的所有检定中具有优势。' },
      { name: '天狗训练', description: '你熟练于下列两个你所选择的技能：体操、欺瞒、隐匿以及巧手。', choices: [
        {
          id: 'kenku-skills',
          name: '选择两项技能',
          chooseNumber: 2,
          options: [
            { id: 'acrobatics', name: '体操' },
            { id: 'deception', name: '欺瞒' },
            { id: 'stealth', name: '隐匿' },
            { id: 'sleightOfHand', name: '巧手' }
          ]
        }
      ] },
      { name: '拟声', description: '你可以模仿任何你曾听过的声音，包括人的嗓音。一个听到这类声音的生物可以通过成功通过一次感知（洞悉）检定来对抗你的魅力（欺瞒）检定以辨别出它是被模仿发出的。' }
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
      { name: '游泳速度', description: '你拥有30尺的游泳速度。' },
      { name: '啃咬', description: '你长满獠牙的血盆大口是一种天生武器，且你可以用它来进行徒手打击。如果你以它命中目标，则你造成等同1d6 + 你的力量调整值的穿刺伤害，而非一般徒手打击的钝击伤害。' },
      { name: '能巧工匠', description: '作为短休的一部分，你可以利用从被杀死的小型或更大的野兽、构装体、龙、怪兽，或植物身上采集下来的骨头和兽皮制作下列其中一个物品：一面盾牌、一根棍棒、一把标枪或1d4个飞镖或吹箭。若要使用这个特性，你将需要一把刀刃，例如一把匕首或是其他适合的工匠工具，例如皮匠工具。' },
      { name: '屏息', description: '你可以屏住你的呼吸长达15分钟。' },
      { name: '猎人学识', description: '你熟练于下列二种你所选择的技能：驯兽、自然、察觉、隐匿和生存。', choices: [
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
      { name: '天生护甲', description: '你拥有坚硬、带鳞的皮肤。当你未穿戴护甲时，你的AC为13 + 你的敏捷调整值。如果你穿着的护甲会让你有较低的AC，则你可以使用你的天生护甲来计算你的AC。当你使用天生护甲时，盾牌的加值仍会如常作用。' },
      { name: '饥渴之腭', description: '在战斗中，你可以让你自己陷入一种凶猛的暴食狂热。以一个附赠动作，你可以使用你的啃咬进行一次特殊攻击。若该攻击命中，则它将造成它原本的伤害，且你获得等同于你体质调整值（最低为1）的临时生命值，且直到你完成一次短休或长休之前你都不能再使用此特性。' }
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
      { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '军事训练', description: '你熟练于二种你所选择的军用武器和轻甲。' },
      { name: '挽回颜面', description: '由于惧怕失去地位，你极为谨慎于不在盟友面前暴露软弱。若你在一次攻击检定中失手，或在一次属性检定或豁免检定中失败，你可以让该检定获得等同于距离你30尺内可见盟友数量的加值（最大加值+5）。一旦你使用此特性，直到你完成一次短休或长休之前你都不能再使用它。' }
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
      { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '小个子怒火', description: '当你以一次攻击或法术伤害了一个体型比你大的生物时，你可以让该攻击或法术对该生物造成额外的伤害。这个额外伤害等同于你的等级。一旦你使用此特性，直到你完成一次短休或长休之前都不能再使用它。' },
      { name: '灵敏脱逃', description: '你可以在每次你的回合以一个附赠动作来采取撤离或躲藏动作。' }
    ],
    spells: [],
    source: 'vgm'
  },
  {
    id: 'kobold',
    name: '狗头人',
    description: '狗头人是崇拜恶龙、擅长坑道作业的敏捷爬行者。由于身单力薄，他们将群体战术作为绝对的核心智慧，擅以摇尾乞怜麻痹敌人，在一生执着的寻龙岁月中书写着血脉传奇。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }],
    size: 'Small',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '龙语'],
    traits: [
      { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '摇尾乞怜', description: '在你的回合以一个动作，你可以可怜兮兮地蜷缩以分散附近敌人的注意。直到你下个回合结束前，你的盟友在对距离你10尺内且你能看见的敌人所进行的攻击检定中具有优势。一旦你使用这个特性，直到你完成一次短休或长休之前你都无法再使用它。' },
      { name: '群体战术', description: '若你有至少一个盟友距离目标生物5尺内且该盟友并未无力，则你在对该生物进行的攻击检定中具有优势。' },
      { name: '日光敏感', description: '当你、你的攻击目标、或你尝试感知的东西直接暴露在阳光下，则你依赖于视觉的攻击检定以及感知（察觉）检定具有劣势。' }
    ],
    spells: [],
    source: 'vgm'
  },
  {
    id: 'orc',
    name: '兽人',
    description: '兽人是体型巍峨、性情狂野的高大族裔。在战神格乌什极具压迫感的力量印记之下，他们具有极强的侵略性与强健体格。当这些原初勇士摆脱嗜血旧俗后，仍是行伍中最可靠的盾。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '兽人语'],
    traits: [
      { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '侵略性', description: '以一个附赠动作，你可以向一个你所能看见或听见的声音敌意生物移动最多等同你移动速度的距离。你必须在比你开始移动时距离该敌人更近的位置结束此移动。' },
      { name: '凶恶', description: '你熟练于威吓技能。' },
      { name: '强健体格', description: '当决定你的负重以及你可以拖曳、推动、或提举的重量时，你将你的体型视作比原本大一级。' }
    ],
    spells: [],
    skillProficiencies: ['intimidation'],
    source: 'vgm'
  },
  {
    id: 'triton',
    name: '梭螺鱼人',
    description: '梭螺鱼人是尊贵自豪的深海守护者。他们为剿灭深渊邪物而建立起水下堡垒。虽因长期与陆地隔绝而显得有些傲慢，但其内心极富正义感、勇武无畏，是天生的海洋斗士。',
    abilityBonuses: [{ ability: 'STR', bonus: 1 }, { ability: 'CON', bonus: 1 }, { ability: 'CHA', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '原初语'],
    traits: [
      { name: '游泳速度', description: '你拥有30尺的游泳速度。' },
      { name: '两栖', description: '你可以在空气和水中呼吸。' },
      { name: '控风操水：云雾术', description: '你可以使用此特性施放云雾术。一旦你施放该法术，则直到你完成一次长休之前你都不能再用此特性施放它。你施展该法术的施法属性为魅力。', level: 1 },
      { name: '控风操水：造风术', description: '从3级开始，你可以使用此特性施放造风术。一旦你施放该法术，则直到你完成一次长休之前你都不能再用此特性施放它。你施展该法术的施法属性为魅力。', level: 3 },
      { name: '控风操水：水墙术', description: '从5级开始，你可以使用此特性施放水墙术。一旦你施放该法术，则直到你完成一次长休之前你都不能再用此特性施放它。你施展该法术的施法属性为魅力。', level: 5 },
      { name: '海之使者', description: '水生野兽与你的族人之间有着非凡的亲和力。你可以与能在水中呼吸的野兽进行简单概念的沟通。它们可以理解你话语的意思，然而你并没有特殊能力以理解它们的回复。' },
      { name: '深海守护者', description: '适应了最极端的深海环境，你具有对冷冻伤害的抗性，且你忽视任何因深水环境所造成的负面影响。' }
    ],
    spells: [
      { level: 1, spellId: 'fog-cloud' },
      { level: 3, spellId: 'gust-of-wind' },
      { level: 5, spellId: 'wall-of-water' }
    ],
    source: 'vgm'
  },
  {
    id: 'bugbear',
    name: '熊地精',
    description: '熊地精是地精类生物中体魄最为巨硕、性情极度贪婪的伏击猎手。他们长肢如猿，悄无声息行动如幽灵，能在首轮袭击中爆发出致命重创，是潜伏在荒林深处的恐怖突袭者。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'DEX', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '地精语'],
    traits: [
      { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '长肢', description: '当你在你的回合进行一次近战攻击时，你的触及范围对该攻击而言视作比原本长5尺。' },
      { name: '强健体格', description: '当决定你的负重以及你可以拖曳、推动、或提举的重量时，你将你的体型视作比原本大一级。' },
      { name: '鬼祟', description: '你熟练于隐匿技能。' },
      { name: '突袭攻击', description: '若你突袭一个生物并在你战斗中的第一个回合以一次攻击命中它，则该攻击将对它造成额外的2d6伤害。你每场战斗只能使用此特性一次。' }
    ],
    spells: [],
    skillProficiencies: ['stealth'],
    source: 'vgm'
  }
];
