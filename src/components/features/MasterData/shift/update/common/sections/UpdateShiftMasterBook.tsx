import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { IMutationShiftValues } from '@/services/graphql/mutation/shift/useCreateShiftMaster';
import { useUpdateShiftMaster } from '@/services/graphql/mutation/shift/useUpdateShiftMaster';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadOneShiftMaster } from '@/services/graphql/query/shift/useReadOneShiftMaster';
import {
  globalText,
  globalTimeInput,
} from '@/utils/constants/Field/global-field';
import { shiftMutationValidation } from '@/utils/form-validation/shift/shift-mutation-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateShiftMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });
  const methods = useForm<IMutationShiftValues>({
    resolver: zodResolver(shiftMutationValidation),
    defaultValues: {
      name: '',
      startHour: '',
      endHour: '',
    },
    mode: 'onBlur',
  });

  const { shiftMasterLoading } = useReadOneShiftMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      methods.setValue('name', data.shift.name);
      methods.setValue('startHour', data.shift.startHour);
      methods.setValue('endHour', data.shift.endHour);
    },
  });

  const [executeUpdate, { loading }] = useUpdateShiftMaster({
    onCompleted: () => {
      sendGAEvent({
        event: 'Edit',
        params: {
          category: 'Pra Rencana',
          subSubCategory: '',
          subCategory: 'Pra Rencana - Shift',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('shift.successUpdateMessage'),
        icon: <IconCheck />,
      });
      router.push('/master-data/shift');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IMutationShiftValues>(error);
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
    const shiftItem = globalText({
      name: 'name',
      label: 'shift',
      colSpan: 12,
      withAsterisk: true,
    });
    const startHourItem = globalTimeInput({
      name: 'startHour',
      label: 'startHour',
      colSpan: 12,
      withAsterisk: true,
    });
    const endHourItem = globalTimeInput({
      name: 'endHour',
      label: 'endHour',
      colSpan: 12,
      withAsterisk: true,
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.shift'),
        formControllers: [shiftItem, startHourItem, endHourItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm: SubmitHandler<IMutationShiftValues> = async (
    data
  ) => {
    const { name, endHour, startHour } = data;
    await executeUpdate({
      variables: {
        id,
        name,
        startHour,
        endHour,
      },
    });
  };
  return (
    <DashboardCard p={0} isLoading={shiftMasterLoading}>
      <GlobalFormGroup
        field={fieldItem}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push('/master-data/shift'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateShiftMasterBook;
