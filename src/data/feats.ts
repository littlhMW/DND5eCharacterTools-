import { Feat } from '../types/dnd';
import { feats as phbFeats } from './phb/feats';
import { feats as dmgFeats } from './dmg/feats';
import { feats as xgeFeats } from './xge/feats';
import { feats as tceFeats } from './tce/feats';
import { feats as scagFeats } from './scag/feats';
import { feats as vgmFeats } from './vgm/feats';
import { feats as mtfFeats } from './mtf/feats';
import { feats as erlwFeats } from './erlw/feats';
import { feats as egwFeats } from './egw/feats';
import { feats as ggrFeats } from './ggr/feats';
import { feats as motFeats } from './mot/feats';
import { feats as vrgrFeats } from './vrgr/feats';
import { feats as rotFeats } from './rot/feats';
import { feats as aiFeats } from './ai/feats';
import { feats as eepcFeats } from './eepc/feats';
import { feats as fodFeats } from './fod/feats';
import { feats as gosFeats } from './gos/feats';
import { feats as bgdiaFeats } from './bgdia/feats';
import { feats as cosFeats } from './cos/feats';
import { feats as toaFeats } from './toa/feats';

export const feats: Feat[] = [
  ...phbFeats,
  ...dmgFeats,
  ...xgeFeats,
  ...tceFeats,
  ...scagFeats,
  ...vgmFeats,
  ...mtfFeats,
  ...erlwFeats,
  ...egwFeats,
  ...ggrFeats,
  ...motFeats,
  ...vrgrFeats,
  ...rotFeats,
  ...aiFeats,
  ...eepcFeats,
  ...fodFeats,
  ...gosFeats,
  ...bgdiaFeats,
  ...cosFeats,
  ...toaFeats,
];
