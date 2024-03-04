import { Divider, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { KeyValueList } from '@/components/elements';

import { useReadOneMonthlyPlan } from '@/services/graphql/query/plan/monthly/useReadOneMonthlyPlan';
import dayjs from '@/utils/helper/dayjs.config';
import { getWeeksInMonth } from '@/utils/helper/getWeeksInMonth';
import { useStoreWeeklyInMonthly } from '@/utils/store/useWeekInMonthlyStore';

const MonthlyPlanInformationData = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [setWeeklyInMonthly] = useStoreWeeklyInMonthly(
    (state) => [state.setWeeklyInMonthly],
    shallow
  );

  const { monthlyPlanData } = useReadOneMonthlyPlan({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: (data) => {
      const weekInMonth = getWeeksInMonth(
        `${data.monthlyPlan.year}`,
        `${data.monthlyPlan.month}`
      );
      setWeeklyInMonthly(weekInMonth);
    },
  });

  return (
    <>
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.monthlyPlanInformation')}
        </Text>
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.companyName'),
              value: monthlyPlanData?.company?.name ?? '-',
            },
            {
              dataKey: t('commonTypography.year'),
              value: `${monthlyPlanData?.year ?? '-'}`,
            },
            {
              dataKey: t('commonTypography.month'),
              value: monthlyPlanData?.month
                ? `${dayjs()
                    .month(monthlyPlanData.month - 1)
                    .format('MMMM')}`
                : '-',
            },
          ]}
          type="grid"
        />
      </Stack>
      <Divider my="md" />
    </>
  );
};

export default MonthlyPlanInformationData;
