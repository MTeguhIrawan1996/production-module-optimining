import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'zustand';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

import { useReadAllHeavyEquipmentFormula } from '@/services/graphql/query/heavy-equipment-formula/useReadAllHeavyEquipmentFormula';
import { usePermissions } from '@/utils/store/usePermissions';

interface IHeavyEquipmentFormulaBookProps {
  tab?: string;
}

const HeavyEquipmentFormulaBook: React.FC<IHeavyEquipmentFormulaBookProps> = ({
  tab: tabProps,
}) => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const [page, setPage] = useQueryState(
    'page',
    queryTypes.integer.withDefault(1)
  );
  const [tab] = useQueryState('tab');
  const { t } = useTranslation('default');

  const isPermissionUpdate = permissions?.includes(
    'update-heavy-equipment-data-formula'
  );
  const isPermissionRead = permissions?.includes(
    'read-heavy-equipment-data-formula'
  );

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
    setPage(page, {
      shallow: true,
    });
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
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/master-data/activity-category/heavy-equipment-performance-formula/read/${id}`
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
                                `/master-data/activity-category/heavy-equipment-performance-formula/update/${id}`
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
          totalAllData: readAllHeavyEquipmentFormulaDataMeta?.totalAllData ?? 0,
          totalData: readAllHeavyEquipmentFormulaDataMeta?.totalData ?? 0,
          totalPage: readAllHeavyEquipmentFormulaDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    readAllHeavyEquipmentFormulaData,
    readAllHeavyEquipmentFormulaDataLoading,
    isPermissionRead,
    isPermissionUpdate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  return <DashboardCard>{renderTable}</DashboardCard>;
};

export default HeavyEquipmentFormulaBook;
