import React from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import useSubmit from '@hooks/useSubmit';

interface Prompt {
  examples: string[];
}

const prompts: Prompt[] = [
  {
    examples: [
      "What do you think about the color scheme used in this design?",
    ],
  },
  {
    examples: [
      "How can the layout be improved for better user experience?",
    ],
  },
  {
    examples: [
      "What are your thoughts on the typography choices in this design?",
    ],
  },
  {
    examples: [
      "Can you suggest any enhancements for the overall visual appeal?",
    ],
  },
];

export const ExamplePromptsComponent: React.FC = () => {
  const { t } = useTranslation();
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const { handleSubmit } = useSubmit();

  const handlePromptClick = async (prompt: string) => {
    if (useStore.getState().generating) return;
    
    const updatedChats = JSON.parse(JSON.stringify(useStore.getState().chats));
    const currentChat = updatedChats[currentChatIndex];
    if (!currentChat || !currentChat.messages) return;
    
    const lastMessageIndex = currentChat.messages.length - 1;
    if (lastMessageIndex >= 0 && currentChat.messages[lastMessageIndex].role === 'user' && !currentChat.messages[lastMessageIndex].content) {
      currentChat.messages[lastMessageIndex].content = prompt;
    } else {
      currentChat.messages.push({
        role: 'user',
        content: prompt,
        attachments: []
      });
    }
    
    // Update the store first
    setChats(updatedChats);
    
    // Then trigger the submission
    handleSubmit();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2 
        className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200"
        variants={itemVariants}
      >
        {t('Explore Your Creativity!')}
      </motion.h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        {prompts.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* <div className="p-4 bg-gray-50 dark:bg-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {category.title}
              </h3>
            </div> */}
            <div className="">
              {category.examples.map((example, exampleIndex) => (
                <motion.button
                  key={exampleIndex}
                  className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm transition-colors"
                  onClick={() => handlePromptClick(example)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {example}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};