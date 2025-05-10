import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POSTリクエストのみ処理
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const events = req.body.events;

    // イベントが存在しない場合は終了
    if (!events || events.length === 0) {
      return res.status(200).json({ message: 'No events' });
    }

    // 各イベントを処理
    for (const event of events) {
      // postbackイベントの場合
      if (event.type === 'postback') {
        // 興味なしボタンが押された場合
        if (event.postback.data === 'not_interested') {
          // ここで「興味なし」の処理を実装
          // 例：データベースに記録、ユーザーの興味を分析など
          console.log('ユーザーが興味なしを選択:', event.source.userId);
          
          // ユーザーに応答メッセージを送信
          await fetch('https://api.line.me/v2/bot/message/reply', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
              replyToken: event.replyToken,
              messages: [
                {
                  type: 'text',
                  text: 'ご回答ありがとうございます。次回からは異なるニュースをお届けします。'
                }
              ]
            })
          });
        }
      }
    }

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 