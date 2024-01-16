import { z } from 'zod';

import { ICompanyMutationValues } from '@/services/restapi/company/useCreateCompanyMasterData';
import {
  zDateOptionalValidation,
  zEmailOptional,
  zEmailValidation,
  zImageArrayOptional,
  zOptionalNumberOfString,
  zOptionalString,
  zPdfArrayOptional,
  zRequiredNumberOfString,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const companyMutationValidation: z.ZodType<ICompanyMutationValues> = z
  .object({
    name: zRequiredString,
    alias: zOptionalString,
    typeId: zRequiredSelectInput,
    businessTypeId: zRequiredSelectInput,
    provinceId: zRequiredSelectInput,
    regencyId: zRequiredSelectInput,
    subdistrictId: zRequiredSelectInput,
    villageId: zRequiredSelectInput,
    address: zRequiredString,
    email1: zEmailValidation,
    phoneNumber1: zRequiredNumberOfString,
    email2: zEmailOptional,
    phoneNumber2: zOptionalNumberOfString,
    faxNumber: zOptionalString,
    code: zOptionalString,
    nib: zOptionalString,
    logo: zImageArrayOptional,
    permissionTypeId: zOptionalString.nullable(),
    permissionTypeNumber: zOptionalString,
    permissionTypeDate: zDateOptionalValidation,
    permissionTypeDocument: zPdfArrayOptional,
  })
  .superRefine((arg, ctx) => {
    if (arg.permissionTypeId !== '') {
      if (arg.permissionTypeNumber === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom, // customize your issue
          path: ['permissionTypeNumber'],
          message: 'Kolom tidak boleh kosong',
        });
      }
      if (!arg.permissionTypeDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom, // customize your issue
          path: ['permissionTypeDate'],
          message: 'Kolom tidak boleh kosong',
        });
      }
      return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
    }
  });
