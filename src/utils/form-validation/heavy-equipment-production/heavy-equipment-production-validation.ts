import { z } from 'zod';

import { IDownloadHEProductionValues } from '@/services/graphql/mutation/download/useDownloadTask';
import { IMutationHeavyEquipmentDataProdValues } from '@/services/graphql/mutation/heavy-equipment-production/useCreateHeavyEquipmentProduction';
import {
  validatePeriod,
  zDateOptionalValidation,
  zDateValidation,
  zOptionalNumber,
  zOptionalString,
  zRequiredNumber,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const heavyEquipmentProductionMutationValidation: z.ZodType<IMutationHeavyEquipmentDataProdValues> =
  z
    .object({
      date: zDateValidation,
      foremanId: zRequiredSelectInput,
      operatorId: zRequiredSelectInput,
      companyHeavyEquipmentId: zRequiredSelectInput,
      shiftId: zRequiredSelectInput,
      workStartTime: zRequiredString,
      workFinishTime: zRequiredString,
      amountWorkTime: zOptionalString,
      desc: zOptionalString,
      heavyEquipmentType: zOptionalString,
      hourMeterBefore: zRequiredNumber,
      hourMeterAfter: zRequiredNumber,
      amountHourMeter: zOptionalNumber,
      fuel: zOptionalNumber,
      loseTimes: z
        .object({
          workingHourPlanId: zOptionalString,
          name: zOptionalString,
          amountHour: zOptionalString,
          details: z
            .object({
              startTime: zRequiredString,
              finishTime: zRequiredString,
            })
            .array(),
        })
        .array(),
      isHeavyEquipmentProblematic: z.boolean(),
      companyHeavyEquipmentChangeId: zOptionalString.nullable(),
      changeTime: zOptionalString,
    })
    .refine(
      (data) =>
        data.companyHeavyEquipmentChangeId !== data.companyHeavyEquipmentId,
      {
        message: 'Nomor lambung tidak boleh sama',
        path: ['companyHeavyEquipmentChangeId'], // path of error
      }
    )
    .refine((data) => data.hourMeterBefore < data.hourMeterAfter, {
      message: 'HM awal harus lebih kecil dari HM akhir',
      path: ['hourMeterBefore'], // path of error
    })
    .superRefine((arg, ctx) => {
      if (arg.isHeavyEquipmentProblematic) {
        const newHeavyequipmentContinueId =
          arg.companyHeavyEquipmentChangeId || null;
        const newChangeTime = arg.changeTime || null;
        if (!newHeavyequipmentContinueId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom, // customize your issue
            path: ['companyHeavyEquipmentChangeId'],
            message: 'Kolom tidak boleh kosong',
          });
        }
        if (!newChangeTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom, // customize your issue
            path: ['changeTime'],
            message: 'Kolom tidak boleh kosong',
          });
        }
        return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
      }
    });

export const downloadHEProductionValidation: z.ZodType<IDownloadHEProductionValues> =
  z
    .object({
      period: zRequiredSelectInput,
      startDate: zDateOptionalValidation,
      endDate: zDateOptionalValidation,
      year: zOptionalString.nullable(),
      month: zOptionalString.nullable(),
      week: zOptionalString.nullable(),
      shiftId: zOptionalString.nullable(),
      companyHeavyEquipmentId: zOptionalString.nullable(),
    })
    .superRefine((arg, ctx) => {
      validatePeriod(arg, ctx);
    });
