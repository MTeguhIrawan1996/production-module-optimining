import * as React from 'react';
import 'dayjs/locale/id';

import {
  DateInputRhf,
  IdentityRadioInputRhf,
  ImageInputDropzoneRhf,
  MarriageSelectInputRhf,
  NumberInputRhf,
  PasswordInputRhf,
  PdfInputDropzoneRhf,
  ProvinceSelectInputRhf,
  RadioInputRhf,
  RegencySelectInputRhf,
  RelegionSelectInputRhf,
  SelectHeavyEquipmentTypesInput,
  SelectInputRhf,
  SubDistrictSelectInputRhf,
  TextInputRhf,
  VillageSelectInputRhf,
} from '@/components/elements';
import DivisionSelectInputRhf from '@/components/elements/input/DivisionSelectInputRhf';
import PositionSelectInputRhf from '@/components/elements/input/PositionSelectInputRhf';
import SelectHeavyEquipmentReferenceInput from '@/components/elements/input/SelectHeavyEquipmentReferenceInput';

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
    default:
      return null;
  }
};

export default FormController;
