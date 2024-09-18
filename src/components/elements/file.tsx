import { FileInfo } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Download } from 'lucide-react';

type FileProps = {
  file: FileInfo;
  onDelete: (file: FileInfo) => void;
};

const getFileEmoji = (type: string) => {
  switch (type) {
    case 'image':
      return '🖼️';
    case 'document':
      return '📄';
    case 'video':
      return '🎥';
    case 'audio':
      return '🎵';
    default:
      return '📁';
  }
};

const downloadFile = async (file: FileInfo) => {
  const response = await fetch(`/api/download/${file.key}`);
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + ' KB';
  const mb = kb / 1024;
  if (mb < 1024) return mb.toFixed(1) + ' MB';
  const gb = mb / 1024;
  return gb.toFixed(1) + ' GB';
};

export const File = ({ file, onDelete }: FileProps) => {
  const fileEmoji = getFileEmoji(file.mimeType.split('/')[0]);
  const formattedDate = formatDistanceToNow(new Date(file.createdAt), {
    locale: ja,
  });
  const formattedSize = formatFileSize(file.fileSize);

  return (
    <div className='flex items-center justify-between rounded-md border border-border p-3 hover:bg-gray-50'>
      <div className='flex items-center space-x-3'>
        <span className='bg-secondary text-2xl shadow-md'>{fileEmoji}</span>
        <div>
          <p className='font-medium'>{file.fileName}</p>
          <p className='text-sm text-gray-500'>
            {formattedDate} - {formattedSize}
          </p>
        </div>
      </div>
      <button
        onClick={() => downloadFile(file)}
        className='ml-4 text-red-500 transition-colors duration-200'
      >
        <Download />
      </button>
    </div>
  );
};
