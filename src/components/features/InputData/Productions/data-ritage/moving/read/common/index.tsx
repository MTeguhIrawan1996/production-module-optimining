import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadRitageMovingBook from '@/components/features/InputData/Productions/data-ritage/moving/read/common/sections/ReadRitageMovingBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadRitageMovingPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.dataRitage'),
        path: '/input-data/production/data-ritage?tabs=ore',
      },
      {
        label: t('ritageOre.readRitageOre'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadRitageMovingBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadRitageMovingPage;
