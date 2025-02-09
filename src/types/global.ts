import { CheckboxProps, PaperProps } from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import { AxiosError } from 'axios';
import { GraphQLErrorExtensions } from 'graphql';

import { IPrimaryButtonProps } from '@/components/elements/button/PrimaryButton';
import { IBrandSelectInputRhfProps } from '@/components/elements/input/BrandSelectInputRhf';
import { IBussinessTypesSelectInputRhfProps } from '@/components/elements/input/BussinessTypeSelectInputRhf';
import { ICheckboxGroupAccessProps } from '@/components/elements/input/CheckboxGroupAccess';
import { IClassSelectInputRhfProps } from '@/components/elements/input/ClassSelectInputRhf';
import { ICompanyPermissionTypesSelectInputRhfProps } from '@/components/elements/input/CompanyPermissionTypeSelectInputRhf';
import { ICompanyTypesSelectInputRhfProps } from '@/components/elements/input/CompanyTypeSelectInputRhf';
import { IDateInputNativeProps } from '@/components/elements/input/DateInputNative';
import { IDateInputProps } from '@/components/elements/input/DateInputRhf';
import { IDivisionSelectInputRhfProps } from '@/components/elements/input/DivisionSelectInputRhf';
import { IDomeNameSelectInputRhfProps } from '@/components/elements/input/DomeNameSelectInputRhf';
import { IEligibilityStatusSelectInputRhfProps } from '@/components/elements/input/EligibilityStatusSelectInputRhf';
import { IEmployeeSelectInputRhfProps } from '@/components/elements/input/EmployeeSelectInputRhf';
import { IExcelInputDropzoneRhfProps } from '@/components/elements/input/ExcelInputDropzoneRhf';
import { IHeavyEquipmentSelectInputRhfProps } from '@/components/elements/input/HeavyEquipmentSelectInputRhf';
import { IIdentityTypesRadioInputProps } from '@/components/elements/input/IdentityRadioInputRhf';
import { IImageInputDropzoneRhfProps } from '@/components/elements/input/ImageInputDropzoneRhf';
import { IInputAverageArrayProps } from '@/components/elements/input/InputAverageArray';
import { IInputSumArrayProps } from '@/components/elements/input/InputSumArray';
import { ILocationCategorySelectInputRhfProps } from '@/components/elements/input/LocationCategorySelectInputRhf';
import { ILocationNativeProps } from '@/components/elements/input/LocationSelectInputNative';
import { ILocationSelectInputRhfProps } from '@/components/elements/input/LocationSelectInputRhf';
import { IMarriagaSelectInputRhfProps } from '@/components/elements/input/MarriageStatusesSelectInputRhf';
import { IMaterialSelectInputRhfProps } from '@/components/elements/input/MaterialSelectInputRhf';
import { IModelSelectInputRhfProps } from '@/components/elements/input/ModelSelectInputRhf';
import { IMultipleSelectLocationRhfProps } from '@/components/elements/input/MultipleSelectLocationRhf';
import { IMultipleSelectMapLocationRhfProps } from '@/components/elements/input/MultipleSelectMapLocationRhf';
import { IMultipleSelectMaterialRhfProps } from '@/components/elements/input/MultipleSelectMaterialRhf';
import { INumberInputProps } from '@/components/elements/input/NumberInputRhf';
import { INumberInputTableRhfProps } from '@/components/elements/input/NumberInputTableRhf';
import { IPasswordInputProps } from '@/components/elements/input/PasswordInputRhf';
import { IPdfInputDropzoneRhfProps } from '@/components/elements/input/PdfInputDropzoneRhf';
import { IPdfOrInputDropzoneRhfProps } from '@/components/elements/input/PdfOrImageInputDropzoneRhf';
import { IPitSelectInputRhfProps } from '@/components/elements/input/PitSelectInputRhf';
import { IPositionSelectInputRhfProps } from '@/components/elements/input/PositionSelectInputRhf';
import { IProvinceSelectInputRhfProps } from '@/components/elements/input/ProvinceSelectInputRhf';
import { IRadioInputProps } from '@/components/elements/input/RadioInputRhf';
import { IRegencySelectInputRhfProps } from '@/components/elements/input/RegencySelectInputRhf';
import { IRelegionSelectInputRhfProps } from '@/components/elements/input/RelegionSelectInputRhf';
import { ISampleTypesSelectnputRhfProps } from '@/components/elements/input/SampleTypeSelectInputRhf';
import { ISelectActivityCategoryRhfProps } from '@/components/elements/input/SelectActivityCategoryRhf';
import { ISelectActivityFormRhfProps } from '@/components/elements/input/SelectActivityFormRhf';
import { ISelectActivityTypePlanRhfProps } from '@/components/elements/input/SelectActivityTypePlanRhf';
import { IArriveBargeNativeProps } from '@/components/elements/input/SelectArriveBargeNative';
import { IArriveBargeRhfProps } from '@/components/elements/input/SelectArriveBargeRhf';
import { ICompanyNativeProps } from '@/components/elements/input/SelectCompanyNative';
import { ISelectCompanyRhfProps } from '@/components/elements/input/SelectCompanyRhf';
import { ISelectFactoryRhfProps } from '@/components/elements/input/SelectFactoryRhf';
import { ISelectHeavyEquipmentNativeProps } from '@/components/elements/input/SelectHeavyEquipmentNative';
import { ISelectMaterialNativeProps } from '@/components/elements/input/SelectInputMaterialNative';
import { ISelectInputNativeProps } from '@/components/elements/input/SelectInputNative';
import { ISelectInputPeriodNatvie } from '@/components/elements/input/SelectInputPeriodNative';
import { ISelectInputPeriodRhf } from '@/components/elements/input/SelectInputPeriodRhf';
import { ISelectInputQuarterNatvie } from '@/components/elements/input/SelectInputQuarterNative';
import { ISelectInputRhfProps } from '@/components/elements/input/SelectInputRhf';
import { ISelectInputRitageStatusNatvie } from '@/components/elements/input/SelectInputRitageStatusNative';
import { ISelectInputStatusRitageRhf } from '@/components/elements/input/SelectInputRitageStatusRhf';
import { ISelectInputSampleTypeNativeProps } from '@/components/elements/input/SelectInputSampleTypeNative';
import { ISelectShiftNativeProps } from '@/components/elements/input/SelectInputShiftNative';
import { ISelectMapTypeRhfProps } from '@/components/elements/input/SelectMapType';
import { ISelectMonthNativeProps } from '@/components/elements/input/SelectMonthNative';
import { ISelectMonthRhfProps } from '@/components/elements/input/SelectMonthRhf';
import { ISelectNewHeavyEquipmentReferenceRhfProps } from '@/components/elements/input/SelectNewHeavyEquipmentReferenceInputRhf';
import { IStatusNativeProps } from '@/components/elements/input/SelectStatusNative';
import { ISelectWeekNativeProps } from '@/components/elements/input/SelectWeekNative';
import { ISelectWeekRhfProps } from '@/components/elements/input/SelectWeekRhf';
import { ISelectWorkingHoursPlanRhfProps } from '@/components/elements/input/SelectWorkingHoursPlanRhf';
import { ISelectYearNativeProps } from '@/components/elements/input/SelectYearNative';
import { ISelectYearRhfProps } from '@/components/elements/input/SelectYearRhf';
import { IShiftSelectInputRhfProps } from '@/components/elements/input/ShiftSelectInputRhf';
import { IStockpileNameSelectInputRhfProps } from '@/components/elements/input/StockpileNameSelectInputRhf';
import { ISubDistrictSelectInputRhfProps } from '@/components/elements/input/SubDistrictSelectInputRhf';
import { ITextAreaInput } from '@/components/elements/input/TextAreaInputRhf';
import { ITextInputProps } from '@/components/elements/input/TextInputRhf';
import { ITimeInputRhfProps } from '@/components/elements/input/TimeInputRhf';
import { ITypeSelectInputRhfProps } from '@/components/elements/input/TypeSelectInputRhf';
import { IVillageInputRhfProps } from '@/components/elements/input/VillageSelectInputRhf';
import { IWeatherConditionSelectInputRhfProps } from '@/components/elements/input/WeatherConditionSelectInputRhf';
import { IWeatherSelectInputRhfProps } from '@/components/elements/input/WeatherSelectInputRhf';
import { IDisplayQuietNumber } from '@/components/elements/ui/DisplayQuietNumber';

