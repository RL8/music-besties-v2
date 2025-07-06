'use client';

import { useState } from 'react';
import { ResearchCanvas } from '@/components/ResearchCanvas';
import { useAGUI } from '@/hooks/useAGUI';

export default function Home() {
  const { sendMessage, messages, isProcessing } = useAGUI();
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;
    await sendMessage(chatInput);
    setChatInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Music Besties Research Assistant</h1>
          <p className="text-gray-600">Intelligent AI assistant with contextual responses and bidirectional state sync</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Research Canvas */}
          <div className="space-y-6">
            <ResearchCanvas />
          </div>

          {/* AI Chat Interface */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">AI Assistant</h2>
            
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <p>Ask me anything about your research!</p>
                                     <p className="text-sm mt-2">Try: &quot;Find sources about climate change&quot; or &quot;Write an article about Taylor Swift as philosopher&quot;</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <span className="text-xs opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {isProcessing && (
                <div className="flex justify-start mt-4">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isProcessing}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isProcessing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setChatInput('Find sources about climate change')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isProcessing}
              >
                Find climate sources
              </button>
              <button
                onClick={() => setChatInput('Write an article about Taylor Swift as philosopher')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isProcessing}
              >
                Taylor Swift article
              </button>
              <button
                onClick={() => setChatInput('What is AI and music research?')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isProcessing}
              >
                AI music research
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
