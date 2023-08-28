import { getUserChatHistory } from '../../utils/getUserChatHistory';
import { requireAuthChat } from '@/utils/requireAuthChat';

export default async function handler(req, res) {
  // server-side authentication check: only logged-in clients allowed
  const isAuthenticated = await requireAuthChat(req, res); // TODO: need to implement requireAuthChatHistory
  if (!isAuthenticated) {
    res.status(401).send('Unauthorized');
    return; // not logged in
  }

  if (req.method === 'GET') {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    // execute the api call
    const chatHistory = await getUserChatHistory(userId);
    console.log("chat history: " + chatHistory)
    return res.status(200).json(chatHistory);
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}
