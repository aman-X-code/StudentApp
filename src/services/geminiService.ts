export class GeminiService {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || '/api';
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');
  }

  async sendMessage(message: string, context?: any): Promise<string> {
    try {
      // If using direct Gemini API (frontend integration)
      if (this.apiKey && this.baseUrl.includes('googleapis.com')) {
        return await this.sendDirectToGemini(message, context);
      }

      // Default: Use backend API
      const response = await fetch(`${this.baseUrl}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(import.meta.env.VITE_BACKEND_API_KEY && {
            'Authorization': `Bearer ${import.meta.env.VITE_BACKEND_API_KEY}`
          })
        },
        body: JSON.stringify({
          message,
          context
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.message || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw new Error(`Failed to get response from AI assistant: ${error.message}`);
      }
      
      throw new Error('Failed to get response from AI assistant. Please try again.');
    }
  }

  private async sendDirectToGemini(message: string, context?: any): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an AI assistant for students. Help with academic questions and provide study guidance.
              
Student context: ${JSON.stringify(context)}

Student question: ${message}

Please provide a helpful, educational response.`
            }]
          }]
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Error with direct Gemini API:', error);
      throw error;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      // If using direct Gemini API
      if (this.apiKey && this.baseUrl.includes('googleapis.com')) {
        return true; // Assume healthy if API key is present
      }

      // Check backend health
      const response = await fetch(`${this.baseUrl}/ai/health`, {
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch (error) {
      console.error('AI service health check failed:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();