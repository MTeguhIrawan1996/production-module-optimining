import { z } from 'zod';

export const zRequiredString = z.string().nonempty({ message: 'Harus diisi' });
export const zOptionalString = z.string().optional();
export const zArrayOfString = z.string().array();
export const zRequiredNumber = z.number({
  required_error: 'Harus diisi',
  invalid_type_error: 'Harus angka',
});
export const zRequiredNumberOfString = z
  .string()
  .nonempty({ message: 'Wajib diisi' })
  .refine((value) => /^[0-9]+$/.test(value), {
    message: 'Input hanya boleh berisi angka',
  });

export const zPasswordValidation = z
  .string()
  .min(8, { message: 'Kata sandi minimal 8 karakter' })
  // .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&_*])(?=.*[0-9])[a-zA-Z0-9!@#$%^&_*]*$/, {
  //   message: 'Format kata sandi salah',
  // })
  .regex(/^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]*$/, {
    message: 'Format kata sandi salah',
  })
  .nonempty({ message: 'Harus diisi ' });

export const zEmailValidation = z
  .string()
  .email({ message: 'Format email salah' })
  .nonempty({ message: 'Harus diisi' });

export const zDateValidation = z.date({
  required_error: 'Harus diisi',
  invalid_type_error: 'Harus diisi / Format tanggal salah',
});

export const forgotPasswordValidate = z.object({
  email: z
    .string()
    .email({ message: 'Format email salah' })
    .nonempty({ message: 'Email harus diisi' }),
});

export const resetPasswordValidate = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Kata sandi minimal 8 karakter' })
      .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&_*])(?=.*[0-9])[a-zA-Z0-9!@#$%^&_*]*$/, {
        message: 'Format kata sandi salah',
      })
      .nonempty({ message: 'Kata sandi harus diisi' }),
    confirm: z
      .string()
      .nonempty({ message: 'Konfirmasi kata sandi harus diisi' }),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Konfirmasi kata sandi tidak sama',
    path: ['confirm'], // path of error
  });

export const zFileRequired = z
  .custom<File>()
  .refine((file) => file, { message: 'File harus diisi' });

export const zImageRequired = z
  .custom<File>()
  .refine((file) => file, { message: 'Harus diisi' })
  .refine(
    (file) =>
      file &&
      ['image/png', 'image/jpeg', 'image/png', 'image/webp'].includes(
        file.type
      ),
    {
      message: 'File harus Foto',
    }
  );

export const zImageArrayRequired = z
  .custom<File>()
  .refine(
    (file) =>
      file &&
      ['image/png', 'image/jpeg', 'image/png', 'image/webp'].includes(
        file.type
      ),
    {
      message: 'File harus Foto',
    }
  )
  .array()
  .nonempty({
    message: 'Foto wajib diisi',
  });

export const zImageArrayOptional = z
  .custom<File>()
  .refine(
    (file) =>
      file &&
      ['image/png', 'image/jpeg', 'image/png', 'image/webp'].includes(
        file.type
      ),
    {
      message: 'File harus Foto',
    }
  )
  .array();
