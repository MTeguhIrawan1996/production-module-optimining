import { Divider, Stack, Tabs, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalHeaderDetail,
  KeyValueList,
} from '@/components/elements';

import { useReadOneHeavyEquipmentMaster } from '@/services/graphql/query/heavy-equipment/useReadOneHeavyEquipmentMaster';

import { IFile } from '@/types/global';

const ReadHeavyEquipmentMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  /* #   /**=========== Query =========== */
  const { heavyEquipmentMasterData, heavyEquipmentMasterDataLoading } =
    useReadOneHeavyEquipmentMaster({
      variables: {
        id,
      },
      skip: !router.isReady,
    });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== PhotosData =========== */
  const photosCallback = React.useCallback(
    (
      { fileName, originalFileName, url }: Omit<IFile, 'mime' | 'path'>,
      i: number
    ) => {
      i;

      return {
        type: i > 0 ? '' : 'photo',
        fileName: originalFileName,
        src: url,
        alt: fileName,
      };
    },
    []
  );
  const photosItem = heavyEquipmentMasterData?.photos?.map(photosCallback);

  const vehicleDocument = heavyEquipmentMasterData?.vehicleNumberPhoto
    ? [
        {
          type: 'vehicleDocument',
          alt: heavyEquipmentMasterData.vehicleNumberPhoto?.fileName,
          fileName:
            heavyEquipmentMasterData.vehicleNumberPhoto?.originalFileName,
          src: heavyEquipmentMasterData.vehicleNumberPhoto.url,
        },
      ]
    : [];

  /* #endregion  /**======== PhotosData =========== */

  return (
    <DashboardCard
      title={t('heavyEquipment.heavyEquipmentTitle')}
      updateButton={{
        label: 'Edit',
        onClick: () => router.push(`/master-data/heavy-equipment/update/${id}`),
      }}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={heavyEquipmentMasterDataLoading}
      enebleBackBottomInner
      paperStackProps={{
        spacing: 'sm',
      }}
    >
      <Tabs
        defaultValue="information"
        radius={4}
        styles={{
          tabsList: {
            flexWrap: 'nowrap',
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="information" fz={14} fw={500}>
            {t('commonTypography.information')}
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="information">
          {!heavyEquipmentMasterDataLoading && heavyEquipmentMasterData ? (
            <>
              <GlobalHeaderDetail
                data={[...vehicleDocument, ...(photosItem ?? [])]}
                title="document"
              />
              <Divider my="md" />
            </>
          ) : null}
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('heavyEquipment.heavyEquipmentIdentity')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.engineNumber'),
                  value: heavyEquipmentMasterData?.engineNumber ?? '-',
                },
                {
                  dataKey: t('commonTypography.frameNumber'),
                  value: heavyEquipmentMasterData?.chassisNumber ?? '-',
                },
                {
                  dataKey: t('heavyEquipment.brandHeavyEquipment'),
                  value:
                    heavyEquipmentMasterData?.reference?.type?.brand?.name ??
                    '-',
                },
                {
                  dataKey: t('heavyEquipment.typeHeavyEquipment'),
                  value: heavyEquipmentMasterData?.reference?.type?.name ?? '-',
                },
                {
                  dataKey: t('commonTypography.model'),
                  value: heavyEquipmentMasterData?.reference?.modelName ?? '-',
                },
                {
                  dataKey: t('commonTypography.specification'),
                  value: heavyEquipmentMasterData?.reference?.spec ?? '-',
                },
                {
                  dataKey: t('commonTypography.class'),
                  value: heavyEquipmentMasterData?.class?.name ?? '-',
                },
                {
                  dataKey: t('heavyEquipment.productionYear'),
                  value: heavyEquipmentMasterData?.createdYear ?? '-',
                },
                {
                  dataKey: t('heavyEquipment.eligibilityStatus'),
                  value:
                    heavyEquipmentMasterData?.eligibilityStatus?.name ?? '-',
                },
              ]}
              type="grid"
              keyStyleText={{
                fw: 400,
                fz: 20,
              }}
              valueStyleText={{
                fw: 600,
                fz: 20,
              }}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadHeavyEquipmentMasterBook;
