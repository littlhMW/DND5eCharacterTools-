import { Race } from '../types/dnd';
import { races } from '../data/races';
import { isSourceEnabled } from './expansionHelper';

import { getExpansionSettings } from './expansionHelper';

export function getAvailableRaces(preferredSources: Record<string, string> = {}): Race[] {
  const settings = getExpansionSettings();
  const overrideNewer = localStorage.getItem('allowNewerExpansionOverride') !== 'false';

  return races
    .map((r) => {
      const validAlts = r.alternatives?.filter((alt) =>
        isSourceEnabled(alt.source || 'phb', 'races', settings, alt.id)
      ) as Race[] | undefined;

      if (!validAlts || validAlts.length === 0) {
        if (!isSourceEnabled(r.source || 'phb', 'races', settings, r.id)) return null;
        return {
          ...r,
          subraces: r.subraces?.filter((sr) =>
            isSourceEnabled(sr.source || r.source || 'phb', 'races', settings, sr.id)
          ),
        };
      }

      let activeSource = overrideNewer ? undefined : preferredSources[r.id];
      if (!activeSource) {
        activeSource = validAlts[validAlts.length - 1].source;
      }

      const matched =
        validAlts.find((a) => a.source === activeSource) ||
        validAlts[validAlts.length - 1];
      
      return {
        ...matched,
        subraces: r.subraces?.filter((sr) =>
          isSourceEnabled(sr.source || matched.source || 'phb', 'races', settings, sr.id)
        ),
        alternatives: overrideNewer ? undefined : validAlts,
      };
    })
    .filter(Boolean) as Race[];
}
