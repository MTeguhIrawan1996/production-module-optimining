import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';

import { DashboardCard, ListDetailsRitageDT } from '@/components/elements';

import { useReadDetailsOreRitageDT } from '@/services/graphql/query/ore-ritage/useReadDetailsOreritageDT';

const ReadOreDumpTruckBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('p')) || 1;
  const date = router.query?.id?.[0] as string;
  const shiftId = router.query?.id?.[1] as string;
  const companyHeavyEquipmentId = router.query?.id?.[2] as string;

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
        tabs="ore"
        fetching={detailsOreRitageDTDataLoading}
        meta={detailsOreRitageDTDataMeta}
      />
    </DashboardCard>
  );
};

export default ReadOreDumpTruckBook;
