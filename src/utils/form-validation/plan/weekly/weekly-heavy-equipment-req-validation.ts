import { z } from 'zod';

import { IMutationHeavyEquipmentReqPlanValues } from '@/services/graphql/mutation/plan/weekly/useCreateHeavyEquipmentReqPlan';
import {
  zArrayOfString,
  zOptionalNumber,
  zOptionalString,
  zRequiredNumber,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const heavyEquipmentReqMutationValidation: z.ZodType<IMutationHeavyEquipmentReqPlanValues> =
  z.object({
    heavyEquipmentRequirementPlans: z
      .object({
        id: zOptionalString.nullable(),
        activityName: zOptionalString,
        materialIds: zArrayOfString,
        locationIds: zArrayOfString,
        averageDistance: zOptionalNumber,
        desc: zOptionalString,
        activities: z
          .object({
            id: zOptionalString.nullable(),
            activityFormId: zRequiredSelectInput,
            classId: zRequiredString,
            weeklyHeavyEquipmentRequirements: z
              .object({
                id: zOptionalString.nullable(),
                day: zRequiredNumber,
                value: zOptionalNumber,
              })

              .array(),
          })
          .array(),
      })
      .array(),
  });
