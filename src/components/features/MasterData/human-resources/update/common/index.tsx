import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateHumanResourcesBook from '@/components/features/MasterData/human-resources/update/common/sections/UpdateHumanResourcesBook';

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
        label: t('commonTypography.individual'),
        path: '/master-data/human-resources',
      },
      {
        label: t('commonTypography.nmIndividual', {
          n: t('commonTypography.edit'),
        }),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('commonTypography.nmIndividual', {
            n: 'Formulir Edit',
          }),
          mb: 'md',
        }}
      >
        <Tabs defaultValue="human-resources-profil" radius={4}>
          <Tabs.List>
            <Tabs.Tab value="human-resources-profil" fz={14} fw={500}>
              {t('commonTypography.nmIndividual', {
                n: 'Profile',
              })}
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
