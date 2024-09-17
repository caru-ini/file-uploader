'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FolderOpen, Minus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { client } from '@/lib/hono';

export const DropZone = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({}); // { fileName: progress }
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploadFileToR2 = async (file: File) => {
        const response = await client.api.upload.$post({ json: { fileType: file.type } });
        const { signedUrl, key } = await response.json();
        if (!response.ok) {
          console.error('Error generating signed URL');
          return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: Math.round(percentComplete),
            }));
          }
        };

        xhr.onload = async () => {
          if (xhr.status === 200) {
            console.log('File uploaded successfully');
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: 100,
            }));
            const fileInfo = await saveFileInfoToDatabase({
              fileName: file.name,
              mimeType: file.type,
              fileSize: file.size,
              key,
            });
            console.log(fileInfo);

            if (fileInfo) {
              setUploadedFiles((prevFiles) => [...prevFiles, fileInfo.key]);
            }
          } else {
            console.error('File upload failed');
          }
        };

        xhr.send(file);
      };

      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      acceptedFiles.forEach((file) => {
        uploadFileToR2(file);
      });
    },
    [setUploadProgress, setFiles],
  );

  const shareFiles = async () => {
    const keys = uploadedFiles;
    if (keys.length === 0) {
      console.error('No files uploaded');
      return;
    }
    const response = await client.api.share.$post({ json: { keys } });
    if (!response.ok) {
      console.error('Error creating share link');
      return await response.json();
    }

    console.log('Share link created successfully');
  };

  const saveFileInfoToDatabase = async (params: Parameters<typeof client.api.files.$post>[0]) => {
    const response = await client.api.files.$post({
      json: params,
    });

    if (!response.ok) {
      console.error('Error saving file info');
      return;
    }

    console.log('File info saved successfully');
    return await response.json();
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setUploadProgress((prevProgress) => {
      const newProgress = { ...prevProgress };
      delete newProgress[files[index].name];
      return newProgress;
    });
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noDrag: false,
    noClick: true,
    noKeyboard: true,
  });

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
            <p className='text-sm '>Drag and drop your files here</p>
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
                {uploadProgress[index] === 100 ? (
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
