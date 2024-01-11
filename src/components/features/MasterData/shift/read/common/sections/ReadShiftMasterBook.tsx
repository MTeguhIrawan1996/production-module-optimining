import { Stack, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, KeyValueList } from '@/components/elements';

import { useReadOneShiftMaster } from '@/services/graphql/query/shift/useReadOneElementMaster';
import { hourFromat } from '@/utils/helper/hourFromat';

const ReadShiftMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  /* #   /**=========== Query =========== */
  const { shiftMaster, shiftMasterLoading } = useReadOneShiftMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
  });
  /* #endregion  /**======== Query =========== */

  return (
    <DashboardCard
      title={t('commonTypography.shift')}
      updateButton={{
        label: 'Edit',
        onClick: () => router.push(`/master-data/shift/update/${id}`),
      }}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={shiftMasterLoading}
      enebleBackBottomInner={{
        onClick: () => router.push('/master-data/shift'),
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
                  dataKey: t('commonTypography.shift'),
                  value: shiftMaster?.name ?? '-',
                },
                {
                  dataKey: t('commonTypography.startHour'),
                  value: hourFromat(shiftMaster?.startHour),
                },
                {
                  dataKey: t('commonTypography.endHour'),
                  value: hourFromat(shiftMaster?.endHour),
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

export default ReadShiftMasterBook;
