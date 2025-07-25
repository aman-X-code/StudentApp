export class GeminiService {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || 'https://generativelanguage.googleapis.com';
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');
  }

  async sendMessage(message: string, context?: any): Promise<string> {
    try {
      // Use direct Gemini API integration
      if (this.apiKey) {
        return await this.sendDirectToGemini(message, context);
      }

      throw new Error('Gemini API key not configured');
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
      const response = await fetch(`${this.baseUrl}/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
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
      // Check if API key is available
      if (this.apiKey) {
        return true; // Assume healthy if API key is present
      }

      return false;
    } catch (error) {
      console.error('AI service health check failed:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();