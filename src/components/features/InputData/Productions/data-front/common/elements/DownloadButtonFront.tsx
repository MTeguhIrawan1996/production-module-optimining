import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { PrimaryDownloadDataButton } from '@/components/elements';
import { IDownloadDataButtonProps } from '@/components/elements/button/PrimaryDownloadDataButton';

interface IDownloadButtonFrontProps
  extends Omit<IDownloadDataButtonProps, 'methods' | 'submitForm'> {}

const DownloadButtonFront: React.FC<IDownloadButtonFrontProps> = (props) => {
  const methods = useForm<any>({
    // resolver: zodResolver(locationMutationValidation),
    defaultValues: {
      name: '',
      handBookId: '',
      categoryId: '',
    },
    mode: 'onBlur',
  });

  const handleSubmitForm: SubmitHandler<any> = async () => {
    // await executeUpdate({
    //   variables: {
    //     weeklyPlanId: id,
    //     domeId: data.domeId,
    //   },
    // });
  };

  return (
    <PrimaryDownloadDataButton
      methods={methods}
      submitForm={handleSubmitForm}
      {...props}
    />
  );
};

export default DownloadButtonFront;
