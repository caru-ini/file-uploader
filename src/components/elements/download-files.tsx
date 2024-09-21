// DownloadFiles.tsx
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatFileSize } from '@/utils/formatFileSize';
import { Download, File } from 'lucide-react';
import React from 'react';

type FileType = {
  name: string;
  size: number;
  type: string;
  key: string;
};

type DownloadFilesProps = {
  files: FileType[];
  downloadFile: (key: string) => void;
};

export const DownloadFiles: React.FC<DownloadFilesProps> = ({ files, downloadFile }) => {
  return (
    <>
      {files.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.key}>
                <TableCell className='font-medium'>
                  <span className='block max-w-[300px] truncate' title={file.name}>
                    {file.name}
                  </span>
                </TableCell>
                <TableCell>{formatFileSize(file.size, 1)}</TableCell>
                <TableCell>{file.type}</TableCell>
                <TableCell>
                  <Button
                    className='text-primary hover:text-primary'
                    onClick={() => downloadFile(file.key)}
                    variant='ghost'
                    size='icon'
                  >
                    <Download className='size-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className='py-8 text-center'>
          <File className='mx-auto size-12 text-gray-400' />
          <h3 className='mt-2 text-sm font-semibold text-gray-900'>No files available</h3>
          <p className='mt-1 text-sm text-gray-500'>There are no files to download</p>
        </div>
      )}
    </>
  );
};
