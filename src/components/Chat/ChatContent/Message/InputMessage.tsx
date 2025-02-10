import React from 'react';
import useStore from '@store/store';

import Avatar from './Avatar';
import MessageContent from './MessageContent';

import { Role } from '@type/chat';
import RoleSelector from './RoleSelector';

const backgroundStyle = ['dark:bg-gray-800', 'bg-gray-50 dark:bg-gray-650'];

const InputMessage = React.memo(
  ({
    role,
    content,
    messageIndex,
  }: {
    role: Role;
    content: string;
    messageIndex: number;
  }) => {
    const hideSideMenu = useStore((state) => state.hideSideMenu);
    // const advancedMode = useStore((state) => state.advancedMode);
    const advancedMode = false;

    return (
      <div
        className={`w-full  border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group`}
      >
        <div
          className={`text-base gap-4 md:gap-6 m-auto p-4 md:py-6 flex transition-all ease-in-out ${
            hideSideMenu
              ? 'md:max-w-5xl lg:max-w-5xl xl:max-w-6xl'
              : 'md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'
          }`}
        >
          <div className='w-full '>
            <MessageContent
              role={role}
              content={content}
              messageIndex={messageIndex}
              sticky={true}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default InputMessage;
