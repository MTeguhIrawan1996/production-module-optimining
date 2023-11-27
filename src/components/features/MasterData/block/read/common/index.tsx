import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadBlockMasterBook from '@/components/features/MasterData/block/read/common/sections/ReadBlockMasterBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadBlockMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.block'),
        path: '/master-data/block',
      },
      {
        label: t('block.readBlock'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadBlockMasterBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadBlockMasterPage;
