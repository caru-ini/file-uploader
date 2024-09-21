'use client';
import { DownloadFiles } from '@/components/elements/download-files';
import Protected from '@/components/layout/protected';
import { useDownloader } from '@/hooks/useDownloader';
import { useParams } from 'next/navigation';

export default function Share() {
  const { id } = useParams() as { id: string };
  const { downloadFile, files, isLoading } = useDownloader({ shareLink: id });

  if (isLoading) {
    return (
      <Protected>
        <main className='flex flex-1 flex-col items-center justify-center'>
          <p>Loading...</p>
        </main>
      </Protected>
    );
  }

  return (
    <Protected>
      <main className='container flex flex-1 flex-col items-center justify-center'>
        {files.length > 0 ? (
          <DownloadFiles
            files={files.map((file) => ({
              name: file.fileInfo.fileName,
              size: file.fileInfo.fileSize,
              type: file.fileInfo.mimeType,
              key: file.fileInfo.key,
            }))}
            downloadFile={downloadFile}
          />
        ) : (
          <p>No files available</p>
        )}
      </main>
    </Protected>
  );
}
