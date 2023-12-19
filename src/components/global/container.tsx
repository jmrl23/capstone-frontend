import type { PropsWithChildren } from 'react';

export default function Container({ children }: Props) {
  return (
    <div className='min-h-screen w-full'>
      <div className='max-w-screen-sm mx-auto'>{children}</div>
    </div>
  );
}

export interface Props extends PropsWithChildren {}
