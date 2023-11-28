import { z } from 'zod';

import { IMutationStockpileDomeValues } from '@/services/graphql/mutation/stockpile-master/useCreateStockpileDomeMaster';
import { IMutationStockpileValues } from '@/services/graphql/mutation/stockpile-master/useCreateStockpileMaster';
import { IMutationUpdateStockpileDomeValues } from '@/services/graphql/mutation/stockpile-master/useUpdateStockpileDomeMaster';
import { zRequiredString } from '@/utils/form-validation/global';

export const stockpileMutationValidation: z.ZodType<IMutationStockpileValues> =
  z.object({
    name: zRequiredString,
    handBookId: zRequiredString,
  });

export const stockpileDomeMutationUpdateValidation: z.ZodType<IMutationUpdateStockpileDomeValues> =
  z.object({
    name: zRequiredString,
    handBookId: zRequiredString,
  });

export const stockpileDomeMutationValidation: z.ZodType<IMutationStockpileDomeValues> =
  z.object({
    domes: z
      .object({
        name: zRequiredString,
        handBookId: zRequiredString,
      })
      .array(),
  });
