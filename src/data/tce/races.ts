import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'custom-lineage',
    name: '自定血统',
    description: '自定血统允许你摆脱传统种族的刻板桎梏。你可以完全依照个人奇思妙想，将奇异的外貌风情、与生俱来的独特专长与敏锐感官融汇一炉，定制出多元宇宙中绝无仅有的出身背景。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }], // In UI user could choose
    size: 'Medium', // Small or Medium
    speed: 30,
    vision: '普通或黑暗视觉',
    languages: ['通用语', '自选一门语言'],
    traits: [
      { name: '生物类型', description: '类人生物。由你自己决定的外貌。' },
      { name: '专长', description: '你选择一个满足条件的专长。', choices: [
        {
          id: 'custom-lineage-feat',
          name: '选择一个专长',
          chooseNumber: 1,
          dynamic: 'feat'
        }
      ] },
      { name: '可选特征', description: '从以下两种特性中选择一个：(a) 60尺黑暗视觉 或 (b) 一个你选择的技能熟练项。', choices: [
        {
          id: 'custom-lineage-trait',
          name: '选择一项特征',
          chooseNumber: 1,
          options: [
            { id: 'darkvision', name: '60尺黑暗视觉' },
            { id: 'acrobatics', name: '技能：特技' },
            { id: 'animalHandling', name: '技能：驯兽' },
            { id: 'arcana', name: '技能：奥秘' },
            { id: 'athletics', name: '技能：运动' },
            { id: 'deception', name: '技能：欺瞒' },
            { id: 'history', name: '技能：历史' },
            { id: 'insight', name: '技能：洞悉' },
            { id: 'intimidation', name: '技能：威吓' },
            { id: 'investigation', name: '技能：调查' },
            { id: 'medicine', name: '技能：医药' },
            { id: 'nature', name: '技能：自然' },
            { id: 'perception', name: '技能：察觉' },
            { id: 'performance', name: '技能：表演' },
            { id: 'persuasion', name: '技能：说服' },
            { id: 'religion', name: '技能：宗教' },
            { id: 'sleightOfHand', name: '技能：巧手' },
            { id: 'stealth', name: '技能：隐匿' },
            { id: 'survival', name: '技能：生存' }
          ]
        }
      ] }
    ],
    spells: [],
    source: 'tce'
  }
];
