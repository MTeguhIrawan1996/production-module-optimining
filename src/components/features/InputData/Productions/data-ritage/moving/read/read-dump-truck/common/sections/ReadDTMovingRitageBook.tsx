import { DataTableColumn } from 'mantine-datatable';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, ListDetailsRitageDT } from '@/components/elements';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IOtherDetailsRitageMovingDT,
  useReadDetailsMovingRitageDT,
} from '@/services/graphql/query/moving-ritage/useReadDetailsMovingRitageDT';
import { useReadOneFotoMovingRitageDT } from '@/services/graphql/query/moving-ritage/useReadOneMovingRitageDT';

import { IElementsData, IListDetailRitageDTData } from '@/types/global';

const ReadDTMovingRitageBook = () => {
  const { t } = useTranslation('default');
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
    detailsMovingRitageDT,
    detailsMovingRitageDTLoading,
    detailsMovingRitageDTMeta,
  } = useReadDetailsMovingRitageDT({
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

  const { getData, movingRitage, movingRitageLoading } =
    useReadOneFotoMovingRitageDT({});

  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
  });

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<
        IListDetailRitageDTData<IOtherDetailsRitageMovingDT>
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
          router.push('/input-data/production/data-ritage?tabs=moving'),
      }}
      shadow="none"
      childrenStackProps={{
        spacing: 'xl',
      }}
    >
      <ListDetailsRitageDT
        data={detailsMovingRitageDT}
        columns={[
          {
            accessor: 'fromDome',
            title: t('commonTypography.fromDome'),
            render: ({ fromDome }) => fromDome?.name ?? '-',
          },
          {
            accessor: 'toDome',
            title: t('commonTypography.toDome'),
            render: ({ toDome }) => toDome?.name ?? '-',
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
        tabs="moving"
        fetching={detailsMovingRitageDTLoading}
        meta={detailsMovingRitageDTMeta}
        modalProps={{
          actionImageModal: () => setIsOpenImageModal((prev) => !prev),
          isOpenImageModal: isOpenImageModal,
          photos: movingRitage?.photos,
          isLoading: movingRitageLoading,
        }}
      />
    </DashboardCard>
  );
};

export default ReadDTMovingRitageBook;
