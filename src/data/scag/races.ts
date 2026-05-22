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
        description: '有木精灵的特性。',
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
        description: '有高等精灵的特性。',
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
        description: '有黑暗精灵的特性。',
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
        description: '隐居且少言。',
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
        description: '用燃烧之手代替炼狱叱喝。',
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
        description: '用巨翼代替法术。',
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
