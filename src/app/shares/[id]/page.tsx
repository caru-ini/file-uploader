'use client';
import { Files } from '@/components/elements/files';
import Protected from '@/components/layout/protected';
import { client } from '@/lib/hono';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

export default function Share() {
  const { id } = useParams() as { id: string };
  const fetchShare = async (id: string) => {
    const res = await client.api.shares[':shareLink'].$get({ param: { shareLink: id } });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return await res.json();
  };
  const { data, error, isLoading } = useSWR([`/api/shares/${id}`, id], ([url, id]) =>
    fetchShare(id),
  );

  console.log(data);
  const files = data?.files?.map(
    (file: {
      fileInfo: {
        id: string;
        fileName: string;
        fileSize: number;
        key: string;
        mimeType: string;
        createdAt: string;
        updatedAt: string;
      };
    }) => ({
      name: file.fileInfo.fileName,
      size: file.fileInfo.fileSize,
      type: file.fileInfo.mimeType,
    }),
  );

  if (isLoading) return <div>Loading...</div>;

  if (files === undefined) return <div>Error loading files</div>;

  async function downloadFile(index: number) {
    const fileData = data?.files?.[index];
    if (!fileData) {
      throw new Error('File data not found');
    }
    const key = fileData.fileInfo.key;
    const res = await client.api.download[':key'].$get({ param: { key } });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const blobData = await res.blob();
    const url = window.URL.createObjectURL(blobData);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileData.fileInfo.fileName || 'download';
    a.click();
  }

  return (
    <Protected>
      <main className='flex flex-1 flex-col items-center justify-center'>
        <div className='container max-w-4xl rounded-lg border border-border'>
          {data && 'files' in data ? (
            <Files files={files} downloadFile={downloadFile} />
          ) : (
            <p>No files available</p>
          )}
        </div>
      </main>
    </Protected>
  );
}
