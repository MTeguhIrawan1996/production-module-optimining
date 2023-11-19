import { z } from 'zod';

import { IMutationElementValues } from '@/services/graphql/mutation/element/useCreateElementMaster';
import { zRequiredString } from '@/utils/form-validation/global';

export const elementMutationValidation: z.ZodType<IMutationElementValues> =
  z.object({
    name: zRequiredString,
  });
