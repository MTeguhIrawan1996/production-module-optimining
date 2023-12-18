import { z } from 'zod';

import { IMutationRitageMoving } from '@/services/restapi/ritage-productions/moving/useCreateRitageMoving';
import {
  zDateValidation,
  zImageArrayOptional,
  zOptionalString,
  zRequiredNumber,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const ritageMovingMutationValidation: z.ZodType<IMutationRitageMoving> =
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
      subMaterialId: zRequiredSelectInput,
      fromTime: zRequiredString,
      arriveTime: zOptionalString,
      ritageDuration: zOptionalString,
      weatherId: zOptionalString.nullable(),
      fromDomeId: zRequiredSelectInput,
      toDomeId: zOptionalString.nullable(),
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
