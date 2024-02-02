import { Flex, Grid, Paper, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import TextInputNative from '@/components/elements/input/TextInputNative';

import { useReadOneWeeklyPlan } from '@/services/graphql/query/plan/weekly/useReadOneWeeklyPlan';

const CommonWeeklyPlanInformation = () => {
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
    <Flex gap={22} direction="column" align="flex-end">
      {/* <PrimaryButton label="Button" /> */}
      <Paper p={24} withBorder w="100%">
        <Stack spacing="md" align="flex-start">
          <Text component="span" fw={500} fz={16}>
            {t('commonTypography.companyInformation')}
          </Text>
          <Grid gutter="md" w="100%">
            <Grid.Col span={6}>
              <TextInputNative
                control="text-input-native"
                name="foo"
                label="companyName"
                disabled
                defaultValue={weeklyPlanData?.company?.name ?? ''}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInputNative
                control="text-input-native"
                name="foo"
                label="year"
                disabled
                defaultValue={`${weeklyPlanData?.year ?? ''}`}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInputNative
                control="text-input-native"
                name="foo"
                label="week"
                disabled
                defaultValue={`${weeklyPlanData?.week ?? ''}`}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Paper>
    </Flex>
  );
};

export default CommonWeeklyPlanInformation;
