import { AnalysisResult } from '../types';

export async function analyzeContent(
  apiKey: string,
  content: string,
  type: 'image' | 'email'
): Promise<AnalysisResult> {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  if (!content) {
    throw new Error('Content is required for analysis');
  }

  const prompt = type === 'image' 
    ? `Analyze this image content for security implications: ${content}`
    : `Analyze this email for potential security risks, phishing attempts, or spam: ${content}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity expert specializing in analyzing images and emails for security risks. Provide clear, non-technical explanations and practical recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    const analysis = data.choices[0].message.content;

    // Parse the response to determine risk level and recommendations
    const riskLevel = analysis.toLowerCase().includes('high risk') ? 'high' 
                    : analysis.toLowerCase().includes('medium risk') ? 'medium' 
                    : 'low';

    const recommendations = analysis
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.trim().replace(/^[-•]\s*/, ''));

    return {
      type,
      content,
      analysis,
      riskLevel,
      recommendations: recommendations.length ? recommendations : ['No specific recommendations provided']
    };
  } catch (error) {
    throw new Error(`Failed to analyze content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}