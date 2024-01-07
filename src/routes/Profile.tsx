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
import {
  type ElementRef,
  useRef,
  ChangeEventHandler,
  useState,
  useEffect,
} from 'react';
import { request } from '@/lib/utils';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useHax } from '@/hooks/useHax';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function Profile({ user, refetch }: Props) {
  const hax = useHax();

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
                <AvatarUpdate refetch={refetch} haxValue={hax.value} />
                <Button title='Update password' variant={'secondary'}>
                  <KeyIcon className='w-4 h-4 mr-2' />
                  Update password
                </Button>
                <NameUpdate
                  user={user}
                  haxValue={hax.value}
                  refetch={refetch}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Container>
  );
}

const nameUpdateSchema = z.object({
  display_name: z.string().min(1, 'Name must contain at least 1 character(s)'),
});

function NameUpdate({
  user,
  haxValue,
  refetch,
}: {
  user: User;
  haxValue: Record<string, string>;
  refetch: () => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof nameUpdateSchema>>({
    resolver: zodResolver(nameUpdateSchema),
    defaultValues: {
      display_name: user.UserInformation.displayName ?? user.UserAuth.username,
    },
  });
  const onSubmit = async (formData: z.infer<typeof nameUpdateSchema>) => {
    const display_name = formData.display_name.trim();

    if (!display_name) return;

    const loadingToast = toast.loading('Updating display name');
    const data = await request<{ user: User }>(
      fetch(`${import.meta.env.VITE_BACKEND_URL}/user/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...haxValue,
        },
        body: JSON.stringify({
          display_name,
        }),
      }),
    );

    toast.dismiss(loadingToast);

    if (data instanceof Error) {
      return toast.error(data.message);
    }

    toast.success('Display name updated!');
    refetch();
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button title='Update name' variant={'secondary'}>
          <CaseSensitiveIcon className='w-6 h-6 mr-2' />
          Update name
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Update name</DialogTitle>
              <DialogDescription>Rename your account</DialogDescription>
            </DialogHeader>
            <FormField
              name='display_name'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <DialogFooter className='gap-x-4 gap-y-2 mt-2'>
              <Button type='submit'>Confirm</Button>
              <Button
                type='button'
                variant={'secondary'}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function AvatarUpdate({
  refetch,
  haxValue,
}: {
  refetch: () => void;
  haxValue: Record<string, string>;
}) {
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
          ...haxValue,
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
    <>
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
    </>
  );
}

export interface Props {
  user: User;
  refetch: () => void;
}
