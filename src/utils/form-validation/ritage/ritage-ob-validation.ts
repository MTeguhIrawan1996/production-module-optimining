import { z } from 'zod';

import { IMutationRitageOb } from '@/services/restapi/ritage-productions/ob/useCreateRitageOb';
import {
  zDateValidation,
  zImageArrayOptional,
  zOptionalString,
  zRequiredNumber,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const ritageObMutationValidation: z.ZodType<IMutationRitageOb> = z
  .object({
    date: zDateValidation,
    checkerFromId: zRequiredSelectInput,
    checkerFromPosition: zOptionalString,
    checkerToId: zOptionalString.nullable(),
    checkerToPosition: zOptionalString,
    shiftId: zRequiredSelectInput,
    companyHeavyEquipmentId: zRequiredSelectInput,
    materialId: zRequiredSelectInput,
    subMaterialId: zRequiredSelectInput,
    fromTime: zRequiredString,
    arriveTime: zOptionalString,
    ritageDuration: zOptionalString,
    block: zOptionalString,
    weatherId: zOptionalString.nullable(),
    fromPitId: zRequiredSelectInput,
    fromFrontId: zOptionalString.nullable(),
    fromGridId: zOptionalString.nullable(),
    fromSequenceId: zOptionalString.nullable(),
    fromElevationId: zOptionalString.nullable(),
    disposalId: zOptionalString.nullable(),
    bulkSamplingDensity: zRequiredNumber,
    bucketVolume: zRequiredNumber,
    tonByRitage: zOptionalString,
    sampleNumber: zOptionalString,
    desc: zOptionalString,
    photos: zImageArrayOptional,
    isRitageProblematic: z.boolean(),
    companyHeavyEquipmentChangeId: zOptionalString.nullable(),
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
