import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { IMutationElementValues } from '@/services/graphql/mutation/element/useCreateElementMaster';
import { useUpdateElementMaster } from '@/services/graphql/mutation/element/useUpdateElementMaster';
import { useReadOneElementMaster } from '@/services/graphql/query/element/useReadOneElementMaster';
import { globalText } from '@/utils/constants/Field/global-field';
import { elementMutationValidation } from '@/utils/form-validation/element/element-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateElementBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const methods = useForm<IMutationElementValues>({
    resolver: zodResolver(elementMutationValidation),
    defaultValues: {
      name: '',
    },
    mode: 'onBlur',
  });

  const { elementMasterLoading } = useReadOneElementMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      methods.setValue('name', data.element.name);
    },
  });

  const [executeUpdate, { loading }] = useUpdateElementMaster({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('element.successUpdateMessage'),
        icon: <IconCheck />,
      });
      router.push('/master-data/element');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IMutationElementValues>(error);
        if (errorArry.length) {
          errorArry.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: error.message,
          icon: <IconX />,
        });
      }
    },
  });

  const fieldItem = React.useMemo(() => {
    const elementItem = globalText({
      name: 'name',
      label: 'element',
      colSpan: 12,
      withAsterisk: true,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.element'),
        formControllers: [elementItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm: SubmitHandler<IMutationElementValues> = async (
    data
  ) => {
    const { name } = data;
    await executeUpdate({
      variables: {
        id,
        name,
      },
    });
  };
  return (
    <DashboardCard p={0} isLoading={elementMasterLoading}>
      <GlobalFormGroup
        field={fieldItem}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push('/master-data/element'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateElementBook;
