import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationFactoryValues,
  useCreateFactoryMaster,
} from '@/services/graphql/mutation/factory/useCreateFactoryMaster';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import {
  globalSelectArriveBargeRhf,
  globalText,
} from '@/utils/constants/Field/global-field';
import { factoryMutationValidation } from '@/utils/form-validation/factory/factory-mutation-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateFactoryBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationFactoryValues>({
    resolver: zodResolver(factoryMutationValidation),
    defaultValues: {
      name: '',
      categoryId: null,
    },
    mode: 'onBlur',
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

  const [executeCreate, { loading }] = useCreateFactoryMaster({
    onCompleted: () => {
      sendGAEvent({
        event: 'Tambah',
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
        message: t('factory.successCreateMessage'),
        icon: <IconCheck />,
      });

      methods.reset();
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
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
  const fieldItem = React.useMemo(() => {
    const factoryCategoryItem = globalSelectArriveBargeRhf({
      name: 'categoryId',
      label: 'category',
      placeholder: 'chooseCategory',
      colSpan: 12,
      withAsterisk: true,
    });
    const factoryNameItem = globalText({
      name: 'name',
      label: 'factoryName',
      colSpan: 12,
      withAsterisk: true,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.factoryName'),
        formControllers: [factoryCategoryItem, factoryNameItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationFactoryValues> = async (
    data
  ) => {
    await executeCreate({
      variables: {
        name: data.name,
        categoryId: data.categoryId,
      },
    });
  };

  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
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

export default CreateFactoryBook;
