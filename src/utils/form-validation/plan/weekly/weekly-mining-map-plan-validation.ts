import { z } from 'zod';

import { IMutationMiningMapPlanValues } from '@/services/restapi/plan/weekly/useCreateMiningMapPlan';
import {
  zImageOrPDFArrayRequired,
  zOptionalString,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const weeklyMiningMapPlanMutationValidation: z.ZodType<IMutationMiningMapPlanValues> =
  z.object({
    miningMapPlans: z
      .object({
        id: zOptionalString.nullable(),
        mapName: zRequiredString,
        locationCategoryId: zRequiredSelectInput,
        locationId: zRequiredSelectInput,
        file: zImageOrPDFArrayRequired,
      })
      .array(),
  });
