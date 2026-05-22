import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'centaur',
    name: '半人马',
    description: '有着半人半马的身躯，倾向中立。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
    size: 'Medium',
    speed: 40,
    vision: '普通视觉',
    languages: ['通用语', '木族语'],
    traits: [
      { name: '精类', description: '你的生物类型是精类生物，而非类人生物。' },
      { name: '冲锋', description: '朝着目标直线移动至少30尺后命中，可用附赠动作马蹄攻击。' },
      { name: '马蹄', description: '你的马蹄是天生近战武器，命中造成1d4+力量调整值的钝击伤害。' },
      { name: '马之身躯', description: '负重视作大一级，但垂直攀爬要多耗费移动力。' },
      { name: '生存者', description: '熟练技能：驯兽、医疗、自然或生存。', choices: [
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
    source: 'ggr'
  },
  {
    id: 'minotaur',
    name: '米诺陶',
    description: '牛头人，身材健壮，超过 6 尺高。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '牛头语'],
    traits: [
      { name: '牛角', description: '天生近战武器，命中造成1d6+力量调整值的穿刺。' },
      { name: '牛角冲刺', description: '疾走并移动20尺后可用附赠动作用牛角攻击。' },
      { name: '猛捶角击', description: '近战命中后，可用附赠动作尝试用牛角推撞目标10尺。' },
      { name: '威风凛凛', description: '熟练技能：威吓或说服。', choices: [
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
    source: 'ggr'
  },
  {
    id: 'vedalken',
    name: '维多肯',
    description: '通常是守序的聪明人，肤色偏蓝。',
    abilityBonuses: [{ ability: 'INT', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '维多肯语', '自选一门语言'],
    traits: [
      { name: '维多肯式沉着', description: '你在所有智力、感知和魅力的豁免检定上具有优势。' },
      { name: '孜孜不倦的专家', description: '获得自选技能和工具熟练，在使用它们时加 1d4。', choices: [
        {
          id: 'vedalken-skill',
          name: '选择一项技能',
          chooseNumber: 1,
          options: [
            { id: 'arcana', name: '奥秘' },
            { id: 'history', name: '历史' },
            { id: 'investigation', name: '调查' },
            { id: 'medicine', name: '医疗' },
            { id: 'performance', name: '表演' },
            { id: 'sleightOfHand', name: '巧手' }
          ]
        },
        {
          id: 'vedalken-tool',
          name: '选择一样工具 (记录下工具名)',
          chooseNumber: 1,
          dynamic: 'tool'
        }
      ] },
      { name: '部分两栖', description: '在水下呼吸长达1小时。' }
    ],
    spells: [],
    source: 'ggr'
  },
  {
    id: 'simic-hybrid',
    name: '析米克混合体',
    description: '身体被改造的人类、精灵或维多肯。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '精灵语或维多肯语'],
    traits: [
      { name: '动物改造', description: '1级时选择1项改造（蝠鲼滑翼、灵敏攀爬者、水中适应），5级时再选1项更强特征。', choices: [
        {
          id: 'simic-1',
          name: '1级 选择一项改造',
          chooseNumber: 1,
          options: [
            { id: 'glide', name: '蝠鲼滑翼' },
            { id: 'climb', name: '灵敏攀爬者' },
            { id: 'swim', name: '水中适应' }
          ]
        },
        {
          id: 'simic-5',
          name: '5级 选择第二项改造 (包含1级未选和新的)',
          chooseNumber: 1,
          options: [
            { id: 'grapple', name: '格斗附肢' },
            { id: 'armor', name: '甲壳' },
            { id: 'acid', name: '酸液喷射' },
            { id: 'glide', name: '蝠鲼滑翼' },
            { id: 'climb', name: '灵敏攀爬者' },
            { id: 'swim', name: '水中适应' }
          ]
        }
      ] }
    ],
    spells: [],
    source: 'ggr'
  },
  {
    id: 'loxodon',
    name: '象族',
    description: '有着厚实皮肤与象鼻。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '象族语'],
    traits: [
      { name: '强健体格', description: '负重计算视作大一级体型。' },
      { name: '象族沉着', description: '对抗魅惑或恐惧的豁免检定优势。' },
      { name: '天生护甲', description: '未穿着护甲时AC为 12 + 体质调整值。' },
      { name: '象鼻', description: '可以抓取物品和简单操作。' },
      { name: '敏锐嗅觉', description: '牵涉嗅觉的察觉、生存或调查拥有优势。' }
    ],
    spells: [],
    source: 'ggr'
  }
];
