# Next.js App "Music Besties" Frontend Implementation Plan

## Background Context

**Key Functionality**
- Intelligent AI assistant with contextual responses
- Bidirectional state sync between chat and canvas
- Dynamic UI generation following the AG-UI protocol as stated here https://github.com/ag-ui-protocol/ag-ui/tree/main/typescript-sdk/integrations/langgraph
- Mobile-responsive design

### Phase 1: App Setup 

#### 1.1 Create New Next.js App
```bash

# Create fresh Next.js app
npx create-next-app@latest music-besties-v2 --typescript --tailwind --eslint --app --src-dir --use-pnpm

# Enter new project
cd music-besties-v2
```

#### 1.2 Install All Required Dependencies
```bash
# UI Framework Dependencies
pnpm install @radix-ui/react-dialog @radix-ui/react-icons @radix-ui/react-select @radix-ui/react-slot

# Styling & Utilities
pnpm install class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate

# API & LLM
pnpm install openai

# Development Dependencies
pnpm install --save-dev @types/node

# Verify installation
pnpm list
```

#### 1.3 Configure Tailwind & Components
- Copy `tailwind.config.ts`
- Copy `components.json`
- Create `src/components/ui/` directory

#### 1.4 Git commit and deploy
- Initiate new repo and commit using Github CLI
- Deploy to Vercel using Github Actions
- You also have access to Vercel CLI as required

### Phase 2: Core LLM Intelligence Migration

#### 2.1 API Route - THE BRAIN 🧠
**Priority: CRITICAL - This contains all the AI intelligence**
```bash
# Create API directory structure
mkdir -p src/app/api/agui

# Copy the main API route (contains all LLM logic)
cp ../CopilotKit/examples/coagents-research-canvas/ui/src/app/api/agui/route.ts src/app/api/agui/

# Verify the file copied correctly
ls -la src/app/api/agui/
cat src/app/api/agui/route.ts | head -20
```

**This file contains:**
- `generateIntelligentResponse()` - Core AI conversation logic
- `generateArticleContent()` - Article generation with Taylor Swift example
- `SAMPLE_RESOURCES` - Smart resource databases
- Request routing and state management

#### 2.2 Environment Configuration
**Create `.env.local` in project root with these variables:**
```bash
# Copy from: ../CopilotKit/examples/coagents-research-canvas/ui/.env.local

# Required Variables:
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_OPENAI_MODEL=gpt-4
NEXT_PUBLIC_AGUI_ENABLED=true

# Optional (if using LangGraph Cloud):
LANGGRAPH_API_URL=your_langgraph_endpoint
LANGSMITH_API_KEY=your_langsmith_key

# Verify file exists and has content:
cat .env.local
```

#### 2.3 Type Definitions
```bash
# Create lib directory
mkdir -p src/lib

# Copy type definitions
cp ../CopilotKit/examples/coagents-research-canvas/ui/src/lib/types.ts src/lib/

# Verify types are present
grep -E "(interface|type)" src/lib/types.ts
```

**Critical types included:**
- `AgentState` - State management interface
- `Resource` - Research resource structure  
- Message and event types

### Phase 3: Agent Backend Migration 

#### 3.1 Agent Directory Structure
```
COPY: entire agent-js/ folder to project root
- aguiAgent.ts (LangGraph workflow)
- state.ts (clean AG-UI version)
- search.ts, download.ts (agent capabilities)
- package.json (agent dependencies)
```

#### 3.2 Update Agent Dependencies
```bash
cd agent-js/
pnpm install  # Install agent-specific dependencies
```

### Phase 4: Smart Client Logic (30 minutes)

#### 4.1 AG-UI Client
```
COPY: src/lib/agui-client.ts
- ResearchCanvasAGUIClient class
- Intelligent response parsing
- State synchronization logic
- Observable implementations
```

