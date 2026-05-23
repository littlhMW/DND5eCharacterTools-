import { DndClass } from '../../types/dnd';

export const classes = [
{
  "id": "cleric",
  "name": "",
  "subclasses": [
    {
      "id": "death",
      "name": "死亡领域",
      "description": "死亡领域掌控使生灵陨落的原动力与死灵负能量。该领域神祇执掌着谋杀、痛苦、疫病及冥界之权，是死灵法师、巫妖和吸血鬼等不死存在的终极守护者。",
      "source": "DMG",
      "traits": [
        {
          "name": "额外熟练",
          "description": "该牧师获得军用武器熟练项。",
          "level": 1
        },
        {
          "name": "收割者",
          "description": "该牧师可以从任意法术列表中选择学习一个死灵戏法。该牧师施展一个通常指定一个生物为目标的死灵戏法时，则该法术现在可以指定施法距离内两个相互之间距离不超过5尺的生物。",
          "level": 1
        },
        {
          "name": "引导神力：死亡之触",
          "description": "该牧师可以用引导神力特性并通过触碰来摧毁另一生物的生命力。\n\n该牧师以近战攻击命中一个生物时，可以使用引导神力对该目标造成额外的黯蚀伤害。该伤害值等于5 + 其牧师等级两倍的数值。",
          "level": 2
        },
        {
          "name": "命定毁伤",
          "description": "该牧师引导负能量的能力更为有效。该角色的牧师法术与引导神力选项所造成的黯蚀伤害将无视对黯蚀伤害抗性。",
          "level": 6
        },
        {
          "name": "神圣打击",
          "description": "该牧师可以使其武器打击充满负能量。该牧师在每个其自己回合里有一次机会，可以在用武器攻击命中某生物时额外造成1d8的黯蚀伤害。第14级时，该伤害提升到2d8。",
          "level": 8
        },
        {
          "name": "精通收割者",
          "description": "该牧师施展一个1至5环的死灵法术时，若该法术只指定一个生物为目标，则将其改为指定施法距离内相互之间距离不超过5尺的两个生物。如果该法术消耗其材料构材，则该牧师必须为每个目标提供一份耗材。",
          "level": 17
        }
      ],
      "spells": [
        {
          "level": 1,
          "spellId": "false-life",
          "alwaysPrepared": true
        },
        {
          "level": 1,
          "spellId": "ray-of-sickness",
          "alwaysPrepared": true
        },
        {
          "level": 3,
          "spellId": "blindness-deafness",
          "alwaysPrepared": true
        },
        {
          "level": 3,
          "spellId": "ray-of-enfeeblement",
          "alwaysPrepared": true
        },
        {
          "level": 5,
          "spellId": "animate-dead",
          "alwaysPrepared": true
        },
        {
          "level": 5,
          "spellId": "vampiric-touch",
          "alwaysPrepared": true
        },
        {
          "level": 7,
          "spellId": "blight",
          "alwaysPrepared": true
        },
        {
          "level": 7,
          "spellId": "death-ward",
          "alwaysPrepared": true
        },
        {
          "level": 9,
          "spellId": "antilife-shell",
          "alwaysPrepared": true
        },
        {
          "level": 9,
          "spellId": "cloudkill",
          "alwaysPrepared": true
        }
      ]
    }
  ]
},
{
  "id": "paladin",
  "name": "",
  "subclasses": [
    {
      "id": "oathbreaker",
      "name": "破誓者",
      "description": "破誓者是那些主动背弃或违背神圣誓言，堕入黑暗的圣武士。追求正义的美德已荡然无存，他们为复仇与野心所吞噬，转化成受不可遏制的黑暗力量驱使的极恶邪物。",
      "source": "DMG",
      "traits": [
        {
          "name": "破誓者法术",
          "description": "你获得以下额外法术。\n3级. 炼狱叱喝, 造成伤势\n5级. 疯狂冠冕, 黑暗术\n9级. 活化死尸, 降咒\n13级. 枯萎术, 困惑术\n17级. 疫病术, 支配人类",
          "level": 3
        },
        {
          "name": "引导神力：控制亡灵",
          "description": "以一个动作，该圣武士指定其身边30尺内一个他能看见的不死生物。该目标必须进行一次感知豁免。豁免失败时，该目标必须在随后的24小时里遵从该圣武士的命令，或者直至该圣武士再次使用该引导神力选项为止。挑战等级等于或高于该圣武士等级的不死生物免疫该效应。",
          "level": 3
        },
        {
          "name": "引导神力：恐怖显现",
          "description": "以一个动作，该圣武士引导最黑暗的情感并将其凝聚爆发为一场魔法的胁迫之息。该圣武士周边30尺内，其指定的每个能看到该圣武士的生物必须进行一次感知豁免。豁免失败的目标将陷入1分钟对该圣武士恐慌的状态。因该效应陷入恐慌的生物如果在距离该圣武士30尺外的位置结束其自己回合，则其可以尝试再进行一次该感知豁免，豁免成功则终止其自己身上的该效应。",
          "level": 3
        },
        {
          "name": "憎恨灵光",
          "description": "该圣武士本身，以及其身边10尺内的所有邪魔和不死生物，都将获得与该圣武士魅力调整值相同（至少为+1）的近战武器伤害骰加值。一个生物一次只能从一名圣武士的该特性中获益。\n\n从18级开始，该灵光的覆盖范围增加至30尺。",
          "level": 7
        },
        {
          "name": "超然抗性",
          "description": "第15级时，该圣武士获得对非魔法武器的钝击、刺穿、挥砍伤害的抗性。",
          "level": 15
        },
        {
          "name": "恐惧之王",
          "description": "第20级时，以一个动作，该圣武士可以使自己在1分钟内环绕于阴郁的灵光中。该灵光可以将该圣武士周边30尺半径的亮光光照减弱为微光光照。任何受该圣武士恐慌的敌人在该灵光内开始其自己回合时将受到4d10的心灵伤害。此外，该圣武士以及由其指定的身处灵光中的生物都将笼罩于更深的幽影中。依赖视觉的生物对笼罩于该幽影中的生物发动攻击检定时具有劣势。\n\n灵光持续时，该圣武士可以在其自己回合内用一个附赠动作令该灵光内的幽影攻击一个生物。该圣武士对该目标发动一次近战法术攻击。若攻击命中，则该目标受到的黯蚀伤害等于3d10 + 该圣武士的魅力调整值。\n\n激活该灵光后，该圣武士必须完成一次长休才能再次使用该特性。",
          "level": 20
        }
      ]
    }
  ]
},
] as any as DndClass[];
