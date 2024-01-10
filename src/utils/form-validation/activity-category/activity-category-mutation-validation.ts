import { z } from 'zod';

import { IMutationLoseTimeValues } from '@/services/graphql/mutation/activity-category/useUpdateActivityCategory';
import { zRequiredSelectInput } from '@/utils/form-validation/global';

export const loseTimeMutationValidation: z.ZodType<IMutationLoseTimeValues> =
  z.object({
    activities: z
      .object({
        activityId: zRequiredSelectInput,
      })
      .array(),
  });
