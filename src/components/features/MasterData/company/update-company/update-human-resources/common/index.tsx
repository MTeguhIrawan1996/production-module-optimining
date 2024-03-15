import { Tabs, TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateCompanyEmployeDataBook from '@/components/features/MasterData/company/update-company/update-human-resources/common/sections/UpdateCompanyEmployeDataBook';
import UpdateCompanyHumanResourcesBook from '@/components/features/MasterData/company/update-company/update-human-resources/common/sections/UpdateCompanyHumanResourcesBook';
import UpdateCompanyPositionHistoryBook from '@/components/features/MasterData/company/update-company/update-human-resources/common/sections/UpdateCompanyPositionHistoryBook';

import { useRouterReady } from '@/utils/hooks/useRouterReady';
import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateCompanyHumanResourcesPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const companyId = router.query?.id?.[0];
  const isRouterReady = useRouterReady();
  const [tabs, setTabs] = useQueryState(
    'tabs',
    queryTypes.string.withDefault('human-resources-profil')
  );
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.company'),
        path: '/master-data/company',
      },
      {
        label: 'Overview',
        path: `/master-data/company/read/${companyId}`,
      },
      {
        label: t('humanResources.updateHumanResources'),
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
      {isRouterReady ? (
        <InnerWrapper
          titleProps={{
            title: t('humanResources.formUpdateHumanResources'),
            mb: 'md',
          }}
        >
          <Tabs
            defaultValue="human-resources-profil"
            value={tabs}
            onTabChange={(value) => handleChangeTab(value)}
            radius={4}
            keepMounted={false}
          >
            <Tabs.List>
              <Tabs.Tab value="human-resources-profil" fz={14} fw={500}>
                {t('humanResources.humanResourcesProfile')}
              </Tabs.Tab>
              <Tabs.Tab value="employe-data" fz={14} fw={500}>
                {t('commonTypography.employeData')}
              </Tabs.Tab>
              <Tabs.Tab value="position-history" fz={14} fw={500}>
                {t('commonTypography.positionHistory')}
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="human-resources-profil">
              <UpdateCompanyHumanResourcesBook />
            </Tabs.Panel>
            <Tabs.Panel value="employe-data">
              <UpdateCompanyEmployeDataBook />
            </Tabs.Panel>
            <Tabs.Panel value="position-history">
              <UpdateCompanyPositionHistoryBook />
            </Tabs.Panel>
          </Tabs>
        </InnerWrapper>
      ) : null}
    </RootWrapper>
  );
};

export default UpdateCompanyHumanResourcesPage;
