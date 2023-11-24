import { z } from 'zod';

import { IUpdateAuthUser } from '@/services/restapi/auth/useUpdateAuthUser';

import {
  zEmailValidation,
  zImageOptional,
  zPasswordValidation,
  zRequiredNumberOfString,
  zRequiredString,
} from '../global';

export const authValidationSchema = z.object({
  usernameOrEmail: zRequiredString,
  password: zRequiredString,
});

export const updateAuthUserPasswordSchema = z
  .object({
    oldPassword: zRequiredString,
    newPassword: zPasswordValidation,
    confirmPassword: zRequiredString,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak sama',
    path: ['confirmPassword'], // path of error
  });

export const updateAuthUserSchema: z.ZodType<IUpdateAuthUser> = z.object({
  name: zRequiredString,
  photo: z.union([zImageOptional, z.string()]),
  email: zEmailValidation,
  phoneNumber: zRequiredNumberOfString.or(z.literal('')),
  username: zRequiredString,
});
