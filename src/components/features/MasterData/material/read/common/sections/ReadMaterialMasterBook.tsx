import { Stack, Tabs, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, KeyValueList } from '@/components/elements';

import { ISubmaterials } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { useReadOneMaterialMaster } from '@/services/graphql/query/material/useReadOneMaterialMaster';

const ReadMaterialMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  /* #   /**=========== Query =========== */
  const { materialMaster, materialMasterLoading } = useReadOneMaterialMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
  });
  /* #endregion  /**======== Query =========== */

  const renderModel = React.useCallback((value: ISubmaterials) => {
    return {
      dataKey: t('commonTypography.subMaterialType'),
      value: `${value.name}`,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const subMaterial = materialMaster?.subMaterials?.map(renderModel);

  return (
    <DashboardCard
      title={t('commonTypography.material')}
      updateButton={{
        label: 'Edit',
        onClick: () => router.push(`/master-data/material/update/${id}`),
      }}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={materialMasterLoading}
      enebleBackBottomInner={{
        onClick: () => router.push('/master-data/material'),
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
            <Text fz={24} fw={600} color="brand">
              {t('material.readMaterial')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.materialType'),
                  value: materialMaster?.name ?? '-',
                },
                ...(subMaterial ?? []),
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

export default ReadMaterialMasterBook;
