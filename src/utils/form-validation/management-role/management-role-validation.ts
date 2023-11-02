import { z } from 'zod';

import { zArrayOfString, zOptionalString, zRequiredString } from '../global';

export const createRoleValidationSchema = z.object({
  name: zRequiredString,
  desc: zOptionalString,
  permissionIds: zArrayOfString.optional(),
});
