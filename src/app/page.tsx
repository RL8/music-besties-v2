'use client';

import { useState } from 'react';
import { Progress } from '@/components/Progress';
import { ResearchCanvas } from '@/components/ResearchCanvas';
import { Resources } from '@/components/Resources';
import { WorkflowCanvas } from '@/components/WorkflowCanvas';
import { useAGUI } from '@/hooks/useAGUI';
import { WorkflowState } from '@/lib/types';

export default function MusicBestiesResearchAssistant() {
  const [query, setQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [workflow, setWorkflow] = useState<WorkflowState | null>(null);
  const [activeTab, setActiveTab] = useState<'research' | 'workflow'>('research');
  
     // Legacy AGUI hook for backward compatibility
   const {
     isProcessing,
     sendMessage,
     reset
   } = useAGUI();

  const handleWorkflowSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsResearching(true);
    setActiveTab('workflow');
    
    try {
      const response = await fetch('/api/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start',
          query: searchQuery
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start workflow');
      }

      const result = await response.json();
      setWorkflow(result.workflow);
      
      // Poll for updates
      pollWorkflowStatus(result.workflow.id);
      
    } catch (error) {
      console.error('Workflow error:', error);
      setIsResearching(false);
    }
  };

  const pollWorkflowStatus = async (workflowId: string) => {
    const poll = async () => {
      try {
        const response = await fetch('/api/workflow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'status',
            workflowId
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setWorkflow(result.workflow);
          
          if (result.workflow.status === 'running') {
            setTimeout(poll, 2000); // Poll every 2 seconds
          } else {
            setIsResearching(false);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        setIsResearching(false);
      }
    };

    setTimeout(poll, 1000); // Start polling after 1 second
  };

  const handleWorkflowPause = async () => {
    if (!workflow) return;
    
    try {
      const response = await fetch('/api/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'pause',
          workflowId: workflow.id
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setWorkflow(result.workflow);
      }
    } catch (error) {
      console.error('Pause error:', error);
    }
  };

  const handleWorkflowResume = async () => {
    if (!workflow) return;
    
    try {
      const response = await fetch('/api/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'resume',
          workflowId: workflow.id
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setWorkflow(result.workflow);
        pollWorkflowStatus(workflow.id);
      }
    } catch (error) {
      console.error('Resume error:', error);
    }
  };

  const handleWorkflowStop = async () => {
    if (!workflow) return;
    
    try {
      const response = await fetch('/api/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'stop',
          workflowId: workflow.id
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setWorkflow(result.workflow);
        setIsResearching(false);
      }
    } catch (error) {
      console.error('Stop error:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (activeTab === 'workflow') {
      handleWorkflowSearch(query);
    } else {
      sendMessage(query);
    }
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎵 Music Besties Research Assistant
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover, analyze, and explore music with our AI-powered research assistant.
            Choose between classic research mode or the new multi-agent workflow system.
          </p>
        </header>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('research')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'research'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🔍 Classic Research
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'workflow'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🤖 AI Workflow
            </button>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeTab === 'workflow'
                  ? "Start a multi-agent research workflow... (e.g., 'Analyze the evolution of hip-hop')"
                  : "Ask me anything about music... (e.g., 'Tell me about jazz history')"
              }
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                             disabled={isProcessing || isResearching}
            />
            <button
              type="submit"
                             disabled={isProcessing || isResearching || !query.trim()}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'workflow'
                  ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400'
                  : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
              } text-white disabled:cursor-not-allowed`}
            >
                             {isProcessing || isResearching ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{activeTab === 'workflow' ? 'Running...' : 'Researching...'}</span>
                </div>
              ) : (
                activeTab === 'workflow' ? '🚀 Start Workflow' : '🔍 Research'
              )}
            </button>
          </div>
        </form>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'workflow' ? (
            /* Workflow Mode */
            <div className="space-y-6">
              <WorkflowCanvas
                workflow={workflow}
                onPause={handleWorkflowPause}
                onResume={handleWorkflowResume}
                onStop={handleWorkflowStop}
              />
              
              {workflow && workflow.status === 'completed' && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    🎯 Research Results
                  </h3>
                  <div className="prose max-w-none">
                    {/* Display final results here */}
                    <p className="text-gray-600">
                      Research workflow completed successfully! 
                      Check the final output from the Quality Reviewer agent above.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Classic Research Mode */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Research Area */}
              <div className="lg:col-span-2 space-y-6">
                                 <ResearchCanvas />
                 {isProcessing && (
                   <Progress />
                 )}
              </div>

              {/* Resources Sidebar */}
                             <div className="lg:col-span-1">
                 <Resources />
               </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              💡 Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setQuery('Analyze the evolution of jazz music');
                  setActiveTab('workflow');
                }}
                className="p-4 text-left rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                <div className="font-medium text-gray-800">🎷 Jazz Evolution</div>
                <div className="text-sm text-gray-600">Multi-agent analysis</div>
              </button>
              
              <button
                onClick={() => {
                  setQuery('Tell me about The Beatles influence on music');
                  setActiveTab('research');
                }}
                className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="font-medium text-gray-800">🎸 Beatles Impact</div>
                <div className="text-sm text-gray-600">Classic research</div>
              </button>
              
              <button
                                 onClick={() => {
                   reset();
                   setWorkflow(null);
                 }}
                className="p-4 text-left rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <div className="font-medium text-gray-800">🗑️ Clear All</div>
                <div className="text-sm text-gray-600">Start fresh</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
