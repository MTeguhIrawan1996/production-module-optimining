import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationUpdateStockpileDomeValues,
  useUpdateStockpileDomeMaster,
} from '@/services/graphql/mutation/stockpile-master/useUpdateStockpileDomeMaster';
import { useReadOneStockpileDomeMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileDomeMaster';
import { globalText } from '@/utils/constants/Field/global-field';
import { stockpileDomeMutationUpdateValidation } from '@/utils/form-validation/stockpile/stockpile-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateStockpileDomeMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const stockpileId = router.query?.id?.[0] as string;
  const domeId = router.query?.id?.[1] as string;

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationUpdateStockpileDomeValues>({
    resolver: zodResolver(stockpileDomeMutationUpdateValidation),
    defaultValues: {
      name: '',
      handBookId: '',
    },
    mode: 'onBlur',
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { stockpileDomeMasterLoading } = useReadOneStockpileDomeMaster({
    variables: {
      id: domeId,
    },
    skip: !router.isReady,
    onCompleted: ({ dome }) => {
      methods.setValue('name', dome.name);
      methods.setValue('handBookId', dome.handBookId);
    },
  });

  const [executeUpdate, { loading }] = useUpdateStockpileDomeMaster({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('stockpile.successUpdateDomeMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push(`/master-data/stockpile/read/${stockpileId}`);
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<unknown>(error);
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
    const domeId = globalText({
      name: 'handBookId',
      label: 'domeId',
      colSpan: 6,
    });
    const domeName = globalText({
      name: 'name',
      label: 'domeName',
      colSpan: 6,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.dome'),
        enableGroupLabel: true,
        formControllers: [domeId, domeName],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<
    IMutationUpdateStockpileDomeValues
  > = async (data) => {
    await executeUpdate({
      variables: {
        id: domeId,
        stockpileId: stockpileId,
        handBookId: data.handBookId,
        name: data.name,
      },
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={stockpileDomeMasterLoading}>
      <GlobalFormGroup
        field={fieldItem}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () =>
            router.push(`/master-data/stockpile/read/${stockpileId}`),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateStockpileDomeMasterBook;
