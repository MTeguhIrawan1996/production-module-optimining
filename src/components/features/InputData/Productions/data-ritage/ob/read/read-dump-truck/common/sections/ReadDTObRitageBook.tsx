import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, ListDetailsRitageDT } from '@/components/elements';

import { useReadDetailsObRitageDT } from '@/services/graphql/query/ob-ritage/useReadDetailsObRitageDT';
import { useReadOneFotoObRitageDT } from '@/services/graphql/query/ob-ritage/useReadOneObRitageDT';

const ReadDTObRitageBook = () => {
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
    >
      <ListDetailsRitageDT
        data={detailsObRitageDTData}
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
        ]}
        onOpenModal={onOpenModal}
        tabs="ob"
        fetching={detailsObRitageDTDataLoading}
        meta={detailsObRitageDTDataMeta}
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
