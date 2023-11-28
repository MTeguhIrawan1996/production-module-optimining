import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import StockpileMasterBook from '@/components/features/MasterData/stockpile/common/sections/StockpileMasterBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const StockpileMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.stockpile'),
        path: '/master-data/stockpile',
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('commonTypography.stockpile'), mb: 'md' }}
      >
        <StockpileMasterBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default StockpileMasterPage;