#### 4.2 AG-UI Hook
```
COPY: src/hooks/useAGUI.ts
- Clean version without CopilotKit references
- State management logic
- Event handling
```

### Phase 5: Clean UI Components (45 minutes)

#### 5.1 Core Components (Copy & Clean)
```bash
# Create components directory structure
mkdir -p src/components/ui

# Copy main components (these are clean of CopilotKit)
cp ../CopilotKit/examples/coagents-research-canvas/ui/src/components/ResearchCanvas.tsx src/components/
cp ../CopilotKit/examples/coagents-research-canvas/ui/src/components/Resources.tsx src/components/
cp ../CopilotKit/examples/coagents-research-canvas/ui/src/components/Progress.tsx src/components/
cp ../CopilotKit/examples/coagents-research-canvas/ui/src/components/AddResourceDialog.tsx src/components/
cp ../CopilotKit/examples/coagents-research-canvas/ui/src/components/EditResourceDialog.tsx src/components/

# Copy UI components
cp ../CopilotKit/examples/coagents-research-canvas/ui/src/components/ui/*.tsx src/components/ui/

# Verify components copied
ls -la src/components/
ls -la src/components/ui/
```

**Components included:**
- `ResearchCanvas.tsx` - Main canvas (AG-UI version)
- `Resources.tsx` - Resource display and management
- `Progress.tsx` - Agent progress tracking
- Dialog components for resource editing
- Complete UI component library

#### 5.2 Main App Components
**Create these files from scratch (DO NOT copy from old app):**

**`src/app/page.tsx`:**
```typescript
"use client";

import { ResearchCanvas } from "@/components/ResearchCanvas";
import { useAGUI } from "@/hooks/useAGUI";
import { useState } from "react";

export default function Home() {
  const { sendMessage } = useAGUI();
  const [chatInput, setChatInput] = useState("");
  
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    await sendMessage(chatInput);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-4">Research Canvas</h1>
            <ResearchCanvas />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**`src/app/layout.tsx`:**
```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Research Canvas",
  description: "AI-powered research assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

#### 5.3 Styling
```
COPY: src/app/globals.css
- Tailwind directives
- Custom styles (mobile responsive, etc.)
```

### Phase 6: Utilities & Configuration (15 minutes)

#### 6.1 Utility Functions
```
COPY: src/lib/utils.ts (Tailwind merge utilities)
COPY: src/hooks/useDeviceDetection.ts (if needed)
```

#### 6.2 Build Configuration
```
COPY: next.config.mjs (if customized)
COPY: postcss.config.mjs
UPDATE: tsconfig.json (ensure paths are correct)
```

### Phase 7: Testing & Validation (30 minutes)

#### 7.1 Development Server
```bash
pnpm run dev
# Should start without any CopilotKit errors
```

#### 7.2 Functionality Tests
- ✅ Research question setting
- ✅ Resource finding ("find sources about climate change")
- ✅ Article generation ("write an article about Taylor Swift as philosopher")
- ✅ State synchronization between chat and canvas
- ✅ Mobile responsiveness

#### 7.3 Error Verification
- ✅ No CopilotKit console errors
- ✅ No infinite re-render loops
- ✅ No aborted GraphQL requests
- ✅ Clean React DevTools profile

### Phase 8: Agent Integration (15 minutes)

#### 8.1 Start Agent Backend
```bash
cd agent-js/
pnpm run dev  # Start LangGraph agent
```

#### 8.2 Test Full Pipeline
- Frontend → AG-UI API → Agent Backend → LLM → Response

## Docker Usage Decision

### ❌ **Current Docker Setup (Not Needed for Clean App)**
The original app uses Docker because it's part of a multi-service demo environment. The clean app **does not require Docker**.

### ✅ **Clean App Development (No Docker)**
```bash
# Simple development setup
pnpm run dev  # Runs on localhost:3000
# No containers, no docker-compose, no complexity
```

