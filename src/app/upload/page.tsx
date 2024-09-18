import { DropZone } from '@/components/elements/dropzone';
import Protected from '@/components/layout/protected';

export default function Home() {
  return (
    <Protected>
      <main className='flex flex-1 flex-col items-center justify-center'>
        <DropZone />
      </main>
    </Protected>
  );
}
