'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut, useSession } from '@hono/auth-js/react';
import { LogIn, LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';

const UserDropdownMenu = () => {
  const session = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative size-8 rounded-full'>
          <Avatar className='size-8'>
            <AvatarImage src={session.data?.user?.image ?? undefined} alt='User avatar' />
            {session.status === 'loading' ? (
              <AvatarFallback className='animate-pulse duration-500' />
            ) : (
              <AvatarFallback>
                {session.data?.user?.name ? session.data.user.name[0].toUpperCase() : 'U'}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      {session.status === 'authenticated' ? (
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>{session.data?.user?.name}</p>
              <p className='text-xs leading-none text-muted-foreground'>
                {session.data?.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className='mr-2 size-4' />
            <span>プロフィール</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className='mr-2 size-4' />
            <span>設定</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className='mr-2 size-4' />
            <span>ログアウト</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='text-muted-foreground'>ゲスト</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href='/api/auth/signin' passHref>
            <DropdownMenuItem>
              <LogIn className='mr-2 size-4' />
              ログイン / 登録
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
