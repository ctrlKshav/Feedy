import type React from "react"
import { motion } from "framer-motion"

interface Prompt {
  title: string
  examples: string[]
}

const prompts: Prompt[] = [
  {
    title: "Explain technical concepts",
    examples: [
      "Explain quantum computing in simple terms",
      "What is the difference between HTTP and HTTPS?",
      "How does a blockchain work?",
    ],
  },
  {
    title: "Creative writing tasks",
    examples: [
      "Write a short story about a time traveler",
      "Compose a poem about the changing seasons",
      "Create a dialogue between two AI assistants",
    ],
  },
  {
    title: "Problem-solving scenarios",
    examples: [
      "How can I improve my productivity?",
      "Suggest ways to reduce plastic waste",
      "What are some strategies for effective team communication?",
    ],
  },
  {
    title: "Code and development",
    examples: [
      "Write a Python function to check if a number is prime",
      "Explain the concept of React hooks",
      "How do I set up a basic Express.js server?",
    ],
  },
]

export const ExamplePromptsComponent: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-200">Example Prompts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prompts.map((prompt, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">{prompt.title}</h3>
              <ul className="space-y-2">
                {prompt.examples.map((example, exIndex) => (
                  <motion.li
                    key={exIndex}
                    className="text-sm text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    "{example}"
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

