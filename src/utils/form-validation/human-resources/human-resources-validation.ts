import { z } from 'zod';

import {
  zDateValidation,
  zEmailValidation,
  zImageArrayOptional,
  zOptionalString,
  zRequiredNumberOfString,
  zRequiredSelectInput,
  zRequiredString,
} from '../global';

export const createHumanResourcesSchema = z
  .object({
    name: zRequiredString,
    alias: zOptionalString,
    isWni: zRequiredString,
    identityTypeId: zRequiredString,
    identityNumber: zRequiredNumberOfString,
    pob: zRequiredString,
    dob: zDateValidation,
    gender: zRequiredString,
    religionId: zOptionalString.nullable(),
    educationDegree: zOptionalString,
    marriageStatusId: zOptionalString.nullable(),
    provinceId: zRequiredSelectInput,
    regencyId: zRequiredSelectInput,
    subdistrictId: zRequiredSelectInput,
    villageId: zRequiredSelectInput,
    address: zRequiredString,
    isAddressSameWithDomicile: z.enum(['true', 'false']),
    domicileProvinceId: zOptionalString.nullable(),
    domicileRegencyId: zOptionalString.nullable(),
    domicileSubdistrictId: zOptionalString.nullable(),
    domicileVillageId: zOptionalString.nullable(),
    domicileAddress: zOptionalString.nullable(),
    phoneNumber: zRequiredNumberOfString,
    email: zEmailValidation,
    bloodType: zRequiredSelectInput,
    resus: zRequiredSelectInput,
    photo: zImageArrayOptional,
    identityPhoto: zImageArrayOptional,
  })
  .superRefine((arg, ctx) => {
    if (arg.isAddressSameWithDomicile === 'false') {
      if (arg.domicileProvinceId === '' || !arg.domicileProvinceId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom, // customize your issue
          path: ['domicileProvinceId'],
          message: 'Kolom tidak boleh kosong',
        });
      }
      if (arg.domicileRegencyId === '' || !arg.domicileRegencyId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom, // customize your issue
          path: ['domicileRegencyId'],
          message: 'Kolom tidak boleh kosong',
        });
      }
      if (arg.domicileSubdistrictId === '' || !arg.domicileSubdistrictId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom, // customize your issue
          path: ['domicileSubdistrictId'],
          message: 'Kolom tidak boleh kosong',
        });
      }
      if (arg.domicileVillageId === '' || !arg.domicileVillageId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom, // customize your issue
          path: ['domicileVillageId'],
          message: 'Kolom tidak boleh kosong',
        });
      }
      if (arg.domicileAddress === '' || !arg.domicileAddress) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom, // customize your issue
          path: ['domicileAddress'],
          message: 'Kolom tidak boleh kosong',
        });
      }

      return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
    }
  });
