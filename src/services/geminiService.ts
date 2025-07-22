export class GeminiService {
  private baseUrl: string;
  private backendApiKey: string;
  private timeout: number;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    this.backendApiKey = import.meta.env.VITE_BACKEND_API_KEY || '';
    this.timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');
  }

  async sendMessage(message: string, context?: any): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.backendApiKey && { 'Authorization': `Bearer ${this.backendApiKey}` })
        },
        body: JSON.stringify({
          message,
          context
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`Backend API error! status: ${response.status}`);
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

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.backendApiKey && { 'Authorization': `Bearer ${this.backendApiKey}` })
        },
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