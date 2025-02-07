import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

const ManagePersona = () => {
  const { t } = useTranslation();
  const generating = useStore((state) => state.generating);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [personaPrompt, setPersonaPrompt] = useState('');

  const handleSubmitPrompt = () => {
    if (personaPrompt.trim()) {
      // Add your persona handling logic here
      console.log('Submitting persona prompt:', personaPrompt);
      setShowPromptModal(false);
      setPersonaPrompt('');
    }
  };

  return (
    <>
      <a
        className={`flex flex-1 items-center rounded-full hover:bg-gray-500/10 transition-all duration-200 text-white text-sm flex-shrink-0 py-2 px-2 gap-3 mb-2 border border-white/20 ${
          generating ? 'cursor-not-allowed opacity-40' : 'cursor-pointer opacity-100'
        }`}
        onClick={() => !generating && setShowPromptModal(true)}
        title={t('Manage Persona') as string}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="inline-block mr-2 ml-2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span className='inline-flex text-white text-sm'>{t('Manage Persona') as string}</span>
      </a>

      {showPromptModal && (
        <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center'>
          <div className='bg-gray-900 rounded-lg p-4 w-full max-w-md border border-white/20'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold text-white'>{t('userPrompt')}</h2>
              <button
                onClick={() => setShowPromptModal(false)}
                className='text-gray-400 hover:text-white transition-colors'
              >
                ×
              </button>
            </div>
            <textarea
              value={personaPrompt}
              onChange={(e) => setPersonaPrompt(e.target.value)}
              className='w-full bg-gray-800 rounded-lg p-3 text-gray-100 mb-4 resize-none'
              rows={4}
              placeholder={t('enterPersonaPrompt') as string}
            />
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setShowPromptModal(false)}
                className='px-4 py-2 rounded-lg border border-white/20 hover:bg-gray-700 transition-colors'
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSubmitPrompt}
                className='px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors'
              >
                {t('submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagePersona;
