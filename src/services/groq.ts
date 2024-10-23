import { AnalysisResult } from '../types';

async function fetchWithRetry(url: string, options: RequestInit, retries: number = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    }
    if (response.status === 503 && i < retries - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
    } else {
      throw new Error(`API request failed with status ${response.status}`);
    }
  }
  throw new Error('Max retries reached');
}

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
    const response = await fetchWithRetry('https://api.groq.com/openai/v1/chat/completions', {
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

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    const analysis = data.choices[0].message.content;

    console.log('Analysis:', analysis);

    // Parse the response to determine risk level and recommendations
    const riskLevel = analysis.toLowerCase().includes('high risk') ? 'high' 
                    : analysis.toLowerCase().includes('medium risk') ? 'medium' 
                    : 'low';

    const recommendations = analysis
      ? analysis
          .split('\n')
          .filter((line: string) => line.trim().startsWith('-') || line.trim().startsWith('•'))
          .map((line: string) => line.trim().replace(/^[-•]\s*/, ''))
      : [];

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