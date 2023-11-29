import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { IMutationStockpileValues } from '@/services/graphql/mutation/stockpile-master/useCreateStockpileMaster';
import { useUpdateStockpileMaster } from '@/services/graphql/mutation/stockpile-master/useUpdateStockpileMaster';
import { useReadOneStockpileMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileMaster';
import { globalText } from '@/utils/constants/Field/global-field';
import { stockpileMutationValidation } from '@/utils/form-validation/stockpile/stockpile-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateStockpileMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const methods = useForm<IMutationStockpileValues>({
    resolver: zodResolver(stockpileMutationValidation),
    defaultValues: {
      name: '',
      handBookId: '',
    },
    mode: 'onBlur',
  });

  const { stockpileMasterLoading } = useReadOneStockpileMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ stockpile }) => {
      methods.setValue('name', stockpile.name);
      methods.setValue('handBookId', stockpile.handBookId);
    },
  });

  const [executeUpdate, { loading }] = useUpdateStockpileMaster({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('stockpile.successUpdateMessage'),
        icon: <IconCheck />,
      });
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

  const handleSubmitForm: SubmitHandler<IMutationStockpileValues> = async (
    data
  ) => {
    const { name, handBookId } = data;
    await executeUpdate({
      variables: {
        id,
        name,
        handBookId,
      },
    });
  };
  return (
    <DashboardCard p={0} isLoading={stockpileMasterLoading}>
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

export default UpdateStockpileMasterBook;
