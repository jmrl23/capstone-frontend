import { ArrowLeftIcon, FrownIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='p-4 min-h-screen flex items-center'>
      <div className='w-full'>
        <main className='max-w-screen-md mx-auto'>
          <h1 className='flex gap-x-2 font-extrabold text-2xl items-center'>
            <FrownIcon />
            Page not found
          </h1>
          <p className='mt-4 text-muted-foreground'>
            We are sorry, we can't find the page that you are looking for.
            <br />
            <Link className='inline-flex' to='/'>
              <Button
                className='mt-4 flex gap-x-2 pl-3'
                role='button'
                title='Return to home'
              >
                <ArrowLeftIcon className='w-4 h-4' />
                Home
              </Button>
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
}
