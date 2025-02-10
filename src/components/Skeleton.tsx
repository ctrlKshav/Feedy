import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Skeleton() {
  return (
    <div className='bg-gray-800 min-h-screen flex justify-center items-center'>
      <Loader2 className='text-white' />
    </div>
  );
}
