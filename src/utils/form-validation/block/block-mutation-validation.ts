import { z } from 'zod';

import { IMutationBlockValues } from '@/services/graphql/mutation/block/useCreateBlockMaster';
import { zRequiredString } from '@/utils/form-validation/global';

export const blockMutationValidation: z.ZodType<IMutationBlockValues> =
  z.object({
    name: zRequiredString,
    handBookId: zRequiredString,
  });
