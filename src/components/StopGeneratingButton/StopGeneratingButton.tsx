import React from 'react';
import useStore from '@store/store';

const StopGeneratingButton = () => {
  const setGenerating = useStore((state) => state.setGenerating);
  const generating = useStore((state) => state.generating);

  return (
  
      <button
        className='flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50'
        aria-label='stop generating'
        onClick={() => setGenerating(false)}
      >
          <svg
            stroke='currentColor'
            fill='none'
            strokeWidth='1.5'
            viewBox='0 0 24 24'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-3 w-3'
            height='1em'
            width='1em'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
          </svg>
        
      </button>
  )
};

export default StopGeneratingButton;
