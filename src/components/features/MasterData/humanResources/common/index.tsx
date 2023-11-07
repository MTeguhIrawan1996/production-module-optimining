import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import HumanResourcesBook from '@/components/features/MasterData/humanResources/common/sections/HumanResourcesBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const HumanResourcesPage = () => {
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
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('commonTypography.humanResources'), mb: 'md' }}
      >
        <HumanResourcesBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default HumanResourcesPage;
