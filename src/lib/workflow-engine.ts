import { v4 as uuidv4 } from 'uuid';
import { 
  WorkflowGraph, 
  WorkflowState, 
  NodeState, 
  AGUIMessage, 
  InterventionPoint 
} from './types';

export class WorkflowEngine {
  private workflows: Map<string, WorkflowState> = new Map();
  private graphs: Map<string, WorkflowGraph> = new Map();
  private listeners: Map<string, ((state: WorkflowState) => void)[]> = new Map();

  constructor() {
    this.registerDefaultWorkflows();
  }

  // Register default research workflow
  private registerDefaultWorkflows() {
    const researchWorkflow: WorkflowGraph = {
      id: 'research_canvas',
      name: 'Research Canvas Workflow',
      description: 'Multi-agent research and article generation',
      entryNode: 'query_analyzer',
      nodes: [
        {
          id: 'query_analyzer',
          name: 'Query Analysis',
          agent: 'query_analyzer',
          description: 'Understand and decompose the research query',
          dependencies: [],
          timeout_seconds: 30
        },
        {
          id: 'web_searcher',
          name: 'Web Search',
          agent: 'web_searcher',
          description: 'Search for relevant sources and information',
          dependencies: ['query_analyzer'],
          timeout_seconds: 60
        },
        {
          id: 'source_validator',
          name: 'Source Validation',
          agent: 'source_validator',
          description: 'Validate and rank found sources',
          dependencies: ['web_searcher'],
          timeout_seconds: 45
        },
        {
          id: 'content_analyzer',
          name: 'Content Analysis',
          agent: 'content_analyzer',
          description: 'Extract insights and key information',
          dependencies: ['source_validator'],
          timeout_seconds: 90
        },
        {
          id: 'article_writer',
          name: 'Article Generation',
          agent: 'article_writer',
          description: 'Generate comprehensive article',
          dependencies: ['content_analyzer'],
          timeout_seconds: 120
        },
        {
          id: 'quality_reviewer',
          name: 'Quality Review',
          agent: 'quality_reviewer',
          description: 'Review and suggest improvements',
          dependencies: ['article_writer'],
          timeout_seconds: 60
        }
      ],
      edges: [
        { from: 'query_analyzer', to: 'web_searcher' },
        { from: 'web_searcher', to: 'source_validator' },
        { from: 'source_validator', to: 'content_analyzer' },
        { from: 'content_analyzer', to: 'article_writer' },
        { from: 'article_writer', to: 'quality_reviewer' }
      ]
    };

    this.graphs.set('research_canvas', researchWorkflow);
  }

