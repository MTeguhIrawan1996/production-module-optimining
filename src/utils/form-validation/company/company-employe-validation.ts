import { z } from 'zod';

import {
  zDateValidation,
  zOptionalString,
  zRequiredString,
} from '@/utils/form-validation/global';

export const createCompanyEmployeSchema = z.object({
  nip: zRequiredString,
  statusId: zOptionalString.nullable(),
  entryDate: zDateValidation.optional().nullable(),
  isStillWorking: z.boolean(),
  quitDate: zDateValidation.optional().nullable(),
});
