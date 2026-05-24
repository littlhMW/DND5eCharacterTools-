import { Race } from '../../types/dnd';

export const races: Race[] = [
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
    source: 'egw',
    subraces: [
      {
        id: 'lotusden',
        name: '莲源半身人',
        description: '莲源半身人是深谙荒野法则的神秘隐士。他们扎根于古老森林深处，与植物和自然界奥术低语共鸣，能够自如施展自然魔法，用繁茂草木和棘刺默默守卫林地圣所。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '树林之子：德鲁伊伎俩', description: '你知晓德鲁伊伎俩戏法。', level: 0 },
          { name: '树林之子：纠缠术', description: '当你升至3级，你能释放一次纠缠术，在完成一次长休前不能再次施展。', level: 3 },
          { name: '树林之子：荆棘丛生', description: '当你升至5级，你能释放一次荆棘丛生，在完成一次长休前不能再次施展。', level: 5 },
          { name: '木行', description: '通过由非魔法植物形成的困难地形不需要花费额外移动力，别人追踪你具有劣势。' }
        ],
        spells: [
          { level: 0, spellId: 'druidcraft' },
          { level: 3, spellId: 'entangle' },
          { level: 5, spellId: 'spike-growth' }
        ],
        source: 'egw'
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
    source: 'egw',
    subraces: [
      {
        id: 'pallid-elf',
        name: '苍白精灵',
        description: '苍白精灵是于巨型阴影与地下隔离中繁衍出的隐秘裔。他们因常年避世而目光雪亮、洞悉人心，身怀月织者的神圣祝福，能悄然踏碎黑夜，于重重迷雾中拨寻真实。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '锐利感知', description: '你在调查和洞悉检定上具有优势。' },
          { name: '月织者之福：光亮术', description: '你知晓光亮术。', level: 0 },
          { name: '月织者之福：睡眠术', description: '当你升至3级，可施展睡眠术，且在完成长休后才能再次施放。', level: 3 },
          { name: '月织者之福：隐形术', description: '当你升至5级，可对自己施展隐形术（限自身），且在完成长休后才能再次施放。', level: 5 }
        ],
        spells: [
          { level: 0, spellId: 'light' },
          { level: 3, spellId: 'sleep' },
          { level: 5, spellId: 'invisibility' }
        ],
        source: 'egw'
      }
    ]
  },
  {
    id: 'dragonborn',
    name: '龙裔',
    description: '',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'egw',
    subraces: [
      {
        id: 'draconblood',
         name: '龙国血统龙裔',
        description: '龙国血统龙裔是生来便在帝国中执掌权柄的高贵统治者。他们虽无传统龙尾，却享有龙祖馈赠的智谋与非凡威仪，擅长用巧妙的辞令同理地位征服人心，平定动荡纷争。',
        abilityBonuses: [{ ability: 'INT', bonus: 2 }, { ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '黑暗视觉', description: '你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。' },
          { name: '强势气场', description: '你可以利用出色的交涉或恐吓在困境中获利。当进行威吓或说服检定时，你可以让自己获得优势（每短休或长休一次）。' }
        ],
        spells: [],
        source: 'egw'
      },
      {
        id: 'ravenite',
        name: '拾荒种龙裔',
        description: '拾荒种龙裔是曾长期蒙受奴役，后以铁血起义赢回自由的无尾斗士。饱经苦难淬炼的他们拥有极其顽强的体魄，每当在战场遭受创伤，体内的复仇血脉便会爆发出狂暴一击。',
        abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
        traits: [
          { name: '黑暗视觉', description: '60尺黑暗视觉。' },
          { name: '复仇打击', description: '当你受到范围内生物的伤害时，你可以使用反应对其进行一次武器攻击（每短休或长休一次）。' }
        ],
        spells: [],
        source: 'egw'
      }
    ]
  },
  {
    id: 'orc',
    name: '兽人',
    description: '兽人是体魄雄健、崇尚力量的原野开拓者。他们常年与严酷荒野抗争，将对先祖的执着和惊人爆发力熔炼于不屈意志。他们虽性情狂烈，但在行伍中也是绝对可靠的力量支柱。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '兽人语'],
    traits: [
      { name: '侵略性', description: '以附赠动作向可见或听见的敌意生物移动速度距离。' },
      { name: '原初直觉', description: '你获得以下两项技能的熟练：驯兽，洞悉，威吓，医疗，察觉，或生存。', choices: [
        {
          id: 'egw-orc-skills',
          name: '选择两项技能',
          chooseNumber: 2,
          options: [
            { id: 'animalHandling', name: '驯兽' },
            { id: 'insight', name: '洞悉' },
            { id: 'intimidation', name: '威吓' },
            { id: 'medicine', name: '医疗' },
            { id: 'perception', name: '察觉' },
            { id: 'survival', name: '生存' }
          ]
        }
      ] },
      { name: '强健体格', description: '决定负重和搬运体重时视作大一级体型。' }
    ],
    spells: [],
    source: 'egw'
  }
];
