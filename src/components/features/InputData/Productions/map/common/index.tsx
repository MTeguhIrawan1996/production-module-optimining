import { TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { GlobalTabs, InnerWrapper, RootWrapper } from '@/components/elements';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

import ListMonthlyMapBook from './sections/ListMonthlyMapBook';
import ListQuarterlyMapBook from './sections/ListQuarterlyMapBook';
import ListWeeklyMapBook from './sections/ListWeeklyMapBook';
import ListYearlyMapBook from './sections/ListYearlyMapBook';

const MapProductionPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [tabs, setTabs] = useQueryState(
    'tabs',
    queryTypes.string.withDefault('weekly')
  );

  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.map'),
        path: router.asPath,
      },
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleChangeTab = (tabs: TabsValue) => {
    setTabs(tabs);
  };

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('commonTypography.map'),
          mb: 'md',
        }}
      >
        <GlobalTabs
          tabs={{
            defaultValue: 'weekly',
            value: tabs,
            onTabChange: (value) => handleChangeTab(value),
            keepMounted: false,
          }}
          tabsData={[
            {
              label: 'Mingguan',
              value: 'weekly',
              component: <ListWeeklyMapBook />,
              isShowItem: true,
            },
            {
              label: 'Bulanan',
              value: 'monthly',
              component: <ListMonthlyMapBook />,
              isShowItem: true,
            },
            {
              label: 'Triwulan',
              value: 'quarterly',
              component: <ListQuarterlyMapBook />,
              isShowItem: true,
            },
            {
              label: 'Tahunan',
              value: 'yearly',
              component: <ListYearlyMapBook />,
              isShowItem: true,
            },
          ]}
        />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default MapProductionPage;
