import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

import { useReadAllHeavyEquipmentFormula } from '@/services/graphql/query/heavy-equipment-formula/useReadAllHeavyEquipmentFormula';

interface IHeavyEquipmentFormulaBookProps {
  tab?: string;
}

const HeavyEquipmentFormulaBook: React.FC<IHeavyEquipmentFormulaBookProps> = ({
  tab: tabProps,
}) => {
  const router = useRouter();
  const page = Number(router.query['page']) || 1;
  const tab = router.query['tab'] || 'lose-time-category';
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
                          `/master-data/activity-category/heavy-equipment-performance-formula/read/${id}`
                        );
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/master-data/activity-category/heavy-equipment-performance-formula/update/${id}`
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

export default HeavyEquipmentFormulaBook;
