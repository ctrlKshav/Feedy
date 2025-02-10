import React, { useState } from 'react';
import useStore from '@store/store';

import ContentView from './View/ContentView';
import EditViewAdmin from './View/EditViewAdmin';
import ContentViewAdmin from './View/ContentViewAdmin';

const MessageContentAdmin = ({
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

  return (
    <div className='relative flex flex-col gap-2 md:gap-3 '>
      {isEdit ? (
        <EditViewAdmin
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
          sticky={sticky}
        />
      ) : (
        <ContentViewAdmin
          role={role}
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
        />
      )}
    </div>
  );
};

export default MessageContentAdmin;
