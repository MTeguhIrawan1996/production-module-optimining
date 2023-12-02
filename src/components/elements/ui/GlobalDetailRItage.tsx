import { Divider, Stack, Text } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import KeyValueList from '@/components/elements/global/KeyValueList';

import { IReadOneOreRitage } from '@/services/graphql/query/ore-ritage/useReadOneOreRitage';
import { formatDate, secondsDuration } from '@/utils/helper/dateFormat';

interface IGlobalDetailRitageProps<T> {
  data: T;
}

const GlobalDetailRitage = <T extends IReadOneOreRitage>({
  data,
}: IGlobalDetailRitageProps<T>) => {
  const { t } = useTranslation('default');

  return (
    <>
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.checkerInformation')}
        </Text>
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.checkerFromName'),
              value: data?.checkerFrom?.humanResource?.name,
            },
            {
              dataKey: t('commonTypography.fromCheckerPosition'),
              value: data?.checkerFromPosition,
            },
            {
              dataKey: t('commonTypography.checkerToName'),
              value: data?.checkerTo?.humanResource?.name,
            },
            {
              dataKey: t('commonTypography.toCheckerPosition'),
              value: data?.checkerToPosition,
            },
            {
              dataKey: t('commonTypography.shift'),
              value: data?.shift?.name,
            },
            {
              dataKey: t('commonTypography.heavyEquipmentCode'),
              value: data?.companyHeavyEquipment?.hullNumber,
            },
            {
              dataKey: t('commonTypography.heavyEquipmentCodeSubstitution'),
              value: data?.companyHeavyEquipmentChange?.hullNumber,
            },
            {
              dataKey: t('commonTypography.materialType'),
              value: data?.material?.name,
            },
            {
              dataKey: t('commonTypography.materialSub'),
              value: data?.subMaterial?.name,
            },
            {
              dataKey: t('commonTypography.fromAt'),
              value: formatDate(data?.fromAt, 'hh:mm:ss A'),
            },
            {
              dataKey: t('commonTypography.arriveAt'),
              value: formatDate(data?.arriveAt, 'hh:mm:ss A'),
            },
            {
              dataKey: t('commonTypography.ritageDuration'),
              value: secondsDuration(data?.duration ?? null),
            },
            {
              dataKey: t('commonTypography.weather'),
              value: data?.weather?.name,
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
          {t('commonTypography.location')}
        </Text>
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.fromPit'),
              value: data?.fromPit?.name,
            },
            {
              dataKey: t('commonTypography.fromFront'),
              value: data?.fromFront?.name,
            },
            {
              dataKey: t('commonTypography.fromBlock'),
              value: data?.fromBlock?.name,
            },
            {
              dataKey: t('commonTypography.fromGrid'),
              value: data?.fromGrid?.name,
            },
            {
              dataKey: t('commonTypography.fromSequence'),
              value: data?.fromSequence?.name,
            },
            {
              dataKey: t('commonTypography.fromElevasi'),
              value: data?.fromElevation?.name,
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
          {t('commonTypography.level')}
        </Text>
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.fromLevel'),
              value: data?.fromLevel,
            },
            {
              dataKey: t('commonTypography.toLevel'),
              value: data?.toLevel,
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
          {t('commonTypography.arrive')}
        </Text>
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.stockpile'),
              value: data?.stockpile?.name,
            },
            {
              dataKey: t('commonTypography.dome'),
              value: data?.dome?.name,
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
          {t('commonTypography.detail')}
        </Text>
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.bucketVolume'),
              value: `${data?.bucketVolume ?? '-'}`,
            },
            {
              dataKey: t('commonTypography.bulkSamplingDensity'),
              value: `${data?.bulkSamplingDensity ?? '-'}`,
            },
            {
              dataKey: t('commonTypography.tonByRitage'),
              value: `${data?.tonByRitage ?? '-'}`,
            },
            {
              dataKey: t('commonTypography.sampleNumber'),
              value: data?.sampleNumber,
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
              dataKey: t('commonTypography.desc'),
              value: data?.desc,
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
    </>
  );
};

export default GlobalDetailRitage;
