import { IIdentityTypesRadioInputProps } from '@/components/elements/input/IdentityRadioInputRhf';
import { IMarriagaSelectInputRhfProps } from '@/components/elements/input/MarriageStatusesSelectInputRhf';
import { IProvinceSelectInputRhfProps } from '@/components/elements/input/ProvinceSelectInputRhf';
import { IRegencySelectInputRhfProps } from '@/components/elements/input/RegencySelectInputRhf';
import { IRelegionSelectInputRhfProps } from '@/components/elements/input/RelegionSelectInputRhf';
import { ISubDistrictSelectInputRhfProps } from '@/components/elements/input/SubDistrictSelectInputRhf';
import { IVillageInputRhfProps } from '@/components/elements/input/VillageSelectInputRhf';

import { ControllerProps } from '@/types/global';

export const name: ControllerProps = {
  control: 'text-input',
  name: 'name',
  label: 'name',
  withAsterisk: true,
};
export const fullname: ControllerProps = {
  control: 'text-input',
  name: 'name',
  label: 'fullname',
  withAsterisk: true,
};
export const identityNumber: ControllerProps = {
  control: 'text-input',
  name: 'identityNumber',
  label: 'identityNumber',
  withAsterisk: true,
};
export const pob: ControllerProps = {
  control: 'text-input',
  name: 'pob',
  label: 'pob',
};
export const dob: ControllerProps = {
  control: 'date-input',
  name: 'dob',
  label: 'dob',
};
export const educationDegree: ControllerProps = {
  control: 'text-input',
  name: 'educationDegree',
  label: 'educationDegree',
  colSpan: 6,
};
export const nameAlias: ControllerProps = {
  control: 'text-input',
  name: 'alias',
  label: 'nameAlias',
  withAsterisk: true,
};
export const username: ControllerProps = {
  control: 'text-input',
  name: 'username',
  label: 'username',
  withAsterisk: true,
};
export const email: ControllerProps = {
  control: 'text-input',
  name: 'email',
  label: 'email',
  withAsterisk: true,
};
export const phoneNumber: ControllerProps = {
  control: 'text-input',
  name: 'phoneNumber',
  label: 'phoneNumber',
};

export const oldPassword: ControllerProps = {
  control: 'password-input',
  name: 'oldPassword',
  label: 'oldPassword',
  withAsterisk: true,
};

export const newPassword: ControllerProps = {
  control: 'password-input',
  name: 'password',
  label: 'newPassword',
  withAsterisk: true,
};

export const newPasswordAuthUser: ControllerProps = {
  control: 'password-input',
  name: 'newPassword',
  label: 'newPassword',
  withAsterisk: true,
};

export const password: ControllerProps = {
  control: 'password-input',
  name: 'password',
  label: 'password',
  withAsterisk: true,
};
export const confirmPassword: ControllerProps = {
  control: 'password-input',
  name: 'confirmPassword',
  label: 'confirmPassword',
  withAsterisk: true,
};
export const description: ControllerProps = {
  control: 'text-input',
  name: 'desc',
  label: 'description',
};
export const contact: ControllerProps = {
  control: 'text-input',
  name: 'phoneNumber',
  label: 'contact',
  withAsterisk: true,
  colSpan: 6,
};
export const address: ControllerProps = {
  control: 'text-input',
  name: 'address',
  label: 'address',
  withAsterisk: true,
};

export const ganderRadio: ControllerProps = {
  control: 'radio-input',
  name: 'gender',
  label: 'gender',
  withAsterisk: true,
  colSpan: 6,
  radioComponent: [
    {
      label: 'Laki-laki',
      value: 'male',
    },
    {
      label: 'Perempuan',
      value: 'female',
    },
  ],
};

export const isWniRadio: ControllerProps = {
  control: 'radio-input',
  name: 'isWni',
  label: 'isWni',
  withAsterisk: true,
  colSpan: 6,
  radioComponent: [
    {
      label: 'WNI',
      value: 'true',
    },
    {
      label: 'WNA',
      value: 'false',
    },
  ],
};

export const bloodTypeSelect: ControllerProps = {
  control: 'select-input',
  name: 'bloodType',
  withAsterisk: true,
  label: 'bloodType',
  placeholder: 'chooseBloodType',
  colSpan: 6,
  data: [
    {
      label: 'A',
      value: 'A',
    },
    {
      label: 'B',
      value: 'B',
    },
    {
      label: 'AB',
      value: 'AB',
    },
    {
      label: 'O',
      value: 'O',
    },
  ],
};

export const resusSelect: ControllerProps = {
  control: 'select-input',
  name: 'resus',
  withAsterisk: true,
  label: 'resus',
  placeholder: 'chooseResus',
  colSpan: 6,
  data: [
    {
      label: '+',
      value: '+',
    },
    {
      label: '-',
      value: '-',
    },
  ],
};

export const relegionSelect = ({
  name = 'religionId',
  label = 'religion',
  searchable = true,
  clearable = true,
  colSpan = 6,
  ...rest
}: Partial<IRelegionSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'relegion-select-input',
    name,
    label,
    searchable,
    clearable,
    colSpan,
    ...rest,
  };
  return field;
};

export const marriageStatusSelect = ({
  name = 'marriageStatusId',
  label = 'marriageStatus',
  searchable = true,
  clearable = true,
  colSpan = 6,
  ...rest
}: Partial<IMarriagaSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'marriage-select-input',
    name,
    label,
    searchable,
    clearable,
    colSpan,
    ...rest,
  };
  return field;
};

export const provinceSelect = ({
  name = 'provinceId',
  label = 'province',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IProvinceSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'province-select-input',
    name,
    label,
    searchable,
    clearable,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};

export const regencySelect = ({
  name = 'regencyId',
  label = 'regency',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  provinceId,
  ...rest
}: Partial<IRegencySelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'regency-select-input',
    name,
    label,
    searchable,
    clearable,
    withAsterisk,
    colSpan,
    provinceId,
    ...rest,
  };
  return field;
};

export const subdistrictSelect = ({
  name = 'subdistrictId',
  label = 'subdistrict',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  provinceId,
  regencyId,
  ...rest
}: Partial<ISubDistrictSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'subdistrict-select-input',
    name,
    label,
    searchable,
    clearable,
    withAsterisk,
    colSpan,
    provinceId,
    regencyId,
    ...rest,
  };
  return field;
};

export const villageSelect = ({
  name = 'villageId',
  label = 'village',
  provinceId,
  regencyId,
  subdistrictId,
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IVillageInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'village-select-input',
    name,
    label,
    searchable,
    clearable,
    withAsterisk,
    colSpan,
    provinceId,
    regencyId,
    subdistrictId,
    ...rest,
  };
  return field;
};

export const identityRadio = ({
  name = 'identityTypeId',
  label = 'identityType',
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IIdentityTypesRadioInputProps>) => {
  const field: ControllerProps = {
    control: 'identity-radio-input',
    name,
    label,
    colSpan,
    withAsterisk,
    ...rest,
  };
  return field;
};
