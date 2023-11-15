import { IBussinessTypesSelectInputRhfProps } from '@/components/elements/input/BussinessTypeSelectInputRhf';
import { ICompanyPermissionTypesSelectInputRhfProps } from '@/components/elements/input/CompanyPermissionTypeSelectInputRhf';
import { ICompanyTypesSelectInputRhfProps } from '@/components/elements/input/CompanyTypeSelectInputRhf';

import { ControllerProps } from '@/types/global';

export const companyTypesSelact = ({
  name = 'typeId',
  label = 'companyType',
  clearable = true,
  colSpan = 6,
  ...rest
}: Partial<ICompanyTypesSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'company-types-select-input',
    name,
    label,
    clearable,
    colSpan,
    ...rest,
  };
  return field;
};

export const businessTypesSelact = ({
  name = 'businessTypeId',
  label = 'businessType',
  clearable = true,
  colSpan = 6,
  ...rest
}: Partial<IBussinessTypesSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'bussiness-types-select-input',
    name,
    label,
    clearable,
    colSpan,
    ...rest,
  };
  return field;
};
export const companyPermissionTypesSelact = ({
  name = 'permissionTypeId',
  label = 'companyPermissionType',
  clearable = true,
  colSpan = 6,
  ...rest
}: Partial<ICompanyPermissionTypesSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'company-permission-types-select-input',
    name,
    label,
    clearable,
    colSpan,
    ...rest,
  };
  return field;
};
