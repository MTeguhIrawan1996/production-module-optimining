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
  tabs?: string;
}

const CalculationCategoryBook: React.FC<ICalculationCategoryBookProps> = ({
  tabs: tabsProps,
}) => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const tabs = pageParams.get('tabs') || 'calculation-category';
  const url = `/master-data/activity-category?page=1&tabs=${tabsProps}`;
  const { t } = useTranslation('default');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);

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
      type: 'count_formula',
      search: searchQuery === '' ? null : searchQuery,
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
          totalAllData: ReadAllActivityCategoryDataMeta?.totalAllData ?? 0,
          totalData: ReadAllActivityCategoryDataMeta?.totalData ?? 0,
          totalPage: ReadAllActivityCategoryDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ReadAllActivityCategoryData, ReadAllActivityCategoryDataLoading]);
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
