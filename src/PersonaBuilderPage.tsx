import React from 'react';
import { PersonaBuilder } from '@components/PersonaBuilder/PersonaBuilder';

function PersonnaBuilderPage() {
  const handleComplete = (prompt: string) => {
    console.log('Final Persona Prompt:', prompt);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Persona Builder
          </h1>
          <p className="text-lg text-gray-600">
            Create your perfect AI persona by customizing its design, tone, and personality
          </p>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> */}
          <PersonaBuilder onComplete={handleComplete} />
        {/* </div> */}
      </div>
    </div>
  );
}

export default PersonnaBuilderPage;