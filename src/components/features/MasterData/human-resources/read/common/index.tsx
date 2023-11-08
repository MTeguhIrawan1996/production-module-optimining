import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadHumanResourceBook from '@/components/features/MasterData/human-resources/read/common/sections/ReadHumanResourceBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadHumanResourcesPage = () => {
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
        path: '/master-data/human-resources',
      },
      {
        label: t('humanResources.readHumanResources'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadHumanResourceBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadHumanResourcesPage;
