import { TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
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
    const url = `/input-data/production/map?tabs=${tabs}`;
    router.push(url, undefined, { shallow: true });
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
            value: router.query.tabs as string,
            onTabChange: (value) => handleChangeTab(value),
            keepMounted: true,
          }}
          tabsData={[
            {
              label: 'Mingguan',
              value: 'weekly',
              component: <ListWeeklyMapBook />,
            },
            {
              label: 'Bulanan',
              value: 'monthly',
              component: <ListMonthlyMapBook />,
            },
            {
              label: 'Triwulan',
              value: 'quarterly',
              component: <ListQuarterlyMapBook />,
            },
            {
              label: 'Tahunan',
              value: 'yearly',
              component: <ListYearlyMapBook />,
            },
          ]}
        />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default MapProductionPage;
