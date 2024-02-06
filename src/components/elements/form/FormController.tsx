import * as React from 'react';

import {
  BrandSelectInputRhf,
  BussinessTypeSelectInputRhf,
  ClassSelectInputRhf,
  CompanyPermissionTypeSelectInputRhf,
  CompanyTypeSelectInputRhf,
  DateInputRhf,
  DivisionSelectInputRhf,
  DomeNameSelectInputRhf,
  EligibilityStatusSelectInputRhf,
  EmployeeSelectInputRhf,
  ExcelInputDropzoneRhf,
  HeavyEquipmentSelectInputRhf,
  IdentityRadioInputRhf,
  ImageInputDropzoneRhf,
  InputAverageArray,
  InputSumArray,
  LocationCategorySelectInputRhf,
  LocationSelectInputRhf,
  MarriageSelectInputRhf,
  MaterialSelectInput,
  ModelSelectInputRhf,
  MultipleSelectLocationRhf,
  MultipleSelectMaterialRhf,
  NumberInputRhf,
  NumberInputTableRhf,
  PasswordInputRhf,
  PdfInputDropzoneRhf,
  PitSelectInputRhf,
  PositionSelectInputRhf,
  ProvinceSelectInputRhf,
  RadioInputRhf,
  RegencySelectInputRhf,
  RelegionSelectInputRhf,
  SampleTypeSelectInput,
  SelectActivityCategoryRhf,
  SelectActivityFormRhf,
  SelectArriveBargeRhf,
  SelectCompanyRhf,
  SelectFactoryRhf,
  SelectHeavyEquipmentReferenceInput,
  SelectHeavyEquipmentTypesInput,
  SelectInputRhf,
  SelectWeekRhf,
  SelectWorkingHoursPlanRhf,
  SelectYearRhf,
  ShiftSelectInputRhf,
  StockpileNameSelectInputRhf,
  SubDistrictSelectInputRhf,
  TextInputRhf,
  TimeInputRhf,
  TypeSelectInputRhf,
  VillageSelectInputRhf,
  WeatherConditionSelectInputRhf,
  WeatherSelectInputRhf,
} from '@/components/elements';

import { ControllerProps } from '@/types/global';

const FormController: React.FC<ControllerProps> = (props) => {
  const { control } = props;

  switch (control) {
    case 'text-input':
      return <TextInputRhf {...props} />;
    case 'select-input':
      return <SelectInputRhf {...props} />;
    case 'password-input':
      return <PasswordInputRhf {...props} />;
    case 'image-dropzone':
      return <ImageInputDropzoneRhf {...props} />;
    case 'pdf-dropzone':
      return <PdfInputDropzoneRhf {...props} />;
    case 'excel-dropzone':
      return <ExcelInputDropzoneRhf {...props} />;
    case 'number-input':
      return <NumberInputRhf {...props} />;
    case 'radio-input':
      return <RadioInputRhf {...props} />;
    case 'date-input':
      return <DateInputRhf {...props} />;
    case 'select-heavy-equipment-types-input':
      return <SelectHeavyEquipmentTypesInput {...props} />;
    case 'relegion-select-input':
      return <RelegionSelectInputRhf {...props} />;
    case 'marriage-select-input':
      return <MarriageSelectInputRhf {...props} />;
    case 'province-select-input':
      return <ProvinceSelectInputRhf {...props} />;
    case 'regency-select-input':
      return <RegencySelectInputRhf {...props} />;
    case 'subdistrict-select-input':
      return <SubDistrictSelectInputRhf {...props} />;
    case 'village-select-input':
      return <VillageSelectInputRhf {...props} />;
    case 'identity-radio-input':
      return <IdentityRadioInputRhf {...props} />;
    case 'position-select-input':
      return <PositionSelectInputRhf {...props} />;
    case 'division-select-input':
      return <DivisionSelectInputRhf {...props} />;
    case 'select-heavy-equipment-reference-input':
      return <SelectHeavyEquipmentReferenceInput {...props} />;
    case 'brand-select-input':
      return <BrandSelectInputRhf {...props} />;
    case 'type-select-input':
      return <TypeSelectInputRhf {...props} />;
    case 'model-select-input':
      return <ModelSelectInputRhf {...props} />;
    case 'class-select-input':
      return <ClassSelectInputRhf {...props} />;
    case 'eligibilityStatus-select-input':
      return <EligibilityStatusSelectInputRhf {...props} />;
    case 'company-types-select-input':
      return <CompanyTypeSelectInputRhf {...props} />;
    case 'bussiness-types-select-input':
      return <BussinessTypeSelectInputRhf {...props} />;
    case 'company-permission-types-select-input':
      return <CompanyPermissionTypeSelectInputRhf {...props} />;
    case 'location-category-select-input':
      return <LocationCategorySelectInputRhf {...props} />;
    case 'time-input':
      return <TimeInputRhf {...props} />;
    case 'stockpilename-select-input':
      return <StockpileNameSelectInputRhf {...props} />;
    case 'domename-select-input':
      return <DomeNameSelectInputRhf {...props} />;
    case 'shift-select-input':
      return <ShiftSelectInputRhf {...props} />;
    case 'sample-type-select-input':
      return <SampleTypeSelectInput {...props} />;
    case 'material-select-input':
      return <MaterialSelectInput {...props} />;
    case 'employee-select-input':
      return <EmployeeSelectInputRhf {...props} />;
    case 'heavyEquipment-select-input':
      return <HeavyEquipmentSelectInputRhf {...props} />;
    case 'weathers-select-input':
      return <WeatherSelectInputRhf {...props} />;
    case 'pit-select-input':
      return <PitSelectInputRhf {...props} />;
    case 'location-select-input':
      return <LocationSelectInputRhf {...props} />;
    case 'weather-condition-select-input':
      return <WeatherConditionSelectInputRhf {...props} />;
    case 'select-arrive-barge-rhf':
      return <SelectArriveBargeRhf {...props} />;
    case 'select-factory-rhf':
      return <SelectFactoryRhf {...props} />;
    case 'select-working-hours-plan-rhf':
      return <SelectWorkingHoursPlanRhf {...props} />;
    case 'select-activity-category-rhf':
      return <SelectActivityCategoryRhf {...props} />;
    case 'select-company-rhf':
      return <SelectCompanyRhf {...props} />;
    case 'select-year-rhf':
      return <SelectYearRhf {...props} />;
    case 'select-week-rhf':
      return <SelectWeekRhf {...props} />;
    case 'select-activity-form-rhf':
      return <SelectActivityFormRhf {...props} />;
    case 'number-input-table-rhf':
      return <NumberInputTableRhf {...props} />;
    case 'multiple-select-location':
      return <MultipleSelectLocationRhf {...props} />;
    case 'multiple-select-material':
      return <MultipleSelectMaterialRhf {...props} />;
    case 'input-sum-array':
      return <InputSumArray {...props} />;
    case 'input-average-array':
      return <InputAverageArray {...props} />;
    default:
      return null;
  }
};

export default FormController;
