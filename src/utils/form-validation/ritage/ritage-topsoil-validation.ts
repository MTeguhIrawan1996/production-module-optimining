import { z } from 'zod';

import { IDownloadRitageCommonValue } from '@/services/graphql/mutation/download/useDownloadTask';
import { IMutationRitageTopsoil } from '@/services/restapi/ritage-productions/topsoil/useCreateRitageTopsoil';
import {
  validatePeriod,
  zDateValidation,
  zImageArrayOptional,
  zOptionalString,
  zRequiredNumber,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';
import { commonDownloadRitageValidation } from '@/utils/form-validation/ritage/common-download-ritage-validation';

export const ritageTopsoilMutationValidation: z.ZodType<IMutationRitageTopsoil> =
  z
    .object({
      date: zDateValidation,
      checkerFromId: zOptionalString.nullable(),
      checkerFromPosition: zOptionalString,
      checkerToId: zOptionalString.nullable(),
      checkerToPosition: zOptionalString,
      shiftId: zRequiredSelectInput,
      companyHeavyEquipmentId: zRequiredSelectInput,
      companyHeavyEquipmentChangeId: zOptionalString.nullable(),
      materialId: zRequiredSelectInput,
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
      toLocationCategoryId: zOptionalString.nullable(),
      toLocationId: zOptionalString.nullable(),
      bulkSamplingDensity: zRequiredNumber,
      bucketVolume: zRequiredNumber,
      tonByRitage: zOptionalString,
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

export const downloadTopsoilProductionValidation: z.ZodType<IDownloadRitageCommonValue> =
  commonDownloadRitageValidation.superRefine((arg, ctx) => {
    validatePeriod(arg, ctx);
  });
