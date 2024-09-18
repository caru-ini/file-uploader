import { Button } from '@/components/ui/button';
import { ArrowRight, CloudUpload } from 'lucide-react';
import Link from 'next/link';

export const HeroSection: React.FC = () => {
  return (
    <section className='flex min-h-[calc(100vh-58px)] w-full bg-gradient-to-r from-blue-400 to-indigo-400 text-white'>
      <div className='mx-auto flex flex-col items-center justify-center px-4 lg:flex-row'>
        <div className='mb-8 text-center lg:mb-0 lg:w-[600px] lg:text-left'>
          <h1 className='mb-4 text-4xl font-bold lg:text-5xl'>File Uploader</h1>
          <Link href='/upload' passHref>
            <Button className='bg-white text-lg font-bold text-blue-600 hover:bg-blue-100'>
              Get Started <ArrowRight strokeWidth={3} />
            </Button>
          </Link>
        </div>
        <div className='flex items-center justify-center lg:w-1/2'>
          <div className='rounded-full bg-white/20 p-12'>
            <CloudUpload size={180} className='text-white' />
          </div>
        </div>
      </div>
    </section>
  );
};
