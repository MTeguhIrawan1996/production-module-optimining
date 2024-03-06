import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { globalSelectNative } from '@/utils/constants/Field/native-field';
import { formatDate } from '@/utils/helper/dateFormat';

import { InputControllerNativeProps } from '@/types/global';

const ListMonthlyMapBook = () => {
  const router = useRouter();
  const page = Number(router.query['monthlyMapPage']) || 1;
  const url = `/input-data/map?monthlyMapPage=${page}&tabs=monthly`;
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const { t } = useTranslation('default');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const [monthlyMapSearchTerm, setMonthlyMapSearchTerm] =
    React.useState<string>('');

  const handleDelete = async () => {
    notifications.show({
      title: t('deleteSuccess'),
      message: t('deleteSuccessMessage'),
      color: 'teal',
      icon: <IconCheck />,
    });
  };

  const handleSetPage = (page: number) => {
    const urlSet = `/input-data/production/map?monthlyMapPage=${page}&tabs=barging`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const filter = React.useMemo(() => {
    const mapTypeItem = globalSelectNative({
      placeholder: 'chooseMapType',
      label: 'mapType',
      searchable: false,
      data: [],
      onChange: () => {
        router.push(url, undefined, { shallow: true });
      },
    });
    const locationItem = globalSelectNative({
      placeholder: 'location',
      label: 'location',
      searchable: false,
      data: [],
      onChange: () => {
        router.push(url, undefined, { shallow: true });
      },
    });
    const yearItem = globalSelectNative({
      placeholder: 'year',
      label: 'year',
      searchable: true,
      data: [],
      onSearchChange: setMonthlyMapSearchTerm,
      searchValue: monthlyMapSearchTerm,
      onChange: () => {
        router.push(url, undefined, { shallow: true });
      },
    });
    const monthItem = globalSelectNative({
      placeholder: 'month',
      label: 'month',
      searchable: true,
      data: [],
      onSearchChange: setMonthlyMapSearchTerm,
      searchValue: monthlyMapSearchTerm,
      onChange: () => {
        router.push(url, undefined, { shallow: true });
      },
    });

    const item: InputControllerNativeProps[] = [
      mapTypeItem,
      locationItem,
      yearItem,
      monthItem,
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <DashboardCard
      addButton={{
        label: t('mapProduction.createMapProd'),
        onClick: () => router.push('/input-data/production/map/monthly/create'),
      }}
      filterDateWithSelect={{
        colSpan: 4,
        items: filter,
      }}
      searchBar={{
        placeholder: t('mapProduction.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
        },
      }}
    >
      <MantineDataTable
        tableProps={{
          records: [],
          fetching: false,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              width: 60,
            },
            {
              accessor: 'date',
              title: `${t('commonTypography.name')} ${t(
                'commonTypography.map'
              )}`,
              width: 160,
              render: ({ date }) => formatDate(date) ?? '-',
            },
            {
              accessor: 'shift',
              title: `${t('commonTypography.type')} ${t(
                'commonTypography.map'
              )}`,
            },
            {
              accessor: 'year',
              title: t('commonTypography.year'),
            },
            {
              accessor: 'month',
              title: t('commonTypography.month'),
            },
            {
              accessor: 'location',
              title: t('commonTypography.location'),
              render: ({ fromAt }) => formatDate(fromAt, 'hh:mm:ss A') ?? '-',
            },
            {
              accessor: 'status',
              title: t('commonTypography.status'),
              render: () => {
                return <GlobalBadgeStatus color="red" label="" />;
              },
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/input-data/production/map/read/${id}`);
                      },
                    }}
                    actionUpdate={undefined}
                    actionDelete={undefined}
                  />
                );
              },
            },
          ],
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('mapProduction.createMapProd'),
            onClick: () => router.push('/input-data/production/map/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: 0,
          totalData: 0,
          totalPage: 0,
        }}
      />
      <ModalConfirmation
        isOpenModalConfirmation={isOpenDeleteConfirmation}
        actionModalConfirmation={() =>
          setIsOpenDeleteConfirmation((prev) => !prev)
        }
        actionButton={{
          label: t('commonTypography.yesDelete'),
          color: 'red',
          onClick: handleDelete,
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
      {/* <SelectionButtonModal
        isOpenSelectionModal={isOpenSelectionModal}
        actionSelectionModal={() => setIsOpenSelectionModal((prev) => !prev)}
        firstButton={{
          label: t('commonTypography.inputDataRitage'),
          onClick: () => router.push('/input-data/production/map/create'),
        }}
      /> */}
    </DashboardCard>
  );
};

export default ListMonthlyMapBook;
