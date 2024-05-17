import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, ListDetailsRitageDT } from '@/components/elements';

import { useReadDetailsObRitageDT } from '@/services/graphql/query/ob-ritage/useReadDetailsObRitageDT';
import { useReadOneFotoObRitageDT } from '@/services/graphql/query/ob-ritage/useReadOneObRitageDT';
import { useReadOneObRitageDTOperators } from '@/services/graphql/query/ob-ritage/useReadOneObRitageDTOperators';

const ReadDTObRitageBook = () => {
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
    detailsObRitageDTData,
    detailsObRitageDTDataLoading,
    detailsObRitageDTDataMeta,
  } = useReadDetailsObRitageDT({
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

  const {
    overburdenDumpTruckRitageDetail,
    overburdenDumpTruckRitageDetailLoading,
  } = useReadOneObRitageDTOperators({
    variables: {
      date: date,
      shiftId: shiftId,
      companyHeavyEquipmentId: companyHeavyEquipmentId,
    },
    skip: !router.isReady,
  });

  const { getData, overburdenRitage, overburdenRitageLoading } =
    useReadOneFotoObRitageDT({});

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
          router.push('/input-data/production/data-ritage?tabs=ob'),
      }}
      shadow="none"
      childrenStackProps={{
        spacing: 'xl',
      }}
      isLoading={overburdenDumpTruckRitageDetailLoading}
    >
      <ListDetailsRitageDT
        data={detailsObRitageDTData}
        operatorDetail={overburdenDumpTruckRitageDetail}
        columns={[
          {
            accessor: 'fromPit',
            title: t('commonTypography.fromPit'),
            width: 120,
            render: ({ fromPit }) => fromPit?.name ?? '-',
          },
          {
            accessor: 'toDisposal',
            title: t('commonTypography.toDisposal'),
            render: ({ disposal }) => disposal?.name ?? '-',
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
        ]}
        subMaterialHidden
        onOpenModal={onOpenModal}
        // tabs="ob"
        fetching={detailsObRitageDTDataLoading}
        meta={detailsObRitageDTDataMeta}
        page={page}
        setPage={setPage}
        modalProps={{
          actionImageModal: () => setIsOpenImageModal((prev) => !prev),
          isOpenImageModal: isOpenImageModal,
          photos: overburdenRitage?.photos,
          isLoading: overburdenRitageLoading,
        }}
      />
    </DashboardCard>
  );
};

export default ReadDTObRitageBook;
