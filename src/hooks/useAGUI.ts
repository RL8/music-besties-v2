'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ResearchCanvasAGUIClient } from '@/lib/agui-client';
import { AgentState, Resource, AGUIMessage } from '@/lib/types';

// Hook return type
interface UseAGUIReturn {
  // State
  messages: AGUIMessage[];
  resources: Resource[];
  currentTopic: string;
  isProcessing: boolean;
  
  // Actions
  sendMessage: (message: string) => Promise<void>;
  findResources: (query: string) => Promise<void>;
  generateArticle: (topic: string) => Promise<void>;
  addResource: (resource: Resource) => void;
  removeResource: (resourceId: string) => void;
  setCurrentTopic: (topic: string) => void;
  reset: () => void;
  
  // State access
  getState: () => AgentState;
}

// Create a global client instance
let globalClient: ResearchCanvasAGUIClient | null = null;

function getClient(): ResearchCanvasAGUIClient {
  if (!globalClient) {
    globalClient = new ResearchCanvasAGUIClient();
  }
  return globalClient;
}

export function useAGUI(): UseAGUIReturn {
  const clientRef = useRef<ResearchCanvasAGUIClient | undefined>(undefined);
  const [state, setState] = useState<AgentState>({
    messages: [],
    resources: [],
    currentTopic: '',
    isProcessing: false,
    lastUpdated: new Date(),
  });

  // Initialize client
  useEffect(() => {
    clientRef.current = getClient();
    
    // Subscribe to state changes
    const unsubscribe = clientRef.current.subscribe((newState) => {
      setState(newState);
    });

    // Set initial state
    setState(clientRef.current.getState());

    return unsubscribe;
  }, []);

  // Actions with error handling
  const sendMessage = useCallback(async (message: string) => {
    if (!clientRef.current) return;
    
    try {
      await clientRef.current.sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, []);

  const findResources = useCallback(async (query: string) => {
    if (!clientRef.current) return;
    
    try {
      await clientRef.current.findResources(query);
    } catch (error) {
      console.error('Failed to find resources:', error);
    }
  }, []);

  const generateArticle = useCallback(async (topic: string) => {
    if (!clientRef.current) return;
    
    try {
      await clientRef.current.generateArticle(topic);
    } catch (error) {
      console.error('Failed to generate article:', error);
    }
  }, []);

  const addResource = useCallback((resource: Resource) => {
    if (!clientRef.current) return;
    clientRef.current.addResource(resource);
  }, []);

  const removeResource = useCallback((resourceId: string) => {
    if (!clientRef.current) return;
    clientRef.current.removeResource(resourceId);
  }, []);

  const setCurrentTopic = useCallback((topic: string) => {
    if (!clientRef.current) return;
    clientRef.current.setCurrentTopic(topic);
  }, []);

  const reset = useCallback(() => {
    if (!clientRef.current) return;
    clientRef.current.reset();
  }, []);

  const getState = useCallback(() => {
    if (!clientRef.current) return state;
    return clientRef.current.getState();
  }, [state]);

  return {
    // State
    messages: state.messages,
    resources: state.resources,
    currentTopic: state.currentTopic,
    isProcessing: state.isProcessing,
    
    // Actions
    sendMessage,
    findResources,
    generateArticle,
    addResource,
    removeResource,
    setCurrentTopic,
    reset,
    
    // State access
    getState,
  };
} 