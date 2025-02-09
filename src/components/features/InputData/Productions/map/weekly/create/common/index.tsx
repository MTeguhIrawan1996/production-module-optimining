import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

import CreateMapWeeklyProductionBook from './sections/CreateMapWeeklyProductionBook';

const CreateMapWeeklyProductionPage = () => {
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
        path: '/input-data/production/map?tabs=weekly',
      },
      {
        label: `${t('mapProduction.createMapProd')} ${t(
          'commonTypography.weekly'
        )}`,
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: `${t('mapProduction.createMapProd')} ${t(
            'commonTypography.weekly'
          )}`,
          mb: 'md',
        }}
      >
        <Tabs defaultValue="information" radius={4}>
          <Tabs.List>
            <Tabs.Tab value="information" fz={14} fw={500}>
              {t('commonTypography.information')}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="information">
            <CreateMapWeeklyProductionBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateMapWeeklyProductionPage;
