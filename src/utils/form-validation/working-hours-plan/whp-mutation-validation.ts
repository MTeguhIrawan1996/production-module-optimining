import { z } from 'zod';

import { IMutationWHPValues } from '@/services/graphql/mutation/working-hours-plan/useCreateWHPMaster';
import { zRequiredString } from '@/utils/form-validation/global';

export const whpMutationValidation: z.ZodType<IMutationWHPValues> = z.object({
  createWorkingHourPlans: z
    .object({
      activityName: zRequiredString,
    })
    .array(),
});
