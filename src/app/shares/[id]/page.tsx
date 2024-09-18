'use client';
import { File } from '@/components/elements/file';
import { useParams } from 'next/navigation';

export default function Share() {
  const { id } = useParams();
  return (
    <main className='flex flex-1 flex-col items-center justify-center'>
      <h1>Share {id}</h1>
      <div className='flex gap-x-4'>
        <File
          file={{
            id: '1',
            key: '1',
            fileName: 'test',
            mimeType: 'image/png',
            fileSize: 1024,
            createdAt: new Date(),
            updatedAt: new Date(),
          }}
          onDelete={() => {}}
        />
      </div>
    </main>
  );
}
