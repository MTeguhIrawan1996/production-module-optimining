import { CheckboxProps } from '@mantine/core';
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
import { IHeavyEquipmentSelectInputRhfProps } from '@/components/elements/input/HeavyEquipmentSelectInputRhf';
import { IIdentityTypesRadioInputProps } from '@/components/elements/input/IdentityRadioInputRhf';
import { IImageInputDropzoneRhfProps } from '@/components/elements/input/ImageInputDropzoneRhf';
import { ILocationCategorySelectInputRhfProps } from '@/components/elements/input/LocationCategorySelectInputRhf';
import { ILocationSelectInputRhfProps } from '@/components/elements/input/LocationSelectInputRhf';
import { IMarriagaSelectInputRhfProps } from '@/components/elements/input/MarriageStatusesSelectInputRhf';
import { IMaterialSelectnputRhfProps } from '@/components/elements/input/MaterialSelectInputRhf';
import { IModelSelectInputRhfProps } from '@/components/elements/input/ModelSelectInputRhf';
import { INumberInputProps } from '@/components/elements/input/NumberInputRhf';
import { IPasswordInputProps } from '@/components/elements/input/PasswordInputRhf';
import { IPdfInputDropzoneRhfProps } from '@/components/elements/input/PdfInputDropzoneRhf';
import { IPitSelectInputRhfProps } from '@/components/elements/input/PitSelectInputRhf';
import { IPositionSelectInputRhfProps } from '@/components/elements/input/PositionSelectInputRhf';
import { IProvinceSelectInputRhfProps } from '@/components/elements/input/ProvinceSelectInputRhf';
import { IRadioInputProps } from '@/components/elements/input/RadioInputRhf';
import { IRegencySelectInputRhfProps } from '@/components/elements/input/RegencySelectInputRhf';
import { IRelegionSelectInputRhfProps } from '@/components/elements/input/RelegionSelectInputRhf';
import { ISampleTypesSelectnputRhfProps } from '@/components/elements/input/SampleTypeSelectInputRhf';
import { ISelectHeavyEquipmentReferenceInputProps } from '@/components/elements/input/SelectHeavyEquipmentReferenceInput';
import { ISelectHeavyEquipmentTypesInputProps } from '@/components/elements/input/SelectHeavyEquipmentTypesInput';
import { ISelectInputRhfProps } from '@/components/elements/input/SelectInputRhf';
import { IShiftSelectInputRhfProps } from '@/components/elements/input/ShiftSelectInputRhf';
import { IStockpileNameSelectInputRhfProps } from '@/components/elements/input/StockpileNameSelectInputRhf';
import { ISubDistrictSelectInputRhfProps } from '@/components/elements/input/SubDistrictSelectInputRhf';
import { ITextInputProps } from '@/components/elements/input/TextInputRhf';
import { ITimeInputRhfProps } from '@/components/elements/input/TimeInputRhf';
import { ITypeSelectInputRhfProps } from '@/components/elements/input/TypeSelectInputRhf';
import { IVillageInputRhfProps } from '@/components/elements/input/VillageSelectInputRhf';
import { IWeatherSelectInputRhfProps } from '@/components/elements/input/WeatherSelectInputRhf';

// import { TablerIconsProps } from '@tabler/icons-react';

export type CommonProps = {
  colSpan?: number;
};

export type IDate = Date | undefined | string | null;

// Controller Field
export type ControllerProps =
  | ITextInputProps
  | ISelectInputRhfProps
  | IPasswordInputProps
  | IImageInputDropzoneRhfProps
  | IPdfInputDropzoneRhfProps
  | INumberInputProps
  | IRadioInputProps
  | ISelectHeavyEquipmentTypesInputProps
  | IRelegionSelectInputRhfProps
  | IMarriagaSelectInputRhfProps
  | IProvinceSelectInputRhfProps
  | IRegencySelectInputRhfProps
  | ISubDistrictSelectInputRhfProps
  | IVillageInputRhfProps
  | IIdentityTypesRadioInputProps
  | IPositionSelectInputRhfProps
  | IDivisionSelectInputRhfProps
  | ISelectHeavyEquipmentReferenceInputProps
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
  | IMaterialSelectnputRhfProps
  | IEmployeeSelectInputRhfProps
  | IDateInputProps
  | IHeavyEquipmentSelectInputRhfProps
  | IWeatherSelectInputRhfProps
  | ILocationSelectInputRhfProps
  | IPitSelectInputRhfProps;

export type InputControllerNativeProps = IDateInputNativeProps;

export type ControllerGroup = {
  group: string;
  formControllers: ControllerProps[];
  enableGroupLabel?: boolean;
  groupCheckbox?: CheckboxProps;
  actionGroup?: {
    addButton?: IPrimaryButtonProps;
    deleteButton?: IPrimaryButtonProps;
  };
};

export type ControllerCheckBoxGroup<T> = {
  name: keyof T;
} & Omit<ICheckboxGroupAccessProps, 'name'>;

// Auhtentication
export interface IPermissionAuth {
  id: string;
  slug: string;
}

export interface IErrorResponseExtensionNextAuth {
  code: string;
  originalError: {
    statusCode: number;
    message: string;
    error: string;
  };
}

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

type IChildren<T> = {
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

export type IErrorResponseExtensionGql<T extends React.ReactNode> =
  IExtensionKey<T>;
// END RESPONSE REQUEST GRAPHQL

// REST API
export interface ErrorValidationMessage<T> {
  property: keyof T;
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
