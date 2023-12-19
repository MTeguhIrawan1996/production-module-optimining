import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UploadRitageTopsoilBook from '@/components/features/InputData/Productions/data-ritage/topsoil/upload/common/sections/UploadRitageTopsoilBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UploadRitageTopsoilPage = () => {
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
        path: '/input-data/production/data-ritage?tabs=topsoil',
      },
      {
        label: t('ritageTopsoil.uploadRitageTopsoil'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('ritageTopsoil.formUploadRitageTopsoil'),
          mb: 'md',
        }}
      >
        <UploadRitageTopsoilBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UploadRitageTopsoilPage;
