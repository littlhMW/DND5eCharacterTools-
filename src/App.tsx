/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CharacterProvider, useCharacter } from './context/CharacterContext';
import { WizardLayout } from './components/WizardLayout';
import { CharacterSheet } from './components/CharacterSheet';

function MainApp() {
  const { state } = useCharacter();
  return state.view === 'wizard' ? <WizardLayout /> : <CharacterSheet />;
}

export default function App() {
  return (
    <CharacterProvider>
      <MainApp />
    </CharacterProvider>
  );
}
