import { DataTableColumn } from 'mantine-datatable';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';

import { DashboardCard, ListDetailsRitageDT } from '@/components/elements';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import { useReadDetailsOreRitageDT } from '@/services/graphql/query/ore-ritage/useReadDetailsOreritageDT';
import { useReadOneFotoOreRitageDT } from '@/services/graphql/query/ore-ritage/useReadOneOreRitageDT';

import { IElementsData, IListDetailRitageDTData } from '@/types/global';

const ReadDTOreRitageBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('p')) || 1;
  const date = router.query?.id?.[0] as string;
  const shiftId = router.query?.id?.[1] as string;
  const companyHeavyEquipmentId = router.query?.id?.[2] as string;
  const [isOpenImageModal, setIsOpenImageModal] =
    React.useState<boolean>(false);

  /* #   /**=========== Query =========== */
  const {
    detailsOreRitageDTData,
    detailsOreRitageDTDataLoading,
    detailsOreRitageDTDataMeta,
  } = useReadDetailsOreRitageDT({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      date: date,
      shiftId: shiftId,
      companyHeavyEquipmentId: companyHeavyEquipmentId,
    },
    skip: !router.isReady,
  });

  const { getData, oreRitage, oreRitageLoading } = useReadOneFotoOreRitageDT(
    {}
  );

  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
  });

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<IListDetailRitageDTData> = {
        accessor: `${element.name}`,
        title: `${element.name}`,
        render: ({ houseSampleAndLab }) => {
          const value = houseSampleAndLab?.elements?.find(
            (val) => val.element?.name === element.name
          );
          return value?.value ?? '-';
        },
      };
      return column;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const renderOtherColumn = elementsData?.map(renderOtherColumnCallback);

  const onOpenModal = async (id: string) => {
    setIsOpenImageModal((prev) => !prev);
    await getData({
      variables: {
        id: id,
      },
    });
  };

  return (
    <DashboardCard
      enebleBackBottomInner={{
        onClick: () =>
          router.push('/input-data/production/data-ritage?tabs=ore'),
      }}
      shadow="none"
      childrenStackProps={{
        spacing: 'xl',
      }}
    >
      <ListDetailsRitageDT
        data={detailsOreRitageDTData}
        columns={[...(renderOtherColumn ?? [])]}
        onOpenModal={onOpenModal}
        tabs="ore"
        fetching={detailsOreRitageDTDataLoading}
        meta={detailsOreRitageDTDataMeta}
        modalProps={{
          actionImageModal: () => setIsOpenImageModal((prev) => !prev),
          isOpenImageModal: isOpenImageModal,
          photos: oreRitage?.photos,
          isLoading: oreRitageLoading,
        }}
      />
    </DashboardCard>
  );
};

export default ReadDTOreRitageBook;
