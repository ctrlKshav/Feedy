import React from 'react';
import { Smile } from 'lucide-react';
import { StepProps } from '../types';

export function TonePersonality({ preferences, onChange }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Tone & Personality</h3>
        <p className="text-sm text-gray-600">Adjust the tone and add personality traits</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Tone Scale (Professional → Casual)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={preferences.tone}
          onChange={(e) => onChange('tone', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>Professional</span>
          <span>Balanced</span>
          <span>Casual</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Additional Notes & Personality Traits
        </label>
        <textarea
          value={preferences.customNotes}
          onChange={(e) => onChange('customNotes', e.target.value)}
          placeholder="Add specific personality traits, quirks, or preferences..."
          className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}