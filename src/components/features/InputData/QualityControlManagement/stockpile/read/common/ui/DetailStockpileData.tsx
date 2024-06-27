import { Divider, Stack, Text } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  GlobalAlert,
  GlobalHeaderDetail,
  KeyValueList,
} from '@/components/elements';
import BargingDataTable from '@/components/features/InputData/QualityControlManagement/stockpile/read/common/elements/BargingDataTable';
import MovingDataTable from '@/components/features/InputData/QualityControlManagement/stockpile/read/common/elements/MovingDataTable';
import ReopenDataTable from '@/components/features/InputData/QualityControlManagement/stockpile/read/common/elements/ReopenDataTable';
import RitageDataTable from '@/components/features/InputData/QualityControlManagement/stockpile/read/common/elements/RitageDataTable';
import SurveyDataTable from '@/components/features/InputData/QualityControlManagement/stockpile/read/common/elements/SurveyDataTable';

import { IReadOneStockpileMonitoringDetail } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringDetail';
import { formatDate } from '@/utils/helper/dateFormat';

interface IDetailStockpileDataProps {
  monitoringStockpile?: IReadOneStockpileMonitoringDetail;
  monitoringStockpileLoading?: boolean;
}

const DetailStockpileData: React.FC<IDetailStockpileDataProps> = ({
  monitoringStockpile,
  monitoringStockpileLoading,
}) => {
  const { t } = useTranslation('default');

  const photo = monitoringStockpile?.photo
    ? [
        {
          type: 'photo',
          alt: monitoringStockpile?.photo?.fileName,
          fileName: monitoringStockpile?.photo?.originalFileName,
          src: monitoringStockpile?.photo?.url,
        },
      ]
    : [];

  return (
    <>
      {monitoringStockpile?.status?.id ===
      'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
        <GlobalAlert
          description={monitoringStockpile?.statusMessage ?? ''}
          title={t('commonTypography.invalidData')}
          color="red"
          mt="xs"
        />
      ) : null}
      {monitoringStockpile?.status?.id ===
      '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
        <GlobalAlert
          description={monitoringStockpile?.statusMessage ?? ''}
          title={t('commonTypography.rejectedData')}
          color="red"
          mt="xs"
        />
      ) : null}
      <Stack spacing="sm" mt="sm">
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.date'),
              value: formatDate(monitoringStockpile?.createdAt) ?? '-',
            },
          ]}
          type="grid"
        />
      </Stack>
      {!monitoringStockpileLoading && monitoringStockpile ? (
        <>
          <GlobalHeaderDetail data={[...photo]} title="document" pt="md" />
          <Divider my="md" />
        </>
      ) : null}
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.stockpileInformation')}
        </Text>
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.stockpileName'),
              value: monitoringStockpile?.dome?.stockpile.name ?? '-',
            },
            {
              dataKey: t('commonTypography.domeId'),
              value: monitoringStockpile?.dome?.handBookId ?? '-',
            },
            {
              dataKey: t('commonTypography.domeName'),
              value: monitoringStockpile?.dome?.name ?? '-',
            },
            {
              dataKey: t('commonTypography.materialType'),
              value: monitoringStockpile?.material?.name ?? '-',
            },
            {
              dataKey: t('commonTypography.domeStatus'),
              value: monitoringStockpile?.domeStatus ?? '-',
            },
            {
              dataKey: t('commonTypography.stockMaterial'),
              value: monitoringStockpile?.stockMaterial ?? '-',
            },
          ]}
          type="grid"
        />
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.time')}
        </Text>
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.startOpen'),
              value: formatDate(monitoringStockpile?.openAt) ?? '-',
            },
            {
              dataKey: t('commonTypography.endOpen'),
              value: formatDate(monitoringStockpile?.closeAt) ?? '-',
            },
            {
              dataKey: t('commonTypography.openTime'),
              value:
                formatDate(monitoringStockpile?.openAt, 'hh:mm:ss A') ?? '-',
            },
            {
              dataKey: t('commonTypography.closeTime'),
              value:
                formatDate(monitoringStockpile?.closeAt, 'hh:mm:ss A') ?? '-',
            },
          ]}
          type="grid"
        />
      </Stack>
      <Divider my="md" />
      <SurveyDataTable />
      <Divider my="md" />
      <RitageDataTable />
      <Divider my="md" />
      <BargingDataTable />
      <Divider my="md" />
      <MovingDataTable />
      <Divider my="md" />
      <ReopenDataTable />
      <Divider my="md" />
      <Stack spacing="sm">
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.desc'),
              value: monitoringStockpile?.desc,
            },
          ]}
          type="grid"
        />
      </Stack>
    </>
  );
};

export default DetailStockpileData;
