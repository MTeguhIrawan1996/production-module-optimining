import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateHumanResourcesBook from '@/components/features/MasterData/humanResources/update/common/sections/UpdateHumanResourcesBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateHumanResourcesPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.humanResources'),
        path: '/master-data/human-resources',
      },
      {
        label: t('humanResources.updateHumanResources'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('humanResources.formHumanResources'), mb: 'xl' }}
      >
        <Tabs defaultValue="human-resources-profil" radius={4}>
          <Tabs.List>
            <Tabs.Tab value="human-resources-profil" fz={14} fw={500}>
              {t('humanResources.humanResourcesProfile')}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="human-resources-profil">
            <UpdateHumanResourcesBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateHumanResourcesPage;
