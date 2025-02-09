import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CreateHumanResourcesBook from '@/components/features/MasterData/human-resources/create/common/sections/CreateHumanResourcesBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateHumanResourcesPage = () => {
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
          n: t('commonTypography.create'),
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
            n: 'Formulir Tambah',
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
            <CreateHumanResourcesBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateHumanResourcesPage;
