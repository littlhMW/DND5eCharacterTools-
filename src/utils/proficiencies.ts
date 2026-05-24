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
  athletics: '运动', Athletics: '运动',
  acrobatics: '特技', Acrobatics: '特技',
  sleightOfHand: '巧手', sleightofhand: '巧手', SleightOfHand: '巧手', 'Sleight of Hand': '巧手',
  stealth: '隐匿', Stealth: '隐匿',
  arcana: '奥秘', Arcana: '奥秘',
  history: '历史', History: '历史',
  investigation: '调查', Investigation: '调查',
  nature: '自然', Nature: '自然',
  religion: '宗教', Religion: '宗教',
  animalHandling: '驯兽', animalhandling: '驯兽', AnimalHandling: '驯兽', 'Animal Handling': '驯兽',
  insight: '洞悉', Insight: '洞悉',
  medicine: '医药', Medicine: '医药',
  perception: '察觉', Perception: '察觉',
  survival: '生存', Survival: '生存',
  deception: '欺瞒', Deception: '欺瞒',
  intimidation: '威吓', Intimidation: '威吓',
  performance: '表演', Performance: '表演',
  persuasion: '说服', Persuasion: '说服',
  'Intelligence/Wisdom/Charisma Skill': '智力/感知/魅力技能',
  'intelligence/wisdom/charisma skill': '智力/感知/魅力技能',
  'any': '任意技能'
};

export function getAbilityTotal(c: Character, race?: Race, subrace?: Subrace, ab?: Ability) {
  if (!ab) return 10;
  const base = c.baseAbilities[ab] || 10;
  const raceBonus = (race?.id === 'human' && subrace?.id === 'human-variant') ? 0 : (race?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0);
  const subraceBonus = subrace?.abilityBonuses?.find(b => b.ability === ab)?.bonus || 0;
  return base + raceBonus + subraceBonus;
}

export function getProficiencyBonus(level: number) {
  return Math.ceil(level / 4) + 1;
}

const ID_MAP: Record<string, string> = {
  '医疗': 'medicine',
  '盗贼工具': 'thieves-tools',
};

const normalizeSkillId = (s: string): string => {
  const mapped = ID_MAP[s] || s;
  const lower = mapped.toLowerCase();
  if (lower === 'sleightofhand' || lower === 'sleight of hand') return 'sleightOfHand';
  if (lower === 'animalhandling' || lower === 'animal handling') return 'animalHandling';
  return lower;
};

export function getProficiencies(c: Character, cls?: Class, race?: Race, subrace?: Subrace, bg?: Background) {
  const saves = cls ? [...cls.saves] : [];
  
  const skills = new Set<string>();
  const tools = new Set<string>();

  if (race?.skillProficiencies) race.skillProficiencies.forEach(s => skills.add(normalizeSkillId(s)));
  if (race?.toolProficiencies) race.toolProficiencies.forEach(t => tools.add(ID_MAP[t] || t));

  if (subrace?.skillProficiencies) subrace.skillProficiencies.forEach(s => skills.add(normalizeSkillId(s)));
  if (subrace?.toolProficiencies) subrace.toolProficiencies.forEach(t => tools.add(ID_MAP[t] || t));

  if (bg?.skillProficiencies) bg.skillProficiencies.forEach(s => skills.add(normalizeSkillId(s)));
  if (bg?.toolProficiencies) bg.toolProficiencies.forEach(t => tools.add(ID_MAP[t] || t));

  if (cls?.toolProficiencies) cls.toolProficiencies.forEach(t => tools.add(ID_MAP[t] || t));
  
  if (c.skillSelections) c.skillSelections.forEach(s => skills.add(normalizeSkillId(s)));

  const expertise = new Set<string>();

  Object.entries(c.traitSelections).forEach(([choiceId, ids]) => {
    if (!ids || !Array.isArray(ids)) return;
    const isExpertise = choiceId.toLowerCase().includes('expertise') || choiceId.includes('knowledge-domain-skills');
    (ids as string[]).forEach(id => {
      if (id.startsWith('inherit-') || id.startsWith('asi-') || id.startsWith('feat-')) return;
      const normalizedId = normalizeSkillId(id);
      if (ALL_SKILLS.includes(normalizedId)) {
        if (isExpertise) {
          expertise.add(normalizedId);
          skills.add(normalizedId);
        } else {
          skills.add(normalizedId);
        }
      } else {
        // If it's not a skill, maybe it's a tool (like thieves-tools)
        if (isExpertise) {
          expertise.add(id);
          tools.add(id);
        } else {
          tools.add(id);
        }
      }
    });
  });

  return { 
    saves, 
    skills: Array.from(skills), 
    expertise: Array.from(expertise),
    tools: Array.from(tools)
  };
}
