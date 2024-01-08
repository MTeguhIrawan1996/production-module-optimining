import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, ListDetailsRitageDT } from '@/components/elements';

import { useReadDetailsQuarryRitageDT } from '@/services/graphql/query/quarry-ritage/useReadDetailsQuarryRitageDT';
import { useReadOneFotoQuarryRitageDT } from '@/services/graphql/query/quarry-ritage/useReadOneQuarryRitageDT';
import { useReadOneQuarryRitageDTOperators } from '@/services/graphql/query/quarry-ritage/useReadOneQuarryRitageDTOperator';

const ReadDTQuarryRitageBook = () => {
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
    quarryRitagesDTData,
    quarryRitagesDTDataLoading,
    quarryRitagesDTDataMeta,
  } = useReadDetailsQuarryRitageDT({
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

  const { quarryDumpTruckRitageDetail, quarryDumpTruckRitageDetailLoading } =
    useReadOneQuarryRitageDTOperators({
      variables: {
        date: date,
        shiftId: shiftId,
        companyHeavyEquipmentId: companyHeavyEquipmentId,
      },
      skip: !router.isReady,
    });

  const { getData, quarryRitage, quarryRitageLoading } =
    useReadOneFotoQuarryRitageDT({});

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
          router.push('/input-data/production/data-ritage?tabs=quarry'),
      }}
      shadow="none"
      childrenStackProps={{
        spacing: 'xl',
      }}
      isLoading={quarryDumpTruckRitageDetailLoading}
    >
      <ListDetailsRitageDT
        data={quarryRitagesDTData}
        operatorDetail={quarryDumpTruckRitageDetail}
        columns={[
          {
            accessor: 'fromPit',
            title: t('commonTypography.fromPit'),
            width: 120,
            render: ({ fromPit }) => fromPit?.name ?? '-',
          },
          {
            accessor: 'toLocation',
            title: t('commonTypography.toLocation'),
            render: ({ toLocationCategory }) => toLocationCategory?.name ?? '-',
          },
          {
            accessor: 'locationName',
            title: t('commonTypography.locationName'),
            render: ({ toLocation }) => toLocation?.name ?? '-',
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
        tabs="quarry"
        fetching={quarryRitagesDTDataLoading}
        meta={quarryRitagesDTDataMeta}
        modalProps={{
          actionImageModal: () => setIsOpenImageModal((prev) => !prev),
          isOpenImageModal: isOpenImageModal,
          photos: quarryRitage?.photos,
          isLoading: quarryRitageLoading,
        }}
      />
    </DashboardCard>
  );
};

export default ReadDTQuarryRitageBook;
