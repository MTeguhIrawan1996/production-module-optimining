import { z } from 'zod';

import {
  zDateOptionalValidation,
  zDateValidation,
  zImageArrayOptional,
  zOptionalNumberOfString,
  zOptionalString,
  zRequiredSelectInput,
  zRequiredString,
} from '@/utils/form-validation/global';

export const stockpileMonitoringMutationValidation: z.ZodType<any> = z.object({
  stockpileId: zRequiredSelectInput,
  handbookId: zOptionalString,
  domeId: zRequiredSelectInput,
  oreSubMaterialId: zRequiredSelectInput,
  openDate: zDateValidation,
  openTime: zOptionalString,
  closeDate: zDateValidation,
  closeTime: zOptionalString,
  desc: zOptionalString,
  photo: zImageArrayOptional,
  // tonSurveys: z.object({
  //   ton: zOptionalString,
  //   date: zDateValidation,
  // }).array()
  // bargingStartDate?: Date | null;
  // bargingStartTime: string;
  // bargingFinishDate?: Date | null;
  // bargingFinishTime: string;
  // movings: {
  //   startDate?: Date | null;
  //   startTime: string;
  //   finishDate?: Date | null;
  //   finishTime: string;
  // }[];
  // reopens: {
  //   openDate?: Date | null;
  //   openTime: string;
  //   closeDate?: Date | null;
  //   closeTime: string;
  // }[];
  samples: z
    .object({
      date: zDateOptionalValidation,
      sampleTypeId: zOptionalString.nullable(),
      sampleNumber: zOptionalString,
      elements: z
        .object({
          elementId: zRequiredString,
          name: zRequiredString,
          value: zOptionalNumberOfString,
        })
        .array(),
    })
    .array(),
});
