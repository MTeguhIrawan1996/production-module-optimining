import { z } from 'zod';

import { IUnitCapacityPlanValues } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyUnitcapacityPlan';
import {
  zArrayOfString,
  zOptionalNumber,
  zOptionalString,
  zRequiredNumber,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const weeklyUnitCapacityPlanMutationValidation: z.ZodType<IUnitCapacityPlanValues> =
  z.object({
    unitCapacityPlans: z
      .object({
        id: zOptionalString.nullable(),
        locationIds: zArrayOfString.min(1, {
          message: 'Pilih minimal 1 lokasi',
        }),
        activityName: zRequiredString,
        materials: z
          .object({
            id: zOptionalString.nullable(),
            materialId: zRequiredSelectInput,
            fleet: zRequiredString,
            classId: zRequiredSelectInput,
            frontId: zRequiredSelectInput,
            physicalAvailability: zRequiredNumber,
            useOfAvailability: zRequiredNumber,
            effectiveWorkingHour: zRequiredNumber,
            distance: zRequiredNumber,
            dumpTruckCount: zRequiredNumber,
            targetPlans: z
              .object({
                id: zOptionalString.nullable(),
                day: zRequiredNumber,
                rate: zOptionalNumber,
                ton: zOptionalNumber,
              })
              .superRefine((arg, ctx) => {
                if (arg.rate !== '') {
                  if (arg.ton === '') {
                    ctx.addIssue({
                      code: z.ZodIssueCode.custom, // customize your issue
                      path: ['ton'],
                      message: 'Kolom tidak boleh kosong',
                    });
                  }

                  return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
                }
                if (arg.ton !== '') {
                  if (arg.rate === '') {
                    ctx.addIssue({
                      code: z.ZodIssueCode.custom, // customize your issue
                      path: ['rate'],
                      message: 'Kolom tidak boleh kosong',
                    });
                  }

                  return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
                }
              })
              .array(),
          })
          .array(),
      })
      .array(),
  });
