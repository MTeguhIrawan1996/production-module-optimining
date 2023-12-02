import { z } from 'zod';

import { zRequiredString } from '@/utils/form-validation/global';

import { IUpdateStatusValues } from '@/types/global';

export const statusValidationSchema: z.ZodType<IUpdateStatusValues> = z.object({
  statusMessage: zRequiredString,
});
