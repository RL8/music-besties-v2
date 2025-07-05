'use client';

import React from 'react';
import { useAGUI } from '@/hooks/useAGUI';

export function Resources() {
  const { resources, removeResource } = useAGUI();

  if (resources.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Resources</h3>
        <p className="text-gray-600">No resources found yet. Try searching for resources related to your topic.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Resources ({resources.length})
      </h3>
      
      <div className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-md p-4 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {resource.title}
                </h4>
                <p className="text-gray-700 text-sm mb-3">
                  {resource.description}
                </p>
                
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {resource.type}
                  </span>
                  
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      View Source
                    </a>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => removeResource(resource.id)}
                className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove resource"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 