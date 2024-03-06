import { Stack, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, KeyValueList } from '@/components/elements';

import { useReadOneWHPMaster } from '@/services/graphql/query/working-hours-plan/useReadOneWHPMaster';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ReadWorkingHoursPlanBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionUpdate = permissions?.includes('update-working-hour-plan');

  /* #   /**=========== Query =========== */
  const { workingHourPlanMaster, workingHourPlanMasterLoading } =
    useReadOneWHPMaster({
      variables: {
        id,
      },
      skip: !router.isReady,
    });
  /* #endregion  /**======== Query =========== */

  return (
    <DashboardCard
      title={t('commonTypography.workingHoursPlan')}
      updateButton={
        isPermissionUpdate
          ? {
              label: 'Edit',
              onClick: () =>
                router.push(`/master-data/working-hours-plan/update/${id}`),
            }
          : undefined
      }
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={workingHourPlanMasterLoading}
      enebleBackBottomInner={{
        onClick: () => router.push('/master-data/working-hours-plan'),
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
          <Stack spacing="sm" mt="sm">
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.activity'),
                  value: workingHourPlanMaster?.activityName ?? '-',
                },
              ]}
              type="grid"
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadWorkingHoursPlanBook;
