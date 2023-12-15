import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UploadRitageQuarryBook from '@/components/features/InputData/Productions/data-ritage/quarry/upload/common/sections/UploadRitageQuarryBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UploadRitageQuarryPage = () => {
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
        path: '/input-data/production/data-ritage?tabs=quarry',
      },
      {
        label: t('ritageQuarry.uploadRitageQuarry'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('ritageQuarry.formUploadRitageQuarry'),
          mb: 'md',
        }}
      >
        <UploadRitageQuarryBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UploadRitageQuarryPage;
