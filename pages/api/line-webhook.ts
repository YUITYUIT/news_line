import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // LINEの仕様に必要
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const rawBody = Buffer.concat(buffers).toString('utf-8');
    const body = JSON.parse(rawBody);

    const userId = body.events?.[0]?.source?.userId;
    console.log('✅ ユーザーID:', userId);

    return res.status(200).send('OK');
  } catch (e) {
    console.error('Webhook error:', e);
    return res.status(500).send('Error');
  }
}
