import { z } from 'zod';

import {
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const createMapYearlyValidation = z.object({
  name: zRequiredString.min(0, 'Nama peta perlu diisi'),
  companyId: z.string().min(0).nullable(),
  mapDataCategoryId: zRequiredSelectInput,
  location: z.array(zRequiredSelectInput).min(1, 'Kolom tidak boleh kosong'),
  year: zRequiredSelectInput,
  mapImage: z.any(),
});

export const createMapMonthlyValidation = z.object({
  name: zRequiredString,
  companyId: z.string().min(0).nullable(),
  mapDataCategoryId: zRequiredSelectInput,
  location: z.array(zRequiredSelectInput).min(1, 'Kolom tidak boleh kosong'),
  year: zRequiredSelectInput,
  month: zRequiredSelectInput,
  mapImage: z.any(),
});

export const createMapWeeklyValidation = z.object({
  name: zRequiredString,
  companyId: z.string().min(0).nullable(),
  mapDataCategoryId: zRequiredSelectInput,
  location: z.array(zRequiredSelectInput).min(1, 'Kolom tidak boleh kosong'),
  year: zRequiredSelectInput,
  week: zRequiredSelectInput,
  mapImage: z.any(),
});

export const createMapQuarterValidation = z.object({
  name: zRequiredString,
  companyId: z.string().min(0).nullable(),
  mapDataCategoryId: zRequiredString,
  location: z.array(zRequiredSelectInput).min(1, 'Kolom tidak boleh kosong'),
  year: zRequiredSelectInput,
  quarter: zRequiredSelectInput,
  mapImage: z.any(),
});
