import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z.string().min(1, 'Username must contain at least 1 character(s)'),
  password: z.string().min(1, 'Password must contain at least 1 character(s)'),
});

export const registerFormSchema = z.object({
  username: z
    .string()
    .min(5, 'Username must contain at least 1 character(s)')
    .toLowerCase(),
  password: z.string().min(5, 'Password must contain at least 1 character(s)'),
});
