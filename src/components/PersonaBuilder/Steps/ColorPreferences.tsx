import React from 'react';
import { Palette } from 'lucide-react';
import { StepProps } from '../types';

const colorSchemes = [
  { name: 'Pastel', class: 'bg-gradient-to-r from-pink-200 to-blue-200' },
  { name: 'Vibrant', class: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { name: 'Monochrome', class: 'bg-gradient-to-r from-gray-200 to-gray-600' },
  { name: 'Earthy', class: 'bg-gradient-to-r from-amber-200 to-emerald-200' },
  { name: 'Ocean', class: 'bg-gradient-to-r from-cyan-200 to-blue-500' },
  { name: 'Sunset', class: 'bg-gradient-to-r from-orange-300 to-red-500' },
  { name: 'Forest', class: 'bg-gradient-to-r from-green-200 to-emerald-500' },
  { name: 'Royal', class: 'bg-gradient-to-r from-indigo-300 to-purple-600' },
];

export function ColorPreferences({ preferences, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <Palette className="w-6 h-6 mr-2 text-purple-500" />
        Color Scheme
      </h3>
      <p className="text-sm text-gray-600">Choose a color palette that matches your brand</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {colorSchemes.map((scheme) => (
          <button
            key={scheme.name}
            onClick={() => onChange('colors', scheme.name)}
            className={`
              relative h-24 rounded-lg transition-all duration-300 transform
              ${scheme.class}
              ${preferences.colors === scheme.name
                ? 'ring-2 ring-blue-500 ring-offset-2 scale-105'
                : 'hover:scale-105 hover:shadow-lg'
              }
            `}
          >
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/10">
              <span className="font-medium text-white shadow-sm">
                {scheme.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}