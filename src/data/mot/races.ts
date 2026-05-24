import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'centaur',
    name: '半人马',
    description: '半人马是融合了高贵人类与矫健骏马的塞洛斯原住民。拉苟那部族行商塞洛斯全境并记录历史，斐力兹部族则在风暴原野中肆意奔驰。他们天性崇尚自由，用一生的疾驰和骄傲丈量着这片神圣的土地。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
    size: 'Medium',
    speed: 40,
    vision: '普通视觉',
    languages: ['通用语', '木族语'],
    traits: [
      { name: '精类', description: '你的生物类型是精类生物，而非类人生物。' },
      { name: '冲锋', description: '若你朝着目标直线移动至少30尺并接着以近战武器在同一回合命中它，你可以立刻在该攻击后以一个附赠动作，使用你的马蹄对目标进行一次攻击。' },
      { name: '马蹄', description: '你的马蹄是天生近战武器，可以使用它们来进行徒手打击。如果你以它们命中目标，则造成等同 1d4 + 你的力量调整值的钝击伤害，而不是一般徒手打击的钝击伤害。' },
      { name: '马之身躯', description: '当决定你的负重以及你可以拖曳或推动的重量时，你将你的体型视作比原本大一级。此外，由于你的短粗蹄腿，垂直攀爬对你来说特别困难：进行攀爬时，每移动1尺都会额外消耗你4尺的移动速度，而非原本的额外1尺移动速度。' },
      { name: '生存者', description: '你熟练于以下其中一个你所选择的技能：驯兽、医疗、自然或生存。', choices: [
        {
          id: 'centaur-skill',
          name: '选择一项技能',
          chooseNumber: 1,
          options: [
            { id: 'animalHandling', name: '驯兽' },
            { id: 'medicine', name: '医疗' },
            { id: 'nature', name: '自然' },
            { id: 'survival', name: '生存' }
          ]
        }
      ] }
    ],
    spells: [],
    source: 'mot'
  },
  {
    id: 'leonin',
    name: '狮族',
    description: '狮族是威严的战士，源自塞洛斯世界。他们以骄傲为荣，崇尚荣誉和力量，对族群有着强烈的忠诚，是天生的猎手和保护者。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }, { ability: 'STR', bonus: 1 }],
    size: 'Medium',
    speed: 35,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '狮族语'],
    traits: [
      { name: '黑暗视觉', description: '你在黑暗和微光环境下拥有卓越视觉。你在看距离你 60 尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，只能看到灰黑的轮廓。' },
      { name: '利爪', description: '你的爪子是天生武器，可以用来进行徒手打击。如果你以此命中目标，你可以造成挥砍伤害，数值为 1d4 + 你的力量调整值，而非普通徒手打击的钝击伤害。' },
      {
        name: '猎手本能',
        description: '你从以下技能中选择一项获得熟练项：运动、威吓、察觉或生存。',
        choices: [
          {
            id: 'leonin-hunter',
            name: '选择一项技能',
            chooseNumber: 1,
            options: [
              { id: 'athletics', name: '运动' },
              { id: 'intimidation', name: '威吓' },
              { id: 'perception', name: '察觉' },
              { id: 'survival', name: '生存' }
            ]
          }
        ]
      },
      {
        name: '慑人怒吼',
        description: '以一个附赠动作，你可以发出一声特别骇人的怒吼。你选择 10 尺内能听到你声音的生物，它们必须通过一次感知豁免检定，否则将对你陷入恐惧状态直到你的下一回合结束。豁免 DC = 8 + 你的熟练加值 + 你的体质调整值。一旦你使用了此特性，你必须完成一次短休或长休后才能再次使用。'
      }
    ],
    spells: [],
    source: 'mot'
  },
  {
    id: 'minotaur',
    name: '米诺陶',
    description: '塞洛斯的米诺陶（牛头怪）生息于巍峨的斯蔻弗斯城邦，或在塞洛斯的荒野中流浪。与受恶魔侵蚀的牛头人不同，这里的米诺陶崇尚钢铁纪律、力量与荣誉。他们天生具有可怕的牛角武器和撞击技巧。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '牛头语'],
    traits: [
      { name: '牛角', description: '你的牛角是天生近战武器，可以使用它们来进行徒手打击。如果你命中目标，则你造成等同1d6 + 你的力量调整值的穿刺伤害，而不是一般徒手打击的钝击伤害。' },
      { name: '牛角冲刺', description: '紧接在你于你的回合使用疾走动作并移动至少20尺后，你可以立刻以一个附赠动作使用你的牛角进行一次近战攻击。' },
      { name: '猛捶角击', description: '紧接在你于你的回合以攻击动作的一部分，通过一次近战攻击命中一个生物后，你可以立刻以一个附赠动作尝试使用你的牛角去推撞该目标。目标的体型不能比你大超过一级，且必须距离你5尺以内。除非它成功通过DC等同于8 + 你的熟练加值 + 你的力量调整值的力量豁免，否则你将把它推离你最多10尺。' },
      { name: '威风凛凛', description: '你熟练于以下其中一个你所选择的技能：威吓或说服。', choices: [
        {
          id: 'minotaur-skill',
          name: '选择一项技能',
          chooseNumber: 1,
          options: [
            { id: 'intimidation', name: '威吓' },
            { id: 'persuasion', name: '说服' }
          ]
        }
      ] }
    ],
    spells: [],
    source: 'mot'
  },
  {
    id: 'satyr',
    name: '半羊人',
    description: '半羊人是妖精荒野的欢乐生灵，热爱音乐、舞蹈和自由。他们天性善良但偶尔顽皮，喜欢用恶作剧给他人带来小小的困扰和惊喜。',
    abilityBonuses: [{ ability: 'CHA', bonus: 2 }, { ability: 'DEX', bonus: 1 }],
    size: 'Medium',
    speed: 35,
    vision: '普通视觉',
    languages: ['通用语', '木族语'],
    traits: [
      { name: '生物种类', description: '你的生物类型是精类，而非类人生物。' },
      { name: '冲撞', description: '你可以用你的头部和角进行徒手打击。如果你击中目标，你造成钝击伤害，数值为 1d4 + 你的力量调整值。' },
      { name: '魔法抗性', description: '你在对抗法术和其他魔法效果的豁免检定中具有优势。' },
      { name: '欢悦跳跃', description: '每当你进行长跳或高跳时，你可以骰一个 d8 并将骰出的数值加到你可跳跃的尺数上，即使在原地起跳时也可以。此额外距离正常消耗移动力。' },
      { name: '狂欢者', description: '你拥有表演和说服技能的熟练项，并且拥有一项自选乐器熟练项。',
        choices: [
          {
            id: 'satyr-instrument',
            name: '选择一种乐器',
            chooseNumber: 1,
            dynamic: 'tool'
          }
        ]
      }
    ],
    spells: [],
    skillProficiencies: ['performance', 'persuasion'],
    source: 'mot'
  },
  {
    id: 'triton',
    name: '梭螺鱼人',
    description: '梭螺鱼人是尊贵自豪的深海守护者。他们习惯在海洋极深处与克拉肯等深渊邪兽战斗。虽然因此而显得有些傲慢自矜，但他们极其信守承诺、热忱而勇敢。鱼人们流淌着控水操气的气水元素魔法，是原生的两栖海洋斗士。',
    abilityBonuses: [{ ability: 'STR', bonus: 1 }, { ability: 'CON', bonus: 1 }, { ability: 'CHA', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '原初语'],
    traits: [
      { name: '游泳速度', description: '你具有 30 尺的游泳速度，且由于天生的游泳天赋，你在水中能自如穿行。' },
      { name: '两栖', description: '你可以在空气和水中呼吸。' },
      { name: '控风操水：云雾术', description: '身为海洋之子，你可以呼唤气和水元素的魔法。你可以使用此特性施放云雾术。你施展该法术的施法属性为魅力。一旦你使用此法术，直到你完成一次长休之前不能再次使用该特性施放它。', level: 1 },
      { name: '控风操水：造风术', description: '当你达到3级时，可以使用此特性施放造风术。你施展该法术的施法属性为魅力。一旦你使用此法术，直到你完成一次长休之前不能再次使用该特性施放它。', level: 3 },
      { name: '控风操水：水墙术', description: '当你达到5级时，可以使用此特性施放水墙术。你施展该法术的施法属性为魅力。一旦你使用此法术，直到你完成一次长休之前不能再次使用该特性施放它。', level: 5 },
      { name: '海之使者', description: '水生野兽与你的族人之间有着非凡的亲和力。你可以与能在水中呼吸的野兽进行简单概念的沟通。它们可以理解你话语的意思，然而你并没有特殊能力以理解它们的回复。' },
      { name: '深海守护者', description: '适应了最极端的深海环境，你具有对冷冻伤害的抗性，且你忽视任何因深水环境所造成的负面影响。' }
    ],
    spells: [
      { level: 1, spellId: 'fog-cloud' },
      { level: 3, spellId: 'gust-of-wind' },
      { level: 5, spellId: 'wall-of-water' }
    ],
    source: 'mot'
  }
];
