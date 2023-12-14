import { z } from 'zod';

import { IMutationRitageBarging } from '@/services/restapi/ritage-productions/barging/useCreateRitageBarging';
import {
  zDateValidation,
  zImageArrayOptional,
  zOptionalString,
  zRequiredNumber,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const ritageBargingMutationValidation: z.ZodType<IMutationRitageBarging> =
  z
    .object({
      date: zDateValidation,
      checkerFromId: zRequiredSelectInput,
      checkerFromPosition: zOptionalString,
      checkerToId: zOptionalString.nullable(),
      checkerToPosition: zOptionalString,
      shiftId: zRequiredSelectInput,
      companyHeavyEquipmentId: zRequiredSelectInput,
      companyHeavyEquipmentChangeId: zOptionalString.nullable(),
      materialId: zRequiredSelectInput,
      subMaterialId: zOptionalString.nullable(),
      fromTime: zRequiredString,
      arriveTime: zOptionalString,
      ritageDuration: zOptionalString,
      weatherId: zOptionalString.nullable(),
      domeId: zOptionalString.nullable(),
      stockpileName: zOptionalString,
      bargingId: zOptionalString.nullable(),
      bulkSamplingDensity: zRequiredNumber,
      bucketVolume: zRequiredNumber,
      tonByRitage: zOptionalString,
      sampleNumber: zOptionalString,
      desc: zOptionalString,
      photos: zImageArrayOptional,
      isRitageProblematic: z.boolean(),
    })
    .superRefine((arg, ctx) => {
      const newHeavyequipmentContinueId =
        arg.companyHeavyEquipmentChangeId === ''
          ? null
          : arg.companyHeavyEquipmentChangeId;
      if (arg.isRitageProblematic) {
        if (!newHeavyequipmentContinueId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom, // customize your issue
            path: ['companyHeavyEquipmentChangeId'],
            message: 'Kolom tidak boleh kosong',
          });
        }

        return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
      }
    });
