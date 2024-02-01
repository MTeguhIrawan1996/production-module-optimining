import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadWeeklyPlanGroupBook from '@/components/features/Plan/weekly/read/weekly-plan-group/common/sections/ReadWeeklyPlanGroupBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadWeeklyPlanGroupPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('weeklyPlan.title'),
        path: '/plan/weekly',
      },
      {
        label: t('weeklyPlan.read'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadWeeklyPlanGroupBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadWeeklyPlanGroupPage;
