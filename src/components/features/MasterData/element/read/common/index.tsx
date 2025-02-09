import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadElementMasterBook from '@/components/features/MasterData/element/read/common/sections/ReadElementMasterBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadElementMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.element'),
        path: '/master-data/element',
      },
      {
        label: t('element.readElement'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadElementMasterBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadElementMasterPage;
