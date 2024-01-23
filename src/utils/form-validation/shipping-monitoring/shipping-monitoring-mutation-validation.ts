import { z } from 'zod';

import { IMutationShippingMonitoringValues } from '@/services/restapi/shipping-monitoring/useCreateShippingMonitoring';
import {
  zDateOptionalValidation,
  zImageArrayOptional,
  zOptionalString,
  zRequiredSelectInput,
} from '@/utils/form-validation/global';

export const shippingMonitoringMutationValidation: z.ZodType<IMutationShippingMonitoringValues> =
  z.object({
    bargeHeavyEquipmentId: zRequiredSelectInput,
    tugboatHeavyEquipmentId: zOptionalString.nullable(),
    palkaOpenDate: zDateOptionalValidation,
    palkaOpenTime: zOptionalString,
    palkaCloseDate: zDateOptionalValidation,
    palkaCloseTime: zOptionalString,
    factoryCategoryId: zRequiredSelectInput,
    factoryId: zOptionalString.nullable(),
    vesselOpenDate: zDateOptionalValidation,
    vesselOpenTime: zOptionalString,
    vesselCloseDate: zDateOptionalValidation,
    vesselCloseTime: zOptionalString,
    desc: zOptionalString,
    photo: zImageArrayOptional,
  });
