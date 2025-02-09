import { IBrandSelectInputRhfProps } from '@/components/elements/input/BrandSelectInputRhf';
import { IClassSelectInputRhfProps } from '@/components/elements/input/ClassSelectInputRhf';
import { IDateInputProps } from '@/components/elements/input/DateInputRhf';
import { IDivisionSelectInputRhfProps } from '@/components/elements/input/DivisionSelectInputRhf';
import { IEligibilityStatusSelectInputRhfProps } from '@/components/elements/input/EligibilityStatusSelectInputRhf';
import { IEmployeeSelectInputRhfProps } from '@/components/elements/input/EmployeeSelectInputRhf';
import { IHeavyEquipmentSelectInputRhfProps } from '@/components/elements/input/HeavyEquipmentSelectInputRhf';
import { IIdentityTypesRadioInputProps } from '@/components/elements/input/IdentityRadioInputRhf';
import { IImageInputDropzoneRhfProps } from '@/components/elements/input/ImageInputDropzoneRhf';
import { IInputAverageArrayProps } from '@/components/elements/input/InputAverageArray';
import { IInputSumArrayProps } from '@/components/elements/input/InputSumArray';
import { ILocationCategorySelectInputRhfProps } from '@/components/elements/input/LocationCategorySelectInputRhf';
import { ILocationSelectInputRhfProps } from '@/components/elements/input/LocationSelectInputRhf';
import { IMarriagaSelectInputRhfProps } from '@/components/elements/input/MarriageStatusesSelectInputRhf';
import { IMaterialSelectInputRhfProps } from '@/components/elements/input/MaterialSelectInputRhf';
import { IModelSelectInputRhfProps } from '@/components/elements/input/ModelSelectInputRhf';
import { IMultipleSelectLocationRhfProps } from '@/components/elements/input/MultipleSelectLocationRhf';
import { IMultipleSelectMapLocationRhfProps } from '@/components/elements/input/MultipleSelectMapLocationRhf';
import { IMultipleSelectMaterialRhfProps } from '@/components/elements/input/MultipleSelectMaterialRhf';
import { INumberInputProps } from '@/components/elements/input/NumberInputRhf';
import { IPdfOrInputDropzoneRhfProps } from '@/components/elements/input/PdfOrImageInputDropzoneRhf';
import { IPitSelectInputRhfProps } from '@/components/elements/input/PitSelectInputRhf';
import { IPositionSelectInputRhfProps } from '@/components/elements/input/PositionSelectInputRhf';
import { IProvinceSelectInputRhfProps } from '@/components/elements/input/ProvinceSelectInputRhf';
import { IRegencySelectInputRhfProps } from '@/components/elements/input/RegencySelectInputRhf';
import { IRelegionSelectInputRhfProps } from '@/components/elements/input/RelegionSelectInputRhf';
import { ISelectActivityCategoryRhfProps } from '@/components/elements/input/SelectActivityCategoryRhf';
import { ISelectActivityFormRhfProps } from '@/components/elements/input/SelectActivityFormRhf';
import { ISelectActivityTypePlanRhfProps } from '@/components/elements/input/SelectActivityTypePlanRhf';
import { IArriveBargeRhfProps } from '@/components/elements/input/SelectArriveBargeRhf';
import { ISelectCompanyRhfProps } from '@/components/elements/input/SelectCompanyRhf';
import { ISelectFactoryRhfProps } from '@/components/elements/input/SelectFactoryRhf';
import { ISelectInputPeriodRhf } from '@/components/elements/input/SelectInputPeriodRhf';
import { ISelectInputRhfProps } from '@/components/elements/input/SelectInputRhf';
import { ISelectInputStatusRitageRhf } from '@/components/elements/input/SelectInputRitageStatusRhf';
import { ISelectMapTypeRhfProps } from '@/components/elements/input/SelectMapType';
import { ISelectMonthRhfProps } from '@/components/elements/input/SelectMonthRhf';
import { ISelectNewHeavyEquipmentReferenceRhfProps } from '@/components/elements/input/SelectNewHeavyEquipmentReferenceInputRhf';
import { ISelectWeekRhfProps } from '@/components/elements/input/SelectWeekRhf';
import { ISelectWorkingHoursPlanRhfProps } from '@/components/elements/input/SelectWorkingHoursPlanRhf';
import { ISelectYearRhfProps } from '@/components/elements/input/SelectYearRhf';
import { ISubDistrictSelectInputRhfProps } from '@/components/elements/input/SubDistrictSelectInputRhf';
import { ITextAreaInput } from '@/components/elements/input/TextAreaInputRhf';
import { ITextInputProps } from '@/components/elements/input/TextInputRhf';
import { ITimeInputRhfProps } from '@/components/elements/input/TimeInputRhf';
import { ITypeSelectInputRhfProps } from '@/components/elements/input/TypeSelectInputRhf';
import { IVillageInputRhfProps } from '@/components/elements/input/VillageSelectInputRhf';
import { IWeatherConditionSelectInputRhfProps } from '@/components/elements/input/WeatherConditionSelectInputRhf';
import { IWeatherSelectInputRhfProps } from '@/components/elements/input/WeatherSelectInputRhf';
import { IDisplayQuietNumber } from '@/components/elements/ui/DisplayQuietNumber';

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
  withAsterisk: false,
  label: 'bloodType',
  placeholder: 'chooseBloodType',
  colSpan: 6,
  clearable: true,
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
  clearable: true,
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
export const globalTextArea = ({
  name = 'globalTextArea',
  label = 'globalTextArea',
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ITextAreaInput>) => {
  const field: ControllerProps = {
    control: 'text-area-input',
    name,
    label,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};

export const globalNumberInput = ({
  name = 'globalNumberInput',
  label = 'globalNumberInput',
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<INumberInputProps>) => {
  const field: ControllerProps = {
    control: 'number-input',
    name,
    label,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};
export const displayQuietNumber = ({
  name = 'displayQuietNumber',
  label = 'displayQuietNumber',
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IDisplayQuietNumber>) => {
  const field: ControllerProps = {
    control: 'display-quiet-number',
    name,
    label,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};

export const globalInputSumArray = ({
  name = 'numberInputSum',
  label = 'numberInputSum',
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IInputSumArrayProps>) => {
  const field: ControllerProps = {
    control: 'input-sum-array',
    name,
    label,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};

export const globalInputaverageArray = ({
  name = 'numberInputaverage',
  label = 'numberInputaverage',
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IInputAverageArrayProps>) => {
  const field: ControllerProps = {
    control: 'input-average-array',
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
export const weatherConditionSelect = ({
  name = 'conditionId',
  label = 'condition',
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IWeatherConditionSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'weather-condition-select-input',
    name,
    label,
    clearable,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};

export const globalSelect = ({
  name = 'globalSelect',
  label = 'globalSelect',
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

export const globalTimeInput = ({
  name = 'timeInput',
  label = 'timeInput',
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ITimeInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'time-input',
    name,
    label,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};

export const materialSelect = ({
  name = 'materialId',
  label = 'material',
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IMaterialSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'material-select-input',
    name,
    label,
    clearable,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};

export const employeeSelect = ({
  name = 'samplerId',
  label = 'samplerName',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IEmployeeSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'employee-select-input',
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

export const heavyEquipmentSelect = ({
  name = 'companyHeavyEquipmentId',
  label = 'hullNumber',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IHeavyEquipmentSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'heavyEquipment-select-input',
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

export const weatherSelect = ({
  name = 'weatherId',
  label = 'weather',
  clearable = true,
  colSpan = 6,
  ...rest
}: Partial<IWeatherSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'weathers-select-input',
    name,
    label,
    colSpan,
    clearable,
    ...rest,
  };
  return field;
};
export const selectActivityForm = ({
  name = 'activityId',
  label = 'formsOfActivity',
  clearable = true,
  colSpan = 6,
  ...rest
}: Partial<ISelectActivityFormRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-activity-form-rhf',
    name,
    label,
    colSpan,
    clearable,
    ...rest,
  };
  return field;
};

export const pitSelect = ({
  name = 'fromPitId',
  label = 'fromPit',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IPitSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'pit-select-input',
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

export const locationSelect = ({
  name = 'fromlocationId',
  label = 'fromlocationId',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ILocationSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'location-select-input',
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

export const globalMultipleSelectLocation = ({
  name = 'locationIds',
  label = 'location',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IMultipleSelectLocationRhfProps>) => {
  const field: ControllerProps = {
    control: 'multiple-select-location',
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

export const globalMultipleSelectMapLocation = ({
  name = 'maplocationIds',
  label = 'mapLocation',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IMultipleSelectMapLocationRhfProps>) => {
  const field: ControllerProps = {
    control: 'multiple-select-map-location',
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

export const globalMultipleSelectMaterial = ({
  name = 'materialIds',
  label = 'material',
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IMultipleSelectMaterialRhfProps>) => {
  const field: ControllerProps = {
    control: 'multiple-select-material',
    name,
    label,
    clearable,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};

export const globalSelectArriveBargeRhf = ({
  name = 'destinationTypeId',
  searchable = false,
  clearable = true,
  ...rest
}: Partial<IArriveBargeRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-arrive-barge-rhf',
    name,
    searchable,
    clearable,
    ...rest,
  };
  return field;
};

export const globalSelectFactoryRhf = ({
  name = 'factoryId',
  label = 'factoryName',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ISelectFactoryRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-factory-rhf',
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

export const globalSelectReferenceRhf = ({
  name = 'referenceId',
  label = 'model',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ISelectNewHeavyEquipmentReferenceRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-new-heavy-equipment-reference-input',
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

export const globalSelectWorkingHoursPlanRhf = ({
  name = 'whpId',
  label,
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ISelectWorkingHoursPlanRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-working-hours-plan-rhf',
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

export const globalSelectActivityCategoryRhf = ({
  name = 'categoryId',
  label,
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ISelectActivityCategoryRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-activity-category-rhf',
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
export const globalSelectCompanyRhf = ({
  name = 'companyId',
  label,
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ISelectCompanyRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-company-rhf',
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
export const globalSelectYearRhf = ({
  name = 'year',
  label,
  searchable = false,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ISelectYearRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-year-rhf',
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
export const globalSelectMonthRhf = ({
  name = 'month',
  label,
  searchable = false,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ISelectMonthRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-month-rhf',
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
export const globalSelectWeekRhf = ({
  name = 'week',
  label,
  searchable = false,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  stateKey = 'weekRhf',
  ...rest
}: Partial<ISelectWeekRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-week-rhf',
    name,
    label,
    searchable,
    clearable,
    withAsterisk,
    colSpan,
    stateKey,
    ...rest,
  };
  return field;
};

export const globalSelectMapTypeRhf = ({
  name = 'typeId',
  label,
  searchable = false,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ISelectMapTypeRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-mapType-rhf',
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

export const globalSelectActivityTypePlanRhf = ({
  name = 'activityTypeId',
  label,
  searchable = false,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ISelectActivityTypePlanRhfProps>) => {
  const field: ControllerProps = {
    control: 'select-activity-type-plan-rhf',
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
export const globalSelectPeriodRhf = ({
  name = 'period',
  label,
  searchable = false,
  clearable = true,
  colSpan = 6,
  ...rest
}: Partial<ISelectInputPeriodRhf>) => {
  const field: ControllerProps = {
    control: 'select-period-rhf',
    name,
    label,
    searchable,
    clearable,
    colSpan,
    ...rest,
  };
  return field;
};
export const globalSelectRitageStatusRhf = ({
  name = 'ritageStatus',
  label,
  searchable = false,
  clearable = true,
  colSpan = 6,
  ...rest
}: Partial<ISelectInputStatusRitageRhf>) => {
  const field: ControllerProps = {
    control: 'select-status-ritage-rhf',
    name,
    label,
    searchable,
    clearable,
    colSpan,
    ...rest,
  };
  return field;
};

export const globalDropzonePdfOrImageRhf = ({
  name = 'uploadFile',
  label,
  withAsterisk = true,
  colSpan = 6,
  maxSize = 10 * 1024 ** 2,
  multiple = false,
  onDrop = () => {},
  onReject = () => {},
  ...rest
}: Partial<IPdfOrInputDropzoneRhfProps>) => {
  const field: ControllerProps = {
    control: 'pdf-image-dropzone',
    name,
    label,
    withAsterisk,
    colSpan,
    maxSize,
    multiple,
    onDrop,
    onReject,
    ...rest,
  };
  return field;
};

export const globalDropzoneImageRhf = ({
  name = 'uploadFile',
  label,
  withAsterisk = true,
  colSpan = 6,
  maxSize = 10 * 1024 ** 2,
  multiple = false,
  onDrop = () => {},
  onReject = () => {},
  ...rest
}: Partial<IImageInputDropzoneRhfProps>) => {
  const field: ControllerProps = {
    control: 'image-dropzone',
    name,
    label,
    withAsterisk,
    colSpan,
    maxSize,
    multiple,
    onDrop,
    onReject,
    ...rest,
  };
  return field;
};
