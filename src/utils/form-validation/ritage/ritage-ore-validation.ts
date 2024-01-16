import { z } from 'zod';

import { IMutationRitageOre } from '@/services/restapi/ritage-productions/ore/useCreateRitageOre';
import {
  zDateValidation,
  zImageArrayOptional,
  zOptionalString,
  zRequiredNumber,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const ritageOreMutationValidation: z.ZodType<IMutationRitageOre> = z
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
    fromLevel: zOptionalString,
    toLevel: zOptionalString,
    stockpileId: zRequiredSelectInput,
    domeId: zOptionalString.nullable(),
    closeDome: z.boolean(),
    bulkSamplingDensity: zRequiredNumber,
    bucketVolume: zRequiredNumber,
    tonByRitage: zOptionalString,
    sampleNumber: zRequiredString,
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
    const newStockpileId = arg.stockpileId || null;
    const newDomeId = arg.domeId || null;
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
    if (newStockpileId && !newDomeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // customize your issue
        path: ['domeId'],
        message: 'Kolom tidak boleh kosong',
      });
      return z.NEVER;
    }
  });
