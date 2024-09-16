import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaClient } from '@prisma/client';
import console from 'console';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: 'APAC',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const app = new Hono().basePath('/api');

app.post('/get-upload-url', async (c) => {
  const { fileName, fileType } = await c.req.json();

  console.log('Generating signed URL for:', fileName, fileType);
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return c.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return c.json({ message: 'Error generating signed URL' }, 500);
  }
});

app.post('/save-file-info', async (c) => {
  const { uniqueId, fileName, fileType } = await c.req.json();

  try {
    const fileInfo = await prisma.fileInfo.create({
      data: {
        uniqueId,
        fileName,
        fileType,
      },
    });

    return c.json(fileInfo);
  } catch (error) {
    console.error('Error saving file info:', error);
    return c.json({ message: 'Error saving file info' }, 500);
  }
});

app.get('/get-files', async (c) => {
  const id = c.req.query('id');

  if (!id) {
    return c.json({ message: 'Invalid ID' }, 400);
  }

  try {
    const files = await prisma.fileInfo.findMany({
      where: {
        uniqueId: id,
      },
    });

    return c.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return c.json({ message: 'Error fetching files' }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
