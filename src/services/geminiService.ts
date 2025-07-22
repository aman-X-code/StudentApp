import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async sendMessage(message: string, context?: any): Promise<string> {
    if (!this.genAI || !this.apiKey) {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      // Create a context-aware prompt for student assistance
      const contextPrompt = context ? `
Student Context:
- Pending assignments: ${context.pendingAssignments || 0}
- Today's classes: ${context.todayClasses || 0}
- Current academic focus: Student management and learning

` : '';

      const prompt = `You are an AI assistant for students. Help with academic questions, study tips, and educational support.

${contextPrompt}Student Question: ${message}

Please provide helpful, educational responses that support learning and academic success.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text || 'Sorry, I could not generate a response. Please try again.';
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID')) {
          throw new Error('Invalid Gemini API key. Please check your API key configuration.');
        }
        if (error.message.includes('QUOTA_EXCEEDED')) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        throw new Error(`Gemini API error: ${error.message}`);
      }
      
      throw new Error('Failed to get response from AI assistant. Please try again.');
    }
  }

  async checkHealth(): Promise<boolean> {
    if (!this.genAI || !this.apiKey) {
      return false;
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent('Hello');
      const response = await result.response;
      return !!response.text();
    } catch (error) {
      console.error('AI service health check failed:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();