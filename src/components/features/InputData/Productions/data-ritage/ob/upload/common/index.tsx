import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UploadRitageObBook from '@/components/features/InputData/Productions/data-ritage/ob/upload/common/sections/UploadRitageObBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UploadRitageObPage = () => {
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
        path: '/input-data/production/data-ritage?tabs=ob',
      },
      {
        label: t('ritageOb.uploadRitageOb'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('ritageOb.formUploadRitageOb'), mb: 'md' }}
      >
        <UploadRitageObBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UploadRitageObPage;
