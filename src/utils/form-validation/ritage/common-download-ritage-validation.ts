import { z } from 'zod';

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
