import { Divider, Stack, Tabs, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalHeaderDetail,
  KeyValueList,
} from '@/components/elements';

import { useReadOneSampleHouseLab } from '@/services/graphql/query/sample-house-lab/useReadOneSampleHouseLab';
import { formatDate } from '@/utils/helper/dateFormat';

const ReadSampleHouseLabBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  /* #   /**=========== Query =========== */
  const { houseSampleAndLabMaster, houseSampleAndLabMasterLoading } =
    useReadOneSampleHouseLab({
      variables: {
        id,
      },
      skip: !router.isReady,
    });
  /* #endregion  /**======== Query =========== */

  const yourPhoto = houseSampleAndLabMaster?.photo
    ? [
        {
          type: 'photo',
          alt: houseSampleAndLabMaster?.photo?.fileName,
          fileName: houseSampleAndLabMaster?.photo?.originalFileName,
          src: houseSampleAndLabMaster?.photo?.url,
        },
      ]
    : [];

  return (
    <DashboardCard
      title={t('sampleHouseLab.readSampleHouseLab')}
      updateButton={{
        label: 'Edit',
        onClick: () => router.push(`/master-data/human-resources/update/${id}`),
      }}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      enebleBackBottom
      shadow="xs"
      isLoading={houseSampleAndLabMasterLoading}
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
          {!houseSampleAndLabMasterLoading && houseSampleAndLabMaster ? (
            <>
              <GlobalHeaderDetail data={[...yourPhoto]} title="document" />
              <Divider my="md" />
            </>
          ) : null}
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('sampleHouseLab.qualityMaterialInformation')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.laboratoriumName'),
                  value: houseSampleAndLabMaster?.laboratoriumName,
                },
                {
                  dataKey: t('commonTypography.sampleDate'),
                  value: formatDate(houseSampleAndLabMaster?.sampleDate),
                },
                {
                  dataKey: t('commonTypography.shift'),
                  value: houseSampleAndLabMaster?.shift?.name,
                },
                {
                  dataKey: t('commonTypography.sampleNumber'),
                  value: houseSampleAndLabMaster?.sampleNumber,
                },
                {
                  dataKey: t('commonTypography.sampleName'),
                  value: houseSampleAndLabMaster?.sampleName,
                },
                {
                  dataKey: t('commonTypography.sampleType'),
                  value: houseSampleAndLabMaster?.sampleType?.name,
                },
                {
                  dataKey: t('commonTypography.bulkSamplingCategory'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.bulkSamplingCategorySub'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.samplerName'),
                  value: houseSampleAndLabMaster?.sampler?.humanResource?.name,
                },
                {
                  dataKey: t('commonTypography.location'),
                  value: houseSampleAndLabMaster?.location,
                },
                {
                  dataKey: t('commonTypography.sampleEnterLabAt'),
                  value: formatDate(houseSampleAndLabMaster?.sampleEnterLabAt),
                },
                {
                  dataKey: t('commonTypography.sampleEnterLabHour'),
                  value: '-',
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
          <Divider my="md" />
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.rate')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.province'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.regency'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.subdistrict'),

                  value: '-',
                },
                {
                  dataKey: t('commonTypography.village'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.detailAddress'),
                  value: '-',
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
          <Divider my="md" />
          <Stack spacing="sm">
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.density'),
                  value: '-',
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
          <Divider my="md" />
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.preparationTime')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.preparationStartDate'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.preparationEndDate'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.preparationStartHour'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.preparationEndHour'),
                  value: '-',
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
          <Divider my="md" />
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.analysisTime')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.analysisStartDate'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.analysisEndDate'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.analysisStartHour'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.analysisEndHour'),
                  value: '-',
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
          <Divider my="md" />
          <Stack spacing="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.rate')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.province'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.regency'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.subdistrict'),

                  value: '-',
                },
                {
                  dataKey: t('commonTypography.village'),
                  value: '-',
                },
                {
                  dataKey: t('commonTypography.detailAddress'),
                  value: '-',
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

export default ReadSampleHouseLabBook;
