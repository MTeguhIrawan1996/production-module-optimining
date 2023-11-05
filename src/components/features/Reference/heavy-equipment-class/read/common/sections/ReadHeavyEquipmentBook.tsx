import { Stack, Tabs, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, KeyValueList } from '@/components/elements';

import {
  IHeavyEquipmentClassType,
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
  const { heavyEquipmentTypes, name } = heavyEquipmentClassData || {};

  /* #endregion  /**======== Query =========== */

  const renderType = React.useCallback((value: IHeavyEquipmentClassType) => {
    return {
      dataKey: t('commonTypography.type'),
      value: value.name,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const typeItems = heavyEquipmentTypes?.map(renderType);

  return (
    <DashboardCard
      title={t('heavyEquipment.heavyEquipmentTitle')}
      updateButton={{
        label: 'Edit',
      }}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={heavyEquipmentClassDataLoading}
      enebleBack
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
              {typeItems ? (
                <>
                  <Text fz={24} fw={600} color="brand">
                    {t('commonTypography.heavyEquipmentType')}
                  </Text>
                  <Stack spacing="sm">
                    <KeyValueList
                      data={typeItems}
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
