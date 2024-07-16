import { z } from 'zod';

import { IDownloadRitageProductionValues } from '@/services/graphql/mutation/download/useDownloadTask';
import {
  zDateOptionalValidation,
  zOptionalString,
  zRequiredSelectInput,
} from '@/utils/form-validation/global';

export const commonDownloadRitageValidation = z.object({
  period: zRequiredSelectInput,
  startDate: zDateOptionalValidation,
  endDate: zDateOptionalValidation,
  year: zOptionalString.nullable(),
  month: zOptionalString.nullable(),
  week: zOptionalString.nullable(),
  shiftId: zOptionalString.nullable(),
  heavyEquipmentCode: zOptionalString.nullable(),
  ritageStatus: zOptionalString.nullable(),
});

export const validatePeriod = (
  arg: IDownloadRitageProductionValues,
  ctx: z.RefinementCtx
) => {
  if (arg.period === 'DATE_RANGE') {
    if (!arg.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // customize your issue
        path: ['startDate'],
        message: 'Kolom tidak boleh kosong',
      });
    }
    if (!arg.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // customize your issue
        path: ['endDate'],
        message: 'Kolom tidak boleh kosong',
      });
    }
    return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
  }
  if (arg.period === 'MONTH') {
    if (!arg.year) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // customize your issue
        path: ['year'],
        message: 'Kolom tidak boleh kosong',
      });
    }
    if (!arg.month) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // customize your issue
        path: ['month'],
        message: 'Kolom tidak boleh kosong',
      });
    }
    return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
  }
  if (arg.period === 'WEEK') {
    if (!arg.year) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // customize your issue
        path: ['year'],
        message: 'Kolom tidak boleh kosong',
      });
    }
    if (!arg.month) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // customize your issue
        path: ['month'],
        message: 'Kolom tidak boleh kosong',
      });
    }
    if (!arg.week) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // customize your issue
        path: ['week'],
        message: 'Kolom tidak boleh kosong',
      });
    }
    return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
  }
};
