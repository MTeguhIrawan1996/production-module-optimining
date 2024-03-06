import { Stack, Text } from '@mantine/core';
import { IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalActionTable,
  GlobalModal,
  MantineDataTable,
  NextImageFill,
} from '@/components/elements';
import WeeklyPlanInformationData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/WeeklyPlanInformationData';

import {
  IReadOneMiningMapPlanData,
  useReadOneMiningMapPlan,
} from '@/services/graphql/query/plan/weekly/mining-map-plan/useReadOneMiningMapPlan';

const MiningMapPlanData = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;
  const page = Number(router.query.page) || 1;
  const [modalData, setModalData] = React.useState<
    IReadOneMiningMapPlanData | undefined
  >(undefined);
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const isImage = IMAGE_MIME_TYPE.includes(modalData?.file.mime as any);

  const {
    weeklyMiningPlanData: data,
    weeklyMiningPlanMeta: meta,
    weeklyMiningPlanDataLoading,
  } = useReadOneMiningMapPlan({
    variables: {
      weeklyPlanId: id,
      orderBy: 'createdAt',
      orderDir: 'desc',
    },
    skip: !router.isReady || tabs !== 'miningMapPlan',
  });

  const handleSetPage = (page: number) => {
    const urlSet = `/plan/weekly/read/weekly-plan-group/${id}?tabs=${tabs}&page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  return (
    <>
      <WeeklyPlanInformationData />
      <DashboardCard p={0}>
        <Stack spacing="sm">
          <Text fz={24} fw={600} color="brand">
            {t('commonTypography.unitCapacityPlanInformation')}
          </Text>
          <MantineDataTable
            tableProps={{
              records: data ?? [],
              fetching: weeklyMiningPlanDataLoading,
              columns: [
                {
                  accessor: 'mapName',
                  title: t('commonTypography.mapName'),
                },
                {
                  accessor: 'category',
                  title: t('commonTypography.category'),
                  render: ({ locationCategory }) =>
                    locationCategory.name || '-',
                },
                {
                  accessor: 'location',
                  title: t('commonTypography.location'),
                  render: ({ location }) => location.name || '-',
                },
                {
                  accessor: 'map',
                  title: t('commonTypography.map'),
                  render: (record) => {
                    return (
                      <GlobalActionTable
                        actionRead={{
                          onClick: (e) => {
                            e.stopPropagation();
                            setModalData(record);
                            setIsOpenModal((prev) => !prev);
                          },
                        }}
                      />
                    );
                  },
                },
              ],
              shadow: 'none',
            }}
            emptyStateProps={{
              title: t('commonTypography.dataNotfound'),
            }}
            paginationProps={{
              setPage: handleSetPage,
              currentPage: page,
              totalAllData: meta?.totalAllData ?? 0,
              totalData: meta?.totalData ?? 0,
              totalPage: meta?.totalPage ?? 0,
            }}
          />
        </Stack>
        <GlobalModal
          actionModal={() => setIsOpenModal((prev) => !prev)}
          isOpenModal={isOpenModal}
          scrollAreaProps={{
            h: 'calc(100vh - 12rem)',
          }}
          label={modalData?.mapName || '-'}
          modalSize="70%"
        >
          {isImage ? (
            <NextImageFill
              alt={modalData?.file.fileName || ''}
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${
                modalData?.file?.url || ''
              }`}
              figureProps={{
                w: '100%',
                h: 'calc(100vh - 13rem)',
                radius: 'sm',
              }}
            />
          ) : (
            <iframe
              style={{
                width: '100%',
                height: 'calc(100vh - 14rem)',
                borderRadius: 8,
                borderWidth: 4,
              }}
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${
                modalData?.file?.url || ''
              }`}
              loading="lazy"
            />
          )}
        </GlobalModal>
      </DashboardCard>
    </>
  );
};

export default MiningMapPlanData;
