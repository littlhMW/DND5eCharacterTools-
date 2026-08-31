import { Spell } from '../../types/dnd';

export const spells: Spell[] = [
  {
    id: "encode-thoughts",
    name: "编码思想",
    level: 0,
    school: "惑控系",
    castingTime: "1 动作",
    range: "自身",
    components: "S",
    duration: "至多 8 小时",
    description: "你将一个记忆或想法凝聚成一个发光的丝状思维束。该思维束可以被任何人带走，并且可以通过侦测思想或底密尔的特有手段被读取或修改。",
    source: "ggr"
  },
  {
    id: "chaos-bolt",
    name: "混乱箭",
    level: 1,
    school: "塑能系",
    castingTime: "1 动作",
    range: "120 尺",
    components: "V, S",
    duration: "瞬间",
    description: "你向距离内一个生物射出一支起伏颤动，裹杂着混乱能量的箭矢。进行一次远程法术攻击。若命中，目标受2d8 + 1d6伤害。你选择d8中的一粒，其数值决定伤害类型（1酸、2冷、3火、4雷鸣、5闪电、6毒素、7心灵、8力场）。若掷出的两个d8数值相同，混沌能量会向30尺内另一个生物跃迁攻击。",
    source: "ggr"
  }
];
