# EduHub - Student Management System PWA

A comprehensive Progressive Web App (PWA) for student management with AI assistance powered by Google's Gemini API.

## 🚀 Features

### Core PWA Features
- **Offline Functionality**: Works without internet connection
- **Push Notifications**: Real-time notifications for assignments and announcements
- **Installable**: Can be installed on mobile devices and desktop
- **Responsive Design**: Optimized for all screen sizes
- **Dark Mode**: System preference detection with manual toggle

### Student Management Features
- **Dashboard**: Overview of assignments, grades, and schedule
- **Class Schedule**: Interactive timetable with real-time highlighting
- **Assignment Tracking**: Due date management and progress indicators
- **Grade Management**: Subject-wise performance with charts
- **Announcements**: Categorized school announcements
- **Profile Management**: Student information and settings

### AI Assistant (NEW!)
- **Backend AI Integration**: Connects to your backend AI service
- **Academic Help**: Get assistance with studies and homework
- **Context-Aware**: Understands your current academic situation
- **Study Tips**: Personalized learning strategies
- **Subject Help**: Explanations for various academic topics
- **Service Health Monitoring**: Real-time status of AI availability

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Heroicons + Lucide React
- **Animations**: Framer Motion
- **AI**: Google Generative AI (Gemini)
- **PWA**: Service Worker + Web App Manifest

## 📱 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key (get from https://makersuite.google.com/app/apikey)
- Optional: Backend API server with AI endpoints (see Backend Setup section)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-app-pwa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your API keys
   nano .env  # or use your preferred editor
   ```

5. **Add your API Keys to .env file**
   ```env
   # Get your Gemini API key from: https://makersuite.google.com/app/apikey
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   
   # Optional: Backend API configuration
   VITE_API_BASE_URL=http://localhost:3001
   VITE_BACKEND_API_KEY=your_backend_api_key_here
   ```

### Building for Production

```bash
npm run build
npm run preview
```

## 🔧 Backend Setup for AI Assistant

The AI Assistant expects these API endpoints on your backend:

### Required Endpoints

1. **POST `/api/ai/chat`**
   ```json
   // Request
   {
     "message": "Help me with math",
     "context": {
       "student": {...},
       "pendingAssignments": 3,
       "todayClasses": 5
     }
   }
   
   // Response
   {
     "response": "I'd be happy to help you with math! What specific topic are you working on?"
   }
   ```

2. **GET `/api/ai/health`**
   ```json
   // Response
   {
     "status": "healthy",
     "timestamp": "2024-01-01T00:00:00Z"
   }
   ```

### Example Express.js Backend

```javascript
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());

// Health check endpoint
app.get('/api/ai/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are an AI assistant for students. Help with academic questions.
    Student context: ${JSON.stringify(context)}
    Question: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ response: response.text() });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

app.listen(3001, () => {
  console.log('Backend running on port 3001');
});
```

## 🔧 Cursor IDE Setup

### Recommended Extensions
1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **TypeScript Importer**
4. **Auto Rename Tag**
5. **Prettier - Code formatter**

### Cursor Configuration

Create `.cursor/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["className\\s*=\\s*[\"'`]([^\"'`]*)[\"'`]", "([a-zA-Z0-9\\-:]+)"]
  ]
}
```

### Development Workflow

1. **File Structure**
   ```
   src/
   ├── components/          # React components
   ├── hooks/              # Custom hooks
   ├── services/           # API services
   ├── types/              # TypeScript types
   ├── data/               # Mock data
   └── App.tsx             # Main app component
   ```

2. **Component Development**
   - Use TypeScript for type safety
   - Follow React hooks patterns
   - Implement responsive design with Tailwind
   - Add animations with Framer Motion

3. **AI Assistant Development**
   - Service layer in `src/services/geminiService.ts` (now calls backend)
   - Custom hook in `src/hooks/useAIAssistant.ts`
   - UI component in `src/components/AIAssistant/AIAssistant.tsx`
   - Health monitoring and error handling

## 🔄 Development with Backend

### Local Development
1. Start your backend server (usually on port 3001)
2. Update the API base URL in `geminiService.ts` if needed
3. The frontend will automatically connect to your backend

### Production Deployment
- Deploy backend and frontend separately
- Update API URLs for production environment
- Ensure proper CORS configuration

### Backend Security Notes
- Store your Gemini API key securely in environment variables
- Implement rate limiting on AI endpoints
- Add authentication/authorization as needed
- Use CORS properly for production deployment

## 📱 PWA Installation

### Mobile (Android/iOS)
1. Open the app in Chrome/Safari
2. Look for "Install" or "Add to Home Screen" prompt
3. Follow the installation steps
4. App will appear on your home screen

### Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Confirm installation
4. App will be available in your applications

## 🔔 Push Notifications

The app includes a demo notification system:
1. Click the notification bell in the header
2. Grant notification permissions
3. Receive sample notifications about assignments and announcements

## 🎨 Customization

### Themes
- Modify `tailwind.config.js` for custom colors
- Update CSS variables in `src/index.css`
- Add new color schemes in the theme system

### Components
- All components are modular and reusable
- Use TypeScript interfaces for props
- Follow the existing design patterns

## 🚀 Deployment

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure PWA settings in Netlify

### Vercel
1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`


---

**Happy Learning with EduHub! 🎓**
