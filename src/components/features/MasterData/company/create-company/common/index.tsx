import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CreateCompanyBook from '@/components/features/MasterData/company/create-company/common/sections/CreateCompanyBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateCompanyPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      { label: t('commonTypography.company'), path: '/master-data/company' },
      {
        label: t('company.createCompany'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper titleProps={{ title: t('company.formCompany'), mb: 'xl' }}>
        <Tabs defaultValue="company-profil" radius={4}>
          <Tabs.List>
            <Tabs.Tab value="company-profil" fz={14} fw={500}>
              {t('company.profileCompany')}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="company-profil">
            <CreateCompanyBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateCompanyPage;
