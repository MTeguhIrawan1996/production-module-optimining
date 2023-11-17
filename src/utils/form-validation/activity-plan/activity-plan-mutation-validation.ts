import { z } from 'zod';

import { IMutationActivityPlanValues } from '@/services/graphql/mutation/activity-plan/useUpdateActivityPlanMaster';
import { zRequiredString } from '@/utils/form-validation/global';

export const activityPlanMutationValidation: z.ZodType<IMutationActivityPlanValues> =
  z.object({
    name: zRequiredString,
  });
