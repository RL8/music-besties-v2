'use client';

import React from 'react';
import { WorkflowState } from '@/lib/types';
import { NodeCard } from './NodeCard';
import { WorkflowProgress } from './WorkflowProgress';

interface WorkflowCanvasProps {
  workflow: WorkflowState | null;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
}

export function WorkflowCanvas({ 
  workflow, 
  onPause, 
  onResume, 
  onStop 
}: WorkflowCanvasProps) {
  if (!workflow) {
    return (
      <div className="w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-pulse bg-gray-300 h-8 w-48 rounded mb-4 mx-auto"></div>
          <p>Start a research workflow to see the progress</p>
        </div>
      </div>
    );
  }

  const nodes = Object.values(workflow.nodeStates);
  
  // Calculate overall progress
  const completedNodes = nodes.filter(node => node.status === 'completed').length;
  const totalNodes = nodes.length;
  const overallProgress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Research Workflow</h2>
            <p className="text-gray-600">Multi-agent research pipeline</p>
          </div>
          
          <div className="flex space-x-2">
            {workflow.status === 'running' && onPause && (
              <button
                onClick={onPause}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                Pause
              </button>
            )}
            {workflow.status === 'paused' && onResume && (
              <button
                onClick={onResume}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Resume
              </button>
            )}
            {onStop && (
              <button
                onClick={onStop}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Overall Progress */}
        <WorkflowProgress 
          progress={overallProgress}
          status={workflow.status}
          completedNodes={completedNodes}
          totalNodes={totalNodes}
        />
      </div>

      {/* Workflow Nodes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Agent Pipeline
        </h3>
        
        <div className="grid gap-4">
          {nodes.map((node, index) => (
            <div key={node.id} className="relative">
              <NodeCard 
                node={node}
                isActive={workflow.currentNode === node.id}
                stepNumber={index + 1}
              />
              
              {/* Connection Line */}
              {index < nodes.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              workflow.status === 'running' ? 'bg-green-100 text-green-800' :
              workflow.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              workflow.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
              workflow.status === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {workflow.status}
            </span>
          </div>
          
          <div>
            <span className="text-gray-600">Started:</span>
            <span className="ml-2 text-gray-800">
              {workflow.startTime.toLocaleTimeString()}
            </span>
          </div>
          
          {workflow.endTime && (
            <div>
              <span className="text-gray-600">Completed:</span>
              <span className="ml-2 text-gray-800">
                {workflow.endTime.toLocaleTimeString()}
              </span>
            </div>
          )}
          
          <div>
            <span className="text-gray-600">Progress:</span>
            <span className="ml-2 text-gray-800">
              {completedNodes}/{totalNodes} nodes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 