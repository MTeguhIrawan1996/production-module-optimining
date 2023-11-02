import { FileRejection } from '@mantine/dropzone';
import { UseFormReturn } from 'react-hook-form';

export interface IHandleRejectFile<T> {
  methods: UseFormReturn<any, any, undefined>;
  files: FileRejection[];
  field: keyof T;
}

export const handleRejectFile = <T>({
  methods,
  files,
  field,
}: IHandleRejectFile<T>) => {
  const errorMessages = {
    'file-too-large': 'Ukuran file tidak sesuai',
    'file-invalid-type': 'Format file tidak sesuai',
    default: 'Periksa kembali file anda',
  };

  const errorCode = files[0].errors[0].code;
  const message: string = errorMessages[errorCode] || errorMessages.default;
  methods.setValue(field as string, null);
  methods.setError(field as string, {
    type: 'manual',
    message: message,
  });
};
