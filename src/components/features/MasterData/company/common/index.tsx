import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CompanyBook from '@/components/features/MasterData/company/common/sections/CompanyBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CompanyPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      { label: t('commonTypography.company'), path: '/master-data/company' },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('commonTypography.company'), mb: 'md' }}
      >
        <CompanyBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CompanyPage;
