import { CheckboxProps } from '@mantine/core';
import { AxiosError } from 'axios';
import { GraphQLErrorExtensions } from 'graphql';

import { IPrimaryButtonProps } from '@/components/elements/button/PrimaryButton';
import { ICheckboxGroupAccessProps } from '@/components/elements/input/CheckboxGroupAccess';
import { IDateInputProps } from '@/components/elements/input/DateInputRhf';
import { IImageInputDropzoneRhfProps } from '@/components/elements/input/ImageInputDropzoneRhf';
import { INumberInputProps } from '@/components/elements/input/NumberInputRhf';
import { IPasswordInputProps } from '@/components/elements/input/PasswordInputRhf';
import { IPdfInputDropzoneRhfProps } from '@/components/elements/input/PdfInputDropzoneRhf';
import { IRadioInputProps } from '@/components/elements/input/RadioInputRhf';
import { ISelectHeavyEquipmentTypesInputProps } from '@/components/elements/input/SelectHeavyEquipmentTypesInput';
import { ISelectInputRhfProps } from '@/components/elements/input/SelectInputRhf';
import { ITextInputProps } from '@/components/elements/input/TextInputRhf';

// import { TablerIconsProps } from '@tabler/icons-react';

type CommonProps = {
  colSpan?: number;
};

// Controller Field
export type ControllerProps =
  | (ITextInputProps & CommonProps)
  | (ISelectInputRhfProps & CommonProps)
  | (IPasswordInputProps & CommonProps)
  | (IImageInputDropzoneRhfProps & CommonProps)
  | (IPdfInputDropzoneRhfProps & CommonProps)
  | (INumberInputProps & CommonProps)
  | (IRadioInputProps & CommonProps)
  | (ISelectHeavyEquipmentTypesInputProps & CommonProps)
  | (IDateInputProps & CommonProps);

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
export interface IPermission {
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

export interface IExtensionKey<T> extends GraphQLErrorExtensions {
  code: string;
  originalError: {
    errors: {
      property: keyof T;
      constraints: {
        [type: string]: string;
      };
    }[];
  };
}

export type IErrorResponseExtensionGql<T> = IExtensionKey<T>;
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
