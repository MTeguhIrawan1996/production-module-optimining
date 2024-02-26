import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateMonthlyPlanInformationBook from '@/components/features/Plan/monthly/update/monthly-plan-information/common/sections/UpdateMonthlyPlanInformationBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateMonthlyPlanInformationPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const id = router.query.id as string;
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('monthlyPlan.title'),
        path: '/plan/monthly',
      },
      {
        label: t('monthlyPlan.update'),
        path: `/plan/monthly/update/${id}`,
      },
      {
        label: t('commonTypography.weeklyPlanInformation'),
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
        <UpdateMonthlyPlanInformationBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateMonthlyPlanInformationPage;
