import { z } from 'zod';

import { IMutationHeavyEquipmentAvailabilityPlanValues } from '@/services/graphql/mutation/plan/weekly/useCreateHeavyEquipmentAvailabilityPlan';
import {
  zOptionalNumber,
  zOptionalString,
  zRequiredSelectInput,
} from '@/utils/form-validation/global';

export const heavyEquipmentAvailAbilityMutationValidation: z.ZodType<IMutationHeavyEquipmentAvailabilityPlanValues> =
  z.object({
    heavyEquipmentAvailabilityPlans: z
      .object({
        id: zOptionalString.nullable(),
        classId: zRequiredSelectInput,
        totalCount: zOptionalNumber,
        damagedCount: zOptionalNumber,
        withoutOperatorCount: zOptionalNumber,
        desc: zOptionalString,
      })
      .array(),
  });
