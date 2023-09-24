import { S3 } from 'aws-sdk';

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';

export const handler = async (event, context) => {
    try {
        // Extract the bucket name and file key from the event
        const bucket = event.Records[0].s3.bucket.name;
        const key = event.Records[0].s3.object.key;

        // Initialize S3 client and get the file from the bucket
        const s3 = new S3();
        const s3Object = await s3.getObject({ Bucket: bucket, Key: key }).promise();

        if (!s3Object.Body) throw new Error('Failed to retrieve the file from S3');

        // Get MAX_UPLOAD_SIZE from environment variables and compare it with the file size
        const MAX_UPLOAD_SIZE = Number(process.env.MAX_UPLOAD_SIZE || '0');
        if (s3Object.ContentLength > MAX_UPLOAD_SIZE) {
            throw new Error(`File size exceeds the maximum upload size of ${MAX_UPLOAD_SIZE} bytes`);
        }

        // Pass the Buffer directly to PDFLoader
        const loader = new PDFLoader(s3Object.Body);
        const rawDocs = await loader.load();

        // Split text into chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await textSplitter.splitDocuments(rawDocs);
        console.log('split docs', docs);

        console.log('creating vector store...');
        // Create and store the embeddings in the vectorStore
        const embeddings = new OpenAIEmbeddings();
        const index = pinecone.Index(PINECONE_INDEX_NAME);

        // Embed the PDF documents
        await PineconeStore.fromDocuments(docs, embeddings, {
            pineconeIndex: index,
            namespace: PINECONE_NAME_SPACE,
            textKey: 'text',
        });
    } catch (error) {
        console.error('error', error);
        throw new Error('Failed to ingest your data');
    }

    console.log('ingestion complete');
};
