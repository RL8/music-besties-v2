# 🎵 Music Besties Research Assistant

An AI-powered music research platform featuring a sophisticated multi-agent workflow system for comprehensive research automation.

## ✨ Features

### 🤖 Multi-Agent Research System
- **Query Analyzer** 🔍 - Breaks down research queries into actionable components
- **Web Searcher** 🌐 - Finds and curates relevant sources
- **Source Validator** ✅ - Quality-checks and validates sources  
- **Content Analyzer** 📊 - Extracts insights and themes
- **Article Writer** ✍️ - Creates comprehensive research articles
- **Quality Reviewer** 🎯 - Reviews and scores final output

### 🎨 Modern Interface
- **Dual-Mode Interface**: Classic Research + AI Workflow modes
- **Real-time Progress Tracking**: Watch agents work in real-time
- **Interactive Workflow Canvas**: Visual progress with agent status cards
- **Workflow Controls**: Pause, resume, or stop workflows
- **Beautiful Design**: Gradient backgrounds with smooth animations

### 🛠️ Technical Features
- **AG-UI Protocol Compliance**: Standardized message types and state management
- **LangGraph-Style Workflows**: Node-based execution with dependencies
- **Full TypeScript**: Complete type safety throughout
- **Error Handling**: Robust error recovery and fallback mechanisms
- **WebSocket-style Polling**: Real-time updates without complex infrastructure

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[YOUR_USERNAME]/music-besties-v2.git
   cd music-besties-v2
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create `.env.local` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_OPENAI_MODEL=gpt-4
   ```

4. **Run development server**
   ```bash
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📖 Usage

### Classic Research Mode
- Enter research queries in natural language
- Get intelligent AI responses with resource management
- Generate articles and find sources

### AI Workflow Mode  
- Start sophisticated multi-agent research workflows
- Watch agents coordinate in real-time
- Get comprehensive research outputs with quality scoring

### Example Queries
- "Analyze the evolution of jazz music"
- "Research Taylor Swift's impact on modern pop culture"
- "Find sources about the history of hip-hop"

## 🏗️ Architecture

### Frontend
- **Next.js 15** with Turbopack
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Components** with modern hooks

### Backend
- **Next.js API Routes** for serverless functions
- **OpenAI Integration** for AI capabilities
- **AG-UI Protocol** for agent communication
- **LangGraph-inspired** workflow engine

### State Management
- **AGUI Client** for bidirectional state sync
- **Observable Pattern** for real-time updates
- **Resource Management** for research assets

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   │   ├── agui/       # AGUI protocol endpoint
│   │   └── workflow/   # Workflow management
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main application
├── components/         # React components
│   ├── WorkflowCanvas.tsx
│   ├── NodeCard.tsx
│   ├── ResearchCanvas.tsx
│   └── ...
├── lib/               # Core libraries
│   ├── workflow-engine.ts
│   ├── research-agents.ts
│   ├── agui-client.ts
│   └── types.ts
└── hooks/             # Custom React hooks
    └── useAGUI.ts
```

### Key Components

- **WorkflowEngine**: Orchestrates multi-agent workflows
- **ResearchAgents**: Specialized AI agents for different tasks
- **AGUIClient**: Handles state management and API communication
- **WorkflowCanvas**: Interactive visualization component

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEXT_PUBLIC_OPENAI_MODEL`: Model to use (e.g., gpt-4)

### GitHub Actions

The repository includes automated deployment via GitHub Actions:

- **Preview deployments** for pull requests
- **Production deployments** for main branch pushes
- **Automatic builds** with dependency caching

Required secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID` 
- `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_OPENAI_MODEL`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for the GPT models
- **Vercel** for hosting and deployment
- **Next.js** team for the amazing framework
- **AG-UI Protocol** inspiration for agent communication
- **LangGraph** concepts for workflow orchestration

---

Built with ❤️ for music research and AI innovation
