import { z } from 'zod';

import { IMutationMiningMapPlanValues } from '@/services/restapi/plan/weekly/useCreateMiningMapPlan';
import {
  zImageOrPDFArrayOptional,
  zOptionalString,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

import { IFile } from '@/types/global';

export const weeklyMiningMapPlanMutationValidation: z.ZodType<IMutationMiningMapPlanValues> =
  z.object({
    miningMapPlans: z
      .object({
        id: zOptionalString.nullable(),
        mapName: zRequiredString,
        locationCategoryId: zRequiredSelectInput,
        locationId: zRequiredSelectInput,
        file: zImageOrPDFArrayOptional,
        serverFile: z.custom<Omit<IFile, 'path'>>().array(),
      })
      .superRefine((arg, ctx) => {
        if (arg.serverFile.length < 1) {
          if (arg.file.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom, // customize your issue
              path: ['file'],
              message: 'File wajib diisi',
            });
          }

          return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
        }
      })
      .array(),
  });
