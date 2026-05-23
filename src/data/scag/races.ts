import { Race } from '../../types/dnd';

export const races: Race[] = [
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
    source: 'scag',
    subraces: [
      {
        id: 'wood-descent',
        name: '木精灵血统',
        description: '木精灵血统赋予了半精灵源自深林隐修士的敏锐直觉、轻捷步伐或荒野隐蔽特异，在基础血脉中完美融入了山林深处的野性奥秘。',
        abilityBonuses: [],
        traits: [
          { name: '轻捷步伐/荒野隐蔽/等选一', description: '在基础面板替换多才多艺。', choices: [
            {
              id: 'wood-elf-descent-choice',
              name: '选择一项木精灵特性',
              chooseNumber: 1,
              options: [
                { id: 'elf-weapon-training', name: '精灵武器训练' },
                { id: 'fleet-of-foot', name: '轻捷步伐' },
                { id: 'mask-of-the-wild', name: '荒野隐蔽' }
              ]
            }
          ] }
        ],
        spells: [],
        source: 'scag'
      },
      {
        id: 'moon-sun-descent',
        name: '月/日精灵血统',
        description: '月/日精灵血统让半精灵完美继承了高等精灵的高雅仪态与奥术天赋，能在指尖轻舞法师戏法或精通灵动的长剑刃技，周身洋溢着智者的圣光。',
        abilityBonuses: [],
        traits: [
          { name: '戏法/精灵武器训练等选一', description: '在基础面板替换多才多艺。', choices: [
            {
              id: 'sun-elf-descent-choice',
              name: '选择一项高等精灵特性',
              chooseNumber: 1,
              options: [
                { id: 'elf-weapon-training', name: '精灵武器训练' },
                { id: 'sun-elf-cantrip', name: '法师戏法' }
              ]
            }
          ] }
        ],
        spells: [],
        source: 'scag'
      },
      {
        id: 'drow-descent',
        name: '卓尔血统',
        description: '卓尔血统赋予半精灵源自幽暗幽域黑暗精灵的魅惑魔能，让他们能够自如召唤舞光、妖火与无边黑暗，在无光的黑夜中展露其致命魅力。',
        abilityBonuses: [],
        traits: [
          { name: '卓尔魔法', description: '在基础面板替换多才多艺。' }
        ],
        spells: [
          { level: 0, spellId: 'dancing-lights' },
          { level: 3, spellId: 'faerie-fire' },
          { level: 5, spellId: 'darkness' }
        ],
        source: 'scag'
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
    source: 'scag',
    subraces: [
      {
        id: 'ghostwise',
        name: '鬼智半身人',
        description: '鬼智半身人是生性孤僻、离群索居的古老隐世族。他们少言寡语，精通不可思议的心灵感应，能用无声传话将意志无障碍送达，在寂静中守护生命。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '无声传话', description: '透过心灵感应向30尺内生物说话。' }
        ],
        spells: [],
        source: 'scag'
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
    source: 'scag',
    subraces: [
      {
        id: 'hellfire',
        name: '地狱之火',
        description: '地狱之火提夫林将体内的炼狱火种淬炼至极。他们能以燃烧之手代替寻常叱喝，以炽热的灵魂烈焰将挡在身前的愚蠢敌人碎身于怒火之中。',
        abilityBonuses: [],
        traits: [
          { name: '地狱之火', description: '3级可施放燃烧之手取代原本法术。' }
        ],
        spells: [
          { level: 0, spellId: 'thaumaturgy' },
          { level: 3, spellId: 'burning-hands' },
          { level: 5, spellId: 'darkness' }
        ],
        source: 'scag'
      },
      {
        id: 'winged',
        name: '飞翔之翼',
        description: '飞翔之翼提夫林拥有一双遮天蔽日的恶魔巨翼以替代传统施法。无盔甲束缚时，他们能从高空俯冲突击，是在战场上方盘旋的黑羽死神。',
        abilityBonuses: [],
        traits: [
          { name: '飞翼', description: '无重甲时拥有30尺飞行速度，取代炼狱传承法术。' }
        ],
        spells: [],
        source: 'scag'
      }
    ]
  }
];
