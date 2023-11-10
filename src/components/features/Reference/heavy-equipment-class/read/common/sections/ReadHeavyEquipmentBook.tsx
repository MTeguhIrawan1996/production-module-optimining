import { Stack, Tabs, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, KeyValueList } from '@/components/elements';

import {
  IHeavyEquipmentClassModel,
  useReadOneHeavyEquipmentClass,
} from '@/services/graphql/query/heavy-equipment-class/useReadOneHeavyEquipmentClass';

const ReadHEavyEquipmentClassBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;

  /* #   /**=========== Query =========== */
  const { heavyEquipmentClassData, heavyEquipmentClassDataLoading } =
    useReadOneHeavyEquipmentClass({
      variables: {
        id,
      },
      skip: !router.isReady,
    });
  const { heavyEquipmentReferences, name } = heavyEquipmentClassData || {};

  /* #endregion  /**======== Query =========== */

  const renderModel = React.useCallback((value: IHeavyEquipmentClassModel) => {
    return {
      dataKey: t('commonTypography.model'),
      value: value.modelName,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const modelItems = heavyEquipmentReferences?.map(renderModel);

  return (
    <DashboardCard
      title={t('heavyEquipmentClass.heavyEquipmentClassTitle')}
      updateButton={{
        label: 'Edit',
        onClick: () =>
          router.push(`/reference/heavy-equipment-class/update/${id}`),
      }}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={heavyEquipmentClassDataLoading}
      enebleBackBottomInner
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
        <Tabs.List mb="md">
          <Tabs.Tab value="information" fz={14} fw={500}>
            {t('commonTypography.information')}
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="information">
          <Stack spacing="sm">
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.class'),
                  value: name ?? '-',
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
            <Stack spacing="sm">
              {modelItems ? (
                <>
                  <Text fz={24} fw={600} color="brand">
                    {t('commonTypography.heavyEquipmentModel')}
                  </Text>
                  <Stack spacing="sm">
                    <KeyValueList
                      data={modelItems}
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
                </>
              ) : null}
            </Stack>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadHEavyEquipmentClassBook;
