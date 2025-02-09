import { Badge, Group, ScrollArea, Stack, Tabs, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, KeyValueList } from '@/components/elements';

import { useReadOneActivityCategory } from '@/services/graphql/query/activity-category/useReadOneActivityCategory';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

interface IReadCalculationCategoryBookProps {
  tab?: string;
}

const ReadCalculationCategoryBook: React.FC<
  IReadCalculationCategoryBookProps
> = ({ tab: tabProps }) => {
  const router = useRouter();
  const id = router.query.id as string;
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const tab = router.query['tab'] || 'calculation-category';
  const { t } = useTranslation('default');

  const isPermissionUpdate = permissions?.includes(
    'update-working-hour-plan-category'
  );

  /* #   /**=========== Query =========== */
  const {
    readOneActivityCategoryDataPure,
    readOneActivityCategoryDataLoading,
  } = useReadOneActivityCategory({
    variables: {
      id: id,
    },
    skip: !router.isReady || tab !== tabProps,
  });

  const valueFormulas =
    readOneActivityCategoryDataPure?.workingHourPlanCategory.countFormula
      ?.parameters;
  const newArray = valueFormulas?.reduce((acc: string[], item) => {
    if (item.operator !== null) {
      acc.push(`${item.operator}`);
      acc.push(`${item.category.name}`);
    } else {
      acc.push(item.category.name);
    }
    return acc;
  }, []);

  return (
    <DashboardCard
      title={t('activityCategory.readCalculationCategory')}
      updateButton={
        isPermissionUpdate
          ? {
              label: 'Edit',
              onClick: () =>
                router.push(
                  `/master-data/activity-category/calculation-category/update/${id}`
                ),
            }
          : undefined
      }
      enebleBackBottomOuter={{
        onClick: () =>
          router.push(`/master-data/activity-category?tab=${tabProps}`),
      }}
      paperStackProps={{
        spacing: 'md',
      }}
      withBorder
      isLoading={readOneActivityCategoryDataLoading}
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
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.category'),
                  value:
                    readOneActivityCategoryDataPure?.workingHourPlanCategory
                      .name,
                },
              ]}
              type="grid"
            />
          </Stack>
          <Stack spacing="sm" mt="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.calculation')}
            </Text>
            {newArray ? (
              <ScrollArea offsetScrollbars type="always">
                <Group spacing="xs" noWrap>
                  {newArray?.map((val, i) => (
                    <Badge key={i} radius={4} size="lg">
                      {val}
                    </Badge>
                  ))}
                </Group>
              </ScrollArea>
            ) : (
              <Text color="gray.6">{t(`commonTypography.rumusNotFound`)}</Text>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadCalculationCategoryBook;
