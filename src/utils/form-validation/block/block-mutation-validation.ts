import { z } from 'zod';

import { IMutationBlockValues } from '@/services/graphql/mutation/block/useCreateBlockMaster';
import { IMutationBlockPitValues } from '@/services/graphql/mutation/block/useCreateBlockPitMaster';
import { IMutationUpdateBlockPitValues } from '@/services/graphql/mutation/block/useUpdateBlockPitMaster';
import { zRequiredString } from '@/utils/form-validation/global';

export const blockMutationValidation: z.ZodType<IMutationBlockValues> =
  z.object({
    name: zRequiredString,
    handBookId: zRequiredString,
  });
export const blockPitMutationUpdateValidation: z.ZodType<IMutationUpdateBlockPitValues> =
  z.object({
    name: zRequiredString,
    handBookId: zRequiredString,
  });

export const blockPitMutationValidation: z.ZodType<IMutationBlockPitValues> =
  z.object({
    pits: z
      .object({
        name: zRequiredString,
        handBookId: zRequiredString,
      })
      .array(),
  });
