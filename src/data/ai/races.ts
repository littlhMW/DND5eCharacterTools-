import { Race } from '../../types/dnd';

export const races: Race[] = [
  {
    id: 'verdan',
    name: '佛丹人',
    description: '佛丹人源于混沌，是由一群地精和熊地精在承受存续之物的阴影后突变而成。他们的皮肤呈翡翠色，血液漆黑，拥有有限的传心能力，但代价是失去了对历史的记忆。',
    abilityBonuses: [{ ability: 'CHA', bonus: 2 }, { ability: 'CON', bonus: 1 }],
    size: 'Small',
    speed: 30,
    vision: '普通视觉',
    languages: ['通用语', '地精语', '一门自选语言'],
    traits: [
      { name: '体型变化', description: '佛丹人刚诞生时体型与地精相似，身高在 3 到 4 尺之间。但在成年之后的某个时刻，每个佛丹人都会经历一次突然的生长突增，身高增加 2 尺或更多。在 1 级时，你是小型生物。当你达到 5 级时，你变为中型生物。' },
      { name: '黑血治愈', description: '标志着你的人民与存续之物相连的黑色血液增强了你的自然治愈能力。当你在短休结束时消耗生命骰，如果掷出 1 或 2，你可以重掷该骰子并且必须使用新的结果。' },
      { name: '有限传心', description: '你可以与 30 尺内你能看见的生物进行心灵交流。你不需要与该生物共享语言，但它必须能够理解至少一种语言。这种交流方式缓慢且有限，只能传递简单的想法和直接的概念。' },
      { name: '说服者', description: '你的人民缺乏历史，这使你值得信赖且谦逊。你拥有说服技能的熟练项。' },
      { name: '传心洞察', description: '你的心智与周围世界的联系增强了你的意志。你在所有感知和魅力豁免检定上具有优势。' },
      {
        name: '额外语言',
        description: '你可以说、读、写通用语、地精语和另一种自选语言。此语言通常与你生活中的某个区域或文化有关。'
      }
    ],
    spells: [],
    skillProficiencies: ['persuasion'],
    source: 'ai'
  }
];
