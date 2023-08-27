import { getUserChatHistory } from '../../utils/getUserChatHistory';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    const chatHistory = await getUserChatHistory(userId);
    return res.status(200).json(chatHistory);
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}
