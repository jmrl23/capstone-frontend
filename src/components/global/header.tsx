import { Button } from '@/components/ui/button';
import { request } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import toast from 'react-hot-toast';

export default function Header(props: Props) {
  const handleLogout = async () => {
    const loadingToast = toast.loading('Logging out..');

    const data = await request<{ success: boolean }>(
      fetch('/api/user/logout', {
        method: 'DELETE',
        credentials: 'include',
      }),
    );

    toast.dismiss(loadingToast);

    if (data instanceof Error) return toast.error(data.message);

    props.refetch();
  };

  return (
    <header className='shadow rounded-b-lg flex justify-between items-center p-4 mx-4'>
      <div className='flex items-center gap-x-2'>
        <Avatar>
          <AvatarImage
            src={props.user.UserInformation.imageUrl ?? ''}
            alt='@shadcn'
          />
          <AvatarFallback>
            {props.user.UserAuth.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className='font-extrabold text-sm'>
          {props.user.UserAuth.username}
        </span>
      </div>
      <Button onClick={handleLogout}>Logout</Button>
    </header>
  );
}

export interface Props {
  user: User;
  refetch: () => void;
}
