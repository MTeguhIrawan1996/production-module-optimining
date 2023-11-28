import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationStockpileValues,
  useCreateStockpileMaster,
} from '@/services/graphql/mutation/stockpile-master/useCreateStockpileMaster';
import { globalText } from '@/utils/constants/Field/global-field';
import { stockpileMutationValidation } from '@/utils/form-validation/stockpile/stockpile-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateStockpileMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationStockpileValues>({
    resolver: zodResolver(stockpileMutationValidation),
    defaultValues: {
      name: '',
      handBookId: '',
    },
    mode: 'onBlur',
  });
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const [executeCreate, { loading }] = useCreateStockpileMaster({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('stockpile.successCreateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push('/master-data/stockpile');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IMutationStockpileValues>(error);
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
    const stockpileId = globalText({
      name: 'handBookId',
      label: 'stockpileId',
      colSpan: 6,
    });
    const stockpileName = globalText({
      name: 'name',
      label: 'stockpileName',
      colSpan: 6,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.stockpile'),
        enableGroupLabel: true,
        formControllers: [stockpileId, stockpileName],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationStockpileValues> = async (
    data
  ) => {
    const { name, handBookId } = data;
    await executeCreate({
      variables: {
        name,
        handBookId,
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
          onClick: () => router.back(),
        }}
      />
    </DashboardCard>
  );
};

export default CreateStockpileMasterBook;
