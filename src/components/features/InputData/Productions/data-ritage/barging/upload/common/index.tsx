import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UploadRitageBargingBook from '@/components/features/InputData/Productions/data-ritage/barging/upload/common/sections/UploadRitageBargingBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UploadRitageBargingPage = () => {
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
        label: t('ritageBarging.uploadRitageBarging'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('ritageBarging.formUploadRitageBarging'),
          mb: 'md',
        }}
      >
        <UploadRitageBargingBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UploadRitageBargingPage;
