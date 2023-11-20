import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadFactoryMasterBook from '@/components/features/MasterData/factory/read/common/sections/ReadFactoryMasterBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadFactoryMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.factory'),
        path: '/master-data/factory',
      },
      {
        label: t('factory.readFactory'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadFactoryMasterBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadFactoryMasterPage;
