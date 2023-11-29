import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadStockpileMasterBook from '@/components/features/MasterData/stockpile/read/common/sections/ReadStockpileMasterBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadStockpileMasterPage = () => {
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
      {
        label: t('stockpile.readStockpile'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadStockpileMasterBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadStockpileMasterPage;
