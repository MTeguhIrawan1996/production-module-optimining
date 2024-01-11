import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

import { useReadAllHeavyEquipmentFormula } from '@/services/graphql/query/heavy-equipment-formula/useReadAllHeavyEquipmentFormula';

interface IHeavyEquipmentPreformanceFormulaBookProps {
  tab?: string;
}

const HeavyEquipmentPreformanceFormulaBook: React.FC<
  IHeavyEquipmentPreformanceFormulaBookProps
> = ({ tab: tabProps }) => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const tab = pageParams.get('tab') || 'lose-time-category';
  const { t } = useTranslation('default');

  /* #   /**=========== Query =========== */
  const {
    readAllHeavyEquipmentFormulaData,
    readAllHeavyEquipmentFormulaDataColumn,
    readAllHeavyEquipmentFormulaDataLoading,
    readAllHeavyEquipmentFormulaDataMeta,
  } = useReadAllHeavyEquipmentFormula({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
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
          records: readAllHeavyEquipmentFormulaData,
          fetching: readAllHeavyEquipmentFormulaDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                readAllHeavyEquipmentFormulaData &&
                readAllHeavyEquipmentFormulaData.indexOf(record) + 1,
              width: 60,
            },
            ...(readAllHeavyEquipmentFormulaDataColumn ?? []),
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
          totalAllData: readAllHeavyEquipmentFormulaDataMeta?.totalAllData ?? 0,
          totalData: readAllHeavyEquipmentFormulaDataMeta?.totalData ?? 0,
          totalPage: readAllHeavyEquipmentFormulaDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    readAllHeavyEquipmentFormulaData,
    readAllHeavyEquipmentFormulaDataLoading,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  return <DashboardCard>{renderTable}</DashboardCard>;
};

export default HeavyEquipmentPreformanceFormulaBook;
