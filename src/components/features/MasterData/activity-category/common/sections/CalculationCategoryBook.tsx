import { useDebouncedState } from '@mantine/hooks';
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

interface ICalculationCategoryBookProps {
  tab?: string;
}

const CalculationCategoryBook: React.FC<ICalculationCategoryBookProps> = ({
  tab: tabProps,
}) => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const tab = pageParams.get('tab') || 'calculation-category';
  const url = `/master-data/activity-category?page=1&tab=${tabProps}`;
  const { t } = useTranslation('default');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);

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
      type: 'count_formula',
      search: searchQuery === '' ? null : searchQuery,
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
                          `/master-data/activity-category/calculation-category/read/${id}`
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

  return (
    <DashboardCard
      addButton={{
        label: t('activityCategory.createActivityCategory'),
        onClick: () => router.push('/master-data/activity-plan/create'),
      }}
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
    </DashboardCard>
  );
};

export default CalculationCategoryBook;
