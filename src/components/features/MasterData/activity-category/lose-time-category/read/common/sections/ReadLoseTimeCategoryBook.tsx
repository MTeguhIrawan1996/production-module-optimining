import { Divider, Stack, Tabs, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, KeyValueList } from '@/components/elements';
import { IKeyValueItemProps } from '@/components/elements/global/KeyValueList';

import { useReadOneActivityCategory } from '@/services/graphql/query/activity-category/useReadOneActivityCategory';

interface IReadLoseTimeCategoryBookProps {
  tab?: string;
}

const ReadLoseTimeCategoryBook: React.FC<IReadLoseTimeCategoryBookProps> = ({
  tab: tabProps,
}) => {
  const router = useRouter();
  const id = router.query.id as string;
  const tab = router.query['tab'] || 'lose-time-category';
  const { t } = useTranslation('default');

  /* #   /**=========== Query =========== */
  const {
    readOneActivityCategoryDataGrouping,
    readOneActivityCategoryDataLoading,
  } = useReadOneActivityCategory({
    variables: {
      id: id,
    },
    skip: !router.isReady || tab !== tabProps,
  });

  return (
    <DashboardCard
      title={t('activityCategory.readLoseTimeCategory')}
      updateButton={{
        label: 'Edit',
        onClick: () =>
          router.push(
            `/master-data/activity-category/lose-time-category/update/${id}`
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
          {readOneActivityCategoryDataGrouping.map((val, i) => {
            const keyValueData: Pick<
              IKeyValueItemProps,
              'value' | 'dataKey'
            >[] = val.itemValue.map((obj) => {
              return {
                dataKey: t(`commonTypography.${obj.name}`),
                value: obj.value,
              };
            });
            return (
              <React.Fragment key={i}>
                {val.itemValue.length > 0 ? (
                  <Stack
                    spacing="sm"
                    mt={i === 0 ? 'sm' : undefined}
                    mb={i === 0 ? 'sm' : undefined}
                  >
                    {val.enableTitle && (
                      <Text fz={24} fw={600} color="brand">
                        {t(`commonTypography.${val.group}`)}
                      </Text>
                    )}
                    <KeyValueList data={keyValueData} type="grid" />
                  </Stack>
                ) : null}
                {val.withDivider && <Divider my="md" />}
              </React.Fragment>
            );
          })}
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadLoseTimeCategoryBook;
