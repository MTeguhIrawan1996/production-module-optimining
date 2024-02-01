import { Divider, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { KeyValueList } from '@/components/elements';

import { useReadOneWeeklyPlan } from '@/services/graphql/query/plan/weekly/useReadOneWeeklyPlan';

const WeeklyPlanInformationData = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  const { weeklyPlanData } = useReadOneWeeklyPlan({
    variables: {
      id,
    },
    skip: !router.isReady,
  });

  return (
    <>
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.weeklyPlanInformation')}
        </Text>
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.companyName'),
              value: weeklyPlanData?.company?.name ?? '-',
            },
            {
              dataKey: t('commonTypography.year'),
              value: `${weeklyPlanData?.year ?? '-'}`,
            },
            {
              dataKey: t('commonTypography.week'),
              value: `${weeklyPlanData?.week ?? '-'}`,
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
    </>
  );
};

export default WeeklyPlanInformationData;
