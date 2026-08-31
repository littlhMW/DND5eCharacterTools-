import { DndClass } from '../types/dnd';
import { classes as phbClasses } from './phb/classes';
import { classes as dmgClasses } from './dmg/classes';
import { classes as xgeClasses } from './xge/classes';
import { classes as tceClasses } from './tce/classes';
import { classes as scagClasses } from './scag/classes';
import { classes as vgmClasses } from './vgm/classes';
import { classes as mtfClasses } from './mtf/classes';
import { classes as erlwClasses } from './erlw/classes';
import { classes as egwClasses } from './egw/classes';
import { classes as ggrClasses } from './ggr/classes';
import { classes as motClasses } from './mot/classes';
import { classes as vrgrClasses } from './vrgr/classes';
import { classes as rotClasses } from './rot/classes';
import { classes as aiClasses } from './ai/classes';
import { classes as eepcClasses } from './eepc/classes';
import { classes as fodClasses } from './fod/classes';
import { classes as gosClasses } from './gos/classes';
import { classes as bgdiaClasses } from './bgdia/classes';
import { classes as cosClasses } from './cos/classes';
import { classes as toaClasses } from './toa/classes';

import { classes as dndbClasses } from './dndb/classes';

const rawClasses: DndClass[] = [
  ...phbClasses,
  ...dmgClasses,
  ...xgeClasses,
  ...tceClasses,
  ...scagClasses,
  ...vgmClasses,
  ...mtfClasses,
  ...erlwClasses,
  ...egwClasses,
  ...ggrClasses,
  ...motClasses,
  ...vrgrClasses,
  ...rotClasses,
  ...aiClasses,
  ...eepcClasses,
  ...fodClasses,
  ...gosClasses,
  ...bgdiaClasses,
  ...cosClasses,
  ...toaClasses,
  ...dndbClasses,
];

export const classes = mergeClasses(rawClasses);

function mergeClasses(allClasses: DndClass[]): DndClass[] {
  const map = new Map<string, DndClass>();
  const alternativesMap = new Map<string, DndClass[]>();

  for (const cls of allClasses) {
    if (!cls.source) {
      cls.source = 'phb';
    }

    if (!alternativesMap.has(cls.id)) {
      alternativesMap.set(cls.id, []);
    }
    alternativesMap.get(cls.id)!.push({ ...cls, subclasses: [] });

    if (map.has(cls.id)) {
      const existing = map.get(cls.id)!;
      if (cls.subclasses && cls.subclasses.length > 0) {
        existing.subclasses = existing.subclasses || [];
        const existingSubIds = new Set(existing.subclasses.map(s => s.id));
        const newSubs = cls.subclasses.filter(s => !existingSubIds.has(s.id));
        existing.subclasses.push(...newSubs);
      }
    } else {
      map.set(cls.id, { ...cls, subclasses: cls.subclasses ? [...cls.subclasses] : [] });
    }
  }

  const result = Array.from(map.values());
  for (const cls of result) {
    const alts = alternativesMap.get(cls.id);
    if (!alts) continue;

    const uniqueAlts: DndClass[] = [];
    const seenSources = new Set<string>();
    for (const alt of alts) {
      if (!seenSources.has(alt.source)) {
        seenSources.add(alt.source);
        uniqueAlts.push(alt);
      }
    }
    cls.alternatives = uniqueAlts;
  }

  return result;
}
