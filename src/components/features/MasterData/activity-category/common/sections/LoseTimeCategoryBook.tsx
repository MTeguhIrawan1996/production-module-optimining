import { useRouter } from 'next/router';
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

import { useReadAllActivityCategory } from '@/services/graphql/query/activity-category/useReadAllActivityCategoryMaster';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

interface ILoseTimeCategoryProps {
  tab?: string;
}

const LoseTimeCategoryBook: React.FC<ILoseTimeCategoryProps> = ({
  tab: tabProps,
}) => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [tab] = useQueryState(
    'tab',
    parseAsString.withDefault('lose-time-category')
  );
  const { t } = useTranslation('default');

  const isPermissionUpdate = permissions?.includes(
    'update-working-hour-plan-category'
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
  } = useReadAllActivityCategory({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      types: ['default'],
    },
    skip: tab !== tabProps,
  });

  const handleSetPage = (page: number) => {
    setPage(page);
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
                                `/master-data/activity-category/lose-time-category/read/${id}`
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
                                `/master-data/activity-category/lose-time-category/update/${id}`
                              );
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
    page,
    readAllActivityCategoryData,
    readAllActivityCategoryDataLoading,
    isPermissionRead,
    isPermissionUpdate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  return <DashboardCard>{renderTable}</DashboardCard>;
};

export default LoseTimeCategoryBook;
