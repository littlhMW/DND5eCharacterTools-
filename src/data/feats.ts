import { Feat } from '../types/dnd';
import { feats as phbFeats } from './phb/feats';
import { feats as dmgFeats } from './dmg/feats';
import { feats as xgeFeats } from './xge/feats';
import { feats as tceFeats } from './tce/feats';
import { feats as scagFeats } from './scag/feats';
import { feats as vgtmFeats } from './vgtm/feats';
import { feats as mtofFeats } from './mtof/feats';
import { feats as erlwFeats } from './erlw/feats';
import { feats as egwFeats } from './egw/feats';
import { feats as ggrFeats } from './ggr/feats';
import { feats as motFeats } from './mot/feats';
import { feats as vrgrFeats } from './vrgr/feats';
import { feats as rotFeats } from './rot/feats';
import { feats as aiFeats } from './ai/feats';
import { feats as eeFeats } from './ee/feats';
import { feats as ftodFeats } from './ftod/feats';
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
  ...vgtmFeats,
  ...mtofFeats,
  ...erlwFeats,
  ...egwFeats,
  ...ggrFeats,
  ...motFeats,
  ...vrgrFeats,
  ...rotFeats,
  ...aiFeats,
  ...eeFeats,
  ...ftodFeats,
  ...gosFeats,
  ...bgdiaFeats,
  ...cosFeats,
  ...toaFeats,
];
