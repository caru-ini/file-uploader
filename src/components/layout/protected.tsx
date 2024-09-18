'use client';
import { useSession } from '@hono/auth-js/react';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { Button } from '../ui/button';

interface ProtectedProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const Protected: FC<ProtectedProps> = ({ children, fallback }) => {
  const session = useSession();

  if (session.status === 'loading') {
    return (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <LoaderCircle className='size-12 animate-spin text-blue-500' />
        <p className='text-lg text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  if (session.status === 'unauthenticated') {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className='flex flex-1 flex-col items-center justify-center space-y-4'>
        <h1 className='text-3xl font-bold'>ログインが必要です</h1>
        <p className='text-lg text-muted-foreground'>
          このページを表示するにはログインしてください
        </p>
        <div className='flex gap-x-4'>
          <Link href='/api/auth/signin' passHref>
            <Button>Sign In</Button>
          </Link>
          <Link href='/api/auth/signup' passHref>
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Protected;
