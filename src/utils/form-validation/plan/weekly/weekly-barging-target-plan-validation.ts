import { z } from 'zod';

import { IBargingDomePlanValue } from '@/services/graphql/mutation/plan/weekly/useCreateBargingDomePlan';
import { IBargingTargetPlanValue } from '@/services/graphql/mutation/plan/weekly/useCreateBargingTargetPlan';
import {
  zOptionalNumber,
  zOptionalString,
  zRequiredNumber,
  zRequiredSelectInput,
} from '@/utils/form-validation/global';

export const weeklyBargingTargetPlanMutationValidation: z.ZodType<IBargingTargetPlanValue> =
  z.object({
    bargingTargetPlans: z
      .object({
        id: zOptionalString.nullable(),
        materialId: zOptionalString.nullable(),
        materialName: zOptionalString,
        weeklyBargingTargets: z
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

export const weeklyBargingDomePlanMutationValidation: z.ZodType<IBargingDomePlanValue> =
  z.object({
    domeId: zRequiredSelectInput,
  });
