import { z } from 'zod';

import { IMutationStockpile } from '@/services/restapi/stockpile-monitoring/useUpdateStockpileMonitoring';
import {
  zDateOptionalValidation,
  zDateValidation,
  zImageArrayOptional,
  zOptionalNumber,
  zOptionalString,
  zRequiredSelectInput,
  zRequiredString,
  zTimeValidation,
} from '@/utils/form-validation/global';

export const stockpileMonitoringMutationValidation: z.ZodType<IMutationStockpile> =
  z.object({
    stockpileId: zRequiredSelectInput,
    domeId: zRequiredSelectInput,
    handbookId: zOptionalString,
    oreSubMaterialId: zRequiredSelectInput,
    openDate: zDateValidation,
    openTime: zTimeValidation,
    closeDate: zDateOptionalValidation,
    closeTime: zTimeValidation,
    tonByRitage: zOptionalNumber,
    desc: zOptionalString,
    photo: zImageArrayOptional,
    tonSurveys: z
      .object({
        ton: zOptionalNumber,
        date: zDateOptionalValidation,
      })
      .array(),
    bargingStartDate: zDateValidation,
    bargingStartTime: zTimeValidation,
    bargingFinishDate: zDateOptionalValidation,
    bargingFinishTime: zTimeValidation,
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
  });
