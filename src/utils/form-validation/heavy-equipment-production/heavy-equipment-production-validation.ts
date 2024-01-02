import { z } from 'zod';

import { IMutationHeavyEquipmentDataProdValues } from '@/services/graphql/mutation/heavy-equipment-production/useCreateHeavyEquipmentProduction';
import {
  zDateValidation,
  zOptionalString,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const heavyEquipmentProductionMutationValidation: z.ZodType<IMutationHeavyEquipmentDataProdValues> =
  z.object({
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
    amountEffectiveWorkingHours: zOptionalString,
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
  });

// .superRefine((arg, ctx) => {
//   const detailsLength = arg.details.length >= 1
//   if (detailsLength) {
//     if (arg.details) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom, // customize your issue
//         path: ['companyHeavyEquipmentChangeId'],
//         message: 'Kolom tidak boleh kosong',
//       });
//     }

//     return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
//   }
// });
