import { Stack, Tabs, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, KeyValueList } from '@/components/elements';

import { useReadOneLocationMaster } from '@/services/graphql/query/location/useReadOneLocationMaster';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ReadLocationMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const id = router.query.id as string;

  const isPermissionUpdate = permissions?.includes('update-location');

  /* #   /**=========== Query =========== */
  const { locationMaster, locationMasterLoading } = useReadOneLocationMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
  });
  /* #endregion  /**======== Query =========== */

  return (
    <DashboardCard
      title={t('commonTypography.location')}
      updateButton={
        isPermissionUpdate
          ? {
              label: 'Edit',
              onClick: () => router.push(`/master-data/location/update/${id}`),
            }
          : undefined
      }
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={locationMasterLoading}
      enebleBackBottomInner={{
        onClick: () => router.push('/master-data/location'),
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
            <Text fz={24} fw={600} color="brand">
              {t('location.readLocation')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.locationId'),
                  value: locationMaster?.handBookId ?? '-',
                },
                {
                  dataKey: t('commonTypography.locationCategory'),
                  value: locationMaster?.category?.name ?? '-',
                },
                {
                  dataKey: t('commonTypography.locationName'),
                  value: locationMaster?.name ?? '-',
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

export default ReadLocationMasterBook;
