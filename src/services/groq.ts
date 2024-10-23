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
            content: 'You are a cybersecurity expert specializing in analyzing images and emails for security risks. Provide clear, non-technical explanations and practical recommendations to normal people, do not assume they have acces to an IT team or part of an orginisartion. Always start the analysis section with "Analysis Start:", the recommendations section with "Recommendations Start:", and include a risk level (low, medium, high) at the end of the analysis section with "Risk Level:".'
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

    if (response.status === 404) {
      throw new Error('API endpoint not found. Please check the URL.');
    }

    if (response.status === 401) {
      throw new Error('API request failed with status 401. Unauthorized access.');
    }

    if (response.status === 400) {
      throw new Error('API request failed with status 400. Bad request.');
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    const analysisContent = data.choices[0].message.content;

    console.log('Analysis:', analysisContent);

    // Split the analysis and recommendations based on the distinctive split
    const [analysisPart, recommendationsPart] = analysisContent.split('Recommendations Start:');

    // Extract the risk level from the analysis part
    const riskLevelMatch = analysisPart.match(/Risk Level:\s*(low|medium|high)/i);
    const riskLevel = riskLevelMatch ? riskLevelMatch[1].toLowerCase() : 'low';

    const recommendations = recommendationsPart
      ? recommendationsPart
          .split('\n')
          .filter((line: string) => line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.') || line.trim().startsWith('4.') || line.trim().startsWith('5.'))
          .map((line: string) => line.trim().replace(/^\d+\.\s*/, ''))
      : [];

    return {
      type,
      content,
      analysis: analysisPart.replace('Analysis Start:', '').replace(/Risk Level:\s*(low|medium|high)/i, '').trim(),
      riskLevel,
      recommendations: recommendations.length ? recommendations : ['No specific recommendations provided']
    };
  } catch (error) {
    throw new Error(`Failed to analyze content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}