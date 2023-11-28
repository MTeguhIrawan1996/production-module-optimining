import { z } from 'zod';

import { IMutationBlockPitValues } from '@/services/graphql/mutation/block/useCreateBlockPitMaster';
import { IMutationStockpileValues } from '@/services/graphql/mutation/stockpile-master/useCreateStockpileMaster';
import { zRequiredString } from '@/utils/form-validation/global';

export const stockpileMutationValidation: z.ZodType<IMutationStockpileValues> =
  z.object({
    name: zRequiredString,
    handBookId: zRequiredString,
  });

export const stockpileDomeMutationValidation: z.ZodType<IMutationBlockPitValues> =
  z.object({
    pits: z
      .object({
        name: zRequiredString,
        handBookId: zRequiredString,
      })
      .array(),
  });
