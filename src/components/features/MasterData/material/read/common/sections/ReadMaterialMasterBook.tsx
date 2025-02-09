import { Stack, Tabs, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, KeyValueList } from '@/components/elements';

import { ISubmaterials } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { useReadOneMaterialMaster } from '@/services/graphql/query/material/useReadOneMaterialMaster';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ReadMaterialMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const id = router.query.id as string;

  const isPermissionUpdate = permissions?.includes('update-material');

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
      updateButton={
        isPermissionUpdate
          ? {
              label: 'Edit',
              onClick: () => router.push(`/master-data/material/update/${id}`),
            }
          : undefined
      }
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
          <Stack spacing="sm" mt="sm">
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
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadMaterialMasterBook;
