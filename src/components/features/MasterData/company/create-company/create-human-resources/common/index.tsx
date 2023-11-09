import { Tabs, TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CreateCompanyHumanResourcesBook from '@/components/features/MasterData/company/create-company/create-human-resources/common/sections/CreateCompanyHumanResourcesBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateCompanyHumanResourcesPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');

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
        path: `/master-data/company/read/${router.query?.id?.[0]}`,
      },
      {
        label: t('humanResources.createHumanResources'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleChangeTab = (tabs: TabsValue) => {
    const employeId = router.query?.id?.[1];
    const idSegment = employeId
      ? `/${router.query?.id?.[0]}/${employeId}`
      : `/${router.query?.id?.[0]}`;
    const url = `/master-data/company/create/human-resources${idSegment}/?tabs=${tabs}`;
    router.push(url, undefined, { shallow: true });
  };

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('humanResources.formHumanResources'), mb: 'md' }}
      >
        <Tabs
          defaultValue="human-resources-profil"
          value={router.query.tabs as string}
          onTabChange={(value) => handleChangeTab(value)}
          radius={4}
        >
          <Tabs.List>
            <Tabs.Tab value="human-resources-profil" fz={14} fw={500}>
              {t('humanResources.humanResourcesProfile')}
            </Tabs.Tab>
            <Tabs.Tab
              value="employe-data"
              fz={14}
              fw={500}
              disabled={!router.query?.id?.[1]}
            >
              {t('commonTypography.employeData')}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="human-resources-profil">
            <CreateCompanyHumanResourcesBook />
          </Tabs.Panel>
          <Tabs.Panel value="employe-data">
            <div className="">Test</div>
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateCompanyHumanResourcesPage;
