import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Save, Check, Sparkles, Wand2 } from 'lucide-react';
import { PersonaBuilderProps, PersonaPreferences } from './types';
import { DesignPreferences } from './Steps/DesignPreferences';
import { ColorPreferences } from './Steps/ColorPreferences';
import { ImagePreferences } from './Steps/ImagePreferences';
import { TonePersonality } from './Steps/TonePersonality';
import { refinePersona } from '@api/api';
import { updateAdminPersona } from '@utils/supabaseOperations';

const defaultPreferences: PersonaPreferences = {
  design: [],
  colors: '',
  imagePreference: '',
  tone: 50,
  customNotes: '',
};

export function PersonaBuilder({ initialData = {}, onComplete }: PersonaBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<PersonaPreferences>({
    ...defaultPreferences,
    ...initialData,
  });
  const [saved, setSaved] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);


  const steps = [
    {
      title: 'Design Style',
      component: DesignPreferences,
      icon: '✨',
    },
    {
      title: 'Color Scheme',
      component: ColorPreferences,
      icon: '🎨',
    },
    {
      title: 'Visual Style',
      component: ImagePreferences,
      icon: '🖼️',
    },
    {
      title: 'Tone & Personality',
      component: TonePersonality,
      icon: '😊',
    },
  ];

  const handleChange = (key: keyof PersonaPreferences, value: any) => {
    setIsUpdating(true);
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setTimeout(() => setIsUpdating(false), 500);
  };

  const generatePrompt = () => {
    const toneDescription = preferences.tone < 33 ? 'professional and formal'
      : preferences.tone > 66 ? 'casual and friendly'
      : 'balanced and adaptable';

    return `You are a ${toneDescription} assistant with a ${preferences.design.join(', ').toLowerCase()} design style and a ${preferences.colors.toLowerCase()} color scheme. Your visual aesthetic is inspired by ${preferences.imagePreference === 'minimal' ? 'minimal and clean' : 'vibrant and bold'} design principles. ${preferences.customNotes}`;
  };

  const handleSave = async () => {
    const prompt = generatePrompt();
    await navigator.clipboard.writeText(prompt);
    onComplete(prompt);
    setSaved(true);

    const response = await refinePersona(prompt)
    const supaResponse = await updateAdminPersona("28851c19-5a52-431a-a430-cea1136ce896", response.refined_prompt)

    
    
    setTimeout(() => setSaved(false), 2000);
  };

  
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">

    

      {/* Form Column */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        {/* Fixed Header */}
        <div className="p-6 border-b bg-white">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <button
                key={step.title}
                onClick={() => setCurrentStep(index)}
                className={`
                  flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300
                  ${currentStep === index 
                    ? 'text-[#4A90E2] bg-blue-50 shadow-sm transform scale-105' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-xl">{step.icon}</span>
                <span className="text-sm font-medium">{step.title}</span>
              </button>
            ))}
          </div>
          <div className="h-2 bg-gray-100 rounded-full mt-6">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-[#4A90E2] rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <CurrentStepComponent
            preferences={preferences}
            onChange={handleChange}
          />
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t bg-white">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className={`
                flex items-center px-5 py-2.5 rounded-lg transition-all duration-300
                ${currentStep === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-50 hover:shadow-sm'
                }
              `}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSave}
                className="flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-500 to-[#4A90E2] text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                {saved ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Persona
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-500 to-[#4A90E2] text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Column */}
      <div className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wand2 className="w-6 h-6 text-[#4A90E2]" />
              <h3 className="text-xl font-semibold text-gray-900">Persona Preview</h3>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Sparkles className="w-4 h-4 mr-2 text-[#4A90E2]" />
              <span>Live Preview</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="relative bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            {isUpdating && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2]"></div>
              </div>
            )}
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Generated Prompt</h4>
              <p className="text-gray-600 leading-relaxed">{generatePrompt()}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center text-sm text-gray-500">
            <Sparkles className="w-4 h-4 mr-2 text-[#4A90E2]" />
            <span>Add custom notes in the form to make your persona more distinctive</span>
          </div>
        </div>
      </div>
    </div>
  );
}