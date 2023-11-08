import { z } from 'zod';

import {
  zEmailValidation,
  zImageRequired,
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

export const updateAuthUserSchema = z.object({
  name: zRequiredString,
  photo: z.union([
    zImageRequired,
    z.string(),
    z.undefined().or(z.literal(null)),
  ]),
  email: zEmailValidation,
  phoneNumber: zRequiredNumberOfString.or(z.literal('')),
  username: zRequiredString,
});
