export interface AnalysisResult {
  type: 'image' | 'email';
  content: string;
  analysis: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
}