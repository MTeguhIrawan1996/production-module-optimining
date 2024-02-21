import { z } from 'zod';

import { ICreateMonthlyPlanInformationValues } from '@/services/graphql/mutation/plan/monthly/useCreateMonthlyPlanInformation';
import { zRequiredSelectInput } from '@/utils/form-validation/global';

export const monthlyPlanInformationMutationValidation: z.ZodType<ICreateMonthlyPlanInformationValues> =
  z.object({
    companyId: zRequiredSelectInput,
    year: zRequiredSelectInput,
    month: zRequiredSelectInput,
  });
