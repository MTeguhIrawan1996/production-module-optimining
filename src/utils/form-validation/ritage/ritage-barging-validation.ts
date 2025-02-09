import { z } from 'zod';

import {
  IDownloadBargingProductionValues,
  IDownloadRitageCommonValue,
} from '@/services/graphql/mutation/download/useDownloadTask';
import { IMutationRitageBarging } from '@/services/restapi/ritage-productions/barging/useCreateRitageBarging';
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

export const ritageBargingMutationValidation: z.ZodType<IMutationRitageBarging> =
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
      material: zOptionalString,
      subMaterial: zOptionalString,
      fromTime: zRequiredString,
      arriveTime: zOptionalString,
      ritageDuration: zOptionalString,
      weatherId: zOptionalString.nullable(),
      domeId: zOptionalString.nullable(),
      fromFrontId: zOptionalString.nullable(),
      stockpileName: zOptionalString,
      closeDome: z.boolean(),
      bargeCompanyHeavyEquipmentId: zOptionalString.nullable(),
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

export const downloadBargingProductionValidation: z.ZodType<
  IDownloadRitageCommonValue & IDownloadBargingProductionValues
> = z
  .object({
    stockpileId: zOptionalString.nullable(),
    domeId: zOptionalString.nullable(),
  })
  .merge(commonDownloadRitageValidation)
  .superRefine((arg, ctx) => {
    validatePeriod(arg, ctx);
  });
