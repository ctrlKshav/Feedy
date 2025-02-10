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

import { ChatInterface } from '@type/chat';
import { codeLanguageSubset } from '@constants/chat';
import {
  Paperclip,
  FileText,
  Image,
  File,
  FileCode,
  FileSpreadsheet,
  FileAudio,
  FileVideo,
} from 'lucide-react';
import { Attachment } from '@type/chat';
import CopyButton from './Button/CopyButton';
import CodeBlock from '../CodeBlock';

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className='w-4 h-4' />;
  if (type.startsWith('text/') || type === 'application/pdf')
    return <FileText className='w-4 h-4' />;
  if (type.startsWith('audio/')) return <FileAudio className='w-4 h-4' />;
  if (type.startsWith('video/')) return <FileVideo className='w-4 h-4' />;
  if (type === 'application/json' || type === 'application/javascript')
    return <FileCode className='w-4 h-4' />;
  if (
    type === 'application/vnd.ms-excel' ||
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
    return <FileSpreadsheet className='w-4 h-4' />;
  return <File className='w-4 h-4' />;
};

interface ContentViewProps {
  role: string;
  content: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
}

const ContentViewAdmin = memo(
  ({ role, content, setIsEdit, messageIndex }: ContentViewProps) => {
    const [isDelete, setIsDelete] = useState<boolean>(false);

    const currentChatIndex = useStore((state) => state.currentChatIndex);
    const setChats = useStore((state) => state.setChats);
    const inlineLatex = useStore((state) => state.inlineLatex);
    const markdownMode = useStore((state) => state.markdownMode);
    const messages = useStore(
      (state) => state.chats?.[currentChatIndex]?.messages ?? []
    );

    const currentMessage = messages?.[messageIndex];
    const attachments = currentMessage?.attachments;

    const handleCopy = () => {
      navigator.clipboard.writeText(content);
    };

    const CopyButtonElement = () =>
      !isDelete ? (
        <div className='opacity-0 group-hover:opacity-100 transition-opacity'>
          <CopyButton onClick={handleCopy} />
        </div>
      ) : (
        <></>
      );

    if (role === 'admin') {
      return (
        <div className='relative flex flex-col items-end gap-2 pb-2 group'>
          <div className='flex-grow flex flex-col items-end markdown prose w-full break-words dark:prose-invert dark'>
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
                [remarkMath, { singleDollarTextMath: inlineLatex }],
              ]}
              rehypePlugins={[
                rehypeKatex,
                [
                  rehypeHighlight,
                  {
                    detect: true,
                    ignoreMissing: true,
                    subset: codeLanguageSubset,
                  },
                ],
              ]}
              linkTarget='_new'
              components={{
                code,
                p,
              }}
            >
              {content}
            </ReactMarkdown>
            <div className=' flex flex-wrap gap-4 items-center '>
              {attachments && attachments.length > 0 && (
                <div className=' flex flex-wrap order-2'>
                  {attachments.map((attachment: Attachment, index: number) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 p-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-700 no-underline text-white'
                    >
                      {getFileIcon(attachment.type)}
                      <span className='text-xs text-black dark:text-white'>
                        {attachment.name.length > 20
                          ? `${attachment.name.substring(
                              0,
                              15
                            )}...${attachment.name.split('.').pop()}`
                          : attachment.name}
                      </span>
                    </a>
                  ))}
                </div>
              )}
              <CopyButtonElement />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='relative flex flex-col items-start gap-2 pb-2 group'>
        <div className='flex-grow flex flex-col items-start markdown prose w-full break-words dark:prose-invert dark'>
          <ReactMarkdown
            remarkPlugins={[
              remarkGfm,
              [remarkMath, { singleDollarTextMath: inlineLatex }],
            ]}
            rehypePlugins={[
              rehypeKatex,
              [
                rehypeHighlight,
                {
                  detect: true,
                  ignoreMissing: true,
                  subset: codeLanguageSubset,
                },
              ],
            ]}
            linkTarget='_new'
            components={{
              code,
              p,
            }}
          >
            {content}
          </ReactMarkdown>
          <div className='flex flex-wrap gap-4 items-center'>
            {attachments && attachments.length > 0 && (
              <div className='flex flex-wrap gap-4'>
                {attachments.map((attachment: Attachment, index: number) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 p-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-700 no-underline text-white'
                  >
                    {getFileIcon(attachment.type)}
                    <span className='text-xs text-black dark:text-white'>
                      {attachment.name.length > 20
                        ? `${attachment.name.substring(0, 15)}...${attachment.name.split('.').pop()}`
                        : attachment.name}
                    </span>
                  </a>
                ))}
              </div>
            )}
            <CopyButtonElement />
          </div>
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

export default ContentViewAdmin;
