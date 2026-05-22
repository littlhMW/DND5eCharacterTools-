import { DndClass } from '../types/dnd';
import { classes as phbClasses } from './phb/classes';
import { classes as dmgClasses } from './dmg/classes';
import { classes as xgeClasses } from './xge/classes';
import { classes as tceClasses } from './tce/classes';
import { classes as scagClasses } from './scag/classes';
import { classes as vgtmClasses } from './vgtm/classes';
import { classes as mtofClasses } from './mtof/classes';
import { classes as erlwClasses } from './erlw/classes';
import { classes as egwClasses } from './egw/classes';
import { classes as ggrClasses } from './ggr/classes';
import { classes as motClasses } from './mot/classes';
import { classes as vrgrClasses } from './vrgr/classes';
import { classes as rotClasses } from './rot/classes';
import { classes as aiClasses } from './ai/classes';
import { classes as eeClasses } from './ee/classes';
import { classes as ftodClasses } from './ftod/classes';
import { classes as gosClasses } from './gos/classes';
import { classes as bgdiaClasses } from './bgdia/classes';
import { classes as cosClasses } from './cos/classes';
import { classes as toaClasses } from './toa/classes';

export const classes: DndClass[] = [
  ...phbClasses,
  ...dmgClasses,
  ...xgeClasses,
  ...tceClasses,
  ...scagClasses,
  ...vgtmClasses,
  ...mtofClasses,
  ...erlwClasses,
  ...egwClasses,
  ...ggrClasses,
  ...motClasses,
  ...vrgrClasses,
  ...rotClasses,
  ...aiClasses,
  ...eeClasses,
  ...ftodClasses,
  ...gosClasses,
  ...bgdiaClasses,
  ...cosClasses,
  ...toaClasses,
];
