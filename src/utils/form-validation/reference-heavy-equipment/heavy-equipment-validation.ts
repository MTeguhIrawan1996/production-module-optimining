import { z } from 'zod';

import {
  zImageArrayOptional,
  zRequiredNumberOfString,
  zRequiredString,
} from '../global';

export const createHeavyEquipmentSchema = z.object({
  photos: zImageArrayOptional,
  modelId: zRequiredString,
  brandId: zRequiredString,
  typeId: zRequiredString,
  spec: zRequiredString.optional().or(z.literal('')),
  createdYear: zRequiredNumberOfString,
});
