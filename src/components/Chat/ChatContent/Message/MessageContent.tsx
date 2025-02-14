import React, { useState } from 'react';
import useStore from '@store/store';

import ContentView from './View/ContentView';
import EditView from './View/EditView';
import { useAuth } from '@src/context/AuthProvider';
import ContentViewAdmin from './View/ContentViewAdmin';
import EditViewAdmin from './View/EditViewAdmin';

const MessageContent = ({
  role,
  content,
  messageIndex,
  sticky = false,
}: {
  role: string;
  content: string;
  messageIndex: number;
  sticky?: boolean;
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(sticky);
  const advancedMode = useStore((state) => state.advancedMode);
  const {user} = useAuth();

  return (
    <div className='relative flex flex-col gap-2 md:gap-3 '>
      {isEdit ? (
        <>
         {user?.role  === 'user' ? (
         <EditView
            content={content}
            setIsEdit={setIsEdit}
            messageIndex={messageIndex}
            sticky={sticky}
          />
        ) : (
          <EditViewAdmin
            content={content}
            setIsEdit={setIsEdit}
            messageIndex={messageIndex}
            sticky={sticky}
          />
        )}
        </>
      ) : (
        <>
        {user?.role  === 'user' ? (
          <ContentView
          role={role}
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
        />
        ) : (
          <ContentViewAdmin 
          role={role}
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
          />
        )}
        </>
      )}
    </div>
  );
};

export default MessageContent;
