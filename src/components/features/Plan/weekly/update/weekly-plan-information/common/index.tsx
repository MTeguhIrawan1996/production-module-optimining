import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateWeeklyPlanInformationBook from '@/components/features/Plan/weekly/update/weekly-plan-information/common/sections/UpdateWeeklyPlanInformationBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateWeeklyPlanInformationPage = () => {
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
        label: t('weeklyPlan.title'),
        path: '/plan/weekly',
      },
      {
        label: t('weeklyPlan.update'),
        path: `/plan/weekly/update/${id}`,
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
        titleProps={{ title: t('weeklyPlan.formCreate'), mb: 'xs' }}
      >
        <UpdateWeeklyPlanInformationBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateWeeklyPlanInformationPage;
