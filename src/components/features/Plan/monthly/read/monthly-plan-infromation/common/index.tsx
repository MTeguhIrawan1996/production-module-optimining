import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadMonthlyPlanInformationBook from '@/components/features/Plan/monthly/read/monthly-plan-infromation/common/sections/ReadMonthlyPlanInformationBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadMonthlyPlanInformationPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
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
        path: `/plan/monthly/read/${id}`,
      },
      {
        label: t('commonTypography.monthlyPlanInformation'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('monthlyPlan.formCreate'), mb: 'xs' }}
      >
        <ReadMonthlyPlanInformationBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadMonthlyPlanInformationPage;
