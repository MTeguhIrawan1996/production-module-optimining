import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadRitageQuarryBook from '@/components/features/InputData/Productions/data-ritage/quarry/read/common/sections/ReadRitageQuarryBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadRitageQuarryPage = () => {
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
        label: t('ritageQuarry.readRitageQuarry'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadRitageQuarryBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadRitageQuarryPage;