### 🔧 **Optional: Docker for Production (Future)**
If you want to containerize later:
```dockerfile
# Optional Dockerfile for production deployment
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Recommendation:** Start without Docker for simplicity. Add containerization only if needed for deployment.

### What NOT to Copy

❌ **Avoid These Files:**
- Any file with CopilotKit imports
- Old package.json (start fresh)
- .next build directory  
- node_modules
- Mobile page.tsx (has CopilotKit remnants)
- Layout.tsx with CopilotKit providers

❌ **Skip These Dependencies:**
- @copilotkit/* packages
- urql, wonka (GraphQL libs used by CopilotKit)
- Any CopilotKit-specific dependencies

### Success Criteria

✅ **App runs clean without:**
- CopilotKit console errors
- Infinite re-render loops
- GraphQL/urql errors
- "extract() failed" errors

✅ **Full functionality preserved:**
- Smart conversation handling
- Bidirectional state sync
- Context-aware responses  
- Article generation with custom content

✅ **Performance improvements:**
- Faster initial load
- No dual framework overhead
- Clean React component tree

### Estimated Timeline
- **Total Time:** ~3 hours
- **Critical Path:** Phase 2 (API intelligence) → Phase 4 (client logic) → Phase 5 (UI)
- **Parallel Work:** Agent setup can run alongside UI migration

### Troubleshooting Common Issues

#### Build Errors
```bash
# If TypeScript errors occur:
pnpm run type-check

# If missing dependencies:
pnpm install

# Clear build cache:
rm -rf .next
pnpm run build
```

#### Runtime Errors
- **"Module not found"**: Check file paths match exactly
- **"Cannot find name"**: Verify all imports are correct
- **"Environment variable undefined"**: Check `.env.local` exists and has correct variables

#### Performance Issues
- **Slow initial load**: Ensure no CopilotKit dependencies in package.json
- **Console errors**: Check browser dev tools for specific error messages
- **Memory leaks**: Verify no infinite re-render loops in React DevTools

#### Validation Checklist
```bash
# ✅ App starts without errors
pnpm run dev

# ✅ API route responds
curl http://localhost:3000/api/agui

# ✅ No CopilotKit in bundle
pnpm run build && grep -r "copilot" .next/ || echo "Clean!"

# ✅ All functionality works
# Test each feature manually
```

### Rollback Strategy
- Keep current app as backup until new app is fully validated
- Environment variables can be shared between both apps  
- Agent backend works with both implementations
- Can run both apps simultaneously on different ports for comparison

### Emergency Contacts
- If migration fails, refer back to original app structure
- Key files to preserve: `/api/agui/route.ts`, `agui-client.ts`, `useAGUI.ts`
- Original app location: `mb-researcher-demo/CopilotKit/examples/coagents-research-canvas/ui/`

---

## Why This Plan Guarantees CopilotKit Error Elimination

### ✅ **Fresh Package.json**
- No CopilotKit dependencies in dependency tree
- No `urql`, `wonka`, or GraphQL libraries 
- Clean build pipeline from scratch

### ✅ **Clean Runtime Environment**  
- New components created from scratch without CopilotKit imports
- No cached build artifacts or hidden providers
- Pure AG-UI implementation with no dual framework conflicts

### ✅ **Preserved Intelligence**
- All AI logic moved intact via `generateIntelligentResponse()` function
- Complete state management and conversation handling preserved
- Zero loss of functionality, only elimination of framework conflicts

### ✅ **Explicit Validation**
- Bundle analysis to confirm no CopilotKit code
- Runtime testing for all features
- Performance verification with clean React DevTools

---

**Key Insight:** The real value is in the API route intelligence (`generateIntelligentResponse()` function) and agent backend - these contain all the contextual AI behavior. The UI is just the presentation layer.

**Developer Note:** If you encounter any issues during migration, the troubleshooting section provides specific solutions for common problems. The rollback strategy ensures you can always return to the working original app. 