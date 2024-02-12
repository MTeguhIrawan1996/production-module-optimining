import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

import { useReadAllActivityCategory } from '@/services/graphql/query/activity-category/useReadAllActivityCategoryMaster';

interface ILoseTimeCategoryProps {
  tab?: string;
}

const LoseTimeCategoryBook: React.FC<ILoseTimeCategoryProps> = ({
  tab: tabProps,
}) => {
  const router = useRouter();
  const page = Number(router.query['page']) || 1;
  const tab = router.query['tab'] || 'lose-time-category';
  const { t } = useTranslation('default');

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
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/master-data/activity-category/lose-time-category/read/${id}`
                        );
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/master-data/activity-category/lose-time-category/update/${id}`
                        );
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
  }, [readAllActivityCategoryData, readAllActivityCategoryDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return <DashboardCard>{renderTable}</DashboardCard>;
};

export default LoseTimeCategoryBook;
