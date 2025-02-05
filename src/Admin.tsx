import React from 'react';
import { Link } from 'react-router';
import { UserGroupIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-12 text-center">Admin Dashboard</h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Persona Card */}
        <Link 
          to="/admin/create-persona"
          className="group relative bg-gray-800 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:bg-gray-700/50 hover:shadow-xl"
        >
          <div className="flex flex-col items-center">
            <UserGroupIcon className="h-24 w-24 mb-6 text-transparent bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text" />
            <h2 className="text-2xl font-semibold mb-3">Create Persona</h2>
            <p className="text-gray-400 text-center">
              Design and configure new AI personalities with custom knowledge bases and behavior patterns
            </p>
          </div>
        </Link>

        {/* View Conversations Card */}
        <Link
          to="/admin/view-conversations"
          className="group relative bg-gray-800 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:bg-gray-700/50 hover:shadow-xl"
        >
          <div className="flex flex-col items-center">
            <ChatBubbleLeftEllipsisIcon className="h-24 w-24 mb-6 text-transparent bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text" />
            <h2 className="text-2xl font-semibold mb-3">View Conversations</h2>
            <p className="text-gray-400 text-center">
              Analyze user interactions, review conversation logs, and improve AI responses
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
