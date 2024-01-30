import { z } from 'zod';

import { IUnitCapacityPlanValues } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyUnitcapacityPlan';
import {
  zArrayOfString,
  zOptionalString,
  zRequiredNumber,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const weeklyUnitCapacityPlanMutationValidation: z.ZodType<IUnitCapacityPlanValues> =
  z.object({
    companyId: zOptionalString.nullable(),
    year: zOptionalString.nullable(),
    week: zOptionalString.nullable(),
    unitCapacityPlans: z
      .object({
        locationIds: zArrayOfString.min(1, {
          message: 'Pilih minimal 1 lokasi',
        }),
        activityName: zRequiredString,
        materials: z
          .object({
            materialId: zRequiredSelectInput,
            fleet: zRequiredNumber,
            classId: zRequiredSelectInput,
            frontId: zRequiredSelectInput,
            physicalAvailability: zRequiredNumber,
            useOfAvailability: zRequiredNumber,
            effectiveWorkingHour: zRequiredNumber,
            distance: zRequiredNumber,
            dumpTruckCount: zRequiredNumber,
            targetPlans: z
              .object({
                day: zRequiredNumber,
                rate: zRequiredNumber,
                ton: zRequiredNumber,
              })
              .array(),
          })
          .array(),
      })
      .array(),
  });
