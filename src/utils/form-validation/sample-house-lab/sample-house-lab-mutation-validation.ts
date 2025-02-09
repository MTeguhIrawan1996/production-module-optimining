import { z } from 'zod';

import { IDownloadSampleHouseLabValues } from '@/services/graphql/mutation/download/useDownloadTask';
import { IMutationSampleHousePlanValues } from '@/services/restapi/sample-house-plan/useCreateSampleHousePlan';
import {
  validatePeriod,
  zDateOptionalValidation,
  zDateValidation,
  zImageArrayOptional,
  zOptionalNumber,
  zOptionalString,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

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
          value: zOptionalNumber,
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
          value: zOptionalNumber,
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

export const downloadSampleHouseLabValidation: z.ZodType<IDownloadSampleHouseLabValues> =
  z
    .object({
      period: zRequiredSelectInput,
      startDate: zDateOptionalValidation,
      endDate: zDateOptionalValidation,
      year: zOptionalString.nullable(),
      month: zOptionalString.nullable(),
      week: zOptionalString.nullable(),
      shiftId: zOptionalString.nullable(),
      sampleTypeId: zOptionalString.nullable(),
    })
    .superRefine((arg, ctx) => {
      validatePeriod(arg, ctx);
    });
