import { Divider, Stack, Tabs, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalHeaderDetail,
  KeyValueList,
} from '@/components/elements';

import { useReadOneHeavyEquipmentCompany } from '@/services/graphql/query/heavy-equipment/useReadOneHeavyEquipmentCompany';
import { formatDate } from '@/utils/helper/dateFormat';

import { IFile } from '@/types/global';

const ReadCompanyHeavyEquipmentBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const companyId = router.query?.id?.[0] as string;
  const heavyEquipmentId = router.query?.id?.[1] as string;

  /* #   /**=========== Query =========== */
  const { heavyEquipmentCompanyData, heavyEquipmentCompanyDataLoading } =
    useReadOneHeavyEquipmentCompany({
      variables: {
        id: heavyEquipmentId,
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
  const photosItem =
    heavyEquipmentCompanyData?.heavyEquipment?.photos?.map(photosCallback);

  const vehicleDocument = heavyEquipmentCompanyData?.heavyEquipment
    ?.vehicleNumberPhoto
    ? [
        {
          type: 'vehicleDocument',
          alt: heavyEquipmentCompanyData.heavyEquipment?.vehicleNumberPhoto
            ?.fileName,
          fileName:
            heavyEquipmentCompanyData.heavyEquipment?.vehicleNumberPhoto
              ?.originalFileName,
          src: heavyEquipmentCompanyData.heavyEquipment?.vehicleNumberPhoto
            ?.url,
        },
      ]
    : [];

  /* #endregion  /**======== PhotosData =========== */

  return (
    <DashboardCard
      title={t('commonTypography.heavyEquipment')}
      updateButton={{
        label: 'Edit',
        onClick: () =>
          router.push(
            `/master-data/company/update/heavy-equipment/${companyId}/${heavyEquipmentId}`
          ),
      }}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={heavyEquipmentCompanyDataLoading}
      enebleBackBottomInner={{
        onClick: () => router.push(`/master-data/company/read/${companyId}`),
      }}
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
          {!heavyEquipmentCompanyDataLoading && heavyEquipmentCompanyData ? (
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
                  dataKey: t('commonTypography.heavyEquipmentCode'),
                  value: heavyEquipmentCompanyData?.hullNumber,
                },
                {
                  dataKey: t('commonTypography.engineNumber'),
                  value:
                    heavyEquipmentCompanyData?.heavyEquipment?.engineNumber ??
                    '-',
                },
                {
                  dataKey: t('commonTypography.frameNumber'),
                  value:
                    heavyEquipmentCompanyData?.heavyEquipment?.chassisNumber ??
                    '-',
                },
                {
                  dataKey: t('heavyEquipment.brandHeavyEquipment'),
                  value:
                    heavyEquipmentCompanyData?.heavyEquipment?.reference?.type
                      ?.brand?.name,
                },
                {
                  dataKey: t('heavyEquipment.typeHeavyEquipment'),
                  value:
                    heavyEquipmentCompanyData?.heavyEquipment?.reference?.type
                      ?.name ?? '-',
                },
                {
                  dataKey: t('commonTypography.model'),
                  value:
                    heavyEquipmentCompanyData?.heavyEquipment?.reference
                      ?.modelName ?? '-',
                },
                {
                  dataKey: t('commonTypography.specification'),
                  value:
                    heavyEquipmentCompanyData?.heavyEquipment?.reference
                      ?.spec ?? '-',
                },
                {
                  dataKey: t('commonTypography.class'),
                  value:
                    heavyEquipmentCompanyData?.heavyEquipment?.class?.name ??
                    '-',
                },
                {
                  dataKey: t('heavyEquipment.eligibilityStatus'),
                  value:
                    heavyEquipmentCompanyData?.heavyEquipment?.eligibilityStatus
                      ?.name ?? '-',
                },
                {
                  dataKey: t('heavyEquipment.productionYear'),
                  value:
                    heavyEquipmentCompanyData?.heavyEquipment?.createdYear ??
                    '-',
                },
                {
                  dataKey: t('heavyEquipment.productionYear'),
                  value:
                    heavyEquipmentCompanyData?.heavyEquipment?.createdYear ??
                    '-',
                },
                {
                  dataKey: t('commonTypography.startDate'),
                  value:
                    formatDate(heavyEquipmentCompanyData?.startDate ?? '') ??
                    '-',
                },
                {
                  dataKey: t('commonTypography.endDate'),
                  value:
                    formatDate(heavyEquipmentCompanyData?.endDate ?? '') ?? '-',
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

export default ReadCompanyHeavyEquipmentBook;