import { IHeavyEquipmentCompany } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentCompany';
import { IEmployeesData } from '@/services/graphql/query/master-data-company/useReadAllEmploye';
import { IMaterialsData } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { IShiftsData } from '@/services/graphql/query/shift/useReadAllShiftMaster';

export type CommonProps = {
  colSpan?: number;
};

export type IElementRhf = {
  elementId: string;
  name: string;
  value: string | number;
};

export type IDate = Date | undefined | string | null;

// Controller Field
export type ControllerProps =
  | ITextInputProps
  | ITextAreaInput
  | ISelectInputRhfProps
  | IPasswordInputProps
  | IImageInputDropzoneRhfProps
  | IPdfInputDropzoneRhfProps
  | IPdfOrInputDropzoneRhfProps
  | IExcelInputDropzoneRhfProps
  | INumberInputProps
  | IRadioInputProps
  | IRelegionSelectInputRhfProps
  | IMarriagaSelectInputRhfProps
  | IProvinceSelectInputRhfProps
  | IRegencySelectInputRhfProps
  | ISubDistrictSelectInputRhfProps
  | IVillageInputRhfProps
  | IIdentityTypesRadioInputProps
  | IPositionSelectInputRhfProps
  | IDivisionSelectInputRhfProps
  | IBrandSelectInputRhfProps
  | ITypeSelectInputRhfProps
  | IModelSelectInputRhfProps
  | IClassSelectInputRhfProps
  | IEligibilityStatusSelectInputRhfProps
  | ICompanyTypesSelectInputRhfProps
  | IBussinessTypesSelectInputRhfProps
  | ICompanyPermissionTypesSelectInputRhfProps
  | ILocationCategorySelectInputRhfProps
  | ITimeInputRhfProps
  | IStockpileNameSelectInputRhfProps
  | IDomeNameSelectInputRhfProps
  | IShiftSelectInputRhfProps
  | ISampleTypesSelectnputRhfProps
  | IMaterialSelectInputRhfProps
  | IEmployeeSelectInputRhfProps
  | IDateInputProps
  | IHeavyEquipmentSelectInputRhfProps
  | IWeatherSelectInputRhfProps
  | ILocationSelectInputRhfProps
  | IPitSelectInputRhfProps
  | IArriveBargeRhfProps
  | ISelectFactoryRhfProps
  | ISelectNewHeavyEquipmentReferenceRhfProps
  | ISelectWorkingHoursPlanRhfProps
  | ISelectActivityCategoryRhfProps
  | ISelectCompanyRhfProps
  | ISelectYearRhfProps
  | ISelectWeekRhfProps
  | INumberInputTableRhfProps
  | IInputSumArrayProps
  | IInputAverageArrayProps
  | ISelectActivityFormRhfProps
  | IMultipleSelectLocationRhfProps
  | IMultipleSelectMaterialRhfProps
  | IDisplayQuietNumber
  | ISelectMonthRhfProps
  | IWeatherConditionSelectInputRhfProps
  | ISelectMapTypeRhfProps
  | ISelectActivityTypePlanRhfProps
  | IMultipleSelectMapLocationRhfProps
  | ISelectInputPeriodRhf
  | ISelectInputStatusRitageRhf;

