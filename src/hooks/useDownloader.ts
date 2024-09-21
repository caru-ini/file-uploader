import { client } from '@/lib/hono';
import { ShareFileInfo } from '@prisma/client';
import { useCallback } from 'react';
import useSWR from 'swr';

type useDownloaderProps = {
  shareLink: string;
};

const fetcher = async (url: string) => {
  const response = await client.api.shares[':shareLink'].$get({ param: { shareLink: url } });
  if (response.ok) {
    const data = await response.json();
    return data || [];
  } else {
    console.error('Error fetching files', response);
    return [];
  }
};

export const useDownloader = ({ shareLink }: useDownloaderProps) => {
  const { data, error, isLoading } = useSWR(shareLink, fetcher);

  const files = data as ShareFileInfo[];

  if (error) {
    console.error('Error fetching files', error);
  }

  const downloadFile = useCallback(async (key: string) => {
    const response = await client.api.download[':key'].$get({ param: { key } });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = key;
      a.click();
    } else {
      console.error('Error downloading file');
    }

    if (!response.ok) {
      console.error('Error generating signed URL');
      return;
    }
  }, []);

  return { files, error, downloadFile, isLoading };
};
