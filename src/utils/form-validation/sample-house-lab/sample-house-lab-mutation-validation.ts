import { z } from 'zod';

import { IUpdateIsValidateSampleHouseLabValues } from '@/services/graphql/mutation/sample-house-lab/useIsValidateSampleHouseLab';
import { IMutationSampleHousePlanValues } from '@/services/restapi/sample-house-plan/useCreateSampleHousePlan';
import {
  zDateOptionalValidation,
  zDateValidation,
  zImageArrayOptional,
  zOptionalNumber,
  zOptionalNumberOfString,
  zOptionalString,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const sampleHouselabStatusValidation: z.ZodType<IUpdateIsValidateSampleHouseLabValues> =
  z.object({
    statusMessage: zRequiredString,
  });

export const sampleHouseLabMutationValidation: z.ZodType<IMutationSampleHousePlanValues> =
  z
    .object({
      laboratoriumName: zRequiredString,
      sampleDate: zDateValidation,
      shiftId: zRequiredSelectInput,
      sampleNumber: zRequiredString,
      sampleName: zRequiredString,
      sampleTypeId: zRequiredSelectInput,
      materialId: zOptionalString.nullable(),
      subMaterialId: zOptionalString.nullable(),
      samplerId: zOptionalString.nullable(),
      gradeControlId: zOptionalString.nullable(),
      locationCategoryId: zOptionalString.nullable(),
      locationId: zOptionalString.nullable(),
      locationName: zOptionalString,
      sampleEnterLabDate: zDateValidation,
      sampleEnterLabTime: zRequiredString,
      gradeControlElements: z
        .object({
          elementId: zRequiredString,
          name: zRequiredString,
          value: zOptionalNumberOfString,
        })
        .array(),
      density: zOptionalNumber,
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
          value: zOptionalNumberOfString,
        })
        .array(),
      photo: zImageArrayOptional,
    })
    .superRefine((arg, ctx) => {
      const newLocationId = arg.locationId === '' ? null : arg.locationId;
      if (arg.sampleTypeId === `${process.env.NEXT_PUBLIC_SAMPLE_BULK_ID}`) {
        if (arg.density === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom, // customize your issue
            path: ['density'],
            message: 'Kolom tidak boleh kosong',
          });
        }
        return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
      }
      if (arg.locationCategoryId) {
        if (
          arg.locationCategoryId !==
            `${process.env.NEXT_PUBLIC_OTHER_LOCATION_ID}` &&
          !newLocationId
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom, // customize your issue
            path: ['locationId'],
            message: 'Kolom tidak boleh kosong',
          });
        }
        if (
          arg.locationCategoryId ===
            `${process.env.NEXT_PUBLIC_OTHER_LOCATION_ID}` &&
          arg.locationName === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom, // customize your issue
            path: ['locationName'],
            message: 'Kolom tidak boleh kosong',
          });
        }

        return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing
      }
    });
