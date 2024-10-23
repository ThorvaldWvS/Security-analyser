import React, { useState } from 'react';
import { Key, KeyRound, ExternalLink, HelpCircle } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyContext';

export const ApiKeyInput: React.FC = () => {
  const { apiKey, setApiKey } = useApiKey();
  const [showKey, setShowKey] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">Groq API Key</h2>
          </div>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-indigo-600 hover:text-indigo-700"
            title={showInstructions ? 'Hide instructions' : 'Show instructions'}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {showInstructions && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-md">
            <h3 className="text-sm font-medium text-indigo-800 mb-2">How to get your API key:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-indigo-700">
              <li>Visit <a href="https://console.groq.com/login" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline inline-flex items-center">
                Groq Console
                <ExternalLink className="w-3 h-3 ml-1" />
              </a></li>
              <li>Sign up for a free account</li>
              <li>Go to <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline inline-flex items-center">
                API Keys
                <ExternalLink className="w-3 h-3 ml-1" />
              </a></li>
              <li>Click "Create API Key" and copy your key</li>
            </ol>
          </div>
        )}
        
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Groq API key"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            title={showKey ? 'Hide API key' : 'Show API key'}
          >
            <KeyRound className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-2 flex items-start gap-2">
          <div className="flex-shrink-0 mt-1">
            <Key className="w-3 h-3 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">
            Your API key is stored locally in your browser and never sent to our servers. 
            The key is used only for direct communication with Groq's API.
          </p>
        </div>
      </div>
    </div>
  );
};