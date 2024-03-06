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

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationLoseTimeValues,
  useUpdateActivityCategory,
} from '@/services/graphql/mutation/activity-category/useUpdateActivityCategory';
import { useReadOneActivityCategory } from '@/services/graphql/query/activity-category/useReadOneActivityCategory';
import { globalSelectWorkingHoursPlanRhf } from '@/utils/constants/Field/global-field';
import { loseTimeMutationValidation } from '@/utils/form-validation/activity-category/activity-category-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup, ITab } from '@/types/global';

interface IUpdateLoseTimeCategoryBookProps {
  tab?: ITab;
}

const UpdateLoseTimeActivityBook: React.FC<
  IUpdateLoseTimeCategoryBookProps
> = ({ tab: tabProps }) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationLoseTimeValues>({
    resolver: zodResolver(loseTimeMutationValidation),
    defaultValues: {
      activities: [
        {
          activityId: '',
        },
      ],
    },
    mode: 'onBlur',
  });
  const { fields, remove, append, replace } = useFieldArray({
    name: 'activities',
    control: methods.control,
  });
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const {
    readOneActivityCategoryDataPure,
    readOneActivityCategoryDataLoading,
  } = useReadOneActivityCategory({
    variables: {
      id: id,
    },
    skip: !router.isReady,
    onCompleted: ({ workingHourPlanCategory }) => {
      const activitiesValue = workingHourPlanCategory?.activities?.data.map(
        (val) => {
          return {
            activityId: val.id,
          };
        }
      );
      if (activitiesValue) {
        replace(activitiesValue);
      }
    },
  });

  const [executeUpdate, { loading }] = useUpdateActivityCategory({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('activityCategory.loseTimeSuccessUpdateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push(`/master-data/activity-category?tab=${tabProps}`);
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        setIsOpenConfirmation((prev) => !prev);
        const errorArry = errorBadRequestField<IMutationLoseTimeValues>(error);
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
  const fieldsSubMaterial = React.useCallback(
    (
      val: FieldArrayWithId<IMutationLoseTimeValues, 'activities', 'id'>,
      index: number
    ) => {
      const materialSubItem = globalSelectWorkingHoursPlanRhf({
        colSpan: 12,
        name: `activities.${index}.activityId`,
        label: `activity`,
        key: val.id,
        withAsterisk: true,
        deleteButtonField: {
          onClick: () => {
            fields.length > 1 ? remove(index) : undefined;
          },
        },
      });

      return materialSubItem;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields]
  );
  const fieldElementsItem = fields.map(fieldsSubMaterial);

  const fieldItem = React.useMemo(() => {
    const field: ControllerGroup[] = [
      {
        group:
          readOneActivityCategoryDataPure?.workingHourPlanCategory.name ?? '',
        enableGroupLabel: true,
        actionGroup: {
          addButton: {
            label: t('commonTypography.createActivity'),
            onClick: () =>
              append(
                {
                  activityId: '',
                },
                { shouldFocus: false }
              ),
          },
        },
        formControllers: [...fieldElementsItem],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldElementsItem, readOneActivityCategoryDataPure]);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationLoseTimeValues> = async (
    data
  ) => {
    const { activities } = data;
    await executeUpdate({
      variables: {
        id,
        activities,
        type: 'default',
      },
    });
  };
  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={readOneActivityCategoryDataLoading}>
      <GlobalFormGroup
        field={fieldItem}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          type: 'button',
          onClick: async () => {
            const output = await methods.trigger(undefined, {
              shouldFocus: true,
            });
            if (output) setIsOpenConfirmation((prev) => !prev);
          },
        }}
        backButton={{
          onClick: () =>
            router.push(`/master-data/activity-category?tab=${tabProps}`),
        }}
        modalConfirmation={{
          isOpenModalConfirmation: isOpenConfirmation,
          actionModalConfirmation: () => setIsOpenConfirmation((prev) => !prev),
          actionButton: {
            label: t('commonTypography.yes'),
            type: 'button',
            onClick: handleConfirmation,
            loading: loading,
          },
          backButton: {
            label: 'Batal',
          },
          modalType: {
            type: 'default',
            title: t('commonTypography.alertTitleConfirmUpdate'),
          },
          withDivider: true,
        }}
      />
    </DashboardCard>
  );
};

export default UpdateLoseTimeActivityBook;
