import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'dragonborn',
    name: '龙裔',
    description: '',
    abilityBonuses: [],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: [],
    traits: [],
    spells: [],
    source: 'fod',
    subraces: [
      {
        id: 'chromatic-dragonborn',
        name: '色彩龙裔',
        description: '有着色彩龙血脉的龙裔掌控着色彩龙的原生元素力量。色彩龙鲜艳亮丽的颜色——黑，蓝，绿，红，白——闪耀在他们鳞片皮肤的表面，也侵染在他们致命的吐息中。其吐息是狂野的原生元素，承载着火山的怒火，寒风的噬咬或者雷霆的狂怒；也可以是沼泽与森林的精巧低语，烈毒而蚀骨。',
        abilityBonuses: [],
        traits: [
          {
            name: '生物类型',
            description: '你是类人生物。'
          },
          {
            name: '色彩龙起源',
            description: '你的血脉可追溯 to 某只色彩龙身上，这赋予你特殊的魔法亲和。从色彩龙血脉表格中选择一项，这将决定你其他特性的伤害类型：\n· 黑龙：强酸\n· 蓝龙：闪电\n· 绿龙：毒素\n· 红龙：火焰\n· 白龙：寒冷',
            choices: [
              {
                id: 'chromatic-ancestry',
                name: '选择你的色彩龙起源',
                chooseNumber: 1,
                options: [
                  { id: 'chromatic-black', name: '黑 (强酸)', description: '黑龙起源，对应伤害类型：强酸' },
                  { id: 'chromatic-blue', name: '蓝 (闪电)', description: '蓝龙起源，对应伤害类型：闪电' },
                  { id: 'chromatic-green', name: '绿 (毒素)', description: '绿龙起源，对应伤害类型：毒素' },
                  { id: 'chromatic-red', name: '红 (火焰)', description: '红龙起源，对应伤害类型：火焰' },
                  { id: 'chromatic-white', name: '白 (寒冷)', description: '白龙起源，对应伤害类型：寒冷' }
                ]
              }
            ]
          },
          {
            name: '吐息武器',
            description: '当你使用攻击动作时，你可以将其中一次攻击替换为呼出一种30尺长，5尺宽的魔法能量。矩形范围内的每个生物都必须成功通过一次DC为（8+你的体质调整值+你的熟练加值）的敏捷豁免，否则将受到1d10的对应色彩龙血脉的伤害，成功则伤害减半。该伤害在你达到5级时增至2d10，11级时增至3d10，17级时增至4d10。你可以使用该特性的次数等同于你的熟练加值，你在完成一次长休后重获所有已使用的次数。'
          },
          {
            name: '龙族抗性',
            description: '你获得你所选的色彩龙血脉对应的伤害类型的抗性。'
          },
          {
            name: '繁彩防护',
            description: '5级起，你可以用一个动作引导出你的龙族能量来保护自身。1分钟内，你免疫你所选的色彩龙血脉对应的伤害类型。在你使用此特性后，你在完成一次长休之前不能再次使用。',
            level: 5
          }
        ],
        spells: [],
        source: 'fod'
      },
      {
        id: 'metallic-dragonborn',
        name: '金属龙裔',
        description: '有着金属龙血脉的龙裔有着无所畏惧的韧性，这来自金属龙——黄铜，青铜，红铜，金，银——的特性在它们的鳞片上闪耀着光芒。它们的吐息是熔炉的心火，高山的冷峻，灵感的火花，也是涤荡净洁的融酸之触。',
        abilityBonuses: [],
        traits: [
          {
            name: '生物类型',
            description: '你是类人生物。'
          },
          {
            name: '金属龙起源',
            description: '你的血脉可追溯 to 某只金属龙身上，这赋予你特殊的魔法亲和。从金属龙血脉表格中选择一项，这将决定你其他特性的伤害类型：\n· 黄铜：火焰\n· 青铜：闪电\n· 赤铜：强酸\n· 金：火焰\n· 银：寒冷',
            choices: [
              {
                id: 'metallic-ancestry',
                name: '选择你的金属龙起源',
                chooseNumber: 1,
                options: [
                  { id: 'metallic-brass', name: '黄铜 (火焰)', description: '黄铜龙起源，对应伤害类型：火焰' },
                  { id: 'metallic-bronze', name: '青铜 (闪电)', description: '青铜龙起源，对应伤害类型：闪电' },
                  { id: 'metallic-copper', name: '赤铜 (强酸)', description: '赤铜龙起源，对应伤害类型：强酸' },
                  { id: 'metallic-gold', name: '金 (火焰)', description: '金龙起源，对应伤害类型：火焰' },
                  { id: 'metallic-silver', name: '银 (寒冷)', description: '银龙起源，对应伤害类型：寒冷' }
                ]
              }
            ]
          },
          {
            name: '吐息武器',
            description: '当你使用攻击动作时，你可以将其中一次攻击替换为呼出一种15尺锥形的魔法能量。锥形范围内的每个生物都必须成功通过一次DC为（8+你的体质调整值+你的熟练加值）的敏捷豁免，否则将受到1d10的对应金属龙血脉的伤害，成功则伤害减半。该伤害在你达到5级时增至2d10，11级时增至3d10，17级时增至4d10。你可以使用该特性的次数等同于你的熟练加值，你在完成一次长休后重获所有已使用的次数。'
          },
          {
            name: '龙族抗性',
            description: '你获得你所选的金属龙血脉对应的伤害类型的抗性。'
          },
          {
            name: '金属龙吐息武器',
            description: '5级起，你获得第二种吐息武器。当你使用攻击动作时，你可以将其中一次攻击替换为呼出一种15尺锥形的魔法气体。其豁免DC为8+你的体质调整值+你的熟练加值。在你使用此特性时，选择以下一项：\n· 衰弱吐息：范围内的每个生物必须成功通过一次体质豁免，否则将陷入失能，直至你的下个回合开始。\n· 排斥吐息：范围内的每个生物必须成功通过一次力量豁免，否则将被推离20尺并应击倒地。在你使用你的金属龙吐息武器后，你不能再次使用它，直至你完成一次长休。',
            level: 5
          }
        ],
        spells: [],
        source: 'fod'
      },
      {
        id: 'gem-dragonborn',
        name: '宝石龙裔',
        description: '有着宝石龙血脉的龙裔分享着所有宝石龙的遗馈，他们称自己为红宝石龙萨迪沃——第一条被创造的宝石龙，由巴哈姆特与提亚马特在第一世界的元日制造而成——的继承人。宝石龙的颜色与神秘力量——紫晶、水晶、翡翠、蓝宝石，黄玉——在他们的鳞片皮肤表面闪耀，流淌在他们的血液中，他们的吐息是心灵的遐想，意志的伟力，顿悟的灵光，发现的回响，绝望的干涸。',
        abilityBonuses: [],
        traits: [
          {
            name: '生物类型',
            description: '你是类人生物。'
          },
          {
            name: '宝石龙起源',
            description: '你的血脉可追溯 to 某只宝石龙身上，这赋予你特殊的魔法亲和。从宝石龙血脉表格中选择一项，这将决定你其他特性的伤害类型：\n· 紫晶：力场\n· 水晶：光耀\n· 翡翠：心灵\n· 蓝宝石：雷鸣\n· 黄玉：暗蚀',
            choices: [
              {
                id: 'gem-ancestry',
                name: '选择你的宝石龙起源',
                chooseNumber: 1,
                options: [
                  { id: 'gem-amethyst', name: '紫晶 (力场)', description: '紫晶龙起源，对应伤害类型：力场' },
                  { id: 'gem-crystal', name: '水晶 (光耀)', description: '水晶龙起源，对应伤害类型：光耀' },
                  { id: 'gem-emerald', name: '翡翠 (心灵)', description: '翡翠龙起源，对应伤害类型：心灵' },
                  { id: 'gem-sapphire', name: '蓝宝石 (雷鸣)', description: '蓝宝石龙起源，对应伤害类型：雷鸣' },
                  { id: 'gem-topaz', name: '黄玉 (暗蚀)', description: '黄玉龙起源，对应伤害类型：暗蚀' }
                ]
              }
            ]
          },
          {
            name: '吐息武器',
            description: '当你使用攻击动作时，你可以将其中一次攻击替换为呼出一种15尺锥形的魔法能量。锥形范围内的每个生物都必须成功通过一次DC为（8+你的体质调整值+你的熟练加值）的敏捷豁免，否则将受到1d10的对应宝石龙血脉的伤害，成功则伤害减半。该伤害在你达到5级时增至2d10，11级时增至3d10，17级时增至4d10。你可以使用该特性的次数等同于你的熟练加值，你在完成一次长休后重获所有已使用的次数。'
          },
          {
            name: '龙族抗性',
            description: '你获得你所选的宝石龙血脉对应的伤害类型的抗性。'
          },
          {
            name: '灵能心智',
            description: '你可以与身边 30 尺内任意你能看见的生物通过心灵感应方式进行交流。你无须懂得该生物的语言也能使其理解你通过心灵感应所传达的话语，但它必须至少会一种语言来理解你传达的信息。'
          },
          {
            name: '宝石之翼',
            description: '5级起，你可以用附赠动作在身上显形一对幽光翅膀，持续1分钟。你在持续时间内获得等同你步行速度的飞行速度，并且可以悬浮。使用此特性后，你在完成一次长休前不能再次使用。',
            level: 5
          }
        ],
        spells: [],
        source: 'fod'
      }
    ]
  }
];
