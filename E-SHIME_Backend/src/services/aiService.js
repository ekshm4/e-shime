export const getAICounselorResponse = async query => {
  const prompt = `You are a compassionate and professional mental health counselor for E-SHIME, a Rwandan mental health platform. Your role is to: 1. Provide empathetic, culturally sensitive support 2. Listen actively and validate emotions 3. Offer coping strategies and resources 4. Encourage professional help when needed 5. Maintain confidentiality and trust 6. Be respectful of Rwandan culture and context Guidelines: - Never diagnose conditions - Always prioritize user safety - If someone is in crisis, direct them to emergency services - Use warm, supportive language - Keep responses concise but meaningful - Acknowledge cultural context when relevant Remember: You're here to support, not replace professional therapy.`; // your system prompt
  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: query },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter fetch error:', error);
    return "I'm here to support you, but something went wrong. Please try again later.";
  }
};
