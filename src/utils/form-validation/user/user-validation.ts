import { z } from 'zod';

import { ICreateUserValues } from '@/services/restapi/user/useCreateUser';
import { IUpdateUser } from '@/services/restapi/user/useUpdateUser';

import {
  zEmailValidation,
  zImageArrayOptional,
  zImageOptional,
  zPasswordValidation,
  zRequiredNumberOfString,
  zRequiredRole,
  zRequiredString,
} from '../global';

export const updateUserPasswordSchema = z
  .object({
    password: zPasswordValidation,
    confirmPassword: zRequiredString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak sama',
    path: ['confirmPassword'], // path of error
  });

export const createUserSchema: z.ZodType<ICreateUserValues> = z
  .object({
    name: zRequiredString,
    photo: zImageArrayOptional,
    email: zEmailValidation,
    phoneNumber: zRequiredNumberOfString.or(z.literal('')),
    username: zRequiredString,
    roleId: zRequiredRole,
    password: zPasswordValidation,
    confirmPassword: zRequiredString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak sama',
    path: ['confirmPassword'], // path of error
  });

export const updateUserSchema: z.ZodType<Omit<IUpdateUser, 'id'>> = z.object({
  name: zRequiredString,
  photo: z.union([zImageOptional, z.string()]),
  email: zEmailValidation,
  phoneNumber: zRequiredNumberOfString.or(z.literal('')),
  username: zRequiredString,
  roleId: zRequiredRole,
});
