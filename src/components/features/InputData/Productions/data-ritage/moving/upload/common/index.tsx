import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UploadRitageMovingBook from '@/components/features/InputData/Productions/data-ritage/moving/upload/common/sections/UploadRitageMovingBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UploadRitageMovingPage = () => {
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
        path: '/input-data/production/data-ritage?tabs=moving',
      },
      {
        label: t('ritageMoving.uploadRitageMoving'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('ritageMoving.formUploadRitageMoving'),
          mb: 'md',
        }}
      >
        <UploadRitageMovingBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UploadRitageMovingPage;
