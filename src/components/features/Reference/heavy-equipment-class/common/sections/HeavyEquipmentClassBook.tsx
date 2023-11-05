import { SelectProps } from '@mantine/core';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
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
import { useReadAllHeavyEquipmentType } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentType';
import { useReadAllHeavyEquipmentClass } from '@/services/graphql/query/heavy-equipment-class/useReadAllHeavyEquipmentClass';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

const HeavyEquipmentClassBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [page, setPage] = React.useState<number>(1);
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [typeSearchTerm, settypeSearchTerm] = React.useState<string>('');
  const [typeSearchQuery] = useDebouncedValue<string>(typeSearchTerm, 400);
  const [typeId, setTypeId] = React.useState<string | null>(null);

  /* #   /**=========== Query =========== */
  const { typesData } = useReadAllHeavyEquipmentType({
    variables: {
      limit: 15,
      search: typeSearchQuery === '' ? null : typeSearchQuery,
    },
  });
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
      // typeId,
    },
  });
  const [executeDelete, { loading }] = useDeleteHeavyEquipmentClass({
    onCompleted: () => {
      refetchHeavyEquipmentClasses();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage(1);
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

  /* #   /**=========== FilterData =========== */
  const { uncombinedItem: typeItems } = useCombineFilterItems({
    data: typesData ?? [],
  });
  /* #endregion  /**======== FilterData =========== */

  /* #   /**=========== FilterRender =========== */
  const filter = React.useMemo(() => {
    const item: SelectProps[] = [
      {
        onChange: (value) => {
          setPage(1);
          setTypeId(value);
        },
        value: typeId,
        data: typeItems ?? [],
        label: t('commonTypography.type'),
        placeholder: t('heavyEquipment.chooseType'),
        searchable: true,
        nothingFound: null,
        clearable: true,
        onSearchChange: settypeSearchTerm,
        searchValue: typeSearchTerm,
      },
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeSearchTerm, typeItems]);
  /* #endregion  /**======== FilterRender =========== */

  /* #   /**=========== HandleClickFc =========== */
  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
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
              title: t('commonTypography.type'),

              render: ({ heavyEquipmentTypes }) => heavyEquipmentTypes[0].name,
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
          setPage: setPage,
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
        onSearch: () => {
          setPage(1);
        },
        placeholder: t('heavyEquipmentClass.searchPlaceholder'),
      }}
      MultipleFilter={{
        MultipleFilterData: filter,
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
