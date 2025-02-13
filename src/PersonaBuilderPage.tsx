import React from 'react';
import { PersonaBuilder } from '@components/PersonaBuilder/PersonaBuilder';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

function PersonnaBuilderPage() {
  
  const handleComplete = (prompt: string) => {
    console.log('Final Persona Prompt:', prompt);
  };
  

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="absolute top-8 flex items-center justify-between">
            <Link to={"/admin"}
              className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Link>
          </div>
        <div className="flex flex-col space-y-6 mt-2">
          
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Persona Builder</h1>
            <p className="text-lg text-gray-600 mt-2">
              Create your perfect AI persona by customizing its design, tone, and personality
            </p>
          </div>

          <PersonaBuilder onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}

export default PersonnaBuilderPage;