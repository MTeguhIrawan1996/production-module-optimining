import { useSearchParams } from 'next/navigation';
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
  tabs?: string;
}

const LoseTimeCategoryBook: React.FC<ILoseTimeCategoryProps> = ({
  tabs: tabsProps,
}) => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const tabs = pageParams.get('tabs') || 'lose-time-category';
  const { t } = useTranslation('default');

  /* #   /**=========== Query =========== */
  const {
    ReadAllActivityCategoryData,
    ReadAllActivityCategoryDataColumn,
    ReadAllActivityCategoryDataLoading,
    ReadAllActivityCategoryDataMeta,
  } = useReadAllActivityCategory({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      type: 'default',
    },
    skip: tabs !== tabsProps,
  });

  const handleSetPage = (page: number) => {
    const urlSet = `/master-data/activity-category?page=${page}&tabs=${tabsProps}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: ReadAllActivityCategoryData,
          fetching: ReadAllActivityCategoryDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                ReadAllActivityCategoryData &&
                ReadAllActivityCategoryData.indexOf(record) + 1,
              width: 60,
            },
            ...(ReadAllActivityCategoryDataColumn ?? []),
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
          totalAllData: ReadAllActivityCategoryDataMeta?.totalAllData ?? 0,
          totalData: ReadAllActivityCategoryDataMeta?.totalData ?? 0,
          totalPage: ReadAllActivityCategoryDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ReadAllActivityCategoryData, ReadAllActivityCategoryDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return <DashboardCard>{renderTable}</DashboardCard>;
};

export default LoseTimeCategoryBook;
