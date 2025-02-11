import React from 'react';
import useStore from '@store/store';

import Api from './Api';
import Me from './Me';
import AboutMenu from '@components/AboutMenu';
import ImportExportChat from '@components/ImportExportChat';
import SettingsMenu from '@components/SettingsMenu';
import CollapseOptions from './CollapseOptions';
import GoogleSync from '@components/GoogleSync';
import { TotalTokenCostDisplay } from '@components/SettingsMenu/TotalTokenCost';
import {t} from 'i18next';
import { UserIcon } from 'lucide-react';
import PersonaBuilderLink from '@components/Chat/ChatContent/Persona/PersonaBuilderLink';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

const MenuOptions = () => {
  const countTotalTokens = useStore((state) => state.countTotalTokens);
  return (
    <>
      <div
        className={`'max-h-full
        overflow-hidden transition-all`}
      >
        <PersonaBuilderLink />

        {/* {countTotalTokens && <TotalTokenCostDisplay />} */}
        {/* {googleClientId && <GoogleSync clientId={googleClientId} />} */}
        {/* <AboutMenu /> */}
        <ImportExportChat />
        {/* <Api /> */}
        <SettingsMenu />
        {/* <Me /> */}
      </div>
    </>
  );
};

export default MenuOptions;
