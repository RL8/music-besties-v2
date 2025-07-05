import { AgentState, Message, Resource, APIRequest, APIResponse } from './types';

export class ResearchCanvasAGUIClient {
  private baseUrl: string;
  private state: AgentState;
  private listeners: ((state: AgentState) => void)[] = [];

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.state = {
      messages: [],
      resources: [],
      currentTopic: '',
      isProcessing: false,
      lastUpdated: new Date(),
    };
  }

  // Observable pattern for state updates
  subscribe(listener: (state: AgentState) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  private updateState(updates: Partial<AgentState>) {
    this.state = {
      ...this.state,
      ...updates,
      lastUpdated: new Date(),
    };
    this.notifyListeners();
  }

  // Core API communication
  private async makeRequest(request: APIRequest): Promise<APIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/agui`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Intelligent response parsing
  async sendMessage(content: string, action?: string): Promise<void> {
    const message: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      type: 'human',
      timestamp: new Date(),
    };

    // Add user message to state
    this.updateState({
      messages: [...this.state.messages, message],
      isProcessing: true,
    });

    try {
      const request: APIRequest = {
        message: content,
        action: action as 'chat' | 'find_resources' | 'generate_article' | 'update_state',
        context: this.state,
      };

      const response = await this.makeRequest(request);
      
      // Parse intelligent response
      await this.parseResponse(response);
    } catch (error) {
      console.error('Send message error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error processing your request.',
        role: 'assistant',
        type: 'ai',
        timestamp: new Date(),
      };
      
      this.updateState({
        messages: [...this.state.messages, errorMessage],
        isProcessing: false,
      });
    }
  }

  // Response parsing with context awareness
  private async parseResponse(response: APIResponse): Promise<void> {
    const assistantMessage: Message = {
      id: Date.now().toString(),
      content: response.response || 'No response received',
      role: 'assistant',
      type: 'ai',
      timestamp: new Date(),
    };

    let updatedResources = this.state.resources;
    
    // Handle different response types
    if (response.resources && response.resources.length > 0) {
      updatedResources = [...this.state.resources, ...response.resources];
      assistantMessage.content = `Found ${response.resources.length} relevant resources for your query.`;
    }

    if (response.article) {
      assistantMessage.content = response.article;
      assistantMessage.type = 'ai';
    }

    this.updateState({
      messages: [...this.state.messages, assistantMessage],
      resources: updatedResources,
      isProcessing: false,
    });
  }

  // Resource management
  async findResources(query: string): Promise<void> {
    await this.sendMessage(query, 'find_resources');
  }

  async generateArticle(topic: string): Promise<void> {
    this.updateState({ currentTopic: topic });
    await this.sendMessage(topic, 'generate_article');
  }

  // State synchronization
  addResource(resource: Resource): void {
    const updatedResources = [...this.state.resources, resource];
    this.updateState({ resources: updatedResources });
  }

  removeResource(resourceId: string): void {
    const updatedResources = this.state.resources.filter(r => r.id !== resourceId);
    this.updateState({ resources: updatedResources });
  }

  setCurrentTopic(topic: string): void {
    this.updateState({ currentTopic: topic });
  }

  // State access
  getState(): AgentState {
    return { ...this.state };
  }

  getMessages(): Message[] {
    return this.state.messages.map(msg => ({
      ...msg,
      role: msg.type === 'human' ? 'user' as const : 
            msg.type === 'ai' ? 'assistant' as const : 
            'system' as const
    }));
  }

  getResources(): Resource[] {
    return [...this.state.resources];
  }

  getCurrentTopic(): string {
    return this.state.currentTopic;
  }

  isProcessing(): boolean {
    return this.state.isProcessing;
  }

  // Clear state
  reset(): void {
    this.updateState({
      messages: [],
      resources: [],
      currentTopic: '',
      isProcessing: false,
    });
  }
} 