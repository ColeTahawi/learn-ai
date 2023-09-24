import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

import dotenv from 'dotenv';

// You might want to define more specific types for your documents, loaders, etc. Here I'm just using any.
const filePath: string = 'docs';

export const handler = async () => {
  dotenv.config({ path: '../.env.local' });
  try {
    const directoryLoader: DirectoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path: string) => new PDFLoader(path),
    });
    const rawDocs: any = await directoryLoader.load();

    const textSplitter: RecursiveCharacterTextSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs: any = await textSplitter.splitDocuments(rawDocs);
    console.log('split docs', docs);

    console.log('creating vector store...');
    const embeddings: OpenAIEmbeddings = new OpenAIEmbeddings();
    const index: any = pinecone.Index(PINECONE_INDEX_NAME);

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: 'text',
    });
  } catch (error: any) {
    console.error('error', error);
    throw new Error('Failed to ingest your data');
  }
  console.log('ingestion complete');
};

// For local testing
if (require.main === module) {
  handler();
}
