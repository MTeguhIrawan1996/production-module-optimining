import { z } from 'zod';

import { IMutationStockpile } from '@/services/restapi/stockpile-monitoring/useUpdateStockpileMonitoring';
import {
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
          date: zDateValidation,
        })
        .array(),
      bargings: z
        .object({
          startDate: zDateOptionalValidation,
          startTime: zTimeValidation,
          finishDate: zDateOptionalValidation,
          finishTime: zTimeValidation,
        })
        .array(),
      movings: z
        .object({
          startDate: zDateOptionalValidation,
          startTime: zTimeValidation,
          finishDate: zDateOptionalValidation,
          finishTime: zTimeValidation,
        })
        .array(),
      reopens: z
        .object({
          openDate: zDateOptionalValidation,
          openTime: zTimeValidation,
          closeDate: zDateOptionalValidation,
          closeTime: zTimeValidation,
        })
        .array(),
      samples: z
        .object({
          date: zDateOptionalValidation,
          sampleTypeId: zOptionalString.nullable(),
          sampleNumber: zOptionalString,
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
