import { z } from 'zod';

import { IUpdateIsValidateSampleHouseLabValues } from '@/services/graphql/mutation/sample-house-lab/useIsValidateSampleHouseLab';
import { IMutationRitageOre } from '@/services/restapi/ritage-productions/useCreateRitageOre';
import {
  zDateValidation,
  zImageArrayOptional,
  zOptionalString,
  zRequiredNumber,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const sampleHouselabStatusValidation: z.ZodType<IUpdateIsValidateSampleHouseLabValues> =
  z.object({
    statusMessage: zRequiredString,
  });

export const ritageOreMutationValidation: z.ZodType<IMutationRitageOre> =
  z.object({
    date: zDateValidation,
    checkerFromId: zRequiredSelectInput,
    checkerFromPosition: zOptionalString,
    checkerToId: zOptionalString.nullable(),
    checkerToPosition: zOptionalString,
    shiftId: zRequiredSelectInput,
    companyHeavyEquipmentId: zRequiredSelectInput,
    materialId: zRequiredSelectInput,
    subMaterialId: zRequiredSelectInput,
    fromTime: zRequiredString,
    arriveTime: zOptionalString,
    ritageDuration: zOptionalString,
    block: zOptionalString,
    weatherId: zOptionalString.nullable(),
    fromPitId: zRequiredSelectInput,
    fromFrontId: zOptionalString.nullable(),
    fromGridId: zOptionalString.nullable(),
    fromSequenceId: zOptionalString.nullable(),
    fromElevationId: zOptionalString.nullable(),
    fromLevel: zOptionalString,
    toLevel: zOptionalString,
    stockpileId: zOptionalString.nullable(),
    domeId: zOptionalString.nullable(),
    closeDome: z.boolean(),
    bulkSamplingDensity: zRequiredNumber,
    bucketVolume: zRequiredNumber,
    tonByRitage: zOptionalString,
    sampleNumber: zOptionalString,
    desc: zOptionalString,
    photos: zImageArrayOptional,
  });
