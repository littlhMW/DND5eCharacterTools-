import { Race } from '../../types/dnd';

/**
 * 模板说明:
 * 在此添加扩展中的主种族。
 * `subraces` 直接嵌套在主种族对象里，不在外部额外导出。
 * 请确保 `source` 字段为小写的扩展名 (例如 'rot')。
 */
export const races: Race[] = [
  /*
  {
    id: "sample_race",
    name: "示例种族",
    description: "简介...",
    abilityBonuses: [{ ability: "STR", bonus: 2 }],
    size: "Medium",
    speed: 30,
    vision: "黑暗视觉 (60尺)",
    languages: ["通用语"],
    traits: [
       { name: "特性名称", description: "特性描述" }
    ],
    spells: [],
    subraces: [
       {
         id: "sample_subrace",
         name: "示例亚种族",
         description: "简介...",
         abilityBonuses: [{ ability: "INT", bonus: 1 }],
         traits: [],
         spells: []
       }
    ],
    source: "rot"
  }
  */
];
