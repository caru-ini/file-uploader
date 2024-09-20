'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUploader } from '@/hooks/useUploader';
import { Copy, FolderOpen } from 'lucide-react';
import { Files } from './files';

export const DropZone = () => {
  const {
    files,
    uploadProgress,
    uploadedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    open,
    removeFile,
    shareFiles,
    shareLink,
  } = useUploader();

  return (
    <Card className='mx-auto w-full max-w-4xl'>
      <CardContent className='flex flex-col gap-6 p-6'>
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          }`}
          onClick={open}
        >
          <input {...getInputProps()} />
          <FolderOpen className='mx-auto size-12 text-muted-foreground' />
          <div className='mt-4 space-y-2'>
            <p className='text-sm text-muted-foreground'>Drag and drop your files here</p>
            <p className='text-sm text-muted-foreground'>or</p>
            <Button>Select files</Button>
          </div>
        </div>

        {files.length > 0 && (
          <div className='rounded-lg bg-muted p-4'>
            <h3 className='mb-2 font-semibold'>Uploaded Files</h3>
            <Files files={files} uploadProgress={uploadProgress} removeFile={removeFile} />
          </div>
        )}

        <Button onClick={shareFiles} disabled={uploadedFiles.length === 0} className='w-full'>
          Generate Share Link
        </Button>

        {shareLink && (
          <div className='rounded-lg bg-muted p-4'>
            <h3 className='mb-2 font-semibold text-primary'>🎉 Share Link Generated!</h3>
            <div className='flex items-center gap-2 rounded-md border border-input bg-background'>
              <input
                onClick={(e) => e.currentTarget.select()}
                className='flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none'
                value={shareLink}
                readOnly
              />
              <Button
                variant='ghost'
                size='icon'
                onClick={() => navigator.clipboard.writeText(shareLink)}
                className='shrink-0'
              >
                <Copy className='size-4' />
                <span className='sr-only'>Copy share link</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
