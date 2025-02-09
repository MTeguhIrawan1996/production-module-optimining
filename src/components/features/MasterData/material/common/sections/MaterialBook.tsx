import { Badge } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, MantineDataTable } from '@/components/elements';

import { useReadAllMaterialsMaster } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { resetAllSlices } from '@/utils/store/useControlPanel';

const MaterialBook = () => {
  // const router = useRouter();
  // const permissions = useStore(usePermissions, (state) => state.permissions);
  const [page, setPage] = React.useState<number>(1);
  const { t } = useTranslation('default');
  // const [id, setId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  // const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
  //   React.useState<boolean>(false);

  // const isPermissionCreate = permissions?.includes('create-material');
  // const isPermissionUpdate = permissions?.includes('update-material');
  // const isPermissionDelete = permissions?.includes('delete-material');
  // const isPermissionRead = permissions?.includes('read-material');

  React.useEffect(() => {
    resetAllSlices();
  }, []);

  /* #   /**=========== Query =========== */
  const {
    materialsData,
    materialsDataLoading,
    materialsDataMeta,
    refetchMaterials,
  } = useReadAllMaterialsMaster({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
      isHaveParent: false,
    },
  });

  // const [executeDelete, { loading }] = useDeleteMaterialMaster({
  //   onCompleted: () => {
  //     refetchMaterials();
  //     setIsOpenDeleteConfirmation((prev) => !prev);
  //     setPage(1);
  //     notifications.show({
  //       color: 'green',
  //       title: 'Selamat',
  //       message: t('material.successDeleteMessage'),
  //       icon: <IconCheck />,
  //     });
  //   },
  //   onError: ({ message }) => {
  //     notifications.show({
  //       color: 'red',
  //       title: 'Gagal',
  //       message: message,
  //       icon: <IconX />,
  //     });
  //   },
  // });
  /* #endregion  /**======== Query =========== */

  // const handleDelete = async () => {
  //   await executeDelete({
  //     variables: {
  //       id,
  //     },
  //   });
  // };

  const handleSetPage = (page: number) => {
    setPage(page);
  };

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: materialsData,
          fetching: materialsDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                materialsData && materialsData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'name',
              title: t('commonTypography.materialType'),
            },
            {
              accessor: 'subMaterialType',
              title: t('commonTypography.subMaterialType'),
              render: ({ subMaterials }) => {
                const material = subMaterials?.map((val) => (
                  <Badge key={val.id}>{val.name}</Badge>
                ));
                return material && material.length > 0 ? material : '-';
              },
            },
            // {
            //   accessor: 'action',
            //   title: t('commonTypography.action'),
            //   render: ({ id }) => {
            //     return (
            //       <GlobalKebabButton
            //         actionRead={
            //           isPermissionRead
            //             ? {
            //                 onClick: (e) => {
            //                   e.stopPropagation();
            //                   router.push(`/master-data/material/read/${id}`);
            //                 },
            //               }
            //             : undefined
            //         }
            //         actionUpdate={
            //           isPermissionUpdate
            //             ? {
            //                 onClick: (e) => {
            //                   e.stopPropagation();
            //                   router.push(`/master-data/material/update/${id}`);
            //                 },
            //               }
            //             : undefined
            //         }
            //         actionDelete={
            //           isPermissionDelete
            //             ? {
            //                 onClick: (e) => {
            //                   e.stopPropagation();
            //                   setIsOpenDeleteConfirmation((prev) => !prev);
            //                   setId(id);
            //                 },
            //               }
            //             : undefined
            //         }
            //       />
            //     );
            //   },
            // },
          ],
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          // actionButton: isPermissionCreate
          //   ? {
          //       label: t('material.createMaterial'),
          //       onClick: () => router.push('/master-data/material/create'),
          //     }
          //   : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: materialsDataMeta?.totalAllData ?? 0,
          totalData: materialsDataMeta?.totalData ?? 0,
          totalPage: materialsDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    materialsData,
    materialsDataLoading,
    // isPermissionDelete,
    // isPermissionRead,
    // isPermissionUpdate,
    // isPermissionCreate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      // addButton={
      //   isPermissionCreate
      //     ? {
      //         label: t('material.createMaterial'),
      //         onClick: () => router.push('/master-data/material/create'),
      //       }
      //     : undefined
      // }
      searchBar={{
        placeholder: t('material.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setPage(1);
          refetchMaterials({
            page: 1,
          });
        },
      }}
    >
      {renderTable}
      {/* <ModalConfirmation
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
          description: t('commonTypography.alertDescConfirmDeleteMasterData'),
        }}
        withDivider
      /> */}
    </DashboardCard>
  );
};

export default MaterialBook;
