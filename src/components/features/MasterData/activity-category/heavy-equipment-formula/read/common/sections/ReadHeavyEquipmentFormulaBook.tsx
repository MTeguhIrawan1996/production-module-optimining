import {
  Badge,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard } from '@/components/elements';

import { useReadOneHeavyEquipmentFormula } from '@/services/graphql/query/heavy-equipment-formula/useReadOneHeavyEquipmentFormula';

interface IReadHeavyEquipmentFormulaBookProps {
  tab?: string;
}

const ReadHeavyEquipmentFormulaBook: React.FC<
  IReadHeavyEquipmentFormulaBookProps
> = ({ tab: tabProps }) => {
  const router = useRouter();
  const id = router.query.id as string;
  const { t } = useTranslation('default');

  /* #   /**=========== Query =========== */
  const {
    readOneHeavyEquipmentFormulaDataPure,
    readOneHeavyEquipmentFormulaDataLoading,
  } = useReadOneHeavyEquipmentFormula({
    variables: {
      id: id,
    },
    skip: !router.isReady,
  });

  const valueTopFormulas =
    readOneHeavyEquipmentFormulaDataPure?.topFormula?.parameters;
  const newArrayTopFormula = valueTopFormulas?.reduce((acc: string[], item) => {
    if (item.operator !== null) {
      acc.push(`${item.operator}`);
      acc.push(`${item.category.name}`);
    } else {
      acc.push(item.category.name);
    }
    return acc;
  }, []);

  const valueBottomFormulas =
    readOneHeavyEquipmentFormulaDataPure?.bottomFormula?.parameters;
  const newArrayBottomFormula = valueBottomFormulas?.reduce(
    (acc: string[], item) => {
      if (item.operator !== null) {
        acc.push(`${item.operator}`);
        acc.push(`${item.category.name}`);
      } else {
        acc.push(item.category.name);
      }
      return acc;
    },
    []
  );

  return (
    <DashboardCard
      title={t('activityCategory.readHeavyEquipmentFormula')}
      updateButton={{
        label: 'Edit',
        onClick: () =>
          router.push(
            `/master-data/activity-category/heavy-equipment-performance-formula/update/${id}`
          ),
      }}
      enebleBackBottomOuter={{
        onClick: () =>
          router.push(`/master-data/activity-category?tab=${tabProps}`),
      }}
      paperStackProps={{
        spacing: 'md',
      }}
      withBorder
      isLoading={readOneHeavyEquipmentFormulaDataLoading}
      titleStyle={{
        fw: 700,
        fz: 30,
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
          <Stack spacing="sm" mt="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.calculation')}
            </Text>
            <Group align="center">
              <Badge radius={4} color="blue" size="lg">
                {readOneHeavyEquipmentFormulaDataPure?.name}
              </Badge>
              <Text fz={22} fw="xl" component="span">
                =
              </Text>
              <ScrollArea
                sx={{
                  overflow: 'unset',
                }}
                maw={700}
              >
                <Stack spacing={6} sx={{ width: 'fit-content' }} p="xs">
                  {newArrayTopFormula ? (
                    <Group spacing="xs" align="flex-end" noWrap>
                      {newArrayTopFormula?.map((val, i) => (
                        <Badge key={i} radius={4} size="lg">
                          {val}
                        </Badge>
                      ))}
                    </Group>
                  ) : (
                    <Text color="gray.6">
                      {t(`commonTypography.rumusNotFound`)}
                    </Text>
                  )}
                  <Divider my={4} size="sm" />
                  {newArrayBottomFormula ? (
                    <Group spacing="xs" align="flex-end" noWrap>
                      {newArrayBottomFormula?.map((val, i) => (
                        <Badge key={i} radius={4} size="lg">
                          {val}
                        </Badge>
                      ))}
                    </Group>
                  ) : (
                    <Text color="gray.6">
                      {t(`commonTypography.rumusNotFound`)}
                    </Text>
                  )}
                </Stack>
              </ScrollArea>
              <Text fz={22} fw={500} component="span">
                X 100%
              </Text>
            </Group>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadHeavyEquipmentFormulaBook;
