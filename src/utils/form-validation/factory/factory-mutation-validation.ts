import { z } from 'zod';

import { IMutationFactoryValues } from '@/services/graphql/mutation/factory/useCreateFactoryMaster';
import { zRequiredString } from '@/utils/form-validation/global';

export const factoryMutationValidation: z.ZodType<IMutationFactoryValues> =
  z.object({
    name: zRequiredString,
  });
