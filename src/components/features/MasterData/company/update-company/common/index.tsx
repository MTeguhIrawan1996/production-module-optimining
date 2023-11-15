import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateCompanyBook from '@/components/features/MasterData/company/update-company/common/sections/UpdateCompanyBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateCompanyPage = () => {
  const router = useRouter();
  const companyId = router.query?.id as string;

  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      { label: t('commonTypography.company'), path: '/master-data/company' },
      {
        label: 'Overview',
        path: `/master-data/company/read/${companyId}`,
      },
      {
        label: t('company.updateCompany'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('company.formUpdateCompany'), mb: 'md' }}
      >
        <Tabs defaultValue="company-profil" radius={4}>
          <Tabs.List>
            <Tabs.Tab value="company-profil" fz={14} fw={500}>
              {t('company.profileCompany')}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="company-profil">
            <UpdateCompanyBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateCompanyPage;
