import { Spell } from '../../types/dnd';

export const spells: Spell[] = [
  {
    id: "green-flame-blade",
    name: "翠炎剑",
    level: 0,
    school: "塑能",
    castingTime: "1 动作",
    range: "自身 (5尺 半径)",
    components: "V, M",
    duration: "瞬间",
    description: "你作为施法的一部分用一把近战武器发起一次攻击。命中除了承受正常的武器攻击外会产生翠绿的火焰，跃向另一个在目标周围5尺内由你选择的可见生物。对其造成等于你施法关键属性调整值的火焰伤害。",
    source: "tce"
  },
  {
    id: "booming-blade",
    name: "轰雷剑",
    level: 0,
    school: "塑能",
    castingTime: "1 动作",
    range: "自身 (5尺 半径)",
    components: "V, M",
    duration: "1 轮",
    description: "你作为施法的一部分用一把近战武器发起一次攻击。如果命中，若目标自愿移动五尺以上，会受到1d8雷鸣伤害。法术也会随等级增加伤害。",
    source: "tce"
  },
  {
    id: "sword-burst",
    name: "剑刃爆发",
    level: 0,
    school: "咒法",
    castingTime: "1 动作",
    range: "自身 (5尺 半径)",
    components: "V",
    duration: "瞬间",
    description: "你挥舞幽灵武器划出一个环形，每个5尺内的生物必须过敏捷豁免，失败受1d6力场伤害。",
    source: "tce"
  },
  {
    id: "lightning-lure",
    name: "闪电牵引",
    level: 0,
    school: "塑能",
    castingTime: "1 动作",
    range: "自身 (15尺 半径)",
    components: "V",
    duration: "瞬间",
    description: "你射出一道闪电鞭试图将目标拉近并电击。目标需进行力量豁免，失败被拉近10尺，并承受1d8闪电伤害（拉近后如果在你5尺内才会承受伤害）。",
    source: "tce"
  },
  {
    id: "tashas-caustic-brew",
    name: "塔莎酸蚀酿",
    level: 1,
    school: "塑能",
    castingTime: "1 动作",
    range: "自身 (30尺 直线)",
    components: "V, S, M",
    duration: "专注, 至多 1 分钟",
    description: "你喷出一道强酸直线，范围内的生物须过敏捷豁免，失败者被强酸附着，在其自己回合开始时受2d4强酸伤害直到目标或其触及内的生物使用动作刮去它。",
    source: "tce"
  },
  {
    id: "intellect-fortress",
    name: "智能壁垒",
    level: 3,
    school: "防护",
    castingTime: "1 动作",
    range: "30 尺",
    components: "V",
    duration: "专注, 至多 1 小时",
    description: "你在目标周围生成心灵屏障，其在智力、感知和魅力豁免中得到优势，同时获得心灵伤害抗性。",
    source: "tce"
  },
  {
    id: "summon-construct",
    name: "构装体召唤术",
    level: 4,
    school: "咒法",
    castingTime: "1 动作",
    range: "90 尺",
    components: "V, S, M",
    duration: "专注, 至多 1 小时",
    description: "召唤一个由魔法组装的精神构装体加入为你战斗，由你提供指令其会紧随你的先攻进行动作。它在属性上可以选择金属、石头或粘土等材质加成。",
    source: "tce"
  }
];
