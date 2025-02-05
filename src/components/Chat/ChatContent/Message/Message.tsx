import React from 'react';
import useStore from '@store/store';

import Avatar from './Avatar';
import MessageContent from './MessageContent';

import { Role } from '@type/chat';

const Message = React.memo(({ role, content, messageIndex, sticky = false }: {
  role: Role;
  content: string;
  messageIndex: number;
  sticky?: boolean;
}) => {
  const hideSideMenu = useStore((state) => state.hideSideMenu);

  return (
    <div className={`w-full text-gray-800 dark:text-gray-100 group 
      `}>
      <div className={`text-base gap-4 md:gap-6 m-auto p-4 md:py-6 flex transition-all ease-in-out 
        ${hideSideMenu ? 'md:max-w-5xl lg:max-w-5xl xl:max-w-6xl' : 'md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'}
        ${role === 'user' ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <Avatar role={role} />
        <div className='w-[calc(100%-50px)]'>
          <span className={`${role} font-bold`}>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
          <MessageContent role={role} content={content} messageIndex={messageIndex} sticky={sticky} />
        </div>
      </div>
    </div>
  );
});

export default Message;
