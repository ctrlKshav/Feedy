import React from 'react';
import { ImageIcon } from 'lucide-react';
import { StepProps } from '../types';

const images = [
  {
    id: 'minimal',
    url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80',
    style: 'Minimal and Clean',
  },
  {
    id: 'vibrant',
    url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=800&q=80',
    style: 'Vibrant and Bold',
  },
];

export function ImagePreferences({ preferences, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Visual Style</h3>
      <p className="text-sm text-gray-600">Select the image that best represents your desired style</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => onChange('imagePreference', image.id)}
            className={`
              relative aspect-video rounded-lg overflow-hidden transition-all
              ${preferences.imagePreference === image.id
                ? 'ring-4 ring-blue-500'
                : 'hover:opacity-90'
              }
            `}
          >
            <img
              src={image.url}
              alt={image.style}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-medium">{image.style}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}