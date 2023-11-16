import { IBrandSelectInputRhfProps } from '@/components/elements/input/BrandSelectInputRhf';
import { IClassSelectInputRhfProps } from '@/components/elements/input/ClassSelectInputRhf';
import { IDateInputProps } from '@/components/elements/input/DateInputRhf';
import { IDivisionSelectInputRhfProps } from '@/components/elements/input/DivisionSelectInputRhf';
import { IEligibilityStatusSelectInputRhfProps } from '@/components/elements/input/EligibilityStatusSelectInputRhf';
import { IIdentityTypesRadioInputProps } from '@/components/elements/input/IdentityRadioInputRhf';
import { ILocationCategorySelectInputRhfProps } from '@/components/elements/input/LocationCategorySelectInputRhf';
import { IMarriagaSelectInputRhfProps } from '@/components/elements/input/MarriageStatusesSelectInputRhf';
import { IModelSelectInputRhfProps } from '@/components/elements/input/ModelSelectInputRhf';
import { IPositionSelectInputRhfProps } from '@/components/elements/input/PositionSelectInputRhf';
import { IProvinceSelectInputRhfProps } from '@/components/elements/input/ProvinceSelectInputRhf';
import { IRegencySelectInputRhfProps } from '@/components/elements/input/RegencySelectInputRhf';
import { IRelegionSelectInputRhfProps } from '@/components/elements/input/RelegionSelectInputRhf';
import { ISelectInputRhfProps } from '@/components/elements/input/SelectInputRhf';
import { ISubDistrictSelectInputRhfProps } from '@/components/elements/input/SubDistrictSelectInputRhf';
import { ITextInputProps } from '@/components/elements/input/TextInputRhf';
import { ITypeSelectInputRhfProps } from '@/components/elements/input/TypeSelectInputRhf';
import { IVillageInputRhfProps } from '@/components/elements/input/VillageSelectInputRhf';

import { ControllerProps } from '@/types/global';

export const name: ControllerProps = {
  control: 'text-input',
  name: 'name',
  label: 'name',
  withAsterisk: true,
};
export const nip: ControllerProps = {
  control: 'text-input',
  name: 'nip',
  label: 'nip',
  colSpan: 6,
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
  withAsterisk: false,
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

export const divisionSelect = ({
  name = 'divisionId',
  label = 'division',
  searchable = true,
  clearable = true,
  data = [],
  nothingFound = null,
  ...rest
}: Partial<ISelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-input',
    name,
    label,
    searchable,
    clearable,
    data,
    nothingFound,
    ...rest,
  };
  return field;
};

export const positionSelect = ({
  name = 'positionId',
  label = 'position',
  searchable = true,
  clearable = true,
  data = [],
  nothingFound = null,
  ...rest
}: Partial<ISelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-input',
    name,
    label,
    searchable,
    clearable,
    data,
    nothingFound,
    ...rest,
  };
  return field;
};

export const positionSelectRhf = ({
  name = 'positionId',
  label = 'position',
  searchable = true,
  clearable = true,
  nothingFound = null,
  ...rest
}: Partial<IPositionSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'position-select-input',
    name,
    label,
    searchable,
    clearable,
    nothingFound,
    ...rest,
  };
  return field;
};

export const divisionSelectRhf = ({
  name = 'divisionId',
  label = 'division',
  searchable = true,
  clearable = true,
  nothingFound = null,
  ...rest
}: Partial<IDivisionSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'division-select-input',
    name,
    label,
    searchable,
    clearable,
    nothingFound,
    ...rest,
  };
  return field;
};

export const employeStatusSelect = ({
  name = 'statusId',
  label = 'employeStatus',
  searchable = false,
  clearable = true,
  data = [],
  ...rest
}: Partial<ISelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-input',
    name,
    label,
    searchable,
    clearable,
    data,
    ...rest,
  };
  return field;
};
export const formStatusSelect = ({
  name = 'formStatusId',
  label = 'formStatus',
  searchable = false,
  clearable = true,
  data = [],
  ...rest
}: Partial<ISelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-input',
    name,
    label,
    searchable,
    clearable,
    data,
    ...rest,
  };
  return field;
};

export const globalDate = ({
  name = 'globalDate',
  label = 'globalDate',
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IDateInputProps>) => {
  const field: ControllerProps = {
    control: 'date-input',
    name,
    label,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};
export const globalText = ({
  name = 'globalTextinput',
  label = 'globalTextinput',
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ITextInputProps>) => {
  const field: ControllerProps = {
    control: 'text-input',
    name,
    label,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};

export const brandSelect = ({
  name = 'brandId',
  label = 'brand',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IBrandSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'brand-select-input',
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
export const typeSelect = ({
  name = 'typeId',
  label = 'type',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ITypeSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'type-select-input',
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
export const modelSelect = ({
  name = 'modelId',
  label = 'model',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IModelSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'model-select-input',
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
export const classSelect = ({
  name = 'classId',
  label = 'class',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IClassSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'class-select-input',
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
export const eligibilityStatusSelect = ({
  name = 'eligibilityStatusId',
  label = 'eligibilityStatus',
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IEligibilityStatusSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'eligibilityStatus-select-input',
    name,
    label,
    clearable,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};
export const locationCategorySelect = ({
  name = 'categoryId',
  label = 'locationCategory',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ILocationCategorySelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'location-category-select-input',
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
