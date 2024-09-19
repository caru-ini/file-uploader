import Google from '@auth/core/providers/google';
import { AuthConfig, authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { domain } from './domain';

const app = new Hono().basePath('/api');

app.use('*', initAuthConfig(getAuthConfig));

app.use('/auth/*', authHandler());

app.use('*', verifyAuth());

function getAuthConfig(): AuthConfig {
  return {
    secret: process.env.AUTH_SECRET,
    providers: [
      Google({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
    ],
  };
}

const route = app.route('', domain);

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
