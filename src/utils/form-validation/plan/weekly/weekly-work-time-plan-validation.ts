import { z } from 'zod';

import { IWorkTimePlanValues } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyWorkTimePlan';
import {
  zOptionalNumber,
  zOptionalString,
  zRequiredNumber,
} from '@/utils/form-validation/global';

export const weeklyWorkTimePlanMutationValidation: z.ZodType<IWorkTimePlanValues> =
  z.object({
    workTimePlanActivities: z
      .object({
        id: zOptionalString.nullable(),
        isLoseTime: z.boolean(),
        activityId: zOptionalString.nullable(),
        loseTimeId: zOptionalString.nullable(),
        name: zOptionalString,
        weeklyWorkTimes: z
          .object({
            id: zOptionalString.nullable(),
            day: zRequiredNumber,
            hour: zOptionalNumber,
          })
          .array(),
      })
      .array(),
  });
