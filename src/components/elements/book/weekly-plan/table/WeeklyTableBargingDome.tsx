import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Group, Loader, Stack, TextProps } from '@mantine/core';
import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useRouter } from 'next/router';
import { useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import PrimaryButton from '@/components/elements/button/PrimaryButton';
import MantineDataTable from '@/components/elements/dataTable/MantineDataTable';
import FormController from '@/components/elements/form/FormController';
import GlobalKebabButton from '@/components/elements/global/GlobalKebabButton';
import TextInputNative from '@/components/elements/input/TextInputNative';
import GlobalModal from '@/components/elements/modal/GlobalModal';
import ModalConfirmation from '@/components/elements/modal/ModalConfirmation';

import {
  IBargingDomePlanValue,
  useCreateWeeklyBargingDomePlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateBargingDomePlan';
import { useDeleteBargingDomePlan } from '@/services/graphql/mutation/plan/weekly/useDeleteBargingDomePlan';
import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IReadOneBargingDomePlanData,
  useReadOneBargingDomePlan,
} from '@/services/graphql/query/plan/weekly/barging-target-plan/useReadOneBargingDomePlan';
import { useReadOneStockpileDomeMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileDomeMaster';
import { weeklyBargingDomePlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-barging-target-plan-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { IElementsData } from '@/types/global';

interface IWeeklyTableBrgingDomeProps {
  pageType?: 'create' | 'update' | 'read';
  labelProps?: TextProps;
}

const WeeklyTableBrgingDome = ({
  pageType = 'read',
  labelProps,
}: IWeeklyTableBrgingDomeProps) => {
  const router = useRouter();
  const id = router.query.id as string;
  const { t } = useTranslation('default');
  const [tabs] = useQueryState('tabs');
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [domeIdState, setDomeIdState] = React.useState<string>('');

  const methods = useForm<IBargingDomePlanValue>({
    resolver: zodResolver(weeklyBargingDomePlanMutationValidation),
    defaultValues: {
      domeId: null,
    },
    mode: 'onBlur',
  });

  const domeId = methods.watch('domeId');

  const {
    weeklyBargingDomePlanData,
    weeklyBargingDomePlanMeta,
    weeklyBargingDomePlanDataLoading,
    refatchWeeklyBargingDomePlanData,
  } = useReadOneBargingDomePlan({
    variables: {
      weeklyPlanId: id,
      limit: 10,
      page,
    },
    skip: tabs !== 'bargingTargetPlan',
  });

  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
    skip: tabs !== 'bargingTargetPlan',
    fetchPolicy: 'cache-and-network',
  });

  const { stockpileDomeMaster, stockpileDomeMasterLoading } =
    useReadOneStockpileDomeMaster({
      variables: {
        id: domeId || '',
      },
      skip: tabs !== 'bargingTargetPlan' || !domeId,
    });

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<IReadOneBargingDomePlanData> = {
        accessor: element.name,
        title: element.name,
        render: ({ dome }) => {
          const value =
            dome.monitoringStockpile.ritageSamples.additional.averageSamples?.find(
              (val) => val.element?.id === element.id
            );
          return value?.value ?? '-';
        },
      };
      return column;
    },
    []
  );

  const renderOtherColumn = elementsData?.map(renderOtherColumnCallback);

  const handleCloseModal = () => {
    setIsOpenModal((prev) => !prev);
    methods.reset();
  };

  const [executeUpdate, { loading }] = useCreateWeeklyBargingDomePlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: 'Dome berhasil dibuat',
        icon: <IconCheck />,
      });
      refatchWeeklyBargingDomePlanData();
      setPage(1);
      handleCloseModal();
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IBargingDomePlanValue>(error);
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

  const [executeDelete, { loading: isLoadingDelete }] =
    useDeleteBargingDomePlan({
      onCompleted: () => {
        refatchWeeklyBargingDomePlanData();
        setIsOpenDeleteConfirmation((prev) => !prev);
        setPage(1);
        notifications.show({
          color: 'green',
          title: 'Selamat',
          message: 'Dome berhasil dihapus',
          icon: <IconCheck />,
        });
      },
      onError: ({ message }) => {
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: message,
          icon: <IconX />,
        });
      },
    });

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        weeklyPlanId: id,
        domeId: domeIdState,
      },
    });
  };

  const handleSubmitForm: SubmitHandler<IBargingDomePlanValue> = async (
    data
  ) => {
    await executeUpdate({
      variables: {
        weeklyPlanId: id,
        domeId: data.domeId,
      },
    });
  };

  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };

  return (
    <Stack spacing="sm">
      <Group position="apart" align="center">
        <Text fz={24} fw={600} component="span" {...labelProps}>
          {t('commonTypography.inputGroupDomeLabel')}
        </Text>
        {pageType !== 'read' ? (
          <PrimaryButton
            label={t('commonTypography.createDome')}
            onClick={handleCloseModal}
          />
        ) : null}
      </Group>
      <MantineDataTable
        tableProps={{
          records: weeklyBargingDomePlanData || [],
          fetching: weeklyBargingDomePlanDataLoading,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                weeklyBargingDomePlanData &&
                weeklyBargingDomePlanData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'stockpile',
              title: t('commonTypography.stockpile'),
              render: ({ dome }) => {
                return dome.stockpile.name ?? '-';
              },
            },
            {
              accessor: 'dome',
              title: t('commonTypography.dome'),
              render: ({ dome }) => {
                return dome.name ?? '-';
              },
            },
            {
              accessor: 'tonByRitage',
              title: t('commonTypography.tonByRitage'),
              render: ({ dome }) => {
                return dome.monitoringStockpile.tonByRitage ?? '-';
              },
            },
            {
              accessor: 'tonBySurvey',
              title: t('commonTypography.tonBySurvey'),
              render: ({ dome }) => {
                return dome.monitoringStockpile.currentTonSurvey ?? '-';
              },
            },
            ...(renderOtherColumn ?? []),
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              hidden: pageType === 'read',
              render: ({ dome }) => {
                return (
                  <GlobalKebabButton
                    actionDelete={{
                      onClick: (e) => {
                        e.stopPropagation();
                        setIsOpenDeleteConfirmation((prev) => !prev);
                        setDomeIdState(dome.id);
                      },
                    }}
                  />
                );
              },
            },
          ],
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
        }}
        paginationProps={
          page && setPage
            ? {
                setPage: setPage,
                currentPage: page || 1,
                totalAllData: weeklyBargingDomePlanMeta?.totalAllData || 1,
                totalData: weeklyBargingDomePlanMeta?.totalData || 1,
                totalPage: weeklyBargingDomePlanMeta?.totalPage || 1,
              }
            : undefined
        }
      />
      <GlobalModal
        actionModal={handleCloseModal}
        isOpenModal={isOpenModal}
        label={t('commonTypography.createDome')}
        modalSize="lg"
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
            <Grid gutter="xs">
              <Grid.Col span={6}>
                <FormController
                  control="domename-select-input"
                  name="domeId"
                  label="dome"
                  withAsterisk
                  clearable
                  searchable
                  skipQuery={tabs !== 'bargingTargetPlan'}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInputNative
                  control="text-input-native"
                  name="stockpile"
                  label="stockpile"
                  readOnly
                  rightSection={
                    stockpileDomeMasterLoading ? (
                      <Loader size="xs" />
                    ) : undefined
                  }
                  value={stockpileDomeMaster?.stockpile.name || ''}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInputNative
                  control="text-input-native"
                  name="tonByRitage"
                  label="tonByRitage"
                  readOnly
                  rightSection={
                    stockpileDomeMasterLoading ? (
                      <Loader size="xs" />
                    ) : undefined
                  }
                  value={
                    stockpileDomeMaster?.monitoringStockpile.tonByRitage || ''
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInputNative
                  control="text-input-native"
                  name="tonBySurvey"
                  label="tonBySurvey"
                  readOnly
                  rightSection={
                    stockpileDomeMasterLoading ? (
                      <Loader size="xs" />
                    ) : undefined
                  }
                  value={
                    stockpileDomeMaster?.monitoringStockpile.currentTonSurvey ||
                    ''
                  }
                />
              </Grid.Col>
              {elementsData?.map((obj) => {
                const value =
                  stockpileDomeMaster?.monitoringStockpile.ritageSamples.additional.averageSamples.find(
                    (val) => val.element?.id === obj.id
                  );
                return (
                  <Grid.Col span={6} key={obj.id}>
                    <TextInputNative
                      control="text-input-native"
                      name={obj.name}
                      label={obj.name}
                      readOnly
                      labelWithTranslate={false}
                      rightSection={
                        stockpileDomeMasterLoading ? (
                          <Loader size="xs" />
                        ) : undefined
                      }
                      value={value?.value || ''}
                    />
                  </Grid.Col>
                );
              })}
            </Grid>
            <Stack mt="sm" w="100%" spacing="xs">
              <PrimaryButton
                label="Simpan"
                type="button"
                onClick={handleConfirmation}
                loading={loading}
              />
              <PrimaryButton
                label="Kembali"
                variant="light"
                onClick={handleCloseModal}
              />
            </Stack>
          </form>
        </FormProvider>
      </GlobalModal>
      <ModalConfirmation
        isOpenModalConfirmation={isOpenDeleteConfirmation}
        actionModalConfirmation={() =>
          setIsOpenDeleteConfirmation((prev) => !prev)
        }
        actionButton={{
          label: t('commonTypography.yesDelete'),
          color: 'red',
          onClick: handleDelete,
          loading: isLoadingDelete,
        }}
        backButton={{
          label: 'Batal',
        }}
        modalType={{
          type: 'default',
          title: t('commonTypography.alertTitleConfirmDelete'),
          description: t('commonTypography.alertDescConfirmDelete'),
        }}
        withDivider
      />
    </Stack>
  );
};

export default WeeklyTableBrgingDome;
