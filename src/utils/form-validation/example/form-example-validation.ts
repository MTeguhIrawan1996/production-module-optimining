import { z } from 'zod';

import {
  zDateValidation,
  zFileRequired,
  zImageRequired,
  zRequiredNumber,
  zRequiredString,
} from '../global';

export const formExamplevalidation = z.object({
  exampleTextInput: zRequiredString,
  exampleSelectInput: zRequiredString,
  exampleFileInput: zFileRequired,
  exampleImageInput: zImageRequired,
  exampleNumberInput: zRequiredNumber,
  exampleRadioInput: zRequiredString,
  exampleDateInput: zDateValidation,
});
