import { Button } from '@/components/ui/button';
import { request } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useHax } from '@/hooks/useHax';
import toast from 'react-hot-toast';
import DeviceBindDialog from '@/components/dialogs/device-bind';
import { Link } from 'react-router-dom';

export default function Header(props: Props) {
  const hax = useHax();
  const handleLogout = async () => {
    const loadingToast = toast.loading('Logging out..');

    const data = await request<{ success: boolean }>(
      fetch(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { ...hax.value },
      }),
    );

    toast.dismiss(loadingToast);

    if (data instanceof Error) return toast.error(data.message);
    hax.reset();
    props.refetchUser();
    toast.success('Logged out');
  };

  return (
    <header className='shadow rounded-b-lg flex justify-between items-center p-4 mx-4 bg-background'>
      <Link to={'/profile'}>
        <div className='flex items-center gap-x-2'>
          <Avatar>
            <AvatarImage
              src={props.user.UserInformation.imageUrl ?? ''}
              alt={props.user.UserAuth.username}
            />
            <AvatarFallback>
              {props.user.UserAuth.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='font-extrabold text-sm line-clamp-1'>
            {props.user.UserInformation.displayName ??
              props.user.UserAuth.username}
          </span>
        </div>
      </Link>
      <div className='flex gap-x-4'>
        <DeviceBindDialog refetch={props.refetchDevices} />
        <Button variant={'secondary'} onClick={handleLogout} title='Logout'>
          Logout
        </Button>
      </div>
    </header>
  );
}

export interface Props {
  user: User;
  refetchUser: () => void;
  refetchDevices: () => void;
}
