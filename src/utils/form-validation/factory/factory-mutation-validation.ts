import { z } from 'zod';

import { IMutationFactoryValues } from '@/services/graphql/mutation/factory/useCreateFactoryMaster';
import {
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const factoryMutationValidation: z.ZodType<IMutationFactoryValues> =
  z.object({
    name: zRequiredString,
    categoryId: zRequiredSelectInput,
  });
