import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/id';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteHeavyEquipmentProduction } from '@/services/graphql/mutation/heavy-equipment-production/useDeleteHeavyEquipmentProduction';
import { useReadAllHeavyEquipmentProduction } from '@/services/graphql/query/heavy-equipment-production/useReadAllHeavyEquipmentProduction';
import { globalSelectWeekNative } from '@/utils/constants/Field/native-field';
import { formatDate } from '@/utils/helper/dateFormat';

import { InputControllerNativeProps } from '@/types/global';

const WeatherProductionProductionBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const url = `/input-data/production/weather?page=1`;
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Query =========== */
  const {
    heavyEquipmentData,
    heavyEquipmentDataLoading,
    heavyEquipmentDataMeta,
    refetchHeavyEquipmentData,
  } = useReadAllHeavyEquipmentProduction({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      search: searchQuery === '' ? null : searchQuery,
    },
  });

  const [executeDelete, { loading }] = useDeleteHeavyEquipmentProduction({
    onCompleted: () => {
      refetchHeavyEquipmentData();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push(url, undefined, { shallow: true });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('weatherProd.successDeleteMessage'),
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
  /* #endregion  /**======== Query =========== */

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
      },
    });
  };

  const handleSetPage = (page: number) => {
    const urlSet = `/input-data/production/heavy-equipment?page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const filter = React.useMemo(() => {
    const selectWeekItem = globalSelectWeekNative({
      // disabled: !year,
      // value: `${week}`,
      // year: year,
      // onChange: (value) => {
      //   router.push(url, undefined, { shallow: true });
      //   setWeek(value ? Number(value) : null);
      // },
    });

    const item: InputControllerNativeProps[] = [selectWeekItem];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: heavyEquipmentData,
          fetching: heavyEquipmentDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                heavyEquipmentData && heavyEquipmentData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'date',
              title: t('commonTypography.date'),
              width: 160,
              render: ({ date }) => formatDate(date),
            },
            {
              accessor: 'location',
              title: t('commonTypography.location'),
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment.heavyEquipment.reference.type.name,
            },
            {
              accessor: 'hourAmountRain',
              title: t('commonTypography.hourAmountRain'),
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment.hullNumber,
            },
            {
              accessor: 'hourAmountSlippery',
              title: t('commonTypography.hourAmountSlippery'),
              render: ({ operator }) => operator.humanResource.name,
            },
            {
              accessor: 'loseTime',
              title: t('commonTypography.loseTime'),
              render: ({ operator }) => operator.humanResource.name,
            },
            {
              accessor: 'availabilityHoursOrDays',
              title: t('commonTypography.availabilityHoursOrDays'),
              render: ({ shift }) => shift?.name,
            },
            {
              accessor: 'status',
              title: t('commonTypography.status'),
              render: ({ status }) => {
                return (
                  <GlobalBadgeStatus
                    color={status?.color}
                    label={status?.name ?? ''}
                  />
                );
              },
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ id, status }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/input-data/production/heavy-equipment/read/${id}`
                        );
                      },
                    }}
                    actionUpdate={
                      status?.id !==
                      `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/production/heavy-equipment/update/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionDelete={
                      status?.id !==
                      `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              setIsOpenDeleteConfirmation((prev) => !prev);
                              setId(id);
                            },
                          }
                        : undefined
                    }
                  />
                );
              },
            },
          ],
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('weatherProd.createWeatherProd'),
            onClick: () => router.push('/input-data/production/weather/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: heavyEquipmentDataMeta?.totalAllData ?? 0,
          totalData: heavyEquipmentDataMeta?.totalData ?? 0,
          totalPage: heavyEquipmentDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heavyEquipmentData, heavyEquipmentDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={{
        label: t('weatherProd.createWeatherProd'),
        onClick: () => router.push('/input-data/production/weather/create'),
      }}
      filterDateWithSelect={{
        colSpan: 3,
        items: filter,
      }}
      searchBar={{
        placeholder: t('weatherProd.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
        },
      }}
    >
      {renderTable}
      <ModalConfirmation
        isOpenModalConfirmation={isOpenDeleteConfirmation}
        actionModalConfirmation={() =>
          setIsOpenDeleteConfirmation((prev) => !prev)
        }
        actionButton={{
          label: t('commonTypography.yesDelete'),
          color: 'red',
          onClick: handleDelete,
          loading: loading,
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
    </DashboardCard>
  );
};

export default WeatherProductionProductionBook;
