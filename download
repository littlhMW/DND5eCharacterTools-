export type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface TraitOption {
  id: string;
  name: string;
  description?: string;
}

export interface TraitChoice {
  id: string;
  name?: string;
  description?: string;
  chooseNumber: number | string; // 可以是数字或表达式，如 "wisMod + level"
  options?: TraitOption[]; // 静态选项列表（选战斗风格、选战技等）
  
  // 动态选择相关字段
  dynamic?: 'spell' | 'expertise' | 'asi' | 'feat' | 'skill' | 'tool' | 'language';
  spellType?: 'cantrip' | 'known' | 'prepared' | 'spellbook';
  spellList?: string;
  maxLevel?: number;
  schoolRestriction?: string[]; // 新增：限制可选学派，如 ['enchantment', 'illusion']
  source?: string;
  preselected?: string[]; // 已经默认获取的选项（不可取消，且不占用chooseNumber）
}

export interface Trait {
  name: string;
  description: string;
  level?: number;
  choices?: TraitChoice[];
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  source?: string;
}

export interface Subrace {
  id: string;
  name: string;
  description: string;
  abilityBonuses: { ability: Ability; bonus: number }[];
  traits: Trait[];
  spells: { level: number; spellId: string }[];
  weaponProficiencies?: string[];
  armorProficiencies?: string[];
  toolProficiencies?: string[];
  skillProficiencies?: string[];
}

export interface Race {
  id: string;
  name: string;
  description: string;
  abilityBonuses: { ability: Ability; bonus: number }[];
  size: 'Small' | 'Medium' | 'Large';
  speed: number;
  vision: string;
  languages: string[];
  traits: Trait[];
  spells: { level: number; spellId: string }[]; // innate spells
  subraces?: Subrace[];
  source: string;
  weaponProficiencies?: string[];
  armorProficiencies?: string[];
  toolProficiencies?: string[];
  skillProficiencies?: string[];
}

export interface Subclass {
  id: string;
  name: string;
  description: string;
  traits: Trait[];
  spells?: { level: number; spellId: string; alwaysPrepared?: boolean }[];
  spellcasting?: {
    type: 'prepared' | 'known';
    ability: Ability;
    cantripsKnown: number[]; 
    spellsKnown?: number[]; 
    spellSlots: number[][]; 
    spellList: string; 
  };
  source: string;
}

export interface DndClass {
  id: string;
  name: string;
  description: string;
  hitDie: number;
  primaryAbility: Ability[];
  saves: Ability[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  skills: { count: number; choices: string[] };
  startingEquipment: string[];
  multiclass?: {
    requirements: ({ ability: Ability; min: number } | { group: 'OR'; options: { ability: Ability; min: number }[] })[];
    proficiencies: {
      armor?: string[];
      weapons?: string[];
      tools?: string[];
      skills?: { count: number; choices?: string[] };
    };
  };
  traits: Trait[];
  spellcasting?: {
    type: 'prepared' | 'known';
    ability: Ability;
    cantripsKnown: number[]; // by level index
    spellsKnown?: number[]; // for known casters
    spellSlots: number[][]; // [level - 1][slotLevel - 1]
    spellList: string; // spell list ID
  };
  subclassAvailableAtLevel: number;
  subclasses: Subclass[];
  source: string;
}

export interface Background {
  id: string;
  name: string;
  description: string;
  skillProficiencies: string[];
  toolProficiencies: string[];
  languages: number; // count
  startingEquipment: string[];
  feature: Trait;
  choices?: TraitChoice[]; // For tool/language/extra skill choices
  specialty?: {
    name: string;
    description?: string;
    options: string[];
  };
  suggestedCharacteristics: {
    personalityTraits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
  };
  source: string;
}

export interface CharacterData {
  id?: string;
  name: string;
  alignment: string;
  deity: string;
  age: string;
  appearance: string;
  specialty: string;
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory?: string;
  
  level: number;
  raceId: string;
  subraceId?: string;
  classId: string;
  subclassId?: string;
  backgroundId: string;
  
  baseAbilities: Record<Ability, number>;
  
  // Selections made during creation
  skillSelections: string[];
  languageSelections: string[];
  equipmentSelections: string[];
  traitSelections: Record<string, string[]>; // choice Id -> selected option ids
  knownSpells: string[]; // spell IDs
  preparedSpells: string[]; // spell IDs
  
  customSpells: Partial<Spell>[]; // empty rows or custom added
}
