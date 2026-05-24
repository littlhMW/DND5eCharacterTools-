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
import { races as eepcRaces } from './eepc/races';
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
  ...eepcRaces,
  ...fodRaces,
  ...gosRaces,
  ...bgdiaRaces,
  ...cosRaces,
  ...toaRaces,
]);

function mergeRaces(allRaces: Race[]): Race[] {
  const map = new Map<string, Race>();
  const alternativesMap = new Map<string, Race[]>();

  for (const race of allRaces) {
    if (race.subraces) {
      for (const sr of race.subraces) {
        if (!sr.source) {
          sr.source = race.source;
        }
      }
    }

    // 真正的空白占位外壳 (例如空精灵、空侏儒主类，仅用于提供subraces容器)
    const isPlaceholder = !race.description || race.description === 'Placeholder' || race.description === '';
    if (!isPlaceholder) {
      if (!alternativesMap.has(race.id)) alternativesMap.set(race.id, []);
      alternativesMap.get(race.id)!.push({ ...race, subraces: undefined });
    }

    if (map.has(race.id)) {
      const existing = map.get(race.id)!;
      if (race.subraces && race.subraces.length > 0) {
        existing.subraces = existing.subraces || [];
        existing.subraces.push(...race.subraces);
      }

      const currentIsShell = !race.description || race.description === 'Placeholder' || race.description === '' || race.description.includes('非玩家');
      const existingIsShell = !existing.description || existing.description === 'Placeholder' || existing.description === '' || existing.description.includes('非玩家');

      // 主卡升级策略：
      // 1. 若当前主卡为非玩家种族(或占位)，而新加入的是标准的玩家种族，优先以正常玩家版本作为主展示，故重写升级。
      // 2. 避免占位壳遮盖实质内容本身。
      const shouldUpgradeToPC = existingIsShell && !currentIsShell;
      const shouldOverwritePlaceholder = !isPlaceholder && (!existing.description || existing.description === 'Placeholder' || existing.description === '');

      if (shouldUpgradeToPC || shouldOverwritePlaceholder) {
        const previousSubraces = existing.subraces;
        Object.assign(existing, { ...race });
        existing.subraces = previousSubraces;
      }
    } else {
      map.set(race.id, { ...race, subraces: race.subraces ? [...race.subraces] : [] });
    }
  }

  const result = Array.from(map.values());
  for (const race of result) {
    const alts = alternativesMap.get(race.id);
    if (!alts) continue;
    
    const uniqueAlts: Race[] = [];
    const seenSources = new Set<string>();
    for (const alt of alts) {
      if (!seenSources.has(alt.source)) {
        seenSources.add(alt.source);
        uniqueAlts.push(alt);
      }
    }
    if (uniqueAlts.length > 1) {
      race.alternatives = uniqueAlts as Omit<Race, 'subraces' | 'alternatives'>[];
    }
  }

  return result;
}

export function getRaceByIdAndSource(raceId: string, raceSource?: string): Race | undefined {
  const baseRace = races.find(r => r.id === raceId);
  if (!baseRace) return undefined;
  if (!raceSource || !baseRace.alternatives) return baseRace;
  const alt = baseRace.alternatives.find(a => a.source === raceSource);
  if (alt) {
    return { ...alt, subraces: baseRace.subraces };
  }
  return baseRace;
}
