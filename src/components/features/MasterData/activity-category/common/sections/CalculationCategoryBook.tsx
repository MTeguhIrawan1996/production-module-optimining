import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteActivityCategory } from '@/services/graphql/mutation/activity-category/useDeleteActivityCategory';
import { useReadAllActivityCategory } from '@/services/graphql/query/activity-category/useReadAllActivityCategoryMaster';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

interface ICalculationCategoryBookProps {
  tab?: string;
}

const CalculationCategoryBook: React.FC<ICalculationCategoryBookProps> = ({
  tab: tabProps,
}) => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const page = Number(router.query['page']) || 1;
  const tab = router.query['tab'] || 'calculation-category';
  const url = `/master-data/activity-category?page=1&tab=${tabProps}`;
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const isPermissionCreate = permissions?.includes(
    'create-working-hour-plan-category'
  );
  const isPermissionUpdate = permissions?.includes(
    'update-working-hour-plan-category'
  );
  const isPermissionDelete = permissions?.includes(
    'delete-working-hour-plan-category'
  );
  const isPermissionRead = permissions?.includes(
    'read-working-hour-plan-category'
  );

  /* #   /**=========== Query =========== */
  const {
    readAllActivityCategoryData,
    readAllActivityCategoryDataColumn,
    readAllActivityCategoryDataLoading,
    readAllActivityCategoryDataMeta,
    refetchReadAllActivityCategoryData,
  } = useReadAllActivityCategory({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      types: ['count_formula'],
      search: searchQuery === '' ? null : searchQuery,
    },
    skip: tab !== tabProps,
  });

  const [executeDelete, { loading }] = useDeleteActivityCategory({
    onCompleted: () => {
      refetchReadAllActivityCategoryData();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push(url, undefined, { shallow: true });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('activityCategory.calculationSuccessDeleteMessage'),
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
        id,
      },
    });
  };

  const handleSetPage = (page: number) => {
    const urlSet = `/master-data/activity-category?page=${page}&tab=${tabProps}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: readAllActivityCategoryData,
          fetching: readAllActivityCategoryDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                readAllActivityCategoryData &&
                readAllActivityCategoryData.indexOf(record) + 1,
              width: 60,
            },
            ...(readAllActivityCategoryDataColumn ?? []),
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/master-data/activity-category/calculation-category/read/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionUpdate={
                      isPermissionUpdate
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/master-data/activity-category/calculation-category/update/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionDelete={
                      isPermissionDelete
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
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: readAllActivityCategoryDataMeta?.totalAllData ?? 0,
          totalData: readAllActivityCategoryDataMeta?.totalData ?? 0,
          totalPage: readAllActivityCategoryDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    readAllActivityCategoryData,
    readAllActivityCategoryDataLoading,
    isPermissionCreate,
    isPermissionRead,
    isPermissionUpdate,
    isPermissionDelete,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              label: t('activityCategory.createCalculationCategory'),
              onClick: () =>
                router.push(
                  `/master-data/activity-category/calculation-category/create`
                ),
            }
          : undefined
      }
      searchBar={{
        placeholder: t('activityCategory.searchPlaceholderCalculation'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
        },
        searchQuery: searchQuery,
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

export default CalculationCategoryBook;
