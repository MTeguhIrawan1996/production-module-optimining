import { z } from 'zod';

import { IUpdateIsValidateSampleHouseLabValues } from '@/services/graphql/mutation/sample-house-lab/useIsValidateSampleHouseLab';
import { IMutationSampleHousePlanValues } from '@/services/restapi/sample-house-plan/useCreateSampleHousePlan';
import {
  zDateOptionalValidation,
  zDateValidation,
  zImageArrayOptional,
  zOptionalString,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const sampleHouselabStatusValidation: z.ZodType<IUpdateIsValidateSampleHouseLabValues> =
  z.object({
    statusMessage: zRequiredString,
  });

export const sampleHouseLabMutationValidation: z.ZodType<IMutationSampleHousePlanValues> =
  z.object({
    laboratoriumName: zRequiredString,
    sampleDate: zDateValidation,
    shiftId: zRequiredString,
    sampleNumber: zRequiredString,
    sampleName: zRequiredString,
    sampleTypeId: zRequiredSelectInput,
    materialId: zOptionalString.nullable(),
    subMaterialId: zOptionalString.nullable(),
    samplerId: zOptionalString.nullable(),
    gradeControlId: zOptionalString.nullable(),
    location: zOptionalString,
    sampleEnterLabDate: zDateValidation,
    sampleEnterLabTime: zOptionalString,
    gradeControlElements: z
      .object({
        elementId: zRequiredString,
        name: zRequiredString,
        value: zOptionalString,
      })
      .array(),
    density: zOptionalString,
    preparationStartDate: zDateOptionalValidation,
    preparationStartTime: zOptionalString,
    preparationFinishDate: zDateOptionalValidation,
    preparationFinishTime: zOptionalString,
    analysisStartDate: zDateOptionalValidation,
    analysisStartTime: zOptionalString,
    analysisFinishDate: zDateOptionalValidation,
    analysisFinishTime: zOptionalString,
    elements: z
      .object({
        elementId: zRequiredString,
        name: zRequiredString,
        value: zOptionalString,
      })
      .array(),
    photo: zImageArrayOptional,
  });
