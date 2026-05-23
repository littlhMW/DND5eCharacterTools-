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
import { classes as eeClasses } from './ee/classes';
import { classes as fodClasses } from './fod/classes';
import { classes as gosClasses } from './gos/classes';
import { classes as bgdiaClasses } from './bgdia/classes';
import { classes as cosClasses } from './cos/classes';
import { classes as toaClasses } from './toa/classes';

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
  ...eeClasses,
  ...fodClasses,
  ...gosClasses,
  ...bgdiaClasses,
  ...cosClasses,
  ...toaClasses,
];

const classesMap = new Map<string, DndClass>();

for (const cls of rawClasses) {
  if (classesMap.has(cls.id)) {
    const existing = classesMap.get(cls.id)!;
    // Deduplicate subclasses by id
    const existingSubIds = new Set(existing.subclasses?.map(s => s.id) || []);
    const newSubs = (cls.subclasses || []).filter(s => !existingSubIds.has(s.id));
    classesMap.set(cls.id, {
      ...existing,
      subclasses: [...(existing.subclasses || []), ...newSubs]
    });
  } else {
    classesMap.set(cls.id, { ...cls, subclasses: cls.subclasses ? [...cls.subclasses] : [] });
  }
}

export const classes = Array.from(classesMap.values());
