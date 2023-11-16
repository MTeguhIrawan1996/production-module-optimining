import { z } from 'zod';

import { IMutationLocationValues } from '@/services/graphql/mutation/location/useCreateLocationMaster';
import {
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const locationMutationValidation: z.ZodType<IMutationLocationValues> =
  z.object({
    name: zRequiredString,
    handBookId: zRequiredString,
    categoryId: zRequiredSelectInput,
  });
