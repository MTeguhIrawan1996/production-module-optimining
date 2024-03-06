import { Flex, Grid, Paper, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import DashboardCard from '@/components/elements/card/DashboardCard';
import TextInputNative from '@/components/elements/input/TextInputNative';

import { useReadOneMonthlyPlan } from '@/services/graphql/query/plan/monthly/useReadOneMonthlyPlan';
import dayjs from '@/utils/helper/dayjs.config';
import { getWeeksInMonth } from '@/utils/helper/getWeeksInMonth';
import { useStoreWeeklyInMonthly } from '@/utils/store/useWeekInMonthlyStore';

const CommonMonthlyPlanInformation = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [setWeeklyInMonthly] = useStoreWeeklyInMonthly(
    (state) => [state.setWeeklyInMonthly],
    shallow
  );

  const { monthlyPlanData, monthlyPlanDataLoading } = useReadOneMonthlyPlan({
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
    <DashboardCard p={0} isLoading={monthlyPlanDataLoading}>
      <Flex gap={22} direction="column" align="flex-end">
        {/* <PrimaryButton label="Button" /> */}
        <Paper p={24} withBorder w="100%">
          <Stack spacing="md">
            <Text component="span" fw={500} fz={16}>
              {t('commonTypography.companyInformation')}
            </Text>
            <Grid gutter="md">
              <Grid.Col span={6}>
                <TextInputNative
                  control="text-input-native"
                  name="companyName"
                  label="companyName"
                  disabled
                  defaultValue={monthlyPlanData?.company?.name ?? ''}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInputNative
                  control="text-input-native"
                  name="year"
                  label="year"
                  disabled
                  defaultValue={`${monthlyPlanData?.year ?? ''}`}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInputNative
                  control="text-input-native"
                  name="month"
                  label="month"
                  disabled
                  defaultValue={`${
                    monthlyPlanData?.month
                      ? dayjs()
                          .month(monthlyPlanData.month - 1)
                          .format('MMMM')
                      : ''
                  }`}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      </Flex>
    </DashboardCard>
  );
};

export default CommonMonthlyPlanInformation;
