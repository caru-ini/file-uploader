import GitHub from '@auth/core/providers/github';
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
      GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
  };
}

const route = app.route('', domain);

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
