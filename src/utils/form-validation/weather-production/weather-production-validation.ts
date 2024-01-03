import { z } from 'zod';

import { IMutationWeatherProductionValues } from '@/services/graphql/mutation/weather-production/useCreateWeatherProduction';
import {
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
