import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UnplugIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { request } from '@/lib/utils';

export default function DeviceUnbindDialog({ device, refetch }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleConfirm = async () => {
    const loadingToast = toast.loading('Removing..');
    const data = await request(
      fetch(
        `${import.meta.env.VITE_BACKEND_URL}/device/unregister/${device.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      ),
    );

    toast.dismiss(loadingToast);

    if (data instanceof Error) return toast.error(data.message);

    setIsOpen(false);
    refetch();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='md:pl-3' variant={'destructive'} title='Disconnect'>
          <UnplugIcon className='w-6 h-6 md:mr-2' />
          <span className='hidden md:inline'>Disconnect</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disconnect device</DialogTitle>
          <DialogDescription>
            You are going to disconnect device{' '}
            <span className='underline font-extrabold'>{device.deviceKey}</span>
            . You can always reconnect if it's not been connected to another
            account. Are you sure you want to do this action?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-x-4 gap-y-2 mt-2'>
          <Button variant={'destructive'} onClick={handleConfirm}>
            Confirm
          </Button>
          <Button variant={'secondary'} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export interface Props {
  device: Device;
  refetch: () => void;
}
