import { z } from 'zod';

import { IMutationFrontProductionValues } from '@/services/graphql/mutation/front-production/useCreateFrontProduction';
import { IDownloadFrontProductionValues } from '@/services/graphql/mutation/front-production/useDownloadFrontProduction';
import {
  zDateOptionalValidation,
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
      shiftId: zOptionalString.nullable(),
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
      supportingHeavyEquipments: z
        .object({
          id: zOptionalString.nullable(),
          activityPlanId: zRequiredSelectInput,
          companyHeavyEquipmentId: zRequiredSelectInput,
        })
        .array(),
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

export const downloadFrontProductionValidation: z.ZodType<IDownloadFrontProductionValues> =
  z
    .object({
      period: zRequiredSelectInput,
      startDate: zDateOptionalValidation,
      endDate: zDateOptionalValidation,
      year: zOptionalString.nullable(),
      month: zOptionalString.nullable(),
      week: zOptionalString.nullable(),
      locationId: zOptionalString.nullable(),
      shiftId: zOptionalString.nullable(),
      materialId: zOptionalString.nullable(),
    })
    .superRefine((arg, ctx) => {
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
    });
