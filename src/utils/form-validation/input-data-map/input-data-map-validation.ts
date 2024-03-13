import { z } from 'zod';

import {
  zOptionalString,
  zRequiredString,
} from '@/utils/form-validation/global';

export const createMapYearlyValidation = z.object({
  name: zRequiredString,
  companyId: zOptionalString,
  mapDataCategoryId: zRequiredString,
  location: z.array(zRequiredString),
  year: zRequiredString,
  mapImage: z.any().optional(),
});

export const createMapMonthlyValidation = z.object({
  name: zRequiredString,
  companyId: zOptionalString,
  mapDataCategoryId: zRequiredString,
  location: z.array(zRequiredString),
  year: zRequiredString,
  month: zRequiredString,
  mapImage: z.any().optional(),
});

export const createMapWeeklyValidation = z.object({
  name: zRequiredString,
  companyId: zOptionalString,
  mapDataCategoryId: zRequiredString,
  location: z.array(zRequiredString),
  year: zRequiredString,
  week: zRequiredString,
  mapImage: z.any().optional(),
});

export const createMapQuarterValidation = z.object({
  name: zRequiredString,
  companyId: zOptionalString,
  mapDataCategoryId: zRequiredString,
  location: z.array(zRequiredString),
  year: zRequiredString,
  quarter: zRequiredString,
  mapImage: z.any().optional(),
});
