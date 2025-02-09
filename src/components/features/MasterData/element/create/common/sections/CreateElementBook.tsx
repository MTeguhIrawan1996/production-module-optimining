import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationElementValues,
  useCreateElementMaster,
} from '@/services/graphql/mutation/element/useCreateElementMaster';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { globalText } from '@/utils/constants/Field/global-field';
import { elementMutationValidation } from '@/utils/form-validation/element/element-mutation-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import useControlPanel from '@/utils/store/useControlPanel';

import { ControllerGroup } from '@/types/global';

const CreateElementBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });
  const [resetElementState] = useControlPanel(
    (state) => [state.resetElementState],
    shallow
  );

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationElementValues>({
    resolver: zodResolver(elementMutationValidation),
    defaultValues: {
      name: '',
    },
    mode: 'onBlur',
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

  const [executeCreate, { loading }] = useCreateElementMaster({
    onCompleted: () => {
      sendGAEvent({
        event: 'Tambah',
        params: {
          category: 'Pra Rencana',
          subSubCategory: '',
          subCategory: 'Pra Rencana - Unsur Kandungan',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('element.successCreateMessage'),
        icon: <IconCheck />,
      });
      resetElementState();
      methods.reset();
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
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
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

  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationElementValues> = async (
    data
  ) => {
    await executeCreate({
      variables: {
        name: data.name,
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
          onClick: () => router.push('/master-data/element'),
        }}
      />
    </DashboardCard>
  );
};

export default CreateElementBook;
