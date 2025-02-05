import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  memo,
  useState,
} from 'react';

import ReactMarkdown from 'react-markdown';
import { CodeProps, ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';

import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import useStore from '@store/store';

import TickIcon from '@icon/TickIcon';
import CrossIcon from '@icon/CrossIcon';

import useSubmit from '@hooks/useSubmit';

import { ChatInterface } from '@type/chat';

import { codeLanguageSubset } from '@constants/chat';

import RefreshButton from './Button/RefreshButton';
import UpButton from './Button/UpButton';
import DownButton from './Button/DownButton';
import CopyButton from './Button/CopyButton';
import EditButton from './Button/EditButton';
import DeleteButton from './Button/DeleteButton';
import MarkdownModeButton from './Button/MarkdownModeButton';

import CodeBlock from '../CodeBlock';
import { Paperclip, FileText, Image, File, FileCode, FileSpreadsheet, FileAudio, FileVideo } from 'lucide-react';

interface Attachment {
  url: string;
  type: string;
  name: string;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
  if (type.startsWith('text/') || type === 'application/pdf') return <FileText className="w-4 h-4" />;
  if (type.startsWith('audio/')) return <FileAudio className="w-4 h-4" />;
  if (type.startsWith('video/')) return <FileVideo className="w-4 h-4" />;
  if (type === 'application/json' || type === 'application/javascript') return <FileCode className="w-4 h-4" />;
  if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') 
    return <FileSpreadsheet className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
};

const ContentView = memo(
  ({
    role,
    content,
    setIsEdit,
    messageIndex,
  }: {
    role: string;
    content: string;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    messageIndex: number;
  }) => {
    const { handleSubmit } = useSubmit();

    const [isDelete, setIsDelete] = useState<boolean>(false);

    const currentChatIndex = useStore((state) => state.currentChatIndex);
    const setChats = useStore((state) => state.setChats);
    const lastMessageIndex = useStore((state) =>
      state.chats ? state.chats[state.currentChatIndex].messages.length - 1 : 0
    );
    const inlineLatex = useStore((state) => state.inlineLatex);
    const markdownMode = useStore((state) => state.markdownMode);
    const messages = useStore((state) => state.chats?.[currentChatIndex]?.messages ?? []);
    const generating = useStore.getState().generating;

    const handleDelete = () => {
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      updatedChats[currentChatIndex].messages.splice(messageIndex, 1);
      setChats(updatedChats);
    };

    const handleCopy = () => {
      navigator.clipboard.writeText(content);
    };

    return (
      <div className='relative flex flex-col gap-3 pb-2'>
        <div className='markdown prose w-full break-words dark:prose-invert dark'>
          {content}
          {messages[messageIndex]?.attachments?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {messages[messageIndex].attachments?.map((attachment: Attachment, index: number) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {getFileIcon(attachment.type)}
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {attachment.name.length > 20 
                      ? `${attachment.name.substring(0, 15)}...${attachment.name.split('.').pop()}`
                      : attachment.name}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
        <div className='flex justify-end gap-2 w-full mt-2'>
          {isDelete || (
            <>
              <MarkdownModeButton />
              <CopyButton onClick={handleCopy} />
            </>
          )}
          {isDelete && (
            <>
              <button
                className='p-1 hover:text-white'
                aria-label='cancel'
                onClick={() => setIsDelete(false)}
              >
                <CrossIcon />
              </button>
              <button
                className='p-1 hover:text-white'
                aria-label='confirm'
                onClick={handleDelete}
              >
                <TickIcon />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
);

const code = memo((props: CodeProps) => {
  const { inline, className, children } = props;
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1];

  if (inline) {
    return <code className={className}>{children}</code>;
  } else {
    return <CodeBlock lang={lang || 'text'} codeChildren={children} />;
  }
});

const p = memo(
  (
    props?: Omit<
      DetailedHTMLProps<
        HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >,
      'ref'
    > &
      ReactMarkdownProps
  ) => {
    return <p className='whitespace-pre-wrap'>{props?.children}</p>;
  }
);

export default ContentView;
