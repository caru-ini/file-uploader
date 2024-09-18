import { Folder } from 'lucide-react';
import Link from 'next/link';
import UserDropdownMenu from './user-menu';

export const Header: React.FC = () => {
  return (
    <header className='sticky top-0 z-50 flex grow-0 select-none items-center justify-between border-b border-border p-3'>
      <Link href={'/'} className='flex items-center'>
        <Folder className='mr-2 fill-yellow-300 stroke-muted-foreground' size={24} />
        File Uploader
      </Link>
      <div className='flex items-center space-x-4'>
        <nav>
          <ul className='flex items-center space-x-4'>
            <li>
              <Link href='/upload' className='text-muted-foreground hover:text-primary'>
                Upload
              </Link>
            </li>
          </ul>
        </nav>
        <UserDropdownMenu />
      </div>
    </header>
  );
};
