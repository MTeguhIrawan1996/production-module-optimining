import { z } from 'zod';

import {
  zImageArrayOptional,
  zOptionalNumberOfString,
  zRequiredString,
} from '../global';

export const createHeavyEquipmentSchema = z.object({
  photos: zImageArrayOptional,
  modelName: zRequiredString,
  brandId: zRequiredString,
  typeId: zRequiredString,
  spec: zRequiredString.optional().or(z.literal('')),
  modelYear: zOptionalNumberOfString,
});
