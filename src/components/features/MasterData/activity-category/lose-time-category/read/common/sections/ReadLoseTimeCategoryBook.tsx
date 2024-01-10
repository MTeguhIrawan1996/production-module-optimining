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

import { useReadOneActivityCategory } from '@/services/graphql/query/activity-category/useReadOneActivityCategory';

interface IReadLoseTimeCategoryBookProps {
  tab?: string;
}

const ReadLoseTimeCategoryBook: React.FC<IReadLoseTimeCategoryBookProps> = ({
  tab: tabProps,
}) => {
  const router = useRouter();
  const id = router.query.id as string;
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const tab = pageParams.get('tab') || 'lose-time-category';
  const url = `/master-data/activity-category/lose-time-category/read/${id}?page=1`;
  const { t } = useTranslation('default');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);

  /* #   /**=========== Query =========== */
  const {
    readOneActivityCategoryDataPure,
    readOneActivityCategoryData,
    readOneActivityCategoryDataColumn,
    readOneActivityCategoryDataLoading,
    readOneActivityCategoryDataMeta,
  } = useReadOneActivityCategory({
    variables: {
      id: id,
      limit: 10,
      page: page,
      orderDir: 'desc',
      search: searchQuery === '' ? null : searchQuery,
    },
    skip: !router.isReady || tab !== tabProps,
  });

  const handleSetPage = (page: number) => {
    const urlSet = `/master-data/activity-category/lose-time-category/read/${id}?page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: readOneActivityCategoryData,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                readOneActivityCategoryData &&
                readOneActivityCategoryData.indexOf(record) + 1,
              width: 60,
            },
            ...(readOneActivityCategoryDataColumn ?? []),
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
          actionButton: {
            label: t('commonTypography.createActivity'),
            onClick: () =>
              router.push(
                `/master-data/activity-category/lose-time-category/create/${id}`
              ),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: readOneActivityCategoryDataMeta?.totalAllData ?? 0,
          totalData: readOneActivityCategoryDataMeta?.totalData ?? 0,
          totalPage: readOneActivityCategoryDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOneActivityCategoryData, readOneActivityCategoryDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      title={readOneActivityCategoryDataPure?.workingHourPlanCategory.name}
      addButton={{
        label: t('commonTypography.createActivity'),
        onClick: () =>
          router.push(
            `/master-data/activity-category/lose-time-category/create/${id}`
          ),
      }}
      searchBar={{
        placeholder: t('activityCategory.searchPlaceholderLoseTime'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
        },
        searchQuery: searchQuery,
      }}
      enebleBackBottomInner={{
        onClick: () =>
          router.push(`/master-data/activity-category?tab=${tabProps}`),
      }}
      paperStackProps={{
        spacing: 'md',
      }}
      isLoading={readOneActivityCategoryDataLoading}
    >
      {renderTable}
    </DashboardCard>
  );
};

export default ReadLoseTimeCategoryBook;
