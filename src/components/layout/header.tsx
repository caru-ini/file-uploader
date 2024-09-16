import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Folder } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className='sticky top-0 z-50 flex grow-0 items-center justify-between border-b border-border p-3'>
      <p className='flex items-center'>
        <Folder className='mr-2 fill-yellow-300 stroke-muted-foreground' size={24} />
        File Uploader
      </p>
      <div className='flex items-center space-x-4'>
        <nav>
          <ul className='flex items-center space-x-4'>
            <li>
              <a href='#' className='text-muted-foreground hover:text-primary'>
                Upload
              </a>
            </li>
          </ul>
        </nav>
        <Avatar>
          <AvatarImage src='' />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
