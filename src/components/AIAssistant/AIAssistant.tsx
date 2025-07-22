import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  TrashIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  SignalSlashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import { mockStudent, mockAssignments, mockSchedule } from '../../data/mockData';
import { format } from 'date-fns';

export const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    isAvailable,
    isCheckingHealth,
    sendMessage,
    clearMessages,
    retryLastMessage
  } = useAIAssistant();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isAvailable) return;

    const messageContent = input.trim();
    setInput('');

    // Provide context about the student
    const context = {
      student: mockStudent,
      pendingAssignments: mockAssignments.filter(a => a.status === 'pending').length,
      todayClasses: mockSchedule.filter(s => s.day === format(new Date(), 'EEEE')).length,
      currentTime: new Date().toISOString()
    };

    try {
      await sendMessage(messageContent, context);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const suggestedQuestions = [
    "Help me organize my study schedule",
    "Explain photosynthesis in simple terms",
    "Tips for writing a good essay",
    "How to solve quadratic equations?",
    "Study techniques for better memory"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const ServiceStatus = () => {
    if (isCheckingHealth) {
      return (
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <ArrowPathIcon className="h-4 w-4 animate-spin" />
          <span>Checking AI service...</span>
        </div>
      );
    }

    return (
      <div className={`flex items-center space-x-2 text-sm ${
        isAvailable 
          ? 'text-green-600 dark:text-green-400' 
          : 'text-red-600 dark:text-red-400'
      }`}>
        {isAvailable ? (
          <>
            <CheckCircleIcon className="h-4 w-4" />
            <span>AI Assistant is ready</span>
          </>
        ) : (
          <>
            <SignalSlashIcon className="h-4 w-4" />
            <span>AI Assistant is unavailable</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Assistant</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Get help with your studies and academic questions
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Clear conversation"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <ServiceStatus />
      </div>

      {/* Chat Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {!isAvailable ? (
          <div className="p-8 text-center">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl inline-block mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Assistant Unavailable
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The AI Assistant service is currently unavailable. Please try again later or contact support if the issue persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl inline-block mb-4">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Welcome to AI Assistant!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    I'm here to help you with your studies. Ask me anything!
                  </p>
                  
                  {/* Suggested Questions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Try asking:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      {message.isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-500">Thinking...</span>
                        </div>
                      ) : (
                        <div>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className={`text-xs ${
                              message.role === 'user' 
                                ? 'text-purple-200' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {format(message.timestamp, 'HH:mm')}
                            </p>
                            {message.role === 'assistant' && message.content.startsWith('Error:') && (
                              <button
                                onClick={retryLastMessage}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-2"
                              >
                                Retry
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your studies..."
                  disabled={isLoading || !isAvailable}
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading || !isAvailable}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          💡 Tips for better assistance
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• Be specific about your questions or problems</li>
          <li>• Mention your grade level or subject for better context</li>
          <li>• Ask for step-by-step explanations when needed</li>
          <li>• Request study tips and learning strategies</li>
          <li>• Get help with homework and assignment planning</li>
        </ul>
      </motion.div>
    </div>
  );
};