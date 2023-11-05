import * as React from 'react';
import 'dayjs/locale/id';

import {
  DateInputRhf,
  ImageInputDropzoneRhf,
  NumberInputRhf,
  PasswordInputRhf,
  PdfInputDropzoneRhf,
  RadioInputRhf,
  SelectHeavyEquipmentTypesInput,
  SelectInputRhf,
  TextInputRhf,
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
    case 'number-input':
      return <NumberInputRhf {...props} />;
    case 'radio-input':
      return <RadioInputRhf {...props} />;
    case 'date-input':
      return <DateInputRhf {...props} />;
    case 'select-heavy-equipment-types-input':
      return <SelectHeavyEquipmentTypesInput {...props} />;
    default:
      return null;
  }
};

export default FormController;
