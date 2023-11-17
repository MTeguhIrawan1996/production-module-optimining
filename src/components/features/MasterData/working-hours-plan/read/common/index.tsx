import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadWorkingHoursPlanBook from '@/components/features/MasterData/working-hours-plan/read/common/sections/ReadWorkingHoursPlanBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadWorkingHoursPlanMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.material'),
        path: '/master-data/material',
      },
      {
        label: t('material.readMaterial'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadWorkingHoursPlanBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadWorkingHoursPlanMasterPage;
