import { EXPANSIONS, ExpansionBook } from '../data/expansions';
export { EXPANSIONS };
export type { ExpansionBook };

export interface BookSettings {
  enabled: boolean;
  races: boolean;
  classes: boolean;
  backgrounds: boolean;
  other: boolean;
}

const STORAGE_KEY_V1 = 'dnd_toolkit_expansions_v3'; // fallback simple array
const STORAGE_KEY_SETTINGS = 'dnd_toolkit_expansions_v3_settings_v4'; // new Map<string, BookSettings>

// Helper to get raw settings
export function getExpansionSettings(): Record<string, BookSettings> {
  const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch {
      // recovery below
    }
  }

  // Fallback / Migrate from old string list format
  const savedActiveIds = localStorage.getItem(STORAGE_KEY_V1);
  let activeIds: string[] = EXPANSIONS.filter(e => e.enabled).map(e => e.id);
  if (savedActiveIds) {
    try {
      activeIds = JSON.parse(savedActiveIds);
    } catch {
      // keep default activeIds
    }
  }

  const initialSettings: Record<string, BookSettings> = {};
  for (const exp of EXPANSIONS) {
    // PHB and Core are always enabled automatically
    const isActuallyActive = exp.isCore || activeIds.includes(exp.id);
    initialSettings[exp.id] = {
      enabled: isActuallyActive,
      races: isActuallyActive,
      classes: isActuallyActive,
      backgrounds: isActuallyActive,
      other: isActuallyActive,
    };
  }

  return initialSettings;
}

// Helper to save settings
export function saveExpansionSettings(settings: Record<string, BookSettings>) {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));

  // Sync to V1 string array as well to keep existing functions/compatibility flawless
  const activeIds = Object.entries(settings)
    .filter(([id, config]) => config.enabled && id !== 'phb')
    .map(([id]) => id);
  localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(activeIds));
}

// Compatibility getter that returns active list of book IDs
export function getActiveExpansions(): string[] {
  const settings = getExpansionSettings();
  return Object.entries(settings)
    .filter(([_, config]) => config.enabled)
    .map(([id]) => id);
}

// Compatibility setter
export function saveActiveExpansions(ids: string[]) {
  const settings = getExpansionSettings();
  for (const exp of EXPANSIONS) {
    if (exp.isCore) continue;
    const isEn = ids.includes(exp.id);
    settings[exp.id] = {
      enabled: isEn,
      races: isEn,
      classes: isEn,
      backgrounds: isEn,
      other: isEn,
    };
  }
  saveExpansionSettings(settings);
}

export function isSourceEnabled(
  sourceId: string,
  category?: 'races' | 'classes' | 'backgrounds' | 'other'
): boolean {
  if (!sourceId) return true;
  let normSource = sourceId.toLowerCase();
  if (normSource === 'ee') {
    normSource = 'eepc';
  }
  if (normSource === 'phb') return true;

  const settings = getExpansionSettings();
  const bookConfig = settings[normSource];

  if (!bookConfig) {
    return false;
  }

  if (!bookConfig.enabled) {
    return false;
  }

  if (category && bookConfig[category] === false) {
    return false;
  }

  return true;
}
