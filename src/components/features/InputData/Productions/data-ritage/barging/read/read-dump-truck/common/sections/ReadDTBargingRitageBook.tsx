import { DataTableColumn } from 'mantine-datatable';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, ListDetailsRitageDT } from '@/components/elements';

import {
  IOtherReadDetailsBargingRitageDT,
  useReadDetailsBargingRitageDT,
} from '@/services/graphql/query/barging-ritage/useReadDetailsBargingRitageDT';
import { useReadOneFotoBargingRitageDT } from '@/services/graphql/query/barging-ritage/useReadOneBargingRitageDT';
import { useReadOneBargingRitageDTOperators } from '@/services/graphql/query/barging-ritage/useReadOneBargingRitageDTOperators';
import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';

import { IElementsData, IListDetailRitageDTData } from '@/types/global';

const ReadDTBargingRitageBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const [page, setPage] = React.useState<number>(1);
  const date = router.query?.id?.[0] as string;
  const shiftId = router.query?.id?.[1] as string;
  const companyHeavyEquipmentId = router.query?.id?.[2] as string;
  const [isOpenImageModal, setIsOpenImageModal] =
    React.useState<boolean>(false);

  /* #   /**=========== Query =========== */
  const {
    detailsBargingRitagesDT,
    detailsBargingRitagesDTLoading,
    detailsBargingRitagesDTMeta,
  } = useReadDetailsBargingRitageDT({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      date: date,
      shiftId: shiftId,
      companyHeavyEquipmentId: companyHeavyEquipmentId,
    },
    skip: !router.isReady,
  });

  const { bargingDumpTruckRitageDetail, bargingDumpTruckRitageDetailLoading } =
    useReadOneBargingRitageDTOperators({
      variables: {
        date: date,
        shiftId: shiftId,
        companyHeavyEquipmentId: companyHeavyEquipmentId,
      },
      skip: !router.isReady,
    });

  const { getData, bargingRitage, bargingRitageLoading } =
    useReadOneFotoBargingRitageDT({});

  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
    fetchPolicy: 'cache-and-network',
  });

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<
        IListDetailRitageDTData<IOtherReadDetailsBargingRitageDT>
      > = {
        accessor: `${element.name}`,
        title: `${element.name}`,
        render: ({ houseSampleAndLab }) => {
          const value = houseSampleAndLab?.elements?.find(
            (val) => val.element?.id === element.id
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
          router.push('/input-data/production/data-ritage?tabs=barging'),
      }}
      shadow="none"
      childrenStackProps={{
        spacing: 'xl',
      }}
      isLoading={bargingDumpTruckRitageDetailLoading}
    >
      <ListDetailsRitageDT
        data={detailsBargingRitagesDT}
        operatorDetail={bargingDumpTruckRitageDetail}
        columns={[
          {
            accessor: 'fromStockpile',
            title: t('commonTypography.fromStockpile'),
            render: ({ dome }) => dome?.stockpile?.name ?? '-',
          },
          {
            accessor: 'dome',
            title: t('commonTypography.dome'),
            render: ({ dome }) => dome?.name ?? '-',
          },
          {
            accessor: 'toBarging',
            title: t('commonTypography.toBarging'),
            render: ({ barging }) => barging?.name ?? '-',
          },
          {
            accessor: 'bucketVolume',
            title: t('commonTypography.bucketVolume'),
            render: ({ bucketVolume }) => bucketVolume ?? '-',
          },
          {
            accessor: 'tonByRitage',
            title: t('commonTypography.tonByRitage'),
            render: ({ tonByRitage }) => tonByRitage ?? '-',
          },
          {
            accessor: 'sampleNumber',
            title: t('commonTypography.sampleNumber'),
            render: ({ sampleNumber }) => sampleNumber ?? '-',
          },
          ...(renderOtherColumn ?? []),
        ]}
        onOpenModal={onOpenModal}
        // tabs="barging"
        fetching={detailsBargingRitagesDTLoading}
        meta={detailsBargingRitagesDTMeta}
        page={page}
        setPage={setPage}
        modalProps={{
          actionImageModal: () => setIsOpenImageModal((prev) => !prev),
          isOpenImageModal: isOpenImageModal,
          photos: bargingRitage?.photos,
          isLoading: bargingRitageLoading,
        }}
      />
    </DashboardCard>
  );
};

export default ReadDTBargingRitageBook;
