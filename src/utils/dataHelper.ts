import { classes } from '../data/classes';
import { backgrounds } from '../data/backgrounds';
import { feats } from '../data/feats';
import { spells } from '../data/spells';
import { getAvailableRaces as getAvailableRacesHelper } from './raceHelper';
import { isSourceEnabled, getExpansionSettings } from './expansionHelper';

import { DndClass } from '../types/dnd';

export function getAvailableClasses(preferredSources: Record<string, string> = {}) {
  const settings = getExpansionSettings();
  const overrideNewer = localStorage.getItem('allowNewerExpansionOverride') !== 'false';

  return classes
    .map((c) => {
      const validAlts = c.alternatives?.filter((alt) =>
        isSourceEnabled(alt.source || 'phb', 'classes', settings, alt.id)
      ) as DndClass[] | undefined;

      if (!validAlts || validAlts.length === 0) {
        if (!isSourceEnabled(c.source || 'phb', 'classes', settings, c.id)) return null;
        return {
          ...c,
          subclasses: c.subclasses?.filter((sc) =>
            isSourceEnabled(sc.source || c.source || 'phb', 'classes', settings, sc.id)
          ) || [],
        };
      }

      let activeSource = overrideNewer ? undefined : preferredSources[c.id];
      if (!activeSource) {
        activeSource = validAlts[validAlts.length - 1].source;
      }

      const matched =
        validAlts.find((a) => a.source === activeSource) ||
        validAlts[validAlts.length - 1];

      return {
        ...matched,
        subclasses: c.subclasses?.filter((sc) =>
          isSourceEnabled(sc.source || matched.source || 'phb', 'classes', settings, sc.id)
        ) || [],
        alternatives: overrideNewer ? undefined : validAlts,
      };
    })
    .filter(Boolean) as DndClass[];
}

export function getAvailableBackgrounds() {
  const settings = getExpansionSettings();
  return backgrounds.filter(b => isSourceEnabled(b.source || 'phb', 'backgrounds', settings, b.id));
}

export function getAvailableFeats() {
  const settings = getExpansionSettings();
  return feats.filter(f => isSourceEnabled(f.source || 'phb', 'other', settings, f.id));
}

export function getAvailableSpells() {
  const settings = getExpansionSettings();
  return spells.filter(s => isSourceEnabled(s.source || 'phb', 'other', settings, s.id));
}

export function getAvailableRaces(preferredSources: Record<string, string> = {}) {
  return getAvailableRacesHelper(preferredSources);
}
