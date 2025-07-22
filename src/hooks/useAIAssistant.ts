import { useState, useCallback, useEffect } from 'react';
import { ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';

export const useAIAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(true);

  // Check if AI service is available
  useEffect(() => {
    const checkAIHealth = async () => {
      setIsCheckingHealth(true);
      try {
        const healthy = await geminiService.checkHealth();
        setIsAvailable(healthy);
      } catch (error) {
        setIsAvailable(false);
      } finally {
        setIsCheckingHealth(false);
      }
    };

    checkAIHealth();
    
    // Check health every 5 minutes
    const interval = setInterval(checkAIHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = useCallback(async (content: string, context?: any) => {
    if (!isAvailable) {
      throw new Error('AI Assistant is currently unavailable. Please try again later.');
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(content, context);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, content: response, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { 
                ...msg, 
                content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`,
                isLoading: false 
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = messages
      .filter(msg => msg.role === 'user')
      .pop();
    
    if (lastUserMessage) {
      // Remove the last assistant message if it was an error
      setMessages(prev => {
        const lastAssistantIndex = prev.map(msg => msg.role).lastIndexOf('assistant');
        if (lastAssistantIndex !== -1) {
          return prev.slice(0, lastAssistantIndex);
        }
        return prev;
      });
      
      await sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    isAvailable,
    isCheckingHealth,
    sendMessage,
    clearMessages,
    deleteMessage,
    retryLastMessage
  };
};