import React from 'react';
import { useAtBottom, useScrollToBottom } from 'react-scroll-to-bottom';

import DownArrow from '@icon/DownArrow';

const ScrollToBottomButton = React.memo(() => {
  const scrollToBottom = useScrollToBottom();
  const [atBottom] = useAtBottom();

  return (
    <button
      className={`cursor-pointer absolute right-6 bottom-0 md:right-8 md:bottom-0 z-10 rounded-full border border-gray-200 bg-gray-50 p-2 text-gray-600 shadow-md dark:border-white/10 dark:bg-white/10 dark:text-gray-200 transition-opacity duration-200 ${
        atBottom ? 'opacity-0 pointer-events-none' : 'opacity-80'
      }`}
      aria-label='Scroll to bottom'
      onClick={scrollToBottom}
    >
      <DownArrow className="w-5 h-5" />
    </button>
  );
});

export default ScrollToBottomButton;
