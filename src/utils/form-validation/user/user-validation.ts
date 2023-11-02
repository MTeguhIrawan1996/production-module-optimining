import { z } from 'zod';

import {
  zEmailValidation,
  zImageArrayRequired,
  zImageRequired,
  zPasswordValidation,
  zRequiredNumberOfString,
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
      zImageArrayRequired,
      z.string(),
      z.undefined().or(z.literal(null)),
    ]),
    email: zEmailValidation,
    phoneNumber: zRequiredNumberOfString.or(z.literal('')),
    username: zRequiredString,
    roleId: zRequiredString,
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
    zImageRequired,
    z.string(),
    z.undefined().or(z.literal(null)),
  ]),
  email: zEmailValidation,
  phoneNumber: zRequiredNumberOfString.or(z.literal('')),
  username: zRequiredString,
  roleId: zRequiredString,
});
