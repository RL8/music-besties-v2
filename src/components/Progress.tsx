'use client';

import React from 'react';

export function Progress() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        
        <div>
          <p className="text-blue-800 font-medium">Processing your request...</p>
          <p className="text-blue-600 text-sm">This may take a few moments</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="bg-blue-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
} 