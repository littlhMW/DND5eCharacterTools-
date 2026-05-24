import { Spell } from '../types/dnd';
import { spells as phbSpells } from './phb/spells';
import { spells as dmgSpells } from './dmg/spells';
import { spells as xgeSpells } from './xge/spells';
import { spells as tceSpells } from './tce/spells';
import { spells as scagSpells } from './scag/spells';
import { spells as vgmSpells } from './vgm/spells';
import { spells as mtfSpells } from './mtf/spells';
import { spells as erlwSpells } from './erlw/spells';
import { spells as egwSpells } from './egw/spells';
import { spells as ggrSpells } from './ggr/spells';
import { spells as motSpells } from './mot/spells';
import { spells as vrgrSpells } from './vrgr/spells';
import { spells as rotSpells } from './rot/spells';
import { spells as aiSpells } from './ai/spells';
import { spells as eepcSpells } from './eepc/spells';
import { spells as fodSpells } from './fod/spells';
import { spells as gosSpells } from './gos/spells';
import { spells as bgdiaSpells } from './bgdia/spells';
import { spells as cosSpells } from './cos/spells';
import { spells as toaSpells } from './toa/spells';

export const spells: Spell[] = [
  ...phbSpells,
  ...dmgSpells,
  ...xgeSpells,
  ...tceSpells,
  ...scagSpells,
  ...vgmSpells,
  ...mtfSpells,
  ...erlwSpells,
  ...egwSpells,
  ...ggrSpells,
  ...motSpells,
  ...vrgrSpells,
  ...rotSpells,
  ...aiSpells,
  ...eepcSpells,
  ...fodSpells,
  ...gosSpells,
  ...bgdiaSpells,
  ...cosSpells,
  ...toaSpells,
];