  // Start a new workflow
  async startWorkflow(
    graphId: string, 
    input: Record<string, unknown>
  ): Promise<string> {
    const graph = this.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Workflow graph ${graphId} not found`);
    }

    const workflowId = uuidv4();
    const initialNodeStates: Record<string, NodeState> = {};

    // Initialize all nodes as pending
    graph.nodes.forEach(node => {
      initialNodeStates[node.id] = {
        id: node.id,
        name: node.name,
        agent: node.agent,
        status: 'pending',
        progress: 0,
        dependencies: node.dependencies,
        input: node.id === graph.entryNode ? input : undefined
      };
    });

    const workflowState: WorkflowState = {
      id: workflowId,
      status: 'running',
      currentNode: graph.entryNode,
      completedNodes: [],
      nodeStates: initialNodeStates,
      globalState: { ...input },
      startTime: new Date(),
      interventionPoints: []
    };

    this.workflows.set(workflowId, workflowState);
    this.listeners.set(workflowId, []);

    // Start execution
    this.executeWorkflow(workflowId);

    return workflowId;
  }

  // Subscribe to workflow updates
  subscribe(workflowId: string, listener: (state: WorkflowState) => void): () => void {
    const listeners = this.listeners.get(workflowId) || [];
    listeners.push(listener);
    this.listeners.set(workflowId, listeners);

    return () => {
      const currentListeners = this.listeners.get(workflowId) || [];
      const index = currentListeners.indexOf(listener);
      if (index > -1) {
        currentListeners.splice(index, 1);
      }
    };
  }

  // Execute workflow
  private async executeWorkflow(workflowId: string) {
    const workflow = this.workflows.get(workflowId);
    const graph = this.graphs.get('research_canvas'); // For now, hardcoded
    
    if (!workflow || !graph) return;

    try {
      while (workflow.status === 'running') {
        const readyNodes = this.getReadyNodes(workflow, graph);
        
        if (readyNodes.length === 0) {
          // Check if all nodes are completed
          const allCompleted = Object.values(workflow.nodeStates)
            .every(node => node.status === 'completed');
          
          if (allCompleted) {
            workflow.status = 'completed';
            workflow.endTime = new Date();
            this.notifyListeners(workflowId, workflow);
            break;
          } else {
            // Wait for intervention or error handling
            workflow.status = 'paused';
            this.notifyListeners(workflowId, workflow);
            break;
          }
        }

        // Execute ready nodes (for now, one at a time)
        for (const nodeId of readyNodes) {
          await this.executeNode(workflowId, nodeId);
        }
      }
    } catch (error) {
      workflow.status = 'error';
      workflow.endTime = new Date();
      this.notifyListeners(workflowId, workflow);
    }
  }

  // Get nodes ready for execution
  private getReadyNodes(workflow: WorkflowState, graph: WorkflowGraph): string[] {
    return graph.nodes
      .filter(node => {
        const nodeState = workflow.nodeStates[node.id];
        return nodeState.status === 'pending' &&
               node.dependencies.every(dep => 
                 workflow.nodeStates[dep]?.status === 'completed'
               );
      })
      .map(node => node.id);
  }

  // Execute a specific node
  private async executeNode(workflowId: string, nodeId: string) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return;

    const nodeState = workflow.nodeStates[nodeId];
    if (!nodeState) return;

    // Update node status
    nodeState.status = 'running';
    nodeState.startTime = new Date();
    workflow.currentNode = nodeId;
    
    this.notifyListeners(workflowId, workflow);

    try {
      // Execute the agent for this node
      const result = await this.executeAgent(nodeState.agent, {
        nodeId,
        workflowId,
        input: nodeState.input || {},
        globalState: workflow.globalState
      });

      // Update node with results
      nodeState.status = 'completed';
      nodeState.endTime = new Date();
      nodeState.progress = 100;
      nodeState.output = result;
      
      // Update global state
      workflow.globalState = { ...workflow.globalState, ...result };
      workflow.completedNodes.push(nodeId);

      this.notifyListeners(workflowId, workflow);

    } catch (error) {
      nodeState.status = 'error';
      nodeState.error = error instanceof Error ? error.message : String(error);
      nodeState.endTime = new Date();
      
      this.notifyListeners(workflowId, workflow);
    }
  }

  // Execute agent using real agent implementations
  private async executeAgent(
    agentType: string, 
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const { AgentRegistry } = await import('./research-agents');
    const registry = new AgentRegistry();
    
    return await registry.executeAgent(agentType, context as any);
  }

  // Utility methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private notifyListeners(workflowId: string, workflow: WorkflowState) {
    const listeners = this.listeners.get(workflowId) || [];
    listeners.forEach(listener => listener(workflow));
  }

  // Public methods
  getWorkflow(workflowId: string): WorkflowState | undefined {
    return this.workflows.get(workflowId);
  }

  pauseWorkflow(workflowId: string) {
    const workflow = this.workflows.get(workflowId);
    if (workflow && workflow.status === 'running') {
      workflow.status = 'paused';
      this.notifyListeners(workflowId, workflow);
    }
  }

  resumeWorkflow(workflowId: string) {
    const workflow = this.workflows.get(workflowId);
    if (workflow && workflow.status === 'paused') {
      workflow.status = 'running';
      this.executeWorkflow(workflowId);
    }
  }
} 