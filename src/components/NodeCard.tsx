'use client';

import React from 'react';
import { NodeState } from '@/lib/types';

interface NodeCardProps {
  node: NodeState;
  isActive: boolean;
  stepNumber: number;
}

export function NodeCard({ node, isActive, stepNumber }: NodeCardProps) {
  const getStatusIcon = () => {
    switch (node.status) {
      case 'completed':
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'running':
        return (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        );
      case 'error':
        return (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'waiting_for_input':
        return (
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-600">{stepNumber}</span>
          </div>
        );
    }
  };

  const getStatusColor = () => {
    switch (node.status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'running':
        return 'border-blue-200 bg-blue-50 shadow-md';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'waiting_for_input':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getAgentIcon = () => {
    switch (node.agent) {
      case 'query_analyzer':
        return '🔍';
      case 'web_searcher':
        return '🌐';
      case 'source_validator':
        return '✅';
      case 'content_analyzer':
        return '📊';
      case 'article_writer':
        return '✍️';
      case 'quality_reviewer':
        return '🎯';
      default:
        return '🤖';
    }
  };

  return (
    <div className={`
      relative p-4 rounded-lg border-2 transition-all duration-300
      ${getStatusColor()}
      ${isActive ? 'scale-105 shadow-lg' : ''}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
              <span>{getAgentIcon()}</span>
              <span>{node.name}</span>
            </h4>
            <p className="text-sm text-gray-600">{node.agent.replace(/_/g, ' ')}</p>
          </div>
        </div>
        
        {node.status === 'running' && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        )}
      </div>

      {/* Progress Bar */}
      {(node.status === 'running' || node.status === 'completed') && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(node.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                node.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${node.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Timing */}
      <div className="flex justify-between text-xs text-gray-500">
        {node.startTime && (
          <span>Started: {node.startTime.toLocaleTimeString()}</span>
        )}
        {node.endTime && (
          <span>Completed: {node.endTime.toLocaleTimeString()}</span>
        )}
      </div>

      {/* Error Message */}
      {node.error && (
        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700">
          <strong>Error:</strong> {node.error}
        </div>
      )}

             {/* Output Preview */}
       {node.output && node.status === 'completed' && (
         <div className="mt-3 p-2 bg-white border border-gray-200 rounded text-sm">
           <div className="text-gray-600 mb-1">Output:</div>
           <div className="text-gray-800 max-h-20 overflow-y-auto">
             {(() => {
               const outputText = typeof node.output === 'string' 
                 ? node.output 
                 : JSON.stringify(node.output);
               return outputText.length > 100 
                 ? outputText.substring(0, 100) + '...'
                 : outputText;
             })()}
           </div>
         </div>
       )}

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
} 