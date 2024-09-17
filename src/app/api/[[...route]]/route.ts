import { generateUniqueShareLink } from '@/utils/generateUniqueId';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaClient } from '@prisma/client';
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

const domain = new Hono()
  .post('/upload', async (c) => {
    const { fileType } = await c.req.json();

    const key = `${new Date().getTime()}.${fileType.split('/')[1]}`;

    console.log('Generating signed URL for:', key, fileType);
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return c.json({ signedUrl, key });
  })

  .post('/files', async (c) => {
    const { fileName, mimeType, fileSize, key } = await c.req.json();

    const fileInfo = await prisma.fileInfo.create({
      data: { fileName, key, mimeType, fileSize, updatedAt: new Date() },
    });

    return c.json(fileInfo);
  })

  .get('/files', async (c) => {
    const id = c.req.query('id');

    if (!id) {
      return c.json({ message: 'Invalid ID' }, 400);
    }

    try {
      const files = await prisma.fileInfo.findMany({
        where: {
          id,
        },
      });

      return c.json(files);
    } catch (error) {
      console.error('Error fetching files:', error);
      return c.json({ message: 'Error fetching files' }, 500);
    }
  })
  .post('/share', async (c) => {
    const { shareLink, keys } = await c.req.json();

    const finalShareLink = shareLink || generateUniqueShareLink();

    const newShare = await prisma.share.create({
      data: {
        shareLink: finalShareLink,
        files: {
          create: keys.map((key: string) => ({
            fileInfo: {
              connect: { key: key },
            },
          })),
        },
      },
      include: {
        files: {
          include: {
            fileInfo: true,
          },
        },
      },
    });

    return c.json(newShare);
  })
  .get('/share:shareLink', async (c) => {
    const shareLink = c.req.query('shareLink');

    if (!shareLink) {
      return c.json({ message: 'Invalid share link' }, 400);
    }

    try {
      const share = await prisma.share.findUnique({
        where: {
          shareLink,
        },
        include: {
          files: {
            include: {
              fileInfo: true,
            },
          },
        },
      });

      return c.json(share);
    } catch (error) {
      console.error('Error fetching share:', error);
      return c.json({ message: 'Error fetching share' }, 500);
    }
  });

const route = app.route('', domain);

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
