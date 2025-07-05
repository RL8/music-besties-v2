'use client';

import React from 'react';

interface WorkflowProgressProps {
  progress: number;
  status: string;
  completedNodes: number;
  totalNodes: number;
}

export function WorkflowProgress({ 
  progress, 
  status, 
  completedNodes, 
  totalNodes 
}: WorkflowProgressProps) {
  const getStatusMessage = () => {
    switch (status) {
      case 'running':
        return 'Research in progress...';
      case 'completed':
        return 'Research completed successfully!';
      case 'paused':
        return 'Research paused';
      case 'error':
        return 'Research encountered an error';
      default:
        return 'Preparing research...';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'paused':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-3">
      {/* Status Message */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          {getStatusMessage()}
        </span>
        <span className="text-sm text-gray-600">
          {completedNodes}/{totalNodes} agents completed
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        >
          {/* Animated shine effect for running state */}
          {status === 'running' && (
            <div className="h-full rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Progress Percentage */}
      <div className="text-right">
        <span className="text-lg font-bold text-gray-800">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
} 