import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadLocationMasterBook from '@/components/features/MasterData/location/read/common/sections/ReadLocationMasterBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadLocationMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.location'),
        path: '/master-data/location',
      },
      {
        label: t('location.readLocation'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadLocationMasterBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadLocationMasterPage;
