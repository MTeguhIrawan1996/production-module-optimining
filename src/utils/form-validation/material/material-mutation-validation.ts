import { z } from 'zod';

import { IMutationMaterialValues } from '@/services/graphql/mutation/material/useCreateMaterialMaster';
import { IMutationUpdateMaterialValues } from '@/services/graphql/mutation/material/useUpdateMaterialMaster';
import {
  zOptionalString,
  zRequiredString,
} from '@/utils/form-validation/global';

export const materialMutationValidation: z.ZodType<IMutationMaterialValues> =
  z.object({
    name: zRequiredString,
    subMaterials: z
      .object({
        name: zRequiredString,
      })
      .array(),
  });
export const materialMutationUpdateValidation: z.ZodType<IMutationUpdateMaterialValues> =
  z.object({
    name: zRequiredString,
    subMaterials: z
      .object({
        subMaterialId: zOptionalString.nullable(),
        name: zRequiredString,
      })
      .array(),
  });
