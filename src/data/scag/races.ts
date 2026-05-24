import { Race } from '../../types/dnd';

export const races: Race[] = [
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
    source: 'scag',
    subraces: [
      {
        id: 'duergar-scag',
        name: '灰矮人',
        description: '灰矮人，又称杜尔加矮人。他们居住在深邃的地底，其性格残酷且沉浸于对神明的痛恨。',
        abilityBonuses: [{ ability: 'STR', bonus: 1 }],
        traits: [
          { name: '高级黑暗视觉', description: '习惯了地底的生活，你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你120尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
          { name: '灰矮人韧性', description: '你在对抗幻术以及对抗魅惑或麻痹的豁免检定中具有优势。' },
          { name: '灰矮人魔法', description: '当你升至3级，你每天可以使用此特性对你自己施放一次变巨/缩小术，但只能使用变巨的选项。当你升至5级，你每天可以使用此特性对你自己施放一次隐形术。你不需要为这些法术提供材料构材，且你不能在自己暴露于阳光下时施放它们，尽管一旦施放后，阳光对它们不会有任何影响。你在完成一次长休后才能恢复再次使用此特性施放这些法术的能力。你施展这些法术的施法属性为智力。' },
          { name: '日光敏感', description: '当你、你的攻击目标或你尝试感知的东西直接暴露在阳光下，则你依赖于视觉的攻击检定以及感知（察觉）检定具有劣势。' }
        ],
        spells: [],
        source: 'scag'
      }
    ]
  },
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
    source: 'scag',
    subraces: [
      {
        id: 'deep-gnome-scag',
        name: '斯奈布力',
        description: '斯奈布力，又称地底侏儒，生活在深邃的幽暗地域中。他们通过巧妙的回避和岩石的伪装颜彩，在充满捕食者的地底求存。生存的关键取决于避免树敌，因此他们偏好中立阵营，很少为了亲近者以外的人冒险。',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '高级黑暗视觉', description: '习惯了地底的生活，你在黑暗与微光环境下仍能保持卓越视觉。你在看距离你120尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
          { name: '侏儒狡黠', description: '你在所有对抗魔法的智力、感知和魅力豁免中具有优势。' },
          { name: '岩地伪装', description: '你在岩石地形为躲藏所进行的敏捷（隐匿）检定中具有优势。' }
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
