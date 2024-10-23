import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { ApiKeyProvider, useApiKey } from './context/ApiKeyContext';
import { ApiKeyInput } from './components/ApiKeyInput';
import { FileUpload } from './components/FileUpload';
import { Analysis } from './components/Analysis';
import { ErrorMessage } from './components/ErrorMessage';
import { analyzeContent } from './services/groq';
import { processImageFile, processEmailFile } from './utils/fileProcessing';
import { AnalysisResult } from './types';

function SecurityAnalyzer() {
  const { apiKey, setApiKey } = useApiKey();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageFile = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      const text = await processImageFile(file);
      const analysis = await analyzeContent(apiKey, text, 'image');
      setResult(analysis);
    } catch (err: any) {
      if (err.message.includes('401')) {
        setApiKey('');
        setError('Invalid API key. Please enter a valid API key.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to process image');
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailFile = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      const text = await processEmailFile(file);
      const analysis = await analyzeContent(apiKey, text, 'email');
      setResult(analysis);
    } catch (err: any) {
      if (err.message.includes('401')) {
        setApiKey('');
        setError('Invalid API key. Please enter a valid API key.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to process email');
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <ApiKeyInput />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Security Analyzer</h1>
          </div>
          <p className="text-gray-600">Upload images or emails for security analysis</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Analyze Image</h2>
            <FileUpload onFileSelect={handleImageFile} type="image" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Analyze Email</h2>
            <FileUpload onFileSelect={handleEmailFile} type="email" />
          </div>
        </div>

        <div className="flex justify-center">
          <Analysis result={result} loading={loading} />
        </div>

        {error && (
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ApiKeyProvider>
      <SecurityAnalyzer />
    </ApiKeyProvider>
  );
}

export default App;