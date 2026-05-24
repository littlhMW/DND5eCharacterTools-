import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CharacterData, Ability } from '../types/dnd';
import { classes } from '../data/classes';

type Action =
  | { type: 'SET_VIEW'; payload: 'landing' | 'wizard' | 'sheet' }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_BASIC_INFO'; payload: Partial<CharacterData> }
  | { type: 'SET_RACE'; payload: { raceId: string; subraceId?: string; raceSource?: string } }
  | { type: 'SET_CLASS'; payload: { classId: string; subclassId?: string } }
  | { type: 'SET_SUBCLASS'; payload: string }
  | { type: 'SET_BACKGROUND'; payload: string }
  | { type: 'SET_ABILITIES'; payload: Record<Ability, number> }
  | { type: 'UPDATE_KNOWN_SPELLS'; payload: string[] }
  | { type: 'UPDATE_PREPARED_SPELLS'; payload: string[] }
  | { type: 'TOGGLE_SKILL'; payload: string }
  | { type: 'SET_TRAIT_SELECTION'; payload: { choiceId: string; selectedIds: string[] } }
  | { type: 'ADD_CUSTOM_SPELL'; payload: any }
  | { type: 'SET_LEVEL'; payload: number }
  | { type: 'LOAD_CHARACTER'; payload: CharacterData }
  | { type: 'LEVEL_UP' };

interface State {
  view: 'landing' | 'wizard' | 'sheet';
  currentStep: number;
  character: CharacterData;
}

const initialState: State = {
  view: 'landing',
  currentStep: 1,
  character: {
    name: 'Tav',
    alignment: 'Neutral',
    deity: '',
    age: '',
    appearance: '',
    specialty: '',
    personality: '',
    ideals: '',
    bonds: '',
    flaws: '',
    backstory: '',
    level: 3,
    raceId: '',
    classId: '',
    backgroundId: '',
    baseAbilities: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    skillSelections: [],
    languageSelections: [],
    equipmentSelections: [],
    traitSelections: {},
    knownSpells: [],
    preparedSpells: [],
    customSpells: []
  }
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'LOAD_CHARACTER':
      return { ...state, view: 'sheet', character: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_BASIC_INFO':
      return { ...state, character: { ...state.character, ...action.payload } };
    case 'SET_RACE': {
      if (state.character.raceId !== action.payload.raceId || state.character.raceSource !== action.payload.raceSource) {
        const newTraits = { ...state.character.traitSelections };
        if (state.character.raceId) {
          Object.keys(newTraits).forEach(k => {
            if (k.startsWith(state.character.raceId + '-')) delete newTraits[k];
          });
        }
        return { ...state, character: { ...state.character, raceId: action.payload.raceId, raceSource: action.payload.raceSource, subraceId: action.payload.subraceId, traitSelections: newTraits } };
      }
      return { ...state, character: { ...state.character, raceId: action.payload.raceId, raceSource: action.payload.raceSource, subraceId: action.payload.subraceId } };
    }
    case 'SET_CLASS': {
      if (state.character.classId !== action.payload.classId) {
        const newTraits = { ...state.character.traitSelections };
        if (state.character.classId) {
          Object.keys(newTraits).forEach(k => {
            if (k.startsWith(state.character.classId + '-')) delete newTraits[k];
          });
        }
        delete newTraits['spells-step-cantrips'];
        delete newTraits['spells-step-leveled'];
        delete newTraits['spells-step-prepared'];
        delete newTraits['spells-step-unrestricted'];
        delete newTraits['spells-step-restricted'];
        return { ...state, character: { ...state.character, classId: action.payload.classId, subclassId: action.payload.subclassId, traitSelections: newTraits } };
      }
      return { ...state, character: { ...state.character, classId: action.payload.classId, subclassId: action.payload.subclassId } };
    }
    case 'SET_SUBCLASS': {
      if (state.character.subclassId !== action.payload) {
        const newTraits = { ...state.character.traitSelections };
        if (state.character.subclassId) {
          Object.keys(newTraits).forEach(k => {
            if (k.startsWith(state.character.subclassId + '-')) delete newTraits[k];
          });
        }
        // Optionals could change, wipe spells just in case? Maybe un-restricted stuff changes, so yes.
        delete newTraits['spells-step-cantrips'];
        delete newTraits['spells-step-leveled'];
        delete newTraits['spells-step-prepared'];
        delete newTraits['spells-step-unrestricted'];
        delete newTraits['spells-step-restricted'];
        return { ...state, character: { ...state.character, subclassId: action.payload, traitSelections: newTraits } };
      }
      return { ...state, character: { ...state.character, subclassId: action.payload } };
    }
    case 'SET_BACKGROUND': {
      if (state.character.backgroundId !== action.payload) {
        const newTraits = { ...state.character.traitSelections };
        if (state.character.backgroundId) {
          Object.keys(newTraits).forEach(k => {
            if (k.startsWith(state.character.backgroundId + '-')) delete newTraits[k];
          });
        }
        return { ...state, character: { ...state.character, backgroundId: action.payload, traitSelections: newTraits } };
      }
      return { ...state, character: { ...state.character, backgroundId: action.payload } };
    }
    case 'SET_ABILITIES':
      return { ...state, character: { ...state.character, baseAbilities: action.payload } };
    case 'UPDATE_KNOWN_SPELLS':
      return { ...state, character: { ...state.character, knownSpells: action.payload } };
    case 'UPDATE_PREPARED_SPELLS':
      return { ...state, character: { ...state.character, preparedSpells: action.payload } };
    case 'TOGGLE_SKILL':
      const hasSkill = state.character.skillSelections.includes(action.payload);
      const newSkills = hasSkill
        ? state.character.skillSelections.filter(s => s !== action.payload)
        : [...state.character.skillSelections, action.payload];
      return { ...state, character: { ...state.character, skillSelections: newSkills } };
    case 'SET_TRAIT_SELECTION':
      return {
        ...state,
        character: {
          ...state.character,
          traitSelections: {
            ...state.character.traitSelections,
            [action.payload.choiceId]: action.payload.selectedIds
          }
        }
      };
    case 'ADD_CUSTOM_SPELL':
      return { ...state, character: { ...state.character, customSpells: [...state.character.customSpells, action.payload] } };
    case 'SET_LEVEL': {
      const cls = classes.find(c => c.id === state.character.classId);
      const isSubAvailable = cls && action.payload >= cls.subclassAvailableAtLevel;
      return { 
        ...state, 
        character: { 
          ...state.character, 
          level: action.payload,
          subclassId: isSubAvailable ? state.character.subclassId : undefined
        } 
      };
    }
    case 'LEVEL_UP':
      return { ...state, character: { ...state.character, level: state.character.level + 1 } };
    default:
      return state;
  }
}

const CharacterContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CharacterContext.Provider value={{ state, dispatch }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}
