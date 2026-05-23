import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'dhampir',
    name: '半血裔',
    description: '半血裔游走于生者与死者的灰色边界。与死灵领域的脆弱纽带赋予了他们类似吸血鬼的无光伟力、绝尘的蛛行攀爬敏捷与渴求生命的噬咬，无时无刻不在经受着恶毒饥渴的试炼。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Medium',
    speed: 35,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '自选一门语言'],
    traits: [
      { name: '先祖遗赠', description: '能保留原本种族的攀爬、飞行或游泳熟练（若替换）。', choices: [
        {
          id: 'dhampir-skills',
          name: '选择两项技能 (若不继承)',
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
      ] },
      { name: '不死本质', description: '你不需要呼吸。' },
      { name: '蛛行', description: '等于速度的攀爬速度，3级可倒挂天花板。' },
      { name: '吸血啃咬', description: '獠牙攻击（1d4），附加回血或在下次检定里取得加值。' }
    ],
    spells: [],
    source: 'vrgr'
  },
  {
    id: 'hexblood',
    name: '巫咒之子',
    description: '巫咒之子是体内充盈着精类或鬼婆巫术的超自然个体。由于源远流长的魔能契约，他们生长出怪异肤色与活体冠冕之印，熟稔干扰感官的奇诡法术，执着跨向揭开奥秘的道路。',
    abilityBonuses: [{ ability: 'CHA', bonus: 2 }, { ability: 'INT', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '自选一门语言'],
    traits: [
      { name: '生物类型', description: '你是精类。' },
      { name: '先祖遗赠', description: '如果继承替换则保留原种族特殊移动力。', choices: [
        {
          id: 'hexblood-skills',
          name: '选择两项技能 (若不继承)',
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
      ] },
      { name: '怪诞徽记', description: '扯下指甲或头发做成魔法徽记，用于心灵传讯和远端观察。' },
      { name: '巫咒魔法', description: '可施展易容术和脆弱诅咒。' }
    ],
    spells: [
      { level: 1, spellId: 'disguise-self' },
      { level: 1, spellId: 'hex' }
    ],
    source: 'vrgr'
  },
  {
    id: 'reborn',
    name: '重生者',
    description: '重生者是跨过死亡边界、带着未了宿命重回尘世的奇异奇迹。他们或许带着致命伤口、又或是拼凑而成的炼金之躯。破碎记忆促使他们再次上路，在不眠一生中寻觅终极答案。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '自选一门语言'],
    traits: [
      { name: '先祖遗赠', description: '如果你用该族系替换了一个种族，你能保留该种族的任何技能熟练，以及任何攀爬、飞行或是游泳速度。如果你不保留这些元素或这属于直接创建的角色，你获得两项自选技能的熟练。', choices: [
        {
          id: 'reborn-skills',
          name: '选择两项技能 (如果不继承原种族熟练)',
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
      ] },
      { name: '不死本质', description: '你脱离了死亡的魔掌。你对抗疾病或中毒的救砖检定具有优势，且你具有毒素伤害抗性；你的死亡救砖检定也同样具备优势；你不需要饮食或呼吸；你不需要睡眠，且魔法不能使你入睡。你只需在保持睁眼且无活动的状态下度过4小时，便可以获得长休的所有效果。' },
      { name: '往昔学识', description: '你偶尔能勾起过去的些微破碎记忆。当你进行一次使用了技能的属性检定，且在看到d20投骰结果之后，你可以立即投掷一个d6骰子并将其结果加入该次属性检定。此特性的可用次数等同于你的熟练加值（PB），并在长休后重置。' }
    ],
    spells: [],
    source: 'vrgr'
  }
];