export type InputControllerNativeProps =
  | IDateInputNativeProps
  | ISelectInputNativeProps
  | ISelectYearNativeProps
  | ISelectMonthNativeProps
  | IArriveBargeNativeProps
  | ISelectHeavyEquipmentNativeProps
  | IStatusNativeProps
  | ICompanyNativeProps
  | ISelectWeekNativeProps
  | ISelectInputQuarterNatvie
  | ILocationNativeProps
  | ISelectInputPeriodNatvie
  | ISelectShiftNativeProps
  | ISelectMaterialNativeProps
  | ISelectInputRitageStatusNatvie
  | ISelectInputSampleTypeNativeProps;

export type ControllerGroup = {
  group: string;
  formControllers: ControllerProps[];
  enableGroupLabel?: boolean;
  groupCheckbox?: CheckboxProps;
  paperProps?: PaperProps;
  actionGroup?: {
    addButton?: IPrimaryButtonProps;
    deleteButton?: IPrimaryButtonProps;
  };
  actionOuterGroup?: {
    addButton?: IPrimaryButtonProps;
    updateButton?: IPrimaryButtonProps;
    deleteButton?: IPrimaryButtonProps;
  };
  actionOuterGroupBottom?: {
    addButton?: IPrimaryButtonProps;
    updateButton?: IPrimaryButtonProps;
    deleteButton?: IPrimaryButtonProps;
  };
  renderItem?: () => React.ReactNode;
};

