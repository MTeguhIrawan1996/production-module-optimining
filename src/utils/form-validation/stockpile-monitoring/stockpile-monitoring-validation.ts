import { z } from 'zod';

import { IDownloadStockpileMonitoringValues } from '@/services/graphql/mutation/download/useDownloadTask';
import { IMutationStockpile } from '@/services/restapi/stockpile-monitoring/useUpdateStockpileMonitoring';
import {
  validatePeriod,
  zDateOptionalValidation,
  zDateValidation,
  zImageArrayOptional,
  zOptionalNumber,
  zOptionalString,
  zRequiredNumber,
  zRequiredSelectInput,
  zRequiredString,
  zTimeValidation,
} from '@/utils/form-validation/global';

export const stockpileMonitoringMutationValidation: z.ZodType<IMutationStockpile> =
  z
    .object({
      stockpileId: zRequiredSelectInput,
      domeId: zOptionalString.nullable(),
      handbookId: zOptionalString,
      oreSubMaterialId: zRequiredSelectInput,
      openDate: zDateOptionalValidation,
      openTime: zTimeValidation,
      closeDate: zDateOptionalValidation,
      closeTime: zTimeValidation,
      tonByRitage: zOptionalNumber,
      desc: zOptionalString,
      photo: zImageArrayOptional,
      tonSurveys: z
        .object({
          ton: zRequiredNumber,
          volume: zRequiredNumber,
          date: zDateValidation,
        })
        .array(),
      samples: z
        .object({
          date: zDateOptionalValidation,
          sampleTypeId: zOptionalString.nullable(),
          sampleNumber: zRequiredString,
          isCreatedAfterDetermine: z.boolean(),
          elements: z
            .object({
              elementId: zRequiredString,
              name: zRequiredString,
              value: zOptionalNumber,
            })
            .array(),
        })
        .array(),
    })
    .superRefine((arg, ctx) => {
      const newStockpileId = arg.stockpileId || null;
      const newDomeId = arg.domeId || null;
      if (newStockpileId && !newDomeId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom, // customize your issue
          path: ['domeId'],
          message: 'Kolom tidak boleh kosong',
        });
        return z.NEVER;
      }
    });

export const downloadStockpileMonitoringValidation: z.ZodType<IDownloadStockpileMonitoringValues> =
  z
    .object({
      period: zRequiredSelectInput,
      startDate: zDateOptionalValidation,
      endDate: zDateOptionalValidation,
      year: zOptionalString.nullable(),
      month: zOptionalString.nullable(),
      week: zOptionalString.nullable(),
      stockpileId: zOptionalString.nullable(),
    })
    .superRefine((arg, ctx) => {
      validatePeriod(arg, ctx);
    });
