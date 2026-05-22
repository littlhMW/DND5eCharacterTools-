import { CharacterData as Character, DndClass as Class, Background, Race, Ability, Subrace } from '../types/dnd';

const ALL_SKILLS = [
  'acrobatics','animalHandling','arcana','athletics','deception','history','insight',
  'intimidation','investigation','medicine','nature','perception','performance',
  'persuasion','religion','sleightOfHand','stealth','survival'
];

export const SKILL_ABILITIES: Record<string, Ability> = {
  athletics: 'STR',
  acrobatics: 'DEX', sleightOfHand: 'DEX', stealth: 'DEX',
  arcana: 'INT', history: 'INT', investigation: 'INT', nature: 'INT', religion: 'INT',
  animalHandling: 'WIS', insight: 'WIS', medicine: 'WIS', perception: 'WIS', survival: 'WIS',
  deception: 'CHA', intimidation: 'CHA', performance: 'CHA', persuasion: 'CHA'
};

export const SKILL_NAMES: Record<string, string> = {
  athletics: '运动',
  acrobatics: '特技', sleightOfHand: '巧手', stealth: '隐匿',
  arcana: '奥秘', history: '历史', investigation: '调查', nature: '自然', religion: '宗教',
  animalHandling: '驯兽', insight: '洞悉', medicine: '医药', perception: '察觉', survival: '生存',
  deception: '欺瞒', intimidation: '威吓', performance: '表演', persuasion: '说服'
};

export function getAbilityTotal(c: Character, race?: Race, subrace?: Subrace, ab?: Ability) {
  if (!ab) return 10;
  const base = c.baseAbilities[ab] || 10;
  const raceBonus = race?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0;
  const subraceBonus = subrace?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0;
  return base + raceBonus + subraceBonus;
}

export function getProficiencyBonus(level: number) {
  return Math.ceil(level / 4) + 1;
}

export function getProficiencies(c: Character, cls?: Class, race?: Race, subrace?: Subrace, bg?: Background) {
  const saves = cls ? [...cls.saves] : [];
  
  const skills = new Set<string>();
  if (race?.skillProficiencies) race.skillProficiencies.forEach(s => skills.add(s));
  if (subrace?.skillProficiencies) subrace.skillProficiencies.forEach(s => skills.add(s));
  if (bg?.skillProficiencies) bg.skillProficiencies.forEach(s => skills.add(s));
  
  const expertise = new Set<string>();

  Object.entries(c.traitSelections).forEach(([choiceId, ids]) => {
    if (!ids) return;
    const isExpertise = choiceId.toLowerCase().includes('expertise') || choiceId.includes('knowledge-domain-skills');
    (ids as string[]).forEach(id => {
      if (ALL_SKILLS.includes(id)) {
        if (isExpertise) {
          expertise.add(id);
          skills.add(id); // Expertise implies proficiency
        } else {
          skills.add(id);
        }
      }
    });
  });

  return { saves, skills: Array.from(skills), expertise: Array.from(expertise) };
}
