import React from 'react';
import { Check } from 'lucide-react';
import { StepProps } from '../types';

const designOptions = [
  'Minimalistic',
  'Bold',
  'Playful',
  'Professional',
  'Modern',
  'Classic',
];

export function DesignPreferences({ preferences, onChange }: StepProps) {
  const toggleDesign = (design: string) => {
    const current = preferences.design || [];
    const updated = current.includes(design)
      ? current.filter(d => d !== design)
      : [...current, design];
    onChange('design', updated);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Design Preferences</h3>
      <p className="text-sm text-gray-600">Select the design styles that resonate with your vision</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {designOptions.map((design) => (
          <button
            key={design}
            onClick={() => toggleDesign(design)}
            className={`
              flex items-center justify-between p-4 rounded-lg border-2 transition-all
              ${preferences.design?.includes(design)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
              }
            `}
          >
            <span className="text-sm font-medium">{design}</span>
            {preferences.design?.includes(design) && (
              <Check className="w-4 h-4 text-blue-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}