export type ControllerCheckBoxGroup<T> = {
  name: keyof T;
} & Omit<ICheckboxGroupAccessProps, 'name'>;

// Auhtentication
export interface IPermissionAuth {
  id: string;
  slug: string;
}

export type IErrorResponseExtensionNextAuth = {
  code: string;
  originalError: {
    statusCode: number;
    message: string;
    error: string;
  };
};

// RESPONSE REQUEST GRAPHQL
export interface IMeta {
  currentPage: number | null;
  totalPage: number | null;
  totalData: number | null;
  totalAllData: number | null;
}

export interface IFile {
  id: string;
  path: string;
  fileName: string;
  url: string;
  originalFileName: string;
  mime: string;
}

export interface GResponse<T> {
  meta: IMeta;
  data: T[];
}

export interface IGlobalMetaRequest {
  page: number | null;
  limit: number | null;
  search: string | null;
  orderBy: string | null;
  orderDir: string | null;
}

export type IChildren<T> = {
  property: keyof T;
  children: IChildren<T>[];
  constraints: {
    [type: string]: string;
  };
};

export interface IExtensionKey<T> extends GraphQLErrorExtensions {
  code: string;
  originalError: {
    errors: {
      property: keyof T;
      children: IChildren<T>[];
      constraints: {
        [type: string]: string;
      };
    }[];
  };
}

export type IErrorResponseExtensionGql<T = unknown> = IExtensionKey<T>;
// END RESPONSE REQUEST GRAPHQL

// REST API
export interface ErrorValidationMessage<T> {
  property: keyof T;
  children: IChildren<T>[];
  constraints: {
    [type: string]: string;
  };
}

export interface RestErrorResponse<T> {
  statusCode: number;
  errors: ErrorValidationMessage<T>[];
  message: string;
}

export type AxiosRestErrorResponse<T> = AxiosError<RestErrorResponse<T>>;

export type IProvinceDetail = {
  province: {
    id: string;
    name: string;
  } | null;
  regency: {
    id: string;
    name: string;
  } | null;
  district: {
    id: string;
    name: string;
  } | null;
  village: {
    id: string;
    name: string;
  } | null;
  address: string;
};

export type IDomicileProvinceDetail = {
  domicileProvince: {
    id: string;
    name: string;
  } | null;
  domicileRegency: {
    id: string;
    name: string;
  } | null;
  domicileDistrict: {
    id: string;
    name: string;
  } | null;
  domicileVillage: {
    id: string;
    name: string;
  } | null;
  domicileAddress: string | null;
};

export interface IElementsData {
  id: string;
  name: string;
}

export interface IElementWithValue {
  value: number | null;
  element: IElementsData | null;
}

export interface IStatus {
  id: string;
  name: string;
  color: string;
}

export interface IUpdateStatusValues {
  statusMessage: string | null;
}

/* #   /**=========== Ritage DT =========== */
export interface IDumpTruckRitagesData {
  date: Date | string | null;
  companyHeavyEquipment: {
    id: string;
    hullNumber: string;
  } | null;
  shift: {
    id: string;
    name: string;
  } | null;
  operators: string[];
  ritageCount: number | null;
  tonByRitage: number | null;
}

export interface IDumpTruckRitagesRequest
  extends Partial<Omit<IGlobalMetaRequest, 'search'>> {
  date?: string | null;
}

