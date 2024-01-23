import { z } from 'zod';

import { IMutationFrontProductionValues } from '@/services/graphql/mutation/front-production/useCreateFrontProduction';
import {
  zDateValidation,
  zOptionalNumber,
  zOptionalString,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const frontProductionMutationValidation: z.ZodType<IMutationFrontProductionValues> =
  z
    .object({
      date: zDateValidation,
      companyHeavyEquipmentId: zRequiredSelectInput,
      frontId: zRequiredSelectInput,
      materialId: zRequiredSelectInput,
      type: zRequiredString,
      pitId: zOptionalString.nullable(),
      block: zOptionalString,
      gridId: zOptionalString.nullable(),
      elevationId: zOptionalString.nullable(),
      domeId: zOptionalString.nullable(),
      x: zOptionalNumber,
      y: zOptionalNumber,
    })
    .superRefine((arg, ctx) => {
      if (arg.type === 'pit') {
        if (arg.pitId === '' || !arg.pitId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom, // customize your issue
            path: ['pitId'],
            message: 'Kolom tidak boleh kosong',
          });
        }
        return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
      }
      if (arg.type === 'dome') {
        if (arg.domeId === '' || !arg.domeId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom, // customize your issue
            path: ['domeId'],
            message: 'Kolom tidak boleh kosong',
          });
        }
        return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
      }
    });
