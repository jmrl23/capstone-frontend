import { LoaderIcon } from 'lucide-react';

export default function Loading() {
  return (
    <div className='h-screen grid place-items-center p-4'>
      <p className='font-extrabold flex gap-x-2'>
        <LoaderIcon className='w-6 h-6 animate-spin' strokeWidth={3} />
        Loading, please wait..
      </p>
    </div>
  );
}
