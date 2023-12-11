import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadRitageObBook from '@/components/features/InputData/Productions/data-ritage/ob/read/common/sections/ReadRitageObBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadRitageObPage = () => {
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
        label: t('ritageOb.readRitageOb'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadRitageObBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadRitageObPage;
