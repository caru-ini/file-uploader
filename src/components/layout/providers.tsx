'use client';

import { SessionProvider } from '@hono/auth-js/react';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
