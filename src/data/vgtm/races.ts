import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'aasimar',
    name: '阿斯莫',
    description: '阿斯莫的灵魂深处承载着来自天堂山神圣领域的纯净光辉。他们是凡人与天界圣界力量契合所化生的眷顾之子。阿斯莫天生拥有散发着微弱光芒的超凡面容，这彰显着他们独特的高贵血脉和作为公义守望者的崇高宿命。在成长岁月中，一位由神明指派的天使向导——通常是梵天神侍，会在梦境 and 冥想中以异象和预言默默引领他们，期许他们打击邪恶、以身作则。即使阿斯莫拥有自主的自由意志并偶有偏离堕落，但他们绝大部分人依然在隐秘地流浪世间。出于保护无辜者的本能，他们不惜戴上厚重的风帽以隐匿面庞，甘愿在黑暗的阴霾中挥舞璀璨的炽白羽翼、引导神圣力量来践行不朽的正义誓言。',
    abilityBonuses: [{ ability: 'CHA', bonus: 2 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '天界语'],
    traits: [
      { name: '黑暗视觉', description: '由于受到光耀之魂的祝福，你的视线可以轻易的穿透黑暗。你在看距离你60尺范围内的事物时，微光的照明程度对你而言视作明亮，黑暗则视作微光。你无法辨别黑暗中的颜色，而只能看到灰黑的轮廓。' },
      { name: '天界抗性', description: '你具有对黯蚀和光耀伤害的抗性。' },
      { name: '治愈之手', description: '以一个动作，你可以触碰一个生物并让它回复等同于你等级的生命值。一旦你使用这个特性，直到你完成一次长休之前你都不能再使用它。' },
      { name: '光辉掌者', description: '你知晓光亮术戏法。你施展这个法术的施法属性为魅力。' }
    ],
    spells: [{ level: 0, spellId: 'light' }],
    source: 'vgtm',
    subraces: [
      {
        id: 'fallen-aasimar',
        name: '堕落阿斯莫',
        description: '被放逐的阿斯莫。',
        abilityBonuses: [{ ability: 'STR', bonus: 1 }],
        traits: [
          { name: '死灵障幕', description: '3级时可释放神性能量，使身边人恐惧，并造成自身等级额外黯蚀伤害（持续1分钟，每天一次）。' }
        ],
        spells: [],
        source: 'vgtm'
      },
      {
        id: 'protector-aasimar',
        name: '守护者阿斯莫',
        description: '被天界指派的守护者。',
        abilityBonuses: [{ ability: 'WIS', bonus: 1 }],
        traits: [
          { name: '光辉灵魂', description: '3级起长出光翼，30尺飞行速度，并造成自身等级额外光耀伤害（持续1分钟，每天一次）。' }
        ],
        spells: [],
        source: 'vgtm'
      },
      {
        id: 'scourge-aasimar',
        name: '天谴阿斯莫',
        description: '充满摧毁邪恶的神圣能量。',
        abilityBonuses: [{ ability: 'CON', bonus: 1 }],
        traits: [
          { name: '光辉焚化', description: '3级放出光芒散布伤害，并在一次攻击中附加自身等级光耀伤害（持续1分钟，每天一次）。' }
        ],
        spells: [],
        source: 'vgtm'
      }
    ]
  },
  {
    id: 'tabaxi',
    name: '斑猫人',
    description: '斑猫人是来自隐秘而遥远国度、宛如灵猫般的类人生物。在神明猫之主的低语下，每一个斑猫人孩子都被赐予了无法遏制、甚至堪称狂野的强烈好奇心。这种天性驱使着他们成为不知疲倦的终身旅行者，游历五湖四海去搜集失落 of 古代遗物、奇妙传说、未知故事与隐秘知识。斑猫人从不在乎世俗财富的多寡，黄金于他们而言仅仅是维系漫长旅途的口粮：只有当事物依然保留着神秘面纱时，它才具有无限的吸引力。他们步伐极度轻捷、身手敏捷，情绪转瞬即逝且充满自信。当热情消逝时，他们会毫不留恋地把拼命夺来的宝物随手易物。晚年归乡后，这些阅历丰富的流浪者会向氏族同胞述说外界的波澜壮阔，将猫科的灵动与对世界的惊叹代代相传。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'CHA', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '自选一门语言'],
    traits: [
      { name: '猫科迅捷', description: '回合移动时可将速度加倍，直到停止移动一回合后重置。' },
      { name: '猫之利爪', description: '20尺攀爬速度，徒手打击造成1d4+力量的挥砍伤害。' },
      { name: '猫之天赋', description: '熟练于察觉和隐匿技能。' }
    ],
    spells: [],
    skillProficiencies: ['perception', 'stealth'],
    source: 'vgtm'
  },
  {
    id: 'yuan-ti-pureblood',
    name: '纯血蛇人',
    description: '纯血蛇人是古老帝国贪婪追求飞升、将自己与邪恶蛇神血脉相融合所诞生的冷酷后裔。作为蛇人阶级中最接近人类凡人外貌的群体，他们拥有光滑且隐约闪烁着细密鳞片的肌肤，以及一双冰冷无情、几无人类情感起伏的蛇眼。纯血蛇人是极致的理性与虚伪者，他们习惯将情绪和同理心视为软弱的缺陷，并极其擅长以此来伪装、蛊惑并操纵身边的凡人以达成背后的阴谋。联通于两个位面的毒素和抵抗一切奥术扭曲的天然抗性，擅长以天生的魅惑与毒雾术来戏弄猎物。许多纯血蛇人以间谍、使节或野心勃勃的欺诈者身份活跃在人类世界，或是作为暗星之下的致命阴谋家，冷眼俯瞰着那些被凡人情感与无谓道德所左右的、在他们看来注定走向覆灭和衰弱的弱小种族。',
    abilityBonuses: [{ ability: 'CHA', bonus: 2 }, { ability: 'INT', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '深渊语', '龙语'],
    traits: [
      { name: '天生施法', description: '知晓毒气喷洒戏法，能对蛇类施放化兽为友。3级可施放暗示术。' },
      { name: '魔法抗性', description: '对抗魔法的豁免具有优势。' },
      { name: '毒素免疫', description: '免疫毒素伤害和中毒。' }
    ],
    spells: [
      { level: 0, spellId: 'poison-spray' },
      { level: 1, spellId: 'animal-friendship' },
      { level: 3, spellId: 'suggestion' }
    ],
    source: 'vgtm'
  },
  {
    id: 'firbolg',
    name: '费尔伯格',
    description: '费尔伯格是隐居于幽深而古老森林深处、体型高大且拥有天然德鲁伊法术造诣的温和隐士。作为自然的忠实守护者与牧羊人，他们将森林视为大地的神圣心脏与不朽生命丰碑，默默履行着维护自然与尘世平衡的圣洁使命。费尔伯格性情谦逊内敛，极度鄙夷贪婪与无节制的奢靡掠夺，仅凭极少数资源就能精妙而富足地与自然共生。因为流淌着纯净精类和巨人神圣遗风，他们能自由掌握“神隐步”进行潜行漫步，利用“费尔伯格魔法”调和世事，甚至无障碍地与一花一木、飞禽走兽倾诉“兽与叶之语”。当宁静的家园遭遇残暴的外来入侵时，这些温厚的隐修士就会化身为坚不可摧的德鲁伊和森林斗士，以浩瀚的天雷与磅礴魔力给予胆敢玷污圣土的愚蠢之徒迎头重击。',
    abilityBonuses: [{ ability: 'WIS', bonus: 2 }, { ability: 'STR', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '精灵语', '巨人语'],
    traits: [
      { name: '费尔伯格魔法', description: '可施放侦测魔法和易容术（可让自己短3尺）。' },
      { name: '神隐步', description: '用附赠动作隐形，直到攻击或施法为止。' },
      { name: '强健体格', description: '负重视作大一级。' },
      { name: '兽与叶之语', description: '可用有限方式与动植物沟通，对它们魅力检定有优势。' }
    ],
    spells: [
      { level: 1, spellId: 'detect-magic' },
      { level: 1, spellId: 'disguise-self' }
    ],
    source: 'vgtm'
  },
  {
    id: 'goliath',
    name: '歌利亚',
    description: '歌利亚是常年居于万仞危峰、在空气稀薄且狂风白雪呼啸的群山之巅中锤炼出钢铁意志的高山之子。他们坚毅的身躯仿佛是由风化磐石和坚冰亲手雕琢而成，蕴藏着令人望而生畏的惊天神力与“强健体格”。在残酷险峻的极寒地带，歌利亚社会将个人技能的精益求精和“公平竞争”视作部落生死存亡的唯一准则；他们不断挑战自己的体能和意志极限，宁愿在力量与武勇的巅峰英勇战死，也决不苟活忍受身体与意志的衰朽。他们天生具有无与伦比的“石之耐性”与抗寒高山体质，不解也不屑于复杂的贵族权谋和依赖外物的等级制度，认为世间唯有真正的才干、健壮和对荒野法则的冰冷敬重，才是证明凡人高贵并立足于多元宇宙天幕下的唯一磐石。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '巨人语'],
    traits: [
      { name: '天生运动员', description: '熟练于运动技能。' },
      { name: '石之耐性', description: '受到伤害时，可用反应该伤害减少1d12+体质调整值。' },
      { name: '强健体格', description: '负重视作大一级。' },
      { name: '高山之子', description: '对冷冻抗性，习惯高海拔。' }
    ],
    spells: [],
    skillProficiencies: ['athletics'],
    source: 'vgtm'
  },
  {
    id: 'kenku',
    name: '天狗',
    description: '被诅咒失去原创声音和飞行能力的鸦类。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '气族语'],
    traits: [
      { name: '专业伪造', description: '拷贝笔迹和手工享有优势。' },
      { name: '天狗训练', description: '熟练于体操、欺瞒、隐匿、巧手中的两个。', choices: [
        {
          id: 'kenku-skills',
          name: '选择两项技能',
          chooseNumber: 2,
          options: [
            { id: 'acrobatics', name: '特技' },
            { id: 'deception', name: '欺瞒' },
            { id: 'stealth', name: '隐匿' },
            { id: 'sleightOfHand', name: '巧手' }
          ]
        }
      ] },
      { name: '拟声', description: '仅能以拟声能力和其他人说话。' }
    ],
    spells: [],
    source: 'vgtm'
  },
  {
    id: 'lizardfolk',
    name: '蜥蜴人',
    description: '冷漠且只受生存本能驱动的爬虫。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }, { ability: 'WIS', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '龙语'],
    traits: [
      { name: '游泳速度', description: '拥有30尺游泳速度。' },
      { name: '啃咬', description: '天生武器，1d6+力量穿刺。' },
      { name: '能巧工匠', description: '小休时可用怪物遗骸制作简单武器盾牌。' },
      { name: '屏息', description: '屏息15分钟。' },
      { name: '猎人学识', description: '熟练于二项：驯兽, 自然, 察觉, 隐匿, 生存', choices: [
        {
          id: 'lizardfolk-skills',
          name: '选择两项技能',
          chooseNumber: 2,
          options: [
            { id: 'animalHandling', name: '驯兽' },
            { id: 'nature', name: '自然' },
            { id: 'perception', name: '察觉' },
            { id: 'stealth', name: '隐匿' },
            { id: 'survival', name: '生存' }
          ]
        }
      ] },
      { name: '天生护甲', description: '无甲AC 13+敏捷。' },
      { name: '饥渴之腭', description: '附赠动作啃咬并拿体质等量临时生命。' }
    ],
    spells: [],
    source: 'vgtm'
  },
  {
    id: 'hobgoblin',
    name: '大地精',
    description: '大地精是地精类生物中纪律严明、体格魁梧的军国主义者。他们拥有橙红色的皮肤和精悍有力的体格，视荣誉、秩序与严格的层级军规为不可动摇的生命基石。在征服之神马格鲁比耶的冷酷凝视下，大地精整个群体都被塑造成一台精准运转的庞大战术机器，每一名成员都渴望在浴血拼杀和攻城拔略中证明自己的无上战功。他们极其推崇集体荣誉以及公平有序的晋升机制，视落后与怯懦为深重罪孽；对他们而言，在失败时“挽回颜面”的执念会激发起惊人的反扑潜能。当部分大地精脱离冷酷帝国的桎梏走上冒险之路时，他们依然保留着无懈可击的战术眼光 and 钢铁般的顽强纪律，坚信自己的军事素养与武器训练能轻易攻克挡在面前的所有艰难险阻。',
    abilityBonuses: [{ ability: 'CON', bonus: 2 }, { ability: 'INT', bonus: 1 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '地精语'],
    traits: [
      { name: '军武训练', description: '你熟练于轻甲以及两件由你选择的军用武器。' },
      { name: '挽回颜面', description: '倘若你未能在一次攻击检定、属性检定或豁免检定中成功，你可以获得等同于你30尺内能看见的盟友数量的加值（最大值为加5）。一旦使用此特性，必须在完成一次短休或长休后方可再次使用。' }
    ],
    spells: [],
    source: 'vgtm'
  },
  {
    id: 'goblin',
    name: '地精',
    description: '地精是地精类群落中体型娇小、生存技巧极为顽强的敏捷生物。由于长期处于力量链条的最底层，他们习惯了暗中观察和在暗影中潜伏等待时机，坚信卑劣、灵活和难以置信的狗屎运才是世界运行的根本法则。尽管大多数凡人对地精抱有狡诈多端、吵闹不堪的偏见，但他们那宛如野草般的狂野情感和不可磨灭的生命力不仅令其在荒地与阴暗角落地带生生不息，更赋予了他们出色的爆发力。这些瘦小伶俐、长满尖牙和长耳的生命具有出乎意料的顽强抗争心；他们精通“敏捷脱逃”的游击战法，当面对那些不可一世的庞大生物时，体内被压抑积郁的力量就会爆发出惊天动地的“弱者发怒”，在阴险诡谲的战术、惊人的攀爬身手与令人咋舌的运气中，夺回属于自己的荣耀和生机。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Small',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '地精语'],
    traits: [
      { name: '弱者发怒', description: '当你使用攻击或法术对一个体型大于你的生物造成伤害时，你可以使其承受额外等同于你角色等级的伤害。每完成一次短休或长休限一次。' },
      { name: '敏捷脱逃', description: '你可以在每个你的回合中使用一个附赠动作来进行撤离或躲藏行动。' }
    ],
    spells: [],
    source: 'vgtm'
  },
  {
    id: 'kobold',
    name: '狗头人',
    description: '狗头人是体型瘦小、长满鳞片，并疯狂崇拜着伟大巨龙的爬行类类人生物。他们坚信自己那微薄的血管里流淌着古老不朽的龙裔之血，这种强烈的血脉归属感赋予了他们坚韧的生命信念和出色的地道勘探与陷阱工程才能。因为身单力薄，狗头人早已将“群体战术”作为绝对的核心智慧，一旦有哪怕一个可靠的盟友在旁协助，他们就会爆发出双倍的命中潜能去倾力反扑。为了保障部落的繁衍生息，他们毫不介意以卑劣、哀求甚至“摇尾乞怜”的方式麻痹敌人。哪怕长期生活在黑暗坑道而患有直射“日光敏感”的弱点，但当这些灵动机敏的小家伙被迫踏出地下巢穴，他们就会凭借卓越的陷阱工艺和团队配合在危机四伏的冒险中赢得尊严并续写龙之传奇。',
    abilityBonuses: [{ ability: 'DEX', bonus: 2 }, { ability: 'STR', bonus: -2 }],
    size: 'Small',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '龙语'],
    traits: [
      { name: '摇尾乞怜', description: '你使用一个动作在敌人面前通过卑微的哀求来分散其注意力，使得你的盟友在对10尺内看到你的敌人进行的攻击检定中拥有优势。每完成一次短休或长休限一次。' },
      { name: '群体战术', description: '当你攻击一个生物时，如果至少有一个非无力的盟友在目标5尺范围内，你的攻击检定具有优势。' },
      { name: '日光敏感', description: '当你或你的攻击目标暴露在直射阳光下，且你试图进行依仗视觉的察觉检定或攻击检定时，你具有劣势。' }
    ],
    spells: [],
    source: 'vgtm'
  },
  {
    id: 'orc',
    name: '兽人',
    description: '兽人是体型雄伟健壮、性情狂野且崇尚原始武勇与纯粹力量的类人族裔。在独眼战争之神格乌什的雷霆咆哮下，每一个兽人生来就被赋予了坚忍不拔的钢铁身躯和不可侵犯的掠夺天性。他们拥有厚重的灰绿色皮肤和威猛獠牙，不屑于世俗精致伪饰的繁文缛节，而是深深拜倒在原野暴风、狩猎狂澜和绝对的物理压迫感前。兽人具有惊人的“强健体格”和天生的荒野“原初直觉”，其狂暴意志甚至会在冲锋时化作无法抵挡的“侵略性”，以不可思议的暴烈之姿全速冲至敌人近身肆虐。当不屈的兽人战士或萨满行者洗净鲜血并挣脱嗜血旧俗的束缚时，他们依然是整个冒险队伍中最令人敬畏的开路先盾与力量化身。',
    abilityBonuses: [{ ability: 'STR', bonus: 2 }, { ability: 'CON', bonus: 1 }, { ability: 'INT', bonus: -2 }],
    size: 'Medium',
    speed: 30,
    vision: '黑暗视觉 60 尺',
    languages: ['通用语', '兽人语'],
    traits: [
      { name: '侵略性', description: '你使用一个附赠动作，可以向一个距离你可见且带有敌意的生物移动最多等同你速度的距离。' },
      { name: '原初直觉', description: '你获得以下技能中的两门熟练项：驯兽、直觉、威吓、医疗、自然、察觉、生存。', choices: [
        {
          id: 'orc-skills',
          name: '选择两项技能',
          chooseNumber: 2,
          options: [
            { id: 'animalHandling', name: '驯兽' },
            { id: 'insight', name: '直觉' },
            { id: 'intimidation', name: '威吓' },
            { id: 'medicine', name: '医疗' },
            { id: 'nature', name: '自然' },
            { id: 'perception', name: '察觉' },
            { id: 'survival', name: '生存' }
          ]
        }
      ] },
      { name: '强健体格', description: '在决定你可搬运和托举的负重限额，以及将你的体型视作比实际大一级（属于大型生物）。' }
    ],
    spells: [],
    source: 'vgtm'
  }
];
