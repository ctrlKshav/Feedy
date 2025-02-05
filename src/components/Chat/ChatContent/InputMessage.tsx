import React from 'react';
import Message from './Message';
import { Role } from '@type/chat';

interface InputMessageProps {
  role: Role;
  content: string;
  messageIndex: number;
}

const InputMessage: React.FC<InputMessageProps> = ({ role, content, messageIndex }) => {
  return (
    <div className="input-message-style"> {/* Add your distinct styles here */}
      <Message role={role} content={content} messageIndex={messageIndex} sticky/>
    </div>
  );
};

export default InputMessage; 