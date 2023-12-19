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
import { loginFormSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { request } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export default function Login(props: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const onSubmit = async (formData: z.infer<typeof loginFormSchema>) => {
    if (isLoading) return;

    const loadingToast = toast.loading('Logging in..');
    setIsLoading(true);

    const data = await request<{ user: User }>(
      fetch('/api/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }),
    );

    toast.dismiss(loadingToast);
    setIsLoading(false);

    if (data instanceof Error) return toast.error(data.message);

    props.refetch();
    toast.success('Logged in');
  };

  return (
    <div className='flex items-center min-h-screen'>
      <div className='p-4 w-full'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='max-w-[425px] mx-auto p-4 border rounded-lg shadow'
          >
            <h1 className='font-extrabold text-2xl mb-4'>Login</h1>
            <FormField
              name={'username'}
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              name={'password'}
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type='password' />
                  </FormControl>
                  <FormDescription />
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <div className='flex justify-between items-center mt-4'>
              <Link className='underline text-sm' to={'/register'}>
                Don't have an account?
              </Link>
              <Button type='submit' className='px-6'>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export interface Props {
  refetch: () => void;
}
