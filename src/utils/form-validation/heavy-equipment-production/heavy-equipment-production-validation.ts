import { z } from 'zod';

import { IMutationHeavyEquipmentDataProdValues } from '@/services/graphql/mutation/heavy-equipment-production/useCreateHeavyEquipmentProduction';
import {
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
    })
    .refine((data) => data.hourMeterBefore < data.hourMeterAfter, {
      message: 'HM awal harus lebih kecil dari HM akhir',
      path: ['hourMeterBefore'], // path of error
    });
