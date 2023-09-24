import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';

// AWS configuration
AWS.config.update({
  region: 'us-west-1', // e.g., 'us-west-1'. Adjust accordingly.
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fileName, fileType } = req.body;

    const s3Params = {
      Bucket: 'learn-ai-test',
      Key: fileName,
      Expires: 60, // URL expiry time in seconds
      ContentType: fileType,
      ACL: 'public-read' // or another appropriate permission
    };

    const s3 = new AWS.S3();

    try {
      const presignedUrl = await s3.getSignedUrlPromise('putObject', s3Params);
      res.status(200).json({ uploadURL: presignedUrl });
    } catch (error) {
      res.status(500).json({ error: 'Error generating pre-signed URL' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
