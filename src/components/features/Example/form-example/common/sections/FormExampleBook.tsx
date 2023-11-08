import { zodResolver } from '@hookform/resolvers/zod';
import { FileRejection, FileWithPath } from '@mantine/dropzone';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { GlobalFormGroup } from '@/components/elements';

import exampleField from '@/utils/constants/Field/example-field';
import { formExamplevalidation } from '@/utils/form-validation/example/form-example-validation';

import { ControllerProps } from '@/types/global';

export interface IFormValues {
  exampleTextInput: string;
  exampleSelectInput: string;
  exampleRadioInput: string;
  exampleDateInput: Date | undefined;
  exampleImageInput: FileWithPath[] | null;
  exampleFileInput: FileWithPath[] | null;
  exampleNumberInput: number | string;
}

const FormExampleBook = () => {
  const defaultValues: IFormValues = {
    exampleTextInput: '',
    exampleSelectInput: '',
    exampleNumberInput: '',
    exampleRadioInput: '',
    exampleImageInput: null,
    exampleFileInput: null,
    exampleDateInput: undefined,
  };
  const methods = useForm<IFormValues>({
    resolver: zodResolver(formExamplevalidation),
    defaultValues,
    mode: 'onSubmit',
  });

  const handleRejectFile = (
    files: FileRejection[],
    field: keyof typeof defaultValues
  ) => {
    const errorMessages = {
      'file-too-large': 'Ukuran file tidak sesuai',
      'file-invalid-type': 'Format file tidak sesuai',
      default: 'Periksa kembali file anda',
    };

    const errorCode = files[0].errors[0].code;
    const message: string = errorMessages[errorCode] || errorMessages.default;
    methods.setValue(field, null);
    methods.setError(field, {
      type: 'manual',
      message: message,
    });
  };

  const fieldWithInputFile = React.useMemo(() => {
    const newArrayField: ControllerProps[] = [
      {
        control: 'image-dropzone',
        name: 'exampleImageInput',
        label: 'Example Image',
        withAsterisk: true,
        description:
          'Logo Perusahaan Maksimal 10Mb dengan extention .JPEG .JPG atau .PNG',
        maxSize: 10 * 1024 ** 2,
        multiple: false,
        maxFiles: 1,
        onDrop: (value) => {
          methods.setValue('exampleImageInput', value);
          methods.clearErrors('exampleImageInput');
        },
        onReject: (files) => handleRejectFile(files, 'exampleImageInput'),
      },
      {
        control: 'pdf-dropzone',
        name: 'exampleFileInput',
        label: 'Example File',
        withAsterisk: true,
        description: 'Unggah Dokumen Maksimal 10Mb dengan extention .Pdf',
        maxSize: 10 * 1024 ** 2,
        multiple: false,
        maxFiles: 1,
        onDrop: (value) => {
          methods.setValue('exampleFileInput', value);
          methods.clearErrors('exampleFileInput');
        },
        onReject: (files) => handleRejectFile(files, 'exampleFileInput'),
      },
    ];
    const oldArrayFormController = [...exampleField];
    oldArrayFormController[1].formControllers.splice(
      1,
      oldArrayFormController[1].formControllers.length,
      ...newArrayField
    );
    return oldArrayFormController;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm: SubmitHandler<IFormValues> = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
  };

  return (
    <GlobalFormGroup
      field={fieldWithInputFile}
      methods={methods}
      submitForm={handleSubmitForm}
      nextButton={{
        label: 'Selanjutnya',
        // eslint-disable-next-line no-console
        onClick: () => console.log('tes'),
      }}
      validationButton={{
        label: 'Validasi',
        // eslint-disable-next-line no-console
        onClick: () => console.log('tes'),
      }}
      backButton={{
        label: 'Kembali',
        // eslint-disable-next-line no-console
        onClick: () => console.log('Kembali'),
      }}
    />
  );
};

export default FormExampleBook;
