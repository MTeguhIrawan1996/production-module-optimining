import { z } from 'zod';

import { IMutationMaterialValues } from '@/services/graphql/mutation/material/useCreateMaterialMaster';
import { zRequiredString } from '@/utils/form-validation/global';

export const materialMutationValidation: z.ZodType<IMutationMaterialValues> =
  z.object({
    name: zRequiredString,
    parentId: zRequiredString,
  });
