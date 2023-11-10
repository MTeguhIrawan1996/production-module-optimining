import { Divider, Stack, Tabs, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalHeaderDetail,
  KeyValueList,
} from '@/components/elements';

import { useReadOneHeavyEquipmentReference } from '@/services/graphql/query/heavy-equipment/useReadOneHeavyEquipment';

import { IFile } from '@/types/global';

const ReadHEavyEquipmentBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  /* #   /**=========== Query =========== */
  const { heavyEquipmentReferenceData, heavyEquipmentReferenceDataLoading } =
    useReadOneHeavyEquipmentReference({
      variables: {
        id,
      },
      skip: !router.isReady,
    });
  const { modelYear, modelName, spec, type } =
    heavyEquipmentReferenceData || {};
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== PhotosData =========== */
  const photosCallback = React.useCallback(
    (
      { fileName, originalFileName, url }: Omit<IFile, 'mime' | 'path'>,
      i: number
    ) => {
      return {
        type: i > 0 ? '' : 'photo',
        fileName: originalFileName,
        src: url,
        alt: fileName,
      };
    },
    []
  );
  const photosItem = heavyEquipmentReferenceData?.photos?.map(photosCallback);
  /* #endregion  /**======== PhotosData =========== */

  return (
    <DashboardCard
      title={t('heavyEquipment.heavyEquipmentTitle')}
      updateButton={{
        label: 'Edit',
        onClick: () => router.push(`/reference/heavy-equipment/update/${id}`),
      }}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={heavyEquipmentReferenceDataLoading}
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
          {!heavyEquipmentReferenceDataLoading && photosItem ? (
            <>
              <GlobalHeaderDetail data={photosItem} title="document" />
              <Divider my="md" />
            </>
          ) : null}
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('heavyEquipment.informationHeavyEquipment')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.brand'),
                  value: type?.brand.name ?? '-',
                },
                {
                  dataKey: t('commonTypography.type'),
                  value: type?.name ?? '-',
                },
                {
                  dataKey: t('commonTypography.model'),

                  value: modelName ?? '-',
                },
                {
                  dataKey: t('heavyEquipment.specHeavyEquipment'),
                  value: spec ?? '-',
                },
                {
                  dataKey: t('heavyEquipment.productionYear'),
                  value: modelYear ?? '-',
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

export default ReadHEavyEquipmentBook;
