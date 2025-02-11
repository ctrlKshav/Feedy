import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserIcon } from 'lucide-react';

import PopupModal from '@components/PopupModal';

const PersonaBuilderLink = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <a
        className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        href='/admin/manage-persona'
      >
        <UserIcon className='w-4 h-4' /> {t('Manage Persona') as string}

      </a>

    </>
  );
};

export default PersonaBuilderLink;
