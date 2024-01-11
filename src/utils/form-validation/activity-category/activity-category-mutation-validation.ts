import { z } from 'zod';

import {
  IMutationCalculationValues,
  IMutationLoseTimeValues,
} from '@/services/graphql/mutation/activity-category/useUpdateActivityCategory';
import { IMutationHeavyEquipmentFormulaValues } from '@/services/graphql/mutation/heavy-equipment-formula/useUpdateHeavyEquipmentFormula';
import {
  zOptionalNumber,
  zOptionalString,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const loseTimeMutationValidation: z.ZodType<IMutationLoseTimeValues> =
  z.object({
    activities: z
      .object({
        activityId: zRequiredSelectInput,
      })
      .array(),
  });
export const calculationMutationValidation: z.ZodType<IMutationCalculationValues> =
  z.object({
    name: zRequiredString,
    countFormula: z.object({
      parameters: z
        .object({
          categoryId: zRequiredSelectInput,
          operator: zOptionalString.nullable(),
          order: zOptionalNumber,
        })
        .array(),
    }),
  });
export const heavyEquipmentFormulaMutationValidation: z.ZodType<IMutationHeavyEquipmentFormulaValues> =
  z.object({
    name: zRequiredString,
    topFormula: z.object({
      parameters: z
        .object({
          categoryId: zRequiredSelectInput,
          operator: zOptionalString.nullable(),
          order: zOptionalNumber,
        })
        .array(),
    }),
    bottomFormula: z.object({
      parameters: z
        .object({
          categoryId: zRequiredSelectInput,
          operator: zOptionalString.nullable(),
          order: zOptionalNumber,
        })
        .array(),
    }),
  });
