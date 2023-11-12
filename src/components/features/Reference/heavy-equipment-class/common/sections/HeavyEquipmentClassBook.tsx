import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteHeavyEquipmentClass } from '@/services/graphql/mutation/heavy-equipment-class/useDeleteHeavyEquipmentClass';
import { useReadAllHeavyEquipmentClass } from '@/services/graphql/query/heavy-equipment-class/useReadAllHeavyEquipmentClass';

const HeavyEquipmentClassBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);

  /* #   /**=========== Query =========== */
  const {
    heavyEquipmentClassesData,
    heavyEquipmentClassesDataLoading,
    heavyEquipmentClassesDataMeta,
    refetchHeavyEquipmentClasses,
  } = useReadAllHeavyEquipmentClass({
    variables: {
      limit: 10,
      page: page,
      search: searchQuery === '' ? null : searchQuery,
    },
  });
  const [executeDelete, { loading }] = useDeleteHeavyEquipmentClass({
    onCompleted: () => {
      refetchHeavyEquipmentClasses();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push({
        href: router.asPath,
        query: {
          page: 1,
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipmentClass.successDeleteMessage'),
        icon: <IconCheck />,
      });
    },
    onError: ({ message }) => {
      notifications.show({
        color: 'red',
        title: 'Gagal',
        message: message,
        icon: <IconX />,
      });
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== HandleClickFc =========== */
  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
      },
    });
  };

  const handleSetPage = (page: number) => {
    router.push({
      href: router.asPath,
      query: {
        page: page,
      },
    });
  };
  /* #endregion  /**======== HandleClickFc =========== */

  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          highlightOnHover: true,
          columns: [
            {
              accessor: 'class',
              title: t('commonTypography.class'),

              render: ({ name }) => name,
            },
            {
              accessor: 'type',
              title: t('commonTypography.model'),
              noWrap: false,
              width: 450,
              render: ({ heavyEquipmentReferences }) => {
                const type = heavyEquipmentReferences.map(
                  (val) => val.modelName
                );
                return type?.join(', ');
              },
            },
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
                          `/reference/heavy-equipment-class/read/${id}`
                        );
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/reference/heavy-equipment-class/update/${id}`
                        );
                      },
                    }}
                    actionDelete={{
                      onClick: (e) => {
                        e.stopPropagation();
                        setIsOpenDeleteConfirmation((prev) => !prev);
                        setId(id);
                      },
                    }}
                  />
                );
              },
            },
          ],
          fetching: heavyEquipmentClassesDataLoading,
          records: heavyEquipmentClassesData,
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('heavyEquipment.createHeavyEquipment'),
            onClick: () => router.push('/reference/heavy-equipment/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: heavyEquipmentClassesDataMeta?.totalAllData ?? 0,
          totalData: heavyEquipmentClassesDataMeta?.totalData ?? 0,
          totalPage: heavyEquipmentClassesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heavyEquipmentClassesData, heavyEquipmentClassesDataLoading]);

  return (
    <DashboardCard
      addButton={{
        label: t('heavyEquipmentClass.createHeavyEquipmentClass'),
        onClick: () => router.push('/reference/heavy-equipment-class/create'),
      }}
      searchBar={{
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery,
        placeholder: t('heavyEquipmentClass.searchPlaceholder'),
      }}
    >
      {renderTable}
      <ModalConfirmation
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
          description: t('heavyEquipment.alertDescConfirmDelete'),
        }}
        withDivider
      />
    </DashboardCard>
  );
};

export default HeavyEquipmentClassBook;