export type IListDetailRitageDTData<T = unknown> = {
  id: string;
  shift: Pick<IShiftsData, 'id' | 'name'> | null;
  weather: {
    id: string;
    name: string;
  } | null;
  fromAt: Date | string | null;
  arriveAt: Date | string | null;
  duration: number | null;
  material: Pick<IMaterialsData, 'id' | 'name'> | null;
  subMaterial: Pick<IMaterialsData, 'id' | 'name'> | null;
  bucketVolume: number | null;
  tonByRitage: number | null;
  desc: string | null;
} & T;

export interface IReadOneRitageDTOperators {
  date: Date | string | null;
  companyHeavyEquipment: {
    id: string;
    hullNumber: string;
  } | null;
  shift: {
    id: string;
    name: string;
  } | null;
  operators: string[] | null;
}
/* #endregion  /**======== Ritage DT =========== */

export type ITabs = 'ore' | 'ob' | 'quarry' | 'barging' | 'moving' | 'topsoil';

export type ITab = string;

export interface ICreateFileProps {
  file: FileWithPath[] | null;
}

/* #   /**=========== Common Ritages =========== */
export type ICommonRitagesData<T = unknown> = {
  id: string;
  date: Date | string | null;
  shift: Pick<IShiftsData, 'id' | 'name'> | null;
  companyHeavyEquipment: Pick<
    IHeavyEquipmentCompany,
    'id' | 'hullNumber'
  > | null;
  fromAt: Date | string | null;
  arriveAt: Date | string | null;
  subMaterial: Pick<IMaterialsData, 'id' | 'name'> | null;
  status: IStatus | null;
  isComplete: boolean;
  isRitageProblematic: boolean;
} & T;

type IChecker = {
  id: string;
} & Pick<IEmployeesData, 'humanResource'>;

export type IReadOneRitage<T = unknown> = {
  id: string;
  date: string | null;
  checkerFrom: IChecker | null;
  checkerFromPosition: string | null;
  checkerTo: IChecker | null;
  checkerToPosition: string | null;
  shift: Pick<IShiftsData, 'id' | 'name'> | null;
  companyHeavyEquipment: Pick<
    IHeavyEquipmentCompany,
    'id' | 'hullNumber'
  > | null;
  companyHeavyEquipmentChange: Pick<
    IHeavyEquipmentCompany,
    'id' | 'hullNumber'
  > | null;
  material: Pick<IMaterialsData, 'id' | 'name'> | null;
  subMaterial: Pick<IMaterialsData, 'id' | 'name'> | null;
  fromAt: Date | string | null;
  arriveAt: Date | string | null;
  duration: number | null;
  weather: {
    id: string;
    name: string;
  } | null;
  bucketVolume: number | null;
  bulkSamplingDensity: number | null;
  tonByRitage: number | null;
  desc: string | null;
  photos: Omit<IFile, 'mime' | 'path'>[] | null;
  status: IStatus | null;
  statusMessage: string | null;
  isRitageProblematic: boolean;
} & T;

/* #endregion  /**======== Common Ritages =========== */

/* #   /**=========== GroupingDetail =========== */

export interface IGroupingDetail {
  group: string;
  enableTitle?: boolean;
  withDivider?: boolean;
  itemValue: {
    name: string;
    value?: string | null;
  }[];
}

/* #endregion  /**======== GroupingDetail =========== */

/* #   /**=========== ReadOneType =========== */

export type IReadOneValueMapping<K, V> = {
  key: K;
  value: V;
};

/* #endregion  /**======== ReadOneType =========== */

export interface IMutationCountFormula {
  parameters: {
    categoryId: string | null;
    operator?: string | null;
    order?: number | '';
  }[];
}

export interface IReadFormulaParameter {
  id: string;
  order: number;
  operator: string | null;
  category: {
    id: string;
    name: string;
  };
}

export interface ISelectData {
  label: string;
  value: string;
}

export interface IGlobalTimeFIlter {
  startDate: string | null;
  endDate: string;
  year: number;
  week: number;
  month: number;
}
