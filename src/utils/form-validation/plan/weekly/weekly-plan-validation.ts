import { z } from 'zod';

import { ICreateWeeklyPlanValues } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyPlan';
import { zRequiredSelectInput } from '@/utils/form-validation/global';

export const weeklyPlanMutationValidation: z.ZodType<ICreateWeeklyPlanValues> =
  z.object({
    companyId: zRequiredSelectInput,
    year: zRequiredSelectInput,
    week: zRequiredSelectInput,
  });
