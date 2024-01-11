import { Badge, Group, ScrollArea, Stack, Tabs, Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, KeyValueList } from '@/components/elements';

import { useReadOneActivityCategory } from '@/services/graphql/query/activity-category/useReadOneActivityCategory';

interface IReadCalculationCategoryBookProps {
  tab?: string;
}

const ReadCalculationCategoryBook: React.FC<
  IReadCalculationCategoryBookProps
> = ({ tab: tabProps }) => {
  const router = useRouter();
  const id = router.query.id as string;
  const pageParams = useSearchParams();
  const tab = pageParams.get('tab') || 'calculation-category';
  const { t } = useTranslation('default');

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
      updateButton={{
        label: 'Edit',
        onClick: () =>
          router.push(
            `/master-data/activity-category/calculation-category/update/${id}`
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
          <Stack spacing="sm" mt="sm">
            <Text fz={24} fw={600} color="brand">
              {t('commonTypography.calculation')}
            </Text>
            <ScrollArea>
              <Group spacing="xs" noWrap pb="sm">
                {newArray?.map((val, i) => (
                  <Badge key={i} radius={4} size="lg">
                    {val}
                  </Badge>
                ))}
              </Group>
            </ScrollArea>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadCalculationCategoryBook;
