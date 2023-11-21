import { Stack, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, KeyValueList } from '@/components/elements';

import { useReadOneActivityPlanMaster } from '@/services/graphql/query/activity-plan/useReadOneActivityPlanMaster';

const ReadActivityPlanBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  /* #   /**=========== Query =========== */
  const { activityPlanMaster, activityPlanMasterLoading } =
    useReadOneActivityPlanMaster({
      variables: {
        id,
      },
      skip: !router.isReady,
    });
  /* #endregion  /**======== Query =========== */

  return (
    <DashboardCard
      title={t('commonTypography.activityPlan')}
      updateButton={{
        label: 'Edit',
        onClick: () => router.push(`/master-data/activity-plan/update/${id}`),
      }}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={activityPlanMasterLoading}
      enebleBackBottomInner={{
        onClick: () => router.back(),
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
          <Stack spacing="sm" mt="lg">
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.activityPlan'),
                  value: activityPlanMaster?.name ?? '-',
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

export default ReadActivityPlanBook;
