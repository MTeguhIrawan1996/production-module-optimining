import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadMonthlyPlanGroupBook from '@/components/features/Plan/monthly/read/monthly-plan-group/sections/ReadMonthlyPlanGroupBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadMonthlyPlanGroupPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const id = router.query.id as string;
  const tabs = (router.query.tabs as string) || '';
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    if (router.isReady)
      setBreadcrumbs([
        {
          label: t('monthlyPlan.title'),
          path: '/plan/monthly',
        },
        {
          label: t('monthlyPlan.read'),
          path: `/plan/monthly/read/${id}`,
        },
        {
          label: t(`commonTypography.${tabs}`),
          path: router.asPath,
        },
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadMonthlyPlanGroupBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadMonthlyPlanGroupPage;
