import { Race } from '../types/dnd';
import { races as phbRaces } from './phb/races';
import { races as dmgRaces } from './dmg/races';
import { races as xgeRaces } from './xge/races';
import { races as tceRaces } from './tce/races';
import { races as scagRaces } from './scag/races';
import { races as vgmRaces } from './vgm/races';
import { races as mtfRaces } from './mtf/races';
import { races as erlwRaces } from './erlw/races';
import { races as egwRaces } from './egw/races';
import { races as ggrRaces } from './ggr/races';
import { races as motRaces } from './mot/races';
import { races as vrgrRaces } from './vrgr/races';
import { races as rotRaces } from './rot/races';
import { races as aiRaces } from './ai/races';
import { races as eeRaces } from './ee/races';
import { races as fodRaces } from './fod/races';
import { races as gosRaces } from './gos/races';
import { races as bgdiaRaces } from './bgdia/races';
import { races as cosRaces } from './cos/races';
import { races as toaRaces } from './toa/races';

export const races: Race[] = mergeRaces([
  ...phbRaces,
  ...dmgRaces,
  ...xgeRaces,
  ...tceRaces,
  ...scagRaces,
  ...vgmRaces,
  ...mtfRaces,
  ...erlwRaces,
  ...egwRaces,
  ...ggrRaces,
  ...motRaces,
  ...vrgrRaces,
  ...rotRaces,
  ...aiRaces,
  ...eeRaces,
  ...fodRaces,
  ...gosRaces,
  ...bgdiaRaces,
  ...cosRaces,
  ...toaRaces,
]);

function mergeRaces(allRaces: Race[]): Race[] {
  const map = new Map<string, Race>();
  for (const race of allRaces) {
    if (race.subraces) {
      for (const sr of race.subraces) {
        if (!sr.source) {
          sr.source = race.source;
        }
      }
    }
    if (map.has(race.id)) {
      const existing = map.get(race.id)!;
      if (race.subraces && race.subraces.length > 0) {
        existing.subraces = existing.subraces || [];
        existing.subraces.push(...race.subraces);
      }
      if (race.description && (!existing.description || existing.description === 'Placeholder' || existing.description === '' || existing.description.includes('非玩家'))) {
        Object.assign(existing, { ...race, subraces: existing.subraces });
      }
    } else {
      map.set(race.id, { ...race, subraces: race.subraces ? [...race.subraces] : [] });
    }
  }
  return Array.from(map.values());
}
