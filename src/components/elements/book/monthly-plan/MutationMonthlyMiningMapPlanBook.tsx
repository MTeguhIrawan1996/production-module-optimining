import { zodResolver } from '@hookform/resolvers/zod';
import { Flex } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import CommonMonthlyPlanInformation from '@/components/elements/book/monthly-plan/ui/CommonMonthlyPlanInformation';
import DashboardCard from '@/components/elements/card/DashboardCard';
import GlobalFormGroup from '@/components/elements/form/GlobalFormGroup';

import { useReadOneMiningMapPlan } from '@/services/graphql/query/plan/weekly/mining-map-plan/useReadOneMiningMapPlan';
import {
  IMutationMonthlyMiningMapPlanValues,
  useCreateMonthlyMiningMapPlan,
} from '@/services/restapi/plan/monthly/useCreateMonthlyMiningMapPlan';
import {
  globalDropzonePdfOrImageRhf,
  globalText,
  locationCategorySelect,
  locationSelect,
} from '@/utils/constants/Field/global-field';
import { weeklyMiningMapPlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-mining-map-plan-validation';
import { errorRestBadRequestField } from '@/utils/helper/errorBadRequestField';
import { handleRejectFile } from '@/utils/helper/handleRejectFile';

import { ControllerGroup } from '@/types/global';

interface IMutationMonthlyMiningMapPlanBook {
  mutationType?: 'create' | 'update';
  mutationSuccessMassage?: string;
}

const MutationMonthlyMiningMapPlanBook = ({
  mutationType,
  mutationSuccessMassage,
}: IMutationMonthlyMiningMapPlanBook) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

  const methods = useForm<IMutationMonthlyMiningMapPlanValues>({
    resolver: zodResolver(weeklyMiningMapPlanMutationValidation),
    defaultValues: {
      miningMapPlans: [
        {
          id: null,
          mapName: '',
          locationCategoryId: null,
          locationId: null,
          file: [],
          serverFile: [],
        },
      ],
    },
    mode: 'onBlur',
  });

  const {
    fields: miningMapPlanFields,
    append: miningMapPlanAppend,
    remove: miningMapPlanRemove,
    // replace: miningMapPlanReplace,
  } = useFieldArray({
    name: 'miningMapPlans',
    control: methods.control,
    keyName: 'miningMapPlanId',
  });

  const miningMapPlans = methods.watch('miningMapPlans');

  const { weeklyMiningPlanDataLoading } = useReadOneMiningMapPlan({
    variables: {
      weeklyPlanId: id,
      orderBy: 'createdAt',
      orderDir: 'desc',
    },
    skip: !router.isReady || tabs !== 'miningMapPlan',
    // onCompleted: ({ weeklyMiningMapPlans }) => {
    //   if (weeklyMiningMapPlans.data.length > 0) {
    //     const newMiningMapPlans: IMiningMapPlanData[] =
    //       weeklyMiningMapPlans.data.map((obj) => {
    //         return {
    //           id: obj.id,
    //           mapName: obj.mapName,
    //           locationCategoryId: obj.locationCategory.id,
    //           locationId: obj.location.id,
    //           file: [],
    //           serverFile: obj.file ? [obj.file] : [],
    //         };
    //       });
    //     miningMapPlanReplace(newMiningMapPlans);
    //   }
    // },
  });

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { mutate, isLoading } = useCreateMonthlyMiningMapPlan({
    onError: (err) => {
      if (err.response) {
        const errorArry = errorRestBadRequestField(err);
        if (errorArry?.length) {
          errorArry?.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: err.response.data.message,
          icon: <IconX />,
        });
      }
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: mutationSuccessMassage,
        icon: <IconCheck />,
      });
      router.push(
        `/plan/weekly/${mutationType}/weekly-plan-group/${id}?tabs=bargingTargetPlan`
      );
      if (mutationType === 'update') {
        setIsOpenConfirmation(false);
      }
    },
  });

  const groupingField = miningMapPlanFields.map((obj, index) => {
    const newLocationCategoryId = miningMapPlans[index].locationCategoryId;
    const mapNameItem = globalText({
      name: `miningMapPlans.${index}.mapName`,
      label: 'mapName',
      key: `${obj.miningMapPlanId}.mapName.${index}`,
    });
    const locationCategoryItem = locationCategorySelect({
      clearable: true,
      limit: null,
      name: `miningMapPlans.${index}.locationCategoryId`,
      key: `${obj.miningMapPlanId}.locationCategoryId.${index}`,
      skipQuery: tabs !== 'miningMapPlan',
    });
    const locationItem = locationSelect({
      colSpan: 6,
      name: `miningMapPlans.${index}.locationId`,
      label: 'location',
      key: `${obj.miningMapPlanId}.locationId.${index}`,
      disabled: !newLocationCategoryId,
      categoryIds: newLocationCategoryId ? [newLocationCategoryId] : null,
      limit: null,
      skipQuery: tabs !== 'miningMapPlan',
    });
    const pdfImageItem = globalDropzonePdfOrImageRhf({
      colSpan: 12,
      label: 'uploadFile',
      withAsterisk: true,
      description: 'uploadFileMax10Mb',
      name: `miningMapPlans.${index}.file`,
      key: `${obj.miningMapPlanId}.file.${index}`,
      serverFile: miningMapPlans[index].serverFile,
      onDrop: (value) => {
        methods.setValue(`miningMapPlans.${index}.serverFile`, []);
        methods.setValue(`miningMapPlans.${index}.file`, value);
        methods.clearErrors(`miningMapPlans.${index}.file`);
      },
      onReject: (files) =>
        handleRejectFile<IMutationMonthlyMiningMapPlanValues>({
          methods,
          files,
          field: `miningMapPlans.${index}.file` as any,
        }),
    });

    const group: ControllerGroup = {
      group: t('commonTypography.bargingTargetPlan'),
      enableGroupLabel: false,
      formControllers: [
        mapNameItem,
        locationCategoryItem,
        locationItem,
        pdfImageItem,
      ],
      actionOuterGroup: {
        addButton:
          index === 0
            ? {
                label: t('commonTypography.createMap'),
                onClick: () =>
                  miningMapPlanAppend({
                    id: null,
                    mapName: '',
                    locationCategoryId: null,
                    locationId: null,
                    file: [],
                    serverFile: [],
                  }),
              }
            : undefined,
      },
      actionGroup: {
        deleteButton: {
          label: t('commonTypography.delete'),
          onClick: () =>
            miningMapPlanFields.length > 1 ? miningMapPlanRemove(index) : null,
        },
      },
    };

    return group;
  });

  const handleSubmitForm: SubmitHandler<
    IMutationMonthlyMiningMapPlanValues
  > = async () =>
    // data
    {
      // const values = objectToArrayValue(data);
      // mutate({
      //   weeklyPlanId: id,
      //   data: values,
      // });
    };

  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };

  return (
    <DashboardCard p={0} isLoading={weeklyMiningPlanDataLoading}>
      <Flex gap={32} direction="column" p={22}>
        <CommonMonthlyPlanInformation />
        <GlobalFormGroup
          flexProps={{
            p: 0,
          }}
          field={groupingField}
          methods={methods}
          submitForm={handleSubmitForm}
          submitButton={{
            label: t('commonTypography.save'),
            loading: mutationType === 'create' ? isLoading : undefined,
            type: mutationType === 'create' ? 'submit' : 'button',
            onClick:
              mutationType === 'update'
                ? async () => {
                    const output = await methods.trigger(undefined, {
                      shouldFocus: true,
                    });
                    if (output) setIsOpenConfirmation((prev) => !prev);
                  }
                : undefined,
          }}
          backButton={{
            onClick: () =>
              router.push(
                mutationType === 'update'
                  ? `/plan/weekly/${mutationType}/${id}`
                  : `/plan/weekly`
              ),
          }}
          modalConfirmation={{
            isOpenModalConfirmation: isOpenConfirmation,
            actionModalConfirmation: () =>
              setIsOpenConfirmation((prev) => !prev),
            actionButton: {
              label: t('commonTypography.yes'),
              type: 'button',
              onClick: handleConfirmation,
              loading: isLoading,
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
      </Flex>
    </DashboardCard>
  );
};

export default MutationMonthlyMiningMapPlanBook;
