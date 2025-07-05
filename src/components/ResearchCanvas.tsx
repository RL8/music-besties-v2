'use client';

import React from 'react';
import { useAGUI } from '@/hooks/useAGUI';
import { Resources } from './Resources';
import { Progress } from './Progress';

export function ResearchCanvas() {
  const { 
    currentTopic, 
    isProcessing, 
    setCurrentTopic, 
    generateArticle,
    findResources 
  } = useAGUI();

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTopic(e.target.value);
  };

  const handleGenerateArticle = async () => {
    if (currentTopic.trim()) {
      await generateArticle(currentTopic);
    }
  };

  const handleFindResources = async () => {
    if (currentTopic.trim()) {
      await findResources(currentTopic);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        {/* Topic Input Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Research Canvas</h2>
          
          <div className="space-y-3">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Research Topic
            </label>
            <input
              id="topic"
              type="text"
              value={currentTopic}
              onChange={handleTopicChange}
              placeholder="Enter your research topic (e.g., 'Taylor Swift as philosopher')"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isProcessing}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleFindResources}
              disabled={!currentTopic.trim() || isProcessing}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Finding...' : 'Find Resources'}
            </button>
            
            <button
              onClick={handleGenerateArticle}
              disabled={!currentTopic.trim() || isProcessing}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Generating...' : 'Generate Article'}
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        {isProcessing && (
          <Progress />
        )}

        {/* Resources Section */}
        <Resources />
      </div>
    </div>
  );
} 