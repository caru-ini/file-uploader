'use client';
import { useUploader } from '@/app/hooks/useUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FolderOpen, Minus } from 'lucide-react';

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
  } = useUploader();

  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardContent className='flex flex-col items-center gap-y-1 p-6'>
        <div
          {...getRootProps()}
          className={`w-full cursor-pointer rounded-lg border-2 border-dashed p-8 text-center ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onClick={open}
        >
          <input {...getInputProps()} />
          <FolderOpen className='mx-auto size-12' />
          <div className='space-y-2'>
            <p className='text-sm'>Drag and drop your files here</p>
            <p className='text-sm'>or</p>
            <Button>Select files</Button>
          </div>
        </div>
        <div className='w-full space-y-2 rounded-md bg-secondary/50 p-3'>
          <p>Uploaded Files</p>
          {files.length > 0 &&
            files.map((file, index) => (
              <div key={file.name} className='flex w-full items-center justify-between gap-x-1'>
                <p className='max-w-[300px] truncate text-sm' aria-label={file.name}>
                  {file.name}
                </p>
                {uploadProgress[file.name] === 100 ? (
                  <Button
                    className='text-destructive hover:text-destructive'
                    onClick={() => removeFile(index)}
                    variant={'ghost'}
                    size={'icon'}
                  >
                    <Minus />
                  </Button>
                ) : (
                  <span className='text-muted-foreground'>{uploadProgress[file.name]}%</span>
                )}
              </div>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={shareFiles} disabled={uploadedFiles.length === 0}>
          Share Files
        </Button>
      </CardFooter>
    </Card>
  );
};
