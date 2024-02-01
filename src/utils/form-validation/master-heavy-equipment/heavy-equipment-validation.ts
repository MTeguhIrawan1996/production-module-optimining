import { z } from 'zod';

import { ICreateHeavyEquipmentMasterValues } from '@/services/restapi/heavy-equipment/useCreateHeavyEquipmentMaster';

import {
  zDateValidation,
  zImageArrayOptional,
  zOptionalString,
  zRequiredNumberOfString,
  zRequiredSelectInput,
  zRequiredString,
} from '../global';

export const createHeavyEquipmentMasterSchema: z.ZodType<ICreateHeavyEquipmentMasterValues> =
  z.object({
    photos: zImageArrayOptional,
    brandId: zRequiredString,
    chassisNumber: zRequiredString,
    referenceId: zRequiredString,
    typeId: zRequiredString,
    specification: zOptionalString,
    classId: zRequiredSelectInput,
    createdYear: zRequiredNumberOfString,
    eligibilityStatusId: zRequiredString,
    engineNumber: zRequiredString,
    vehicleNumber: zRequiredString,
    vehicleNumberPhoto: zImageArrayOptional,
  });

export const createHeavyEquipmentCompanySchema = z.object({
  hullNumber: zRequiredString,
  engineNumber: zRequiredString,
  chassisNumber: zRequiredString,
  brandId: zRequiredString,
  typeId: zRequiredString,
  referenceId: zRequiredString,
  specification: zOptionalString,
  vehicleNumber: zRequiredString,
  classId: zRequiredString,
  eligibilityStatusId: zRequiredString,
  createdYear: zRequiredNumberOfString,
  startDate: zDateValidation,
  endDate: zDateValidation.optional().nullable(),
  isStill: z.boolean(),
  vehicleNumberPhoto: zImageArrayOptional,
  photos: zImageArrayOptional,
});
