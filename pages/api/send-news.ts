import { fetchNews } from '@/lib/fetchNews';
import { summarize } from '@/lib/summarize';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = process.env.LINE_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;

  if (!token) return res.status(500).json({ error: 'LINE_ACCESS_TOKEN not set' });
  if (!userId) return res.status(500).json({ error: 'LINE_USER_ID not set' });

  try {
    // ニュース取得＆要約
    const raw = await fetchNews('AI');
    const summarized = await Promise.all(
      raw.map(async (article) => ({
        title: article.title,
        summary: await summarize(article.content, 100),
        url: article.url,
        imageUrl: article.imageUrl,
      }))
    );

    // カルーセルメッセージを作成
    const message = {
      to: userId,
      messages: [
        {
          type: 'flex',
          altText: 'AI関連ニュース',
          contents: {
            type: 'carousel',
            contents: summarized.map(article => ({
              type: 'bubble',
              size: 'mega',
              header: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: article.title,
                    weight: 'bold',
                    size: 'md',
                    wrap: true,
                    color: '#000000',
                    margin: 'md'
                  }
                ],
                backgroundColor: '#FFFFFF',
                paddingAll: '12px'
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  ...(article.imageUrl ? [{
                    type: 'image',
                    url: article.imageUrl,
                    size: 'full',
                    aspectMode: 'cover',
                    aspectRatio: '16:9',
                    margin: 'none'
                  }] : []),
                  {
                    type: 'text',
                    text: article.summary,
                    size: 'sm',
                    wrap: true,
                    margin: 'sm',
                    color: '#666666'
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [],
                    margin: 'xl'
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'button',
                        action: {
                          type: 'postback',
                          label: '興味なし',
                          data: 'not_interested'
                        },
                        style: 'secondary',
                        color: '#CCCCCC',
                        margin: 'md',
                        flex: 1,
                        adjustMode: 'shrink-to-fit'
                      },
                      {
                        type: 'button',
                        action: {
                          type: 'uri',
                          label: '記事を読む',
                          uri: article.url
                        },
                        style: 'primary',
                        color: '#00B900',
                        margin: 'md',
                        flex: 2
                      }
                    ],
                    spacing: 'md'
                  }
                ],
                paddingTop: '0px',
                paddingAll: '8px'
              }
            }))
          }
        }
      ]
    };

    // LINEに送信
    const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!lineRes.ok) {
      const errorText = await lineRes.text();
      return res.status(500).json({ error: 'LINE送信エラー', detail: errorText });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('エラー:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
