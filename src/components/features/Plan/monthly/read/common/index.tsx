import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadMonthlyPlanBook from '@/components/features/Plan/monthly/read/common/sections/ReadMonthlyPlanBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadMonthlyPlanPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('monthlyPlan.title'),
        path: '/plan/weekly',
      },
      {
        label: t('monthlyPlan.read'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper titleProps={{ title: t('monthlyPlan.title2'), mb: 'xs' }}>
        <ReadMonthlyPlanBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadMonthlyPlanPage;
