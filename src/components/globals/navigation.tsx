import { NavigationContents } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { BlocksIcon, BookIcon } from 'lucide-react';

export default function Navigation(props: Props) {
  return (
    <div className='fixed w-full bottom-0 left-0 bg-background'>
      <nav className='max-w-screen-sm mx-auto grid grid-cols-2 gap-4 p-4 border-t'>
        <Button
          variant={'ghost'}
          title='Learn'
          onClick={() => props.setContent(NavigationContents.learn)}
        >
          <BookIcon className='w-6 h-6 mr-2' />
          Learn
        </Button>
        <Button
          variant={'ghost'}
          title='Devices'
          onClick={() => props.setContent(NavigationContents.devices)}
        >
          <BlocksIcon className='w-6 h-6 mr-2' />
          Devices
        </Button>
      </nav>
    </div>
  );
}

export interface Props {
  setContent: (state: NavigationContents) => void;
}
