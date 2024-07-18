import { z } from 'zod';

import { IDownloadWeatherProductionValues } from '@/services/graphql/mutation/download/useDownloadTask';
import { IMutationWeatherProductionValues } from '@/services/graphql/mutation/weather-production/useCreateWeatherProduction';
import {
  validatePeriod,
  zDateOptionalValidation,
  zDateValidation,
  zOptionalNumber,
  zOptionalString,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const weatherProductionMutationValidation: z.ZodType<IMutationWeatherProductionValues> =
  z.object({
    date: zDateValidation,
    desc: zOptionalString,
    checkerId: zRequiredSelectInput,
    locationCategoryId: zRequiredSelectInput,
    locationId: zRequiredSelectInput,
    weatherDataConditions: z
      .object({
        conditionId: zRequiredSelectInput,
        startTime: zRequiredString,
        finishTime: zRequiredString,
        rainfall: zOptionalNumber,
      })
      .array(),
  });

export const downloadWeatherProductionValidation: z.ZodType<IDownloadWeatherProductionValues> =
  z
    .object({
      period: zRequiredSelectInput,
      startDate: zDateOptionalValidation,
      endDate: zDateOptionalValidation,
      year: zOptionalString.nullable(),
      month: zOptionalString.nullable(),
      week: zOptionalString.nullable(),
      shiftId: zOptionalString.nullable(),
    })
    .superRefine((arg, ctx) => {
      validatePeriod(arg, ctx);
    });
