import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadCompanyBook from '@/components/features/MasterData/company/read-company/common/sections/ReadCompanyBook';
import ReadCompanyHumanResourceBook from '@/components/features/MasterData/company/read-company/common/sections/ReadCompanyHumanResourceBook';
import ReadHeavyEquipmentBook from '@/components/features/MasterData/company/read-company/common/sections/ReadHeavyEquipmentBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadCompanyPage = () => {
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
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  return (
    <RootWrapper
      stackProps={{
        spacing: 'sm',
      }}
    >
      <InnerWrapper
        containerProps={{ pb: 0 }}
        titleProps={{ title: 'Overview', mb: 'sm' }}
      >
        <ReadCompanyBook />
      </InnerWrapper>
      <InnerWrapper containerProps={{ pb: 0, pt: 0 }}>
        <ReadCompanyHumanResourceBook />
      </InnerWrapper>
      <InnerWrapper containerProps={{ pb: 0, pt: 0 }}>
        <ReadHeavyEquipmentBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadCompanyPage;
