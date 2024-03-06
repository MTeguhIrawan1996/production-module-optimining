import { z } from 'zod';

import { ICreateWeeklyPlanInformationValues } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyPlanInformation';
import { zRequiredSelectInput } from '@/utils/form-validation/global';

export const weeklyPlanMutationValidation: z.ZodType<ICreateWeeklyPlanInformationValues> =
  z.object({
    companyId: zRequiredSelectInput,
    year: zRequiredSelectInput,
    week: zRequiredSelectInput,
  });
