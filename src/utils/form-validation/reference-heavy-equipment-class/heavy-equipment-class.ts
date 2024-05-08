import { z } from 'zod';

import { IHeavyEquipmentClassValues } from '@/components/features/Reference/heavy-equipment-class/create/common/sections/CreateHeavyEquipmentClassBook';

import { zRequiredSelectInput, zRequiredString } from '../global';

export const classHeavyEquipmentMutationValidation: z.ZodType<IHeavyEquipmentClassValues> =
  z.object({
    name: zRequiredString,
    heavyEquipmentReference: z
      .object({
        id: zRequiredSelectInput,
      })
      .array(),
  });
