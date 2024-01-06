import Container from '@/components/globals/container';
import {
  ArrowLeftIcon,
  CaseSensitiveIcon,
  ImageIcon,
  KeyIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type ElementRef, useRef, ChangeEventHandler } from 'react';
import { request } from '@/lib/utils';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useHax } from '@/hooks/useHax';

export default function Profile({ user, refetch }: Props) {
  const hax = useHax();
  const fileInputRef = useRef<ElementRef<'input'>>(null);
  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const files = event.currentTarget.files;

    if (!files || files.length < 1) return;

    const file = files[0];
    const formData = new FormData();

    formData.append('files', file);

    const loadingToast = toast.loading('Uploading..');
    const data = await request<{
      files: { url: string }[];
    }>(
      fetch(`${import.meta.env.VITE_SERVICE_FILE_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${
            import.meta.env.VITE_SERVICE_FILE_AUTHORIZATION_KEY
          }`,
        },
        body: formData,
      }),
    );

    toast.dismiss(loadingToast);

    if (data instanceof Error) {
      return toast.error(data.message);
    }

    if (data.files.length < 1) return;

    const image = data.files[0];

    await request(
      fetch(`${import.meta.env.VITE_BACKEND_URL}/user/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...hax.value,
        },
        body: JSON.stringify({
          image_url: image.url,
        }),
      }),
    );

    toast.success('Avatar updated!');

    refetch();
  };

  return (
    <Container>
      <header className='p-4 bg-primary-foreground flex items-center shadow gap-x-4 rounded-b-lg mx-4'>
        <Link to='/'>
          <Button variant='secondary'>
            <ArrowLeftIcon />
          </Button>
        </Link>
        <h3 className='font-extrabold text-lg'>Profile</h3>
      </header>
      <main>
        <div className='m-4'>
          <Card>
            <CardContent className='pt-6'>
              <div className='p-4 rounded-lg bg-gray-200 relative h-[100px]'>
                <Avatar className='w-[100px] h-[100px] absolute bottom-[-50px] left-1/2 -translate-x-1/2'>
                  <AvatarImage
                    src={user.UserInformation.imageUrl ?? ''}
                    alt={user.UserAuth.username}
                  />
                  <AvatarFallback>
                    {user.UserAuth.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className='h-[100px] flex items-end justify-center mt-6'>
                <div>
                  <p className='font-extrabold text-xl text-center'>
                    {user.UserInformation.displayName ?? user.UserAuth.username}
                  </p>
                  <p className='text-sm mt-2'>
                    Joined {moment(user.createdAt).format('MMM YYYY')}
                  </p>
                </div>
              </div>
              <hr className='my-6' />
              <div className='flex justify-center gap-4 flex-wrap'>
                <input
                  type='file'
                  className='hidden'
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept='image/*'
                />
                <Button
                  title='Update avatar'
                  variant={'secondary'}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className='w-4 h-4 mr-2' />
                  Update avatar
                </Button>
                <Button title='Update password' variant={'secondary'}>
                  <KeyIcon className='w-4 h-4 mr-2' />
                  Update password
                </Button>
                <Button title='Update name' variant={'secondary'}>
                  <CaseSensitiveIcon className='w-6 h-6 mr-2' />
                  Update name
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Container>
  );
}

export interface Props {
  user: User;
  refetch: () => void;
}
