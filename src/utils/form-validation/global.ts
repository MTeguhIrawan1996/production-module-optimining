import { z } from 'zod';

export const zRequiredString = z
  .string()
  .min(1, { message: 'Kolom tidak boleh kosong' });

export const zRequiredRole = z
  .string()
  .min(1, { message: 'Pilih salah satu role yang sesuai' });
export const zOptionalString = z.string();

export const zRequiredSelectInput = zRequiredString
  .nullable()
  .refine((val) => val, {
    message: 'Kolom tidak boleh kosong',
  });

export const zArrayOfString = z.string().array();

export const zRequiredNumber = z.number({
  required_error: 'Kolom tidak boleh kosong',
  invalid_type_error: 'Kolom tidak boleh kosong',
});

export const zOptionalNumber = z.number().or(z.literal(''));

export const zRequiredNumberOfString = z
  .string()
  .min(1, { message: 'Kolom tidak boleh kosong' })
  .refine((value) => /^[0-9.]+$/.test(value), {
    message: 'Input hanya boleh berisi angka',
  });

export const zOptionalNumberOfString = z
  .string()
  .refine((value) => /^[0-9.]+$/.test(value), {
    message: 'Input hanya boleh berisi angka',
  })
  .or(z.literal(''));

export const zPasswordValidation = z
  .string()
  .min(8, { message: 'Kata sandi minimal 8 karakter' })
  .regex(/^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]*$/, {
    message: 'Format kata sandi salah',
  });

export const zTimeValidation = z
  .string()
  .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'Format salah',
  })
  .or(z.literal(''));

export const zEmailValidation = z
  .string()
  .min(1, { message: 'Kolom tidak boleh kosong' })
  .email({ message: 'Format email salah' });

export const zEmailOptional = z
  .string()
  .email({ message: 'Format email salah' })
  .or(z.literal(''));

export const zDateValidation = z.date({
  required_error: 'Kolom tidak boleh kosong',
  invalid_type_error: 'Kolom tidak boleh kosong / Format tanggal salah',
});

export const zDateOptionalValidation = z
  .date({
    required_error: 'Kolom tidak boleh kosong',
    invalid_type_error: 'Kolom tidak boleh kosong / Format tanggal salah',
  })
  .optional()
  .nullable();

export const forgotPasswordValidate = z.object({
  email: z
    .string()
    .email({ message: 'Format email salah' })
    .min(1, { message: 'Kolom tidak boleh kosong' }),
});

export const resetPasswordValidate = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Kata sandi minimal 8 karakter' })
      .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&_*])(?=.*[0-9])[a-zA-Z0-9!@#$%^&_*]*$/, {
        message: 'Format kata sandi salah',
      }),

    confirm: z.string().min(1, { message: 'Kolom tidak boleh kosong' }),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Konfirmasi kata sandi tidak sama',
    path: ['confirm'], // path of error
  });

export const zFileRequired = z
  .custom<File>()
  .refine((file) => file, { message: 'File kolom tidak boleh kosong' });

export const zImageRequired = z
  .custom<File>()
  .refine((file) => file, { message: 'Kolom tidak boleh kosong' })
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

export const zImageOptional = z
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
  .or(z.literal(null));

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

export const zPdfArrayOptional = z
  .custom<File>()
  .refine((file) => file && ['application/pdf'].includes(file.type), {
    message: 'File harus pdf',
  })
  .array();
