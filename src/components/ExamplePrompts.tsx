import React, { Dispatch, DispatchWithoutAction, SetStateAction } from "react";
import useStore from "@store/store";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Prompt {
  examples: string[];
}

const userPrompts: Prompt[] = [
  {
    examples: ["Does this new gradient fit our premium feel @supervisor?"],
  },
  {
    examples: ["@manager - the form feels clunky. Any suggestions to streamline it?"],
  },
  {
    examples: ["@manager - readable enough for long articles?"],
  },
  {
    examples: ["@designer - ways to add personality without being overwhelming?"],
  },
];

// Admin-specific prompts
const adminPrompts: Prompt[] = [
  {
    examples: [
      "Review the latest analytics report and provide a summary.",
    ],
  },
  {
    examples: [
      "Generate a report on user activity for the past month.",
    ],
  },
  {
    examples: [
      "Prepare a presentation for the upcoming board meeting.",
    ],
  },
  {
    examples: [
      "Audit the permissions for all admin accounts.",
    ],
  },
];

export const ExamplePromptsComponent: React.FC<{setInputMessage: Dispatch<SetStateAction<string>>, role: string}> = ({setInputMessage, role}) => {
  const { t } = useTranslation();
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const generating = useStore((state) => state.generating);

  const handlePromptClick = async (prompt: string) => {
    if (generating) return;
    setInputMessage(prompt)
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const prompts = role === "user" ? userPrompts : adminPrompts;

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex items-center justify-center gap-3 mb-12" variants={itemVariants}>
        <Sparkles className="w-6 h-6 text-green-500" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t("Real feedback, right now")}</h2>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 " variants={containerVariants}>
        {prompts.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            className="bg-white/90 dark:bg-gray-800/90 rounded-2xl overflow-hidden shadow-lg dark:shadow-gray-900/30 hover:bg-gradient-to-r from-indigo-50 to-purple-50 dark:hover:bg-gradient-to-r dark:from-indigo-900/20 dark:to-purple-900/20 
            "
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className="p-1 ">
              {category.examples.map((example, exampleIndex) => (
                <motion.button
                  key={exampleIndex}
                  className="w-full text-left p-6 rounded-xl text-gray-700 dark:text-gray-200 text-lg transition-all duration-300 ease-in-out transform hover:translate-x-1 "
                  onClick={() => handlePromptClick(example)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-indigo-500 " />
                    <span className="font-medium leading-relaxed">{example}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
