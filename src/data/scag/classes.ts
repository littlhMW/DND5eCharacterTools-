import { DndClass } from '../../types/dnd';

export const classes = [
{
  "id": "barbarian",
  "name": "",
  "subclasses": [
    {
      "id": "battlerager",
      "name": "战狂道途",
      "description": "在矮人语中以「库扎尔夫」闻名（意为「斧头笨蛋」），战狂是一群追随着战争之神，并选择了战狂道途的矮人们。他们特化于穿着笨重的钉刺甲投身战斗中，用他们的躯体本身打击敌人，让自己挥洒战斗的狂怒。",
      "source": "SCAG",
      "traits": [
        {
          "name": "限制 - 仅限矮人",
          "description": "只有矮人可以追随战狂道途。战狂在矮人的社会和文化中占据了特殊的地位。\n\n你的DM可以拔除这个限制以使之更符合战役设置。这个限制是为了被遗忘的国度而存在，但这也许并不适用于你DM的设定，或他那个版本的国度。",
          "level": 3
        },
        {
          "name": "战狂护甲",
          "description": "你获得把钉刺甲作为武器使用的能力。\n\n当你穿着钉刺甲并处于狂暴时，你可以使用一个附赠动作以你护甲上的尖刺对一个距离你5尺内的目标进行一次近战武器攻击。若该攻击命中，该尖刺将造成1d4穿刺伤害。你将力量调整值用于该攻击的攻击检定和伤害骰中。\n\n此外，当你使用攻击动作以擒抱一个生物时，若你的擒抱检定成功，目标将受到3点穿刺伤害。",
          "level": 3
        },
        {
          "name": "鲁莽放荡",
          "description": "当你在狂暴时使用鲁莽攻击，你也将获得等同于你体质调整值（最少为1）的临时生命值。若你在狂暴结束时有任何剩余的这些临时生命值，则它们将会消失。",
          "level": 6
        },
        {
          "name": "战狂冲锋",
          "description": "当你处于狂暴时，你能够以一个附赠动作采取疾走动作。",
          "level": 10
        },
        {
          "name": "尖刺反击",
          "description": "当一个距离你5尺内的生物以一次近战攻击命中你时，若你处于狂暴，未陷入无力状态，且正穿着钉刺甲，则攻击者将受到3点穿刺伤害。",
          "level": 14
        }
      ]
    }
  ]
},
{
  "id": "cleric",
  "name": "",
  "subclasses": [
    {
      "id": "arcana-domain",
      "name": "奥秘领域",
      "description": "奥秘领域专注于对神圣魔网与纯质魔法本质的研究。其牧师擅长将神明圣法与高深奥术极效联结，不仅是高超的法术消解大师，更可信手斩妖魔、除精类、破法界。",
      "source": "SCAG",
      "traits": [
        {
          "name": "奥法学徒",
          "description": "你获得奥秘技能的熟练，且你获得二个从法师法术列表中自选的戏法。对你而言，这些戏法被视作牧师戏法。",
          "level": 1
        },
        {
          "name": "引导神力：奥秘阻绝",
          "description": "你可以使用你的引导神力来抵御异界生物。\n\n以一个动作，你展现你的圣徽，且只要距离你30尺内你所选择的一个天界生物、元素、精类、或邪魔可以看见或听见你，它就必须进行一次感知豁免。若该生物豁免失败，则它将被驱散长达1分钟或直到它受到伤害。\n\n一个被驱散的生物必须用它的回合尝试尽可能的远离你，且它无法自愿的移动到距离你30尺内的空间。它无法采取反应。它的动作只能使用疾走动作或尝试挣脱阻止它移动的效果。若它无法移动，则该生物将使用闪避动作。\n\n在你升至5级后，当一个生物在对抗你奥秘阻绝能力的豁免检定中失败，若该生物并不在它的原生位面，且它的挑战等级为特定数值或更低，则该生物将被放逐长达1分钟（如同放逐术，无须专注）。",
          "level": 2
        },
        {
          "name": "法术破坏者",
          "description": "当你使用1环或更高环的法术回复一个盟友的生命值，你也可以选择结束一个作用于该生物上的法术。你所结束法术的环位必须等于或低于你用以施放该治疗法术所使用的法术位环阶。",
          "level": 6
        },
        {
          "name": "强力施法",
          "description": "你将你的感知调整值加入任何你使用牧师戏法所造成的伤害中。",
          "level": 8
        },
        {
          "name": "奥术宗师",
          "description": "你从法师法术列表中选择四个法术，其环阶分别如下：6环、7环、8环、9环。你将它们加入你的领域法术列表中。如同你其他的领域法术，它们永远视作被准备，且对你而言视作牧师法术。",
          "level": 17
        }
      ],
      "spells": [
        {
          "level": 1,
          "spellId": "detect-magic",
          "alwaysPrepared": true
        },
        {
          "level": 1,
          "spellId": "magic-missile",
          "alwaysPrepared": true
        },
        {
          "level": 3,
          "spellId": "magic-weapon",
          "alwaysPrepared": true
        },
        {
          "level": 3,
          "spellId": "nystuls-magic-aura",
          "alwaysPrepared": true
        },
        {
          "level": 5,
          "spellId": "dispel-magic",
          "alwaysPrepared": true
        },
        {
          "level": 5,
          "spellId": "magic-circle",
          "alwaysPrepared": true
        },
        {
          "level": 7,
          "spellId": "arcane-eye",
          "alwaysPrepared": true
        },
        {
          "level": 7,
          "spellId": "leomunds-secret-chest",
          "alwaysPrepared": true
        },
        {
          "level": 9,
          "spellId": "planar-binding",
          "alwaysPrepared": true
        },
        {
          "level": 9,
          "spellId": "teleportation-circle",
          "alwaysPrepared": true
        }
      ]
    }
  ]
},
{
  "id": "fighter",
  "name": "",
  "subclasses": [
    {
      "id": "purple-dragon-knight",
      "name": "紫龙骑士（旗将）",
      "description": "紫龙骑士是代表科米尔王权和极致正义的名门统帅。他们擅在沙场前线高呼战号、鼓舞士气，在一往无前的铁血攻势或冲锋中同时振奋并协同大军克敌致胜。",
      "source": "SCAG",
      "traits": [
        {
          "name": "限制：骑士爵位",
          "description": "紫龙骑士绑定于科米尔骑士爵位中的一个特别阶级。若你想在其他战役设置或想塑造一个不同于紫龙骑士的军阀，「旗将」将作为这个范型的通用称呼。",
          "level": 3
        },
        {
          "name": "鼓舞战吼",
          "description": "你学会如何激励你的盟友们战胜他们过去的伤害。当你使用你的回气能力，你可以选择最多三个距离你60尺内且与你同盟的生物。只要他们可以看见或听见你，他们将各自回复等同于你战士等级的生命值。",
          "level": 3
        },
        {
          "name": "皇家特使",
          "description": "紫龙骑士作为科米尔王室的外交特使。在7级时，你获得说服技能的熟练。若你已经熟练于它，则你可以选择获得下列其中一个技能的熟练：驯兽、洞悉、威吓或表演。\n\n你的熟练加值在你进行任何使用说服技能的属性检定时变为两倍。无论你是否通过此能力获得该技能的熟练，你都能享有这个好处。",
          "level": 7
        },
        {
          "name": "振奋之潮",
          "description": "当你使用你的动作如潮能力，你可以选择一个距离你60尺内且与你同盟的生物。只要它可以看见或听见你，该生物就能够以它的反应进行一次近战或远程武器攻击。\n\n从18级开始，你可以选择二个距离你60尺内且与你同盟的生物，而非一个。",
          "level": 10
        },
        {
          "name": "意志壁垒",
          "description": "你可以将你不屈能力的好处扩展到一个盟友身上。当你决定使用不屈能力以重骰一次智力、感知、或魅力豁免检定，且你不处于无力状态时，你可以选择一个距离你60尺内，且在对抗相同效果的豁免检定中失败的盟友。若该生物可以看见或听见你，则它也可以重骰它的豁免检定，且必须使用新的掷骰结果。",
          "level": 15
        }
      ]
    }
  ]
},
{
  "id": "monk",
  "name": "",
  "subclasses": [
    {
      "id": "way-long-death",
      "name": "永亡宗",
      "description": "永亡宗的武僧痴心于死亡的意义和机制。他们俘虏生物并用精心准备的实验去捕捉、记录、并理解他们死亡的瞬间。他们利用这些知识去指导他们的武术，从而产生了致命的战斗风格。",
      "source": "SCAG",
      "traits": [
        {
          "name": "死之触",
          "description": "你对于死亡的研究让你得以在另一个生物濒临死亡时抽取它的生命力。当你将一个距离你5尺内的生物的生命值归零时，你将获得等同于你感知调整值 + 你武僧等级的临时生命值（最少1点临时生命值）。",
          "level": 3
        },
        {
          "name": "索命之时",
          "description": "由于你的灵魂已经被死亡的阴影所影响，你得到以一个动作让你周遭人们动摇或恐惧的能力。当你采取这个动作时，每个距离你30尺内且能看见你的生物必须成功通过一次感知豁免，否则被你恐惧直到你的下个回合结束。",
          "level": 6
        },
        {
          "name": "掌握生死",
          "description": "你利用你对死亡的熟悉以逃离它的魔掌。当你的生命值被归零时，你可以消耗1点气（无须动作）以改为保有1点生命值。",
          "level": 11
        },
        {
          "name": "长眠触",
          "description": "你的触碰可以将死亡的能量导入一个生物体内。以一个动作，你触碰一个距离你5尺内的生物，且你消耗1到10点气。目标必须进行一次体质豁免，若该豁免失败则受到每一点被消耗的气2d10的黯蚀伤害，豁免成功则只受到一半的伤害。",
          "level": 17
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
      "id": "oath-crown",
      "name": "王冠之誓",
      "description": "王冠之誓高扬法律秩序与臣属忠诚的无上法度。圣武士誓死保卫王土、宣誓效忠正统，他们是坚不可摧的守护防线，可用神圣光环威逼并截断任何叛逆之徒。",
      "source": "SCAG",
      "traits": [
        {
          "name": "引导神力：捍卫挑战",
          "description": "以一个附赠动作，你发起一个挑战以强迫其他生物与你战斗。每个距离你30尺内你所选且你能看见的生物必须进行一次感知豁免。若豁免失败，该生物将无法自愿移动到距离你超过30尺范围的位置。这个效果对该生物的影响会在你陷入无力状态或死亡、或该生物距离你超过30尺时提早结束。",
          "level": 3
        },
        {
          "name": "引导神力：扭转局势",
          "description": "以一个附赠动作，你可以用你的引导神力援助重伤的生物。每个距离你30尺内你所选且能听见你的生物若只有不超过一半的生命值，则将回复等同于1d6 + 你的魅力调整值（至少为1）的生命值。",
          "level": 3
        },
        {
          "name": "神圣忠诚",
          "description": "当一个距离你5尺内的生物受到伤害，你可以使用你的反应以魔法性地让你的生命值代替该目标生物，使该生物不受伤害。取而代之，你受到该伤害。这个对你造成的伤害无法被任何方式减轻或避免。",
          "level": 7
        },
        {
          "name": "不屈之魂",
          "description": "你在用于避免被麻痹或震慑的豁免检定中具有优势。",
          "level": 15
        },
        {
          "name": "崇高卫士",
          "description": "你在战场上的姿态对那些致力于你事业的人们而言是一种强大的鼓舞。你可以使用你的动作以获得下列好处长达1小时：\n- 你对非魔法武器所造成的钝击、穿刺、挥砍伤害具有抗性。\n- 你的盟友在处于你30尺范围内时在死亡豁免中具有优势。\n- 你以及距离你30尺内的盟友在感知豁免中具有优势。\n\n这个效果会在你陷入无力状态或死亡时提早结束。一旦你使用此能力，直到你完成一次长休之前你都不能再使用它。",
          "level": 20
        }
      ],
      "spells": [
        {
          "level": 3,
          "spellId": "command",
          "alwaysPrepared": true
        },
        {
          "level": 3,
          "spellId": "compelled-duel",
          "alwaysPrepared": true
        },
        {
          "level": 5,
          "spellId": "warding-bond",
          "alwaysPrepared": true
        },
        {
          "level": 5,
          "spellId": "zone-of-truth",
          "alwaysPrepared": true
        },
        {
          "level": 9,
          "spellId": "aura-of-vitality",
          "alwaysPrepared": true
        },
        {
          "level": 9,
          "spellId": "spirit-guardians",
          "alwaysPrepared": true
        },
        {
          "level": 13,
          "spellId": "banishment",
          "alwaysPrepared": true
        },
        {
          "level": 13,
          "spellId": "guardian-of-faith",
          "alwaysPrepared": true
        },
        {
          "level": 17,
          "spellId": "circle-of-power",
          "alwaysPrepared": true
        },
        {
          "level": 17,
          "spellId": "geas",
          "alwaysPrepared": true
        }
      ]
    }
  ]
},
{
  "id": "warlock",
  "name": "",
  "subclasses": [
    {
      "id": "undying",
      "name": "不朽者",
      "description": "不朽者与巫妖或古代木乃伊法老这类极力逆转生死的凡俗巅峰存在缔结约盟。契术师得以一窥长生，获得在死伤边缘极速回血、免疫恶疾并能令死灵倒退的异能。",
      "source": "SCAG",
      "traits": [
        {
          "name": "常伴死亡",
          "description": "你学会拯救濒死戏法，且它对你而言视作契术师戏法。你同时在对抗任何疾病的豁免检定中具有优势。\n\n此外，不死生物将难以伤害你。若一个不死生物直接指定你作为一次攻击或伤害性法术的目标，该生物必须进行一次对抗你法术豁免DC的感知豁免（不死生物在使用会卷入你的范围效果时并不需要进行此检定，像是火球术的爆炸范围）。若豁免失败，该生物必须选择一个新的目标、或者放弃指定除了你之外的某人，这可能会导致该攻击或法术被浪费。若豁免成功，该生物将在接下来24小时内免疫于此效果。若你指定它为一次攻击或伤害性法术的目标，则该不死生物也将在接下来24小时内免疫于此效果。",
          "level": 1
        },
        {
          "name": "反抗死亡",
          "description": "你可以在欺骗死亡或帮助他人欺骗死亡时赋予自己活力。当你成功通过一次死亡豁免、或当你使用拯救濒死稳定一个生物的伤势时，你将回复等同于1d8 + 你的体质调整值（最少1点）的生命值。\n\n一旦你使用此能力，直到你完成一次长休之前你都不能再使用它。",
          "level": 6
        },
        {
          "name": "不朽天性",
          "description": "你可以永远地屏住气息，且你不再需要食物、饮水、或睡眠。尽管你仍然需要休息才能减轻力竭等级，且仍会得到完成短休和长休的好处。\n\n此外，你会以较慢的速度老化。每10年过去，你的身体只会老化1年，且你免疫于被魔法变老。",
          "level": 10
        },
        {
          "name": "不灭生命",
          "description": "当你升至14级时，你分享了一些不朽者宗主的真理秘密。在你的回合，你可以使用一个附赠动作以回复等同于1d8 + 你的契术师等级的生命值。此外，若你在使用此能力时将一个你断掉的身体部位放回它原本的位置，该部位将会重新接合。\n\n一旦你使用此能力，直到你完成一次短休或长休之前你都不能再使用它。",
          "level": 14
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
          "spellId": "silence",
          "alwaysPrepared": true
        },
        {
          "level": 5,
          "spellId": "feign-death",
          "alwaysPrepared": true
        },
        {
          "level": 5,
          "spellId": "speak-with-dead",
          "alwaysPrepared": true
        },
        {
          "level": 7,
          "spellId": "aura-of-life",
          "alwaysPrepared": true
        },
        {
          "level": 7,
          "spellId": "death-ward",
          "alwaysPrepared": true
        },
        {
          "level": 9,
          "spellId": "contagion",
          "alwaysPrepared": true
        },
        {
          "level": 9,
          "spellId": "legend-lore",
          "alwaysPrepared": true
        }
      ]
    }
  ]
},
] as any as DndClass[];
