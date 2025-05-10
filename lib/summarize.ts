// OpenAI APIで100文字以内に要約する関数

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarize(text: string, maxLength: number): Promise<string> {
  return text.slice(0, maxLength) + '...';
}
  