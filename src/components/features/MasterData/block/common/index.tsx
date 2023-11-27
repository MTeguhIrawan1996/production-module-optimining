import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import BlockBook from '@/components/features/MasterData/block/common/sections/BlockBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const BlockPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      { label: t('commonTypography.block'), path: '/master-data/block' },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('commonTypography.block'), mb: 'md' }}
      >
        <BlockBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default BlockPage;
