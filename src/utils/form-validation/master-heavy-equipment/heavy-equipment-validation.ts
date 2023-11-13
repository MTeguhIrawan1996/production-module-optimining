import { z } from 'zod';

import {
  zImageArrayOptional,
  zOptionalString,
  zRequiredNumberOfString,
  zRequiredString,
} from '../global';

export const createHeavyEquipmentMasterSchema = z.object({
  photos: zImageArrayOptional,
  brandId: zRequiredString,
  chassisNumber: zRequiredString,
  referenceId: zRequiredString,
  typeId: zRequiredString,
  specification: zOptionalString,
  classId: zRequiredString,
  createdYear: zRequiredNumberOfString,
  eligibilityStatusId: zRequiredString,
  engineNumber: zRequiredString,
  vehicleNumber: zOptionalString,
  vehicleNumberPhoto: zImageArrayOptional,
});
