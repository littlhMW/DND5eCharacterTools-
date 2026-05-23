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
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-warding',
        name: '警戒龙纹矮人',
        description: '警戒龙纹矮人携带防御与封锁之龙纹。他们精于破解盗贼工具，能施展警报与神圣护甲等护卫秘术，是世间各大家族金库与圣所最值得信赖的终极铁卫。',
        abilityBonuses: [{ ability: 'INT', bonus: 1 }],
        traits: [
          { name: '守卫直觉', description: '进行调查或盗贼工具检定时可以加上1d4。' },
          { name: '保护与封锁', description: '能够施展警报术和法师护甲。从3级起，还能施展秘法锁。' }
        ],
        spells: [
          { level: 1, spellId: 'alarm' },
          { level: 1, spellId: 'mage-armor' },
          { level: 3, spellId: 'arcane-lock' }
        ],
        source: 'erlw'
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
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-storm',
        name: '暴风龙纹半精灵',
        description: '暴风龙纹半精灵携带有控制气候与蔚蓝风暴力量的龙纹。他们抗性卓越，在波涛汹涌的海轮或空艇中能凭借超凡直觉驾驭风向，是用狂风神术御行万里的风雨之子。',
        abilityBonuses: [{ ability: 'DEX', bonus: 1 }],
        traits: [
          { name: '驭风者直觉', description: '当你进行体操检定或使用领航工具时附加 1d4。' },
          { name: '暴风之祝福', description: '你对闪电伤害有抗性。' },
          { name: '逆风行事', description: '你能够施展gust戏法。3级可施展造风术。' }
        ],
        spells: [
          { level: 0, spellId: 'gust' },
          { level: 3, spellId: 'gust-of-wind' }
        ],
        source: 'erlw'
      },
      {
        id: 'mark-of-detection',
        name: '侦测龙纹半精灵',
        description: '侦测龙纹半精灵携带有看破迷雾与勘破隐秘力量的龙纹。他们天生具有敏锐的推理直觉，能一眼识破藏匿于暗影中的魔能，是帝国中最杰出的密探与调查大师。',
        abilityBonuses: [{ ability: 'WIS', bonus: 2 }],
        traits: [
          { name: '推理直觉', description: '当你进行调查或洞悉检定可加 1d4。' },
          { name: '魔法侦测', description: '能够施展侦测魔法和侦测毒素或疾病。3级可施展识破隐形。' }
        ],
        spells: [
          { level: 1, spellId: 'detect-magic' },
          { level: 1, spellId: 'detect-poison-and-disease' },
          { level: 3, spellId: 'see-invisibility' }
        ],
        source: 'erlw'
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
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-healing',
        name: '医疗龙纹半身人',
        description: '医疗龙纹半身人携带治愈诸痛与抚平创伤之神秘龙纹。微小的身躯孕育着不凡的草药感知，他们能轻易引导神圣能量使骨肉重生，是苦难旅者心中最温暖的医疗之光。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '医疗直觉', description: '进行医疗技能或草药工具检定时加 1d4。' },
          { name: '医疗之触', description: '能够施展治疗伤势，从第3级起还能施展次级复原术。' }
        ],
        spells: [
          { level: 1, spellId: 'cure-wounds' },
          { level: 3, spellId: 'lesser-restoration' }
        ],
        source: 'erlw'
      },
      {
        id: 'mark-of-hospitality',
        name: '招待龙纹半身人',
        description: '招待龙纹半身人携带操控食物、引燃炉火与提供隐秘庇护所的招待龙纹。他们生性热诚、手艺卓越，能将简陋酒肆点缀得如家般温馨，是最伟大的酒家与团队润滑剂。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '永远热情好客', description: '进行说服、酿酒工具或厨师工具检定时加 1d4。' },
          { name: '旅店老板的魔法', description: '能够施展魔法技俩，净化饮食和隐形仆役。' }
        ],
        spells: [
          { level: 0, spellId: 'prestidigitation' },
          { level: 1, spellId: 'purify-food-and-drink' },
          { level: 1, spellId: 'unseen-servant' }
        ],
        source: 'erlw'
      }
    ]
  },
  {
    id: 'half-orc',
    name: '半兽人',
    description: '',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-finding',
        name: '探索龙纹半兽人',
        description: '探索龙纹半兽人携带能洞察猎物踪迹、辨明世间方位的追踪之龙纹。他们继承了荒野之子的直觉感知，擅使猎人印记追踪百里，是寻龙点穴、追索逃犯的最强猎犬。',
        abilityBonuses: [{ ability: 'WIS', bonus: 2 }, { ability: 'CON', bonus: 1 }],
        traits: [
          { name: '猎人直觉', description: '进行察觉或生存检定时加 1d4。' },
          { name: '寻者魔法', description: '可施展猎人印记。3级可施展物品定位术。' }
        ],
        spells: [
          { level: 1, spellId: 'hunters-mark' },
          { level: 3, spellId: 'locate-object' }
        ],
        source: 'erlw'
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
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-shadow',
        name: '阴影龙纹精灵',
        description: '阴影龙纹精灵携带编织幻象、隐匿在星月暗影中的古老龙纹。他们是精妙的幻术师与潜行者，擅长在众目睽睽下隐去身形，用完美的伪装在帷幕后操弄历史的车轮。',
        abilityBonuses: [{ ability: 'CHA', bonus: 1 }],
        traits: [
          { name: '狡诈直觉', description: '进行表演或隐匿检定时加 1d4。' },
          { name: '阴影塑形', description: '能施展次级幻象。3级施展隐形术。' }
        ],
        spells: [
          { level: 0, spellId: 'minor-illusion' },
          { level: 3, spellId: 'invisibility' }
        ],
        source: 'erlw'
      }
    ]
  },
  {
    id: 'human',
    name: '人类',
    description: '',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '',
    languages: [],
    traits: [],
    spells: [],
    source: 'erlw',
    subraces: [
      {
        id: 'mark-of-handling',
        name: '畜牧龙纹人类',
        description: '畜牧龙纹人类拥有与野生野兽和巨型魔法生物进行心灵链接的特异龙纹。他们极易赢得生灵信任，可轻易驯化智力低下怪兽，是荒野畜牧和自然生态的坚固桥梁。',
        abilityBonuses: [{ ability: 'WIS', bonus: 2 }],
        traits: [
          { name: '野性直觉', description: '进行驯兽或自然检定时加 1d4。' },
          { name: '原始链接', description: '可施展化兽为友和动物交谈术。' },
          { name: '它们不过是大了点', description: '你的化兽为友等能对智力3以下怪兽生效。' }
        ],
        spells: [
          { level: 1, spellId: 'animal-friendship' },
          { level: 1, spellId: 'speak-with-animals' }
        ],
        source: 'erlw'
      },
      {
        id: 'mark-of-making',
        name: '创造龙纹人类',
        description: '创造龙纹人类携带有操控万物结构、点石成金的制造之龙纹。他们是天生的工匠大师与附魔学者，能单手附魔兵刃，用修复术维持精密机关，是工业帝国的魔能枢纽。',
        abilityBonuses: [{ ability: 'INT', bonus: 2 }],
        traits: [
          { name: '工匠直觉', description: '进行奥秘或工匠工具检定时加 1d4。' },
          { name: '匠师天赋', description: '选择一种工匠工具，获得其熟练。' },
          { name: '魔力制造', description: '习得修复术。可施展魔化武器。' }
        ],
        spells: [
          { level: 0, spellId: 'mending' },
          { level: 3, spellId: 'magic-weapon' }
        ],
        source: 'erlw'
      },
      {
        id: 'mark-of-sentinel',
        name: '守护龙纹人类',
        description: '守护龙纹人类攜带着坚不可摧之叹息之墙的守卫龙纹。他们直觉感官极其锐利，关键时刻能挺身而出、替换替友承受重创，是用肉躯与护盾捍卫誓言的钢铁人墙。',
        abilityBonuses: [{ ability: 'CON', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '哨兵直觉', description: '进行洞悉或察觉检定时加 1d4。' },
          { name: '哨兵之盾', description: '可施展护盾术。' },
          { name: '警觉卫士', description: '附近角色受击时你可以互换位置并代替受击。' }
        ],
        spells: [{ level: 1, spellId: 'shield' }],
        source: 'erlw'
      },
      {
        id: 'mark-of-passage',
        name: '通行龙纹人类',
        description: '通行龙纹人类携带着能操纵空间折叠、运动无阻的移动之龙纹。他们移速如飞，能于战场上踏碎虚空，自如施展迷踪步，是冲锋陷阵、纵横无阻的战地信使。',
        abilityBonuses: [{ ability: 'DEX', bonus: 2 }],
        traits: [
          { name: '邮差之速', description: '基础步行速度为35尺。' },
          { name: '运动直觉', description: '体操或陆运载具检定加 1d4。' },
          { name: '魔法通道', description: '可施展迷踪步。' }
        ],
        spells: [{ level: 1, spellId: 'misty-step' }],
        source: 'erlw'
      }
    ]
  },
  {
    id: 'bugbear',
    name: '熊地精',
    description: '熊地精是地精类生物中体魄最为巨硕、性情极度贪婪的伏击猎手。他们长肢如猿，悄无声息行动如幽灵，能在首轮袭击中爆发出致命重创，是潜伏在荒林深处的恐怖突袭者。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'DEX', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60尺',
    languages: ['通用语', '地精语'],
    traits: [
      { name: '长肢', description: '近战攻击范围增加5尺。' },
      { name: '强健体格', description: '决定负重和搬运重量视作大一级体型。' },
      { name: '鬼祟', description: '熟练于隐匿。' },
      { name: '突袭攻击', description: '突袭下第一回合攻击造成额外 2d6 伤害。' }
    ],
    spells: [],
    skillProficiencies: ['stealth'],
    source: 'erlw'
  }
];
