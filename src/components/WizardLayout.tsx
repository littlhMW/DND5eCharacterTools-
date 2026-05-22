import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import { OriginStep } from './steps/OriginStep';
import { ClassStep } from './steps/ClassStep';
import { BackgroundStep } from './steps/BackgroundStep';
import { AbilitiesStep } from './steps/AbilitiesStep';
import { DetailsStep } from './steps/DetailsStep';
import { SpellsStep } from './steps/SpellsStep';
import { ReviewStep } from './steps/ReviewStep';
import { CharacterSummary } from './CharacterSummary';

const STEPS = [
  { id: 1, title: '种族与起源', component: OriginStep },
  { id: 2, title: '职业', component: ClassStep },
  { id: 3, title: '背景', component: BackgroundStep },
  { id: 4, title: '属性', component: AbilitiesStep },
  { id: 5, title: '细节', component: DetailsStep },
  { id: 6, title: '法术', component: SpellsStep },
  { id: 7, title: '检视', component: ReviewStep },
];

export function WizardLayout() {
  const { state, dispatch } = useCharacter();
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const currentStepData = STEPS.find(s => s.id === state.currentStep) || STEPS[0];
  const StepComponent = currentStepData.component;

  return (
    <div className="flex h-screen bg-[#fffdfc] text-stone-900 font-sans overflow-hidden">
      {/* Left panel: Wizard Steps & Configuration */}
      <div className="flex-1 flex flex-col relative bg-[#fffdfc] shadow-sm z-10 w-full overflow-hidden">
        
        {/* Header - Tabs */}
        <header className="border-b border-stone-200">
          <div className="max-w-4xl mx-auto w-full p-4 flex justify-between items-center gap-4">
            <div className="flex space-x-2 overflow-x-auto flex-1">
              {STEPS.map(step => (
                <button
                  key={step.id}
                  onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: step.id })}
                  className={`px-5 py-2 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                    state.currentStep === step.id
                      ? 'border-amber-500 text-amber-700'
                      : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
                  }`}
                >
                  {step.id}. {step.title}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-shrink-0 border-l border-stone-200 pl-4">
              <button 
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'landing' })}
                className="px-4 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-sm transition border border-transparent"
              >
                主页
              </button>
              <button 
                onClick={() => {
                  let charToSave = { ...state.character };
                  if (!charToSave.id) charToSave.id = crypto.randomUUID();
                  const saved = localStorage.getItem('dndChars');
                  let chars = [];
                  if (saved) {
                    try { chars = JSON.parse(saved); } catch(e){}
                  }
                  const index = chars.findIndex((ch: any) => ch.id === charToSave.id);
                  if (index >= 0) {
                    chars[index] = charToSave;
                  } else {
                    chars.push(charToSave);
                  }
                  localStorage.setItem('dndChars', JSON.stringify(chars));
                  dispatch({ type: 'UPDATE_BASIC_INFO', payload: { id: charToSave.id } });
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2000);
                }}
                className="px-4 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-sm transition min-w-[3.5rem] text-center"
              >
                {saveSuccess ? '已保存 ✓' : '保存'}
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Step Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto w-full">
            <StepComponent />
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-stone-200 bg-stone-50/80 backdrop-blur">
          <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-5 flex justify-between">
            <button
              disabled={state.currentStep === 1}
              onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: state.currentStep - 1 })}
              className="px-4 md:px-6 py-2 md:py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-200 disabled:opacity-50 transition-colors rounded-sm font-medium"
            >
              上一步
            </button>
            
            <button
              onClick={() => {
                if (state.currentStep === STEPS.length) {
                  dispatch({ type: 'SET_VIEW', payload: 'sheet' });
                } else {
                  dispatch({ type: 'SET_CURRENT_STEP', payload: state.currentStep + 1 });
                }
              }}
              className="px-6 md:px-8 py-2 md:py-2.5 bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors shadow-sm rounded-sm"
            >
              {state.currentStep === STEPS.length ? '完成创建' : '下一步'}
            </button>
          </div>
        </div>
      </div>

      {/* Right panel: Character Summary (Live update) */}
      <div className="w-[320px] lg:w-[360px] xl:w-[400px] flex-shrink-0 bg-[#fefbf8] hidden lg:flex flex-col pt-6 overflow-y-auto border-l border-stone-200 relative z-0">
        <CharacterSummary />
      </div>
    </div>
  );
}
