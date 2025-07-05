// AG-UI Protocol - Core Agent State Interface
export interface AgentState {
  messages: AGUIMessage[];
  resources: Resource[];
  currentTopic: string;
  isProcessing: boolean;
  workflow?: WorkflowState;
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

// AG-UI Protocol Message Types
export interface AGUIMessage {
  id: string;
  content: string | object;
  type: 'human' | 'ai' | 'tool' | 'system' | 'workflow_update';
  timestamp: Date;
  metadata?: {
    agent?: string;
    step?: string;
    progress?: number;
    nodeId?: string;
    workflowId?: string;
    [key: string]: unknown;
  };
}

// Legacy Message interface for compatibility
export interface Message extends AGUIMessage {
  role: 'user' | 'assistant' | 'system';
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

// LangGraph-Style Workflow State
export interface WorkflowState {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'error' | 'paused';
  currentNode: string | null;
  completedNodes: string[];
  nodeStates: Record<string, NodeState>;
  globalState: Record<string, unknown>;
  startTime: Date;
  endTime?: Date;
  interventionPoints: InterventionPoint[];
}

export interface NodeState {
  id: string;
  name: string;
  agent: string;
  status: 'pending' | 'running' | 'completed' | 'error' | 'waiting_for_input';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  dependencies: string[];
}

export interface InterventionPoint {
  nodeId: string;
  message: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  required: boolean;
  timestamp: Date;
}

// Workflow Graph Definition
export interface WorkflowGraph {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  entryNode: string;
}

export interface WorkflowNode {
  id: string;
  name: string;
  agent: string;
  description: string;
  dependencies: string[];
  retry_policy?: {
    max_attempts: number;
    delay_seconds: number;
  };
  timeout_seconds?: number;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  condition?: string;
}

// Progress tracking for agent operations (legacy compatibility)
export interface ProgressState {
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  isActive: boolean;
  details?: string;
} 