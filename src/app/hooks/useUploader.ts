import { client } from '@/lib/hono';
import { FileInfo } from '@prisma/client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const useUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [shareLink, setShareLink] = useState<string | null>(null);

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

            if (fileInfo) {
              setUploadedFiles((prevFiles) => [
                ...prevFiles,
                {
                  ...fileInfo,
                  createdAt: new Date(fileInfo.createdAt),
                  updatedAt: new Date(fileInfo.updatedAt),
                },
              ]);
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
    if (uploadedFiles.length === 0) {
      console.error('No files uploaded');
      return;
    }
    const keys = uploadedFiles.map((file) => file.key);
    const response = await client.api.shares.$post({ json: { keys } });
    if (!response.ok) {
      console.error('Error creating share link');
      return await response.json();
    }
    const { shareLink } = await response.json();
    setShareLink(
      process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/shares/${shareLink}`
        : `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/shares/${shareLink}`,
    );
    console.log('Share link created successfully');
  };

  const saveFileInfoToDatabase = async (params: Parameters<typeof client.api.files.$post>[0]) => {
    const response = await client.api.files.$post({ json: params });

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

  return {
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
  };
};
