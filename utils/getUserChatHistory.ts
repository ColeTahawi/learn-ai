import { connectToDatabase } from './mongoConnect'; // Adjust the import path as necessary

const COLLECTION_NAME = 'testCollection';

export async function getUserChatHistory(userId: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTION_NAME);

  // Query to find documents where `user_id` equals the provided `userId`
  const query = { user_id: userId };
  
  // Fetch and convert the results into an array
  const result = await collection.find(query).toArray();

  return result;
}
