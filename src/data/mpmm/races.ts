import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'harengon',
    name: '兔人',
    description: '兔人源于妖精荒野，秉承自由与旅行的精类精神。他们两足着地，长着兔子的长脚与多彩毛皮，感官敏锐，活力如春。受些许精类气运祝福，兔人常能幸运地从危险中逃脱。',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '木族语'],
    traits: [
      {
        name: '属性提升', 
        description: '你所选择的一项属性增加 2，另一项增加 1；或者你所选择的三项不同属性各增加 1。',
        choices: [
          {
            id: 'harengon-asi',
            name: '选择属性提升 (总计+3，单项最高+2)',
            chooseNumber: 3,
            dynamic: 'asi'
          }
        ]
      },
      {
        name: '生物种类',
        description: '你是类人生物。'
      },
      {
        name: '体型',
        description: '你的体型为中型或小型。在你选择该种族时选择体型。'
      },
      {
        name: '速度',
        description: '你的步行速度为30尺。'
      },
      {
        name: '野兔敏锐',
        description: '你可以将你的熟练加值加入你的先攻数值。'
      },
      {
        name: '野兔感官',
        description: '你拥有察觉技能的熟练项。'
      },
      {
        name: '幸运步法',
        description: '当你的敏捷豁免检定失败时，你可以用反应投掷一粒d4并将其加入到结果中，这样做可能会将失败转变为成功。当你的速度为0或处于倒地状态时，你不能使用该反应。'
      },
      {
        name: '兔子跳',
        description: '作为一个附赠动作，你能够跳跃一段距离，距离长度为你的熟练加值的五倍，并且不会触发借机攻击。你只能在你的速度高于0时才能使用该特质。你可以使用此特质的次数等于你的熟练加值，当你完成一次长休后，你重新获得所有消耗的次数。'
      }
    ],
    spells: [],
    skillProficiencies: ['perception'],
    source: 'mpmm'
  }
];
