import { DataTableColumn } from 'mantine-datatable';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, ListDetailsRitageDT } from '@/components/elements';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IOtherDetailsRitageOreDT,
  useReadDetailsOreRitageDT,
} from '@/services/graphql/query/ore-ritage/useReadDetailsOreritageDT';
import { useReadOneFotoOreRitageDT } from '@/services/graphql/query/ore-ritage/useReadOneOreRitageDT';
import { useReadOneOreRitageDTOperators } from '@/services/graphql/query/ore-ritage/useReadOneOreRitageDTOperators';

import { IElementsData, IListDetailRitageDTData } from '@/types/global';

const ReadDTOreRitageBook = () => {
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
    detailsOreRitageDTData,
    detailsOreRitageDTDataLoading,
    detailsOreRitageDTDataMeta,
  } = useReadDetailsOreRitageDT({
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

  const { oreDumpTruckRitageDetail, oreDumpTruckRitageDetailLoading } =
    useReadOneOreRitageDTOperators({
      variables: {
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
      const column: DataTableColumn<
        IListDetailRitageDTData<IOtherDetailsRitageOreDT>
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
          router.push('/input-data/production/data-ritage?tabs=ore'),
      }}
      shadow="none"
      childrenStackProps={{
        spacing: 'xl',
      }}
      isLoading={oreDumpTruckRitageDetailLoading}
    >
      <ListDetailsRitageDT
        data={detailsOreRitageDTData}
        operatorDetail={oreDumpTruckRitageDetail}
        columns={[
          {
            accessor: 'fromLevel',
            title: t('commonTypography.fromLevel'),
            render: ({ fromLevel }) => fromLevel ?? '-',
          },
          {
            accessor: 'toLevel',
            title: t('commonTypography.toLevel'),
            render: ({ toLevel }) => toLevel ?? '-',
          },
          {
            accessor: 'dome',
            title: t('commonTypography.dome'),
            render: ({ dome }) => dome?.name ?? '-',
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
