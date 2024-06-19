import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  FieldArrayWithId,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationWHPValues,
  useCreateWHPMaster,
} from '@/services/graphql/mutation/working-hours-plan/useCreateWHPMaster';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { globalText } from '@/utils/constants/Field/global-field';
import { whpMutationValidation } from '@/utils/form-validation/working-hours-plan/whp-mutation-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import useControlPanel from '@/utils/store/useControlPanel';

import { ControllerGroup } from '@/types/global';

const CreateWorkingHoursPlanBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);
  const [resetWHP] = useControlPanel((state) => [state.resetWHP], shallow);
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationWHPValues>({
    resolver: zodResolver(whpMutationValidation),
    defaultValues: {
      createWorkingHourPlans: [
        {
          activityName: '',
        },
      ],
    },
    mode: 'onBlur',
  });
  const { fields, append, remove } = useFieldArray({
    name: 'createWorkingHourPlans',
    control: methods.control,
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

  const [executeCreate, { loading }] = useCreateWHPMaster({
    onCompleted: () => {
      sendGAEvent({
        event: 'Tambah',
        params: {
          category: 'Pra Rencana',
          subSubCategory: '',
          subCategory: 'Pra Rencana - Rencana Waktu Hilang',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('workingHoursPlan.successCreateMessage'),
        icon: <IconCheck />,
      });
      setIsOpenConfirmation((prev) => !prev);
      methods.reset();
      resetWHP();
      router.push('/master-data/working-hours-plan');
    },
    onError: (error) => {
      setIsOpenConfirmation((prev) => !prev);
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IMutationWHPValues>(error);
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
  const fieldItem = React.useCallback(
    (
      val: FieldArrayWithId<IMutationWHPValues, 'createWorkingHourPlans', 'id'>,
      index: number
    ) => {
      const activityItem = globalText({
        name: `createWorkingHourPlans.${index}.activityName`,
        label: 'activity',
        colSpan: 12,
        withAsterisk: true,
        key: `createWorkingHourPlans.${index}.activityName.${val.id}`,
        deleteButtonField: {
          onClick: () => {
            fields.length > 1 ? remove(index) : null;
          },
        },
      });

      const field: ControllerGroup = {
        group: t('commonTypography.activity'),
        formControllers: [activityItem],
      };
      return field;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields]
  );

  const arrayField = fields.map(fieldItem);

  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationWHPValues> = async (data) => {
    await executeCreate({
      variables: {
        createWorkingHourPlans: data.createWorkingHourPlans,
      },
    });
  };

  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
      <GlobalFormGroup
        field={arrayField}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          type: 'button',
          onClick: () => setIsOpenConfirmation((prev) => !prev),
        }}
        outerButton={{
          label: t('commonTypography.createActivity'),
          onClick: () =>
            append({
              activityName: '',
            }),
        }}
        backButton={{
          onClick: () => router.push('/master-data/working-hours-plan'),
        }}
        modalConfirmation={{
          isOpenModalConfirmation: isOpenConfirmation,
          actionModalConfirmation: () => setIsOpenConfirmation((prev) => !prev),
          actionButton: {
            label: t('commonTypography.yesSave'),
            type: 'button',
            onClick: handleConfirmation,
            loading: loading,
          },
          backButton: {
            label: 'Batal',
          },
          modalType: {
            type: 'default',
            title: t('commonTypography.alertTitleConfirmSave'),
            description: t('commonTypography.alertDescConfirmSaveWHP'),
          },
          withDivider: true,
        }}
      />
    </DashboardCard>
  );
};

export default CreateWorkingHoursPlanBook;
