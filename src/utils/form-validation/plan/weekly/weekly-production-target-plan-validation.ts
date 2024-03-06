import { z } from 'zod';

import { IWeeklyProductionTargetPlanValues } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyProductionTargetPlan';
import {
  zOptionalNumber,
  zOptionalString,
  zRequiredNumber,
} from '@/utils/form-validation/global';

export const weeklyProductionTargetPlanMutationValidation: z.ZodType<IWeeklyProductionTargetPlanValues> =
  z.object({
    productionTargetPlans: z
      .object({
        id: zOptionalString.nullable(),
        materialId: zOptionalString.nullable(),
        materialName: zOptionalString,
        isPerent: z.boolean(),
        index: z.number().nullable(),
        weeklyProductionTargets: z
          .object({
            id: zOptionalString.nullable(),
            day: zRequiredNumber,
            rate: zOptionalNumber,
            ton: zOptionalNumber,
          })
          .superRefine((arg, ctx) => {
            if (arg.rate !== '') {
              if (arg.ton === '') {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom, // customize your issue
                  path: ['ton'],
                  message: 'Kolom tidak boleh kosong',
                });
              }

              return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
            }
            if (arg.ton !== '') {
              if (arg.rate === '') {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom, // customize your issue
                  path: ['rate'],
                  message: 'Kolom tidak boleh kosong',
                });
              }

              return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
            }
          })
          .array(),
      })
      .array(),
  });
