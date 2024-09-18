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
import { Download, File, Minus } from 'lucide-react';

type FileType = {
  name: string;
  size: number;
  type: string;
};

type FilesProps = {
  files: FileType[];
  uploadProgress?: Record<string, number>;
  removeFile?: (index: number) => void;
  downloadFile?: (index: number) => void;
};

export const Files: React.FC<FilesProps> = ({
  files,
  uploadProgress,
  removeFile,
  downloadFile,
}) => {
  return (
    <>
      {files.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
              {uploadProgress && <TableHead>Progress</TableHead>}
              {removeFile && uploadProgress && <TableHead>Actions</TableHead>}
              {downloadFile && <TableHead>Download</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file, index) => (
              <TableRow key={file.name}>
                <TableCell className='font-medium'>
                  <span className='block max-w-[300px] truncate' title={file.name}>
                    {file.name}
                  </span>
                </TableCell>
                <TableCell>{formatFileSize(file.size, 1)}</TableCell>
                <TableCell>{file.type}</TableCell>
                {uploadProgress && (
                  <TableCell>
                    {uploadProgress[file.name] === 100 ? (
                      'Complete'
                    ) : (
                      <span className='text-muted-foreground'>{uploadProgress[file.name]}%</span>
                    )}
                  </TableCell>
                )}
                {removeFile && uploadProgress && (
                  <TableCell>
                    {uploadProgress[file.name] === 100 && (
                      <Button
                        className='text-destructive hover:text-destructive'
                        onClick={() => removeFile(index)}
                        variant='ghost'
                        size='icon'
                      >
                        <Minus className='size-4' />
                      </Button>
                    )}
                  </TableCell>
                )}
                {downloadFile && (
                  <TableCell>
                    <Button
                      className='text-primary hover:text-primary'
                      onClick={() => downloadFile(index)}
                      variant='ghost'
                      size='icon'
                    >
                      <Download className='size-4' />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className='py-8 text-center'>
          <File className='mx-auto size-12 text-gray-400' />
          <h3 className='mt-2 text-sm font-semibold text-gray-900'>No files uploaded</h3>
          <p className='mt-1 text-sm text-gray-500'>Upload files to start sharing</p>
        </div>
      )}
    </>
  );
};
