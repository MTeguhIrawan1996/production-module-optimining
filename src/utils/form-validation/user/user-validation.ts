import { z } from 'zod';

import {
  zEmailValidation,
  zImageArrayOptional,
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

export const createUserSchema = z
  .object({
    name: zRequiredString,
    photo: z.union([
      zImageArrayOptional,
      z.string(),
      z.undefined().or(z.literal(null)),
    ]),
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

export const updateUserSchema = z.object({
  name: zRequiredString,
  photo: z.union([
    zImageArrayOptional,
    z.string(),
    z.undefined().or(z.literal(null)),
  ]),
  email: zEmailValidation,
  phoneNumber: zRequiredNumberOfString.or(z.literal('')),
  username: zRequiredString,
  roleId: zRequiredRole,
});
