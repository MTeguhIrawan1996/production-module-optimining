import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { IMutationFactoryValues } from '@/services/graphql/mutation/factory/useCreateFactoryMaster';
import { useUpdateFactoryMaster } from '@/services/graphql/mutation/factory/useUpdateFactoryMaster';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadOneFactoryMaster } from '@/services/graphql/query/factory/useReadOneFactoryMaster';
import {
  globalSelectArriveBargeRhf,
  globalText,
} from '@/utils/constants/Field/global-field';
import { factoryMutationValidation } from '@/utils/form-validation/factory/factory-mutation-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateFactoryBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });
  const methods = useForm<IMutationFactoryValues>({
    resolver: zodResolver(factoryMutationValidation),
    defaultValues: {
      name: '',
      categoryId: null,
    },
    mode: 'onBlur',
  });

  const { factoryMasterLoading } = useReadOneFactoryMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      methods.setValue('name', data.factory.name);
      methods.setValue('categoryId', data.factory.category.id);
    },
  });

  const [executeUpdate, { loading }] = useUpdateFactoryMaster({
    onCompleted: () => {
      sendGAEvent({
        event: 'Edit',
        params: {
          category: 'Pra Rencana',
          subSubCategory: '',
          subCategory: 'Pra Rencana - Pabrik / Vessel',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('factory.successUpdateMessage'),
        icon: <IconCheck />,
      });
      router.push('/master-data/factory');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IMutationFactoryValues>(error);
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
    const factoryCategoryItem = globalSelectArriveBargeRhf({
      name: 'categoryId',
      label: 'category',
      placeholder: 'chooseCategory',
      colSpan: 12,
      withAsterisk: true,
    });
    const factoryName = globalText({
      name: 'name',
      label: 'factoryName',
      colSpan: 12,
      withAsterisk: true,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.factory'),
        formControllers: [factoryCategoryItem, factoryName],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm: SubmitHandler<IMutationFactoryValues> = async (
    data
  ) => {
    const { name, categoryId } = data;
    await executeUpdate({
      variables: {
        id,
        name,
        categoryId,
      },
    });
  };
  return (
    <DashboardCard p={0} isLoading={factoryMasterLoading}>
      <GlobalFormGroup
        field={fieldItem}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push('/master-data/factory'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateFactoryBook;
