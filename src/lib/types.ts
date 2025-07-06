// Core Agent State Interface
export interface AgentState {
  messages: Message[];
  resources: Resource[];
  currentTopic: string;
  isProcessing: boolean;
  lastUpdated: Date;
  context?: Record<string, unknown>;
}

// Resource structure for research
export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'research' | 'article' | 'source' | 'reference';
  tags?: string[];
  dateAdded?: Date;
  relevanceScore?: number;
}

// Message types for chat interface
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  type?: 'chat' | 'action' | 'resource' | 'article';
  metadata?: Record<string, unknown>;
}

// Event types for AG-UI communication
export interface AGUIEvent {
  type: 'message' | 'state_update' | 'resource_found' | 'article_generated';
  payload: Record<string, unknown>;
  timestamp: Date;
}

// API Request/Response types
export interface APIRequest {
  message: string;
  action?: 'chat' | 'find_resources' | 'generate_article' | 'update_state';
  context?: AgentState;
}

export interface APIResponse {
  response?: string;
  resources?: Resource[];
  article?: string;
  state?: AgentState;
  type: string;
  error?: string;
}

// Canvas state for UI management
export interface CanvasState {
  selectedResources: string[];
  currentView: 'chat' | 'resources' | 'article';
  isLoading: boolean;
  error?: string;
}

// Progress tracking for agent operations
export interface ProgressState {
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  isActive: boolean;
  details?: string;
} 