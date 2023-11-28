import { z } from 'zod';

import { IUpdateEmployeeDataRequest } from '@/services/graphql/mutation/master-data-company/useUpdateCompanyEmployeData';
import { IUpdateEmployeePositionsRequest } from '@/services/graphql/mutation/master-data-company/useUpdateCompanyPositionHistory';
import {
  zDateOptionalValidation,
  zDateValidation,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const createCompanyEmployeSchema: z.ZodType<
  Omit<IUpdateEmployeeDataRequest, 'id'>
> = z
  .object({
    nip: zRequiredString,
    statusId: zRequiredSelectInput,
    entryDate: zDateValidation,
    isStillWorking: z.boolean(),
    quitDate: zDateOptionalValidation,
  })
  .superRefine((arg, ctx) => {
    if (!arg.isStillWorking) {
      if (!arg.quitDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom, // customize your issue
          path: ['quitDate'],
          message: 'Kolom tidak boleh kosong',
        });
      }

      return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
    }
  });

export const createCompanyPositionHistroySchema: z.ZodType<
  Pick<IUpdateEmployeePositionsRequest, 'positionHistories'>
> = z.object({
  positionHistories: z
    .object({
      positionId: zRequiredSelectInput,
      divisionId: zRequiredSelectInput,
      isStill: z.boolean(),
      startDate: zDateValidation,
      endDate: zDateOptionalValidation,
    })
    .superRefine((arg, ctx) => {
      if (!arg.isStill) {
        if (!arg.endDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom, // customize your issue
            path: ['endDate'],
            message: 'Kolom tidak boleh kosong',
          });
        }

        return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
      }
    })
    .array(),
});
