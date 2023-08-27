import { connectToDatabase } from '../../utils/mongoConnect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { AIMessage, HumanMessage } from 'langchain/schema';
import { makeChain } from '@/utils/makechain';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';

import { requireAuthChat } from '../../utils/requireAuthChat';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const { question, history } = req.body;

  console.log('question', question); // TODO: for testing purposes.
  console.log('history', history); // TODO: for testing purposes.

  // only accept post requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // server-side authentication check: only logged-in clients allowed
  const isAuthenticated = await requireAuthChat(req, res);
  if (!isAuthenticated) {
    res.status(401).send('Unauthorized');
    return; // not logged in
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }

  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
      },
    );

    //create chain
    const chain = makeChain(vectorStore);

    const pastMessages = history.map((message: string, i: number) => {
      if (i % 2 === 0) {
        return new HumanMessage(message);
      } else {
        return new AIMessage(message);
      }
    });

    // Ask a question using chat history
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: pastMessages
    });

    console.log('response', response);
    
    // MongoDB Integration
    const { db } = await connectToDatabase(process.env.MONGO_URI);
    const collection = db.collection('testCollection');
    
    // Storing the question and response in MongoDB
    await collection.insertOne({
        question: sanitizedQuestion,
        response: response,
        timestamp: new Date()
    });
    
    res.status(200).json(response);
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
