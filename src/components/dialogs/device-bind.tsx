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
import { PlugIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { deviceBindSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { request } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useHax } from '@/hooks/useHax';

export default function DeviceBindDialog({ refetch }: Props) {
  const hax = useHax();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof deviceBindSchema>>({
    resolver: zodResolver(deviceBindSchema),
    defaultValues: {
      key: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (formData: z.infer<typeof deviceBindSchema>) => {
    const loadingToast = toast.loading('Connecting..');
    const data = await request(
      fetch(`${import.meta.env.VITE_BACKEND_URL}/device/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...hax.value,
        },
        body: JSON.stringify({
          device_key: formData.key,
        }),
      }),
    );

    toast.dismiss(loadingToast);

    if (data instanceof Error) return toast.error(data.message);

    toast.success('Device added!');
    setIsOpen(false);
    refetch();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='md:pl-3' title='Connect device'>
          <PlugIcon className='w-6 h-6 md:mr-2' />
          <span className='hidden md:inline'>Connect</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Connect device</DialogTitle>
              <DialogDescription>
                Add new device to your account
              </DialogDescription>
            </DialogHeader>
            <FormField
              name='key'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Device key</FormLabel>
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

export interface Props {
  refetch: () => void;
}
