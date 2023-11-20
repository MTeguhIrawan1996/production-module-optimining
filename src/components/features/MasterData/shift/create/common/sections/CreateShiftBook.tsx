import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationShiftValues,
  useCreateShiftMaster,
} from '@/services/graphql/mutation/shift/useCreateShiftMaster';
import {
  globalText,
  globalTimeInput,
} from '@/utils/constants/Field/global-field';
import { shiftMutationValidation } from '@/utils/form-validation/shift/shift-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const CreateShiftBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationShiftValues>({
    resolver: zodResolver(shiftMutationValidation),
    defaultValues: {
      name: '',
      startHour: '',
      endHour: '',
    },
    mode: 'onBlur',
  });
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

  const [executeCreate, { loading }] = useCreateShiftMaster({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('shift.successCreateMessage'),
        icon: <IconCheck />,
      });

      methods.reset();
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
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
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

  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationShiftValues> = async (
    data
  ) => {
    await executeCreate({
      variables: {
        name: data.name,
        startHour: data.startHour,
        endHour: data.endHour,
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

export default CreateShiftBook;
