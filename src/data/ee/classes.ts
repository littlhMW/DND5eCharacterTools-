import { DndClass } from '../../types/dnd';

/**
 * 模板说明:
 * 在此添加扩展职业或通过组合方式扩展已有职业的子职业。
 * 请确保 `source` 字段为小写的扩展名 (例如 'ee')，以便正确呈现 Wiki 链接标记。
 */
export const classes: DndClass[] = [
  /*
  {
    id: "sample_class",
    name: "示例职业 (需要完整实现)",
    description: "简介...",
    hitDie: 8,
    primaryAbility: ['DEX'],
    saves: ['DEX'],
    armorProficiencies: [],
    weaponProficiencies: [],
    toolProficiencies: [],
    skills: { count: 2, choices: ["Acrobatics"] },
    startingEquipment: [],
    traits: [],
    subclassAvailableAtLevel: 3,
    subclasses: [
       {
         id: "sample_subclass",
         name: "示例扩展子职业",
         description: "简介...",
         traits: [],
         source: "ee" // 非常重要，确保能正确链接至 5etools
       }
    ],
    source: "ee"
  }
  */
];
