import { z } from 'zod';

import { IDownloadShippingMonitoringValues } from '@/services/graphql/mutation/download/useDownloadTask';
import { IMutationShippingMonitoringValues } from '@/services/restapi/shipping-monitoring/useCreateShippingMonitoring';
import {
  validatePeriod,
  zDateOptionalValidation,
  zImageArrayOptional,
  zOptionalNumber,
  zOptionalString,
  zRequiredSelectInput,
} from '@/utils/form-validation/global';

export const shippingMonitoringMutationValidation: z.ZodType<IMutationShippingMonitoringValues> =
  z
    .object({
      bargeHeavyEquipmentId: zRequiredSelectInput,
      tugboatHeavyEquipmentId: zOptionalString.nullable(),
      palkaOpenDate: zDateOptionalValidation,
      palkaOpenTime: zOptionalString,
      palkaCloseDate: zDateOptionalValidation,
      palkaCloseTime: zOptionalString,
      factoryCategoryId: zRequiredSelectInput,
      factoryId: zOptionalString.nullable(),
      vesselOpenDate: zDateOptionalValidation,
      vesselOpenTime: zOptionalString,
      vesselCloseDate: zDateOptionalValidation,
      vesselCloseTime: zOptionalString,
      desc: zOptionalString,
      tonByDraft: zOptionalNumber,
      photo: zImageArrayOptional,
    })
    .superRefine((arg, ctx) => {
      if (arg.palkaOpenDate) {
        const newPalkaOpenTime = arg.palkaOpenTime || null;
        if (!newPalkaOpenTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom, // customize your issue
            path: ['palkaOpenTime'],
            message: 'Kolom tidak boleh kosong',
          });
        }
      }
      if (arg.palkaCloseDate) {
        const newPalkaCloseTime = arg.palkaCloseTime || null;
        if (!newPalkaCloseTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom, // customize your issue
            path: ['palkaCloseTime'],
            message: 'Kolom tidak boleh kosong',
          });
        }
        return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
      }
    });

export const downloadShippingMonitoringValidation: z.ZodType<IDownloadShippingMonitoringValues> =
  z
    .object({
      period: zRequiredSelectInput,
      startDate: zDateOptionalValidation,
      endDate: zDateOptionalValidation,
      year: zOptionalString.nullable(),
      month: zOptionalString.nullable(),
      week: zOptionalString.nullable(),
      bargeHeavyEquipmentId: zOptionalString.nullable(),
      factoryCategoryId: zOptionalString.nullable(),
    })
    .superRefine((arg, ctx) => {
      validatePeriod(arg, ctx);
    });
