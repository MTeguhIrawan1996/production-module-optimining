import { z } from 'zod';

import { zArrayOfString, zRequiredString } from '../global';

export const createHeavyEquipmentClassSchema = z.object({
  name: zRequiredString,
  heavyEquipmentReferenceIds: zArrayOfString.min(1, {
    message: 'Pilih minimal 1 jenis',
  }),
});
