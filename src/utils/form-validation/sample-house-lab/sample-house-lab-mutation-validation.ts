import { z } from 'zod';

import { IUpdateIsValidateSampleHouseLabValues } from '@/services/graphql/mutation/sample-house-lab/useIsValidateSampleHouseLab';
import { zRequiredString } from '@/utils/form-validation/global';

export const sampleHouselabMutationValidation: z.ZodType<IUpdateIsValidateSampleHouseLabValues> =
  z.object({
    statusMessage: zRequiredString,
  });
