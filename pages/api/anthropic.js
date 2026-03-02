// pages/api/anthropic.js
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { messages, system, max_tokens } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array required' });
    const userMessages = messages.filter(m => m.role !== 'system');
    if (userMessages.length === 0) return res.status(400).json({ error: 'No valid messages' });
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: max_tokens || 1024,
      system: system || 'You are Starky (★), a warm and encouraging AI tutor for NewWorld Education. Patient, never judgmental, always celebrating effort.',
      messages: userMessages,
    });
    res.status(200).json({ content: response.content[0].text, usage: response.usage });
  } catch (error) {
    console.error('Anthropic API error:', error);
    if (error.status === 401) return res.status(401).json({ error: 'Invalid API key' });
    if (error.status === 429) return res.status(429).json({ error: 'Rate limit exceeded. Please try again.' });
    res.status(500).json({ error: 'Failed to get response from Starky.' });
  }
}
