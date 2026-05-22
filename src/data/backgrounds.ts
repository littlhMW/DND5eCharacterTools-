import { Background } from '../types/dnd';
import { backgrounds as phbBackgrounds } from './phb/backgrounds';
import { backgrounds as dmgBackgrounds } from './dmg/backgrounds';
import { backgrounds as xgeBackgrounds } from './xge/backgrounds';
import { backgrounds as tceBackgrounds } from './tce/backgrounds';
import { backgrounds as scagBackgrounds } from './scag/backgrounds';
import { backgrounds as vgtmBackgrounds } from './vgtm/backgrounds';
import { backgrounds as mtofBackgrounds } from './mtof/backgrounds';
import { backgrounds as erlwBackgrounds } from './erlw/backgrounds';
import { backgrounds as egwBackgrounds } from './egw/backgrounds';
import { backgrounds as ggrBackgrounds } from './ggr/backgrounds';
import { backgrounds as motBackgrounds } from './mot/backgrounds';
import { backgrounds as vrgrBackgrounds } from './vrgr/backgrounds';
import { backgrounds as rotBackgrounds } from './rot/backgrounds';
import { backgrounds as aiBackgrounds } from './ai/backgrounds';
import { backgrounds as eeBackgrounds } from './ee/backgrounds';
import { backgrounds as ftodBackgrounds } from './ftod/backgrounds';
import { backgrounds as gosBackgrounds } from './gos/backgrounds';
import { backgrounds as bgdiaBackgrounds } from './bgdia/backgrounds';
import { backgrounds as cosBackgrounds } from './cos/backgrounds';
import { backgrounds as toaBackgrounds } from './toa/backgrounds';

export const backgrounds: Background[] = [
  ...phbBackgrounds,
  ...dmgBackgrounds,
  ...xgeBackgrounds,
  ...tceBackgrounds,
  ...scagBackgrounds,
  ...vgtmBackgrounds,
  ...mtofBackgrounds,
  ...erlwBackgrounds,
  ...egwBackgrounds,
  ...ggrBackgrounds,
  ...motBackgrounds,
  ...vrgrBackgrounds,
  ...rotBackgrounds,
  ...aiBackgrounds,
  ...eeBackgrounds,
  ...ftodBackgrounds,
  ...gosBackgrounds,
  ...bgdiaBackgrounds,
  ...cosBackgrounds,
  ...toaBackgrounds,
];
