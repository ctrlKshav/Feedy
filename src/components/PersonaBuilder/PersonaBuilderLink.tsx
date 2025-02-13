import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserIcon } from 'lucide-react';

import PopupModal from '@components/PopupModal';
import { Link } from 'react-router';

const PersonaBuilderLink = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
    <Link to={"/admin/manage-persona"}
        className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        >
        <UserIcon className='w-4 h-4' /> {t('Manage Persona') as string}
    </Link>
     
    </>
  );
};

export default PersonaBuilderLink;
