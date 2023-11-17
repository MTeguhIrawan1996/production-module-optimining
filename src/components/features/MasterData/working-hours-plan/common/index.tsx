import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import WorkingHoursPlanBook from '@/components/features/MasterData/working-hours-plan/common/sections/WorkingHoursPlanBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const WorkingHoursPlanMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.workingHoursPlan'),
        path: '/master-data/working-hours-plan',
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('commonTypography.workingHoursPlan'), mb: 'md' }}
      >
        <WorkingHoursPlanBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default WorkingHoursPlanMasterPage;
