import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadRitageBargingBook from '@/components/features/InputData/Productions/data-ritage/barging/read/common/sections/ReadRitageBargingBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadRitageBargingPage = () => {
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
        path: '/input-data/production/data-ritage?tabs=barging',
      },
      {
        label: t('ritageBarging.readRitageBarging'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadRitageBargingBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadRitageBargingPage;
