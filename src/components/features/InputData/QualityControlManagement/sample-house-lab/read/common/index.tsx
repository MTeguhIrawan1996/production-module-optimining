import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadSampleHouseLabBook from '@/components/features/InputData/QualityControlManagement/sample-house-lab/read/common/sections/ReadSampleHouseLabBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadSampleHouseLabPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.sampleHouseLab'),
        path: '/input-data/quality-control-management/sample-house-lab',
      },
      {
        label: t('sampleHouseLab.readSampleHouseLab'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadSampleHouseLabBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadSampleHouseLabPage;
