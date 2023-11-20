import { z } from 'zod';

import { IMutationShiftValues } from '@/services/graphql/mutation/shift/useCreateShiftMaster';
import { zRequiredString } from '@/utils/form-validation/global';

export const shiftMutationValidation: z.ZodType<IMutationShiftValues> =
  z.object({
    name: zRequiredString,
    startHour: zRequiredString,
    endHour: zRequiredString,
  });
