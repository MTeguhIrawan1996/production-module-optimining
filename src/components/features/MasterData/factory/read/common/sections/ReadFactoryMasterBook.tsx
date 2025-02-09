import { Stack, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, KeyValueList } from '@/components/elements';

import { useReadOneFactoryMaster } from '@/services/graphql/query/factory/useReadOneFactoryMaster';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ReadFactoryMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const id = router.query.id as string;

  const isPermissionUpdate = permissions?.includes('update-factory');

  /* #   /**=========== Query =========== */
  const { factoryMaster, factoryMasterLoading } = useReadOneFactoryMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
  });
  /* #endregion  /**======== Query =========== */

  return (
    <DashboardCard
      title={t('commonTypography.factory')}
      updateButton={
        isPermissionUpdate
          ? {
              label: 'Edit',
              onClick: () => router.push(`/master-data/factory/update/${id}`),
            }
          : undefined
      }
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={factoryMasterLoading}
      enebleBackBottomInner={{
        onClick: () => router.push('/master-data/factory'),
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
                  dataKey: t('commonTypography.category'),
                  value: factoryMaster?.category.name ?? '-',
                },
                {
                  dataKey: t('commonTypography.factoryName'),
                  value: factoryMaster?.name ?? '-',
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

export default ReadFactoryMasterBook;
