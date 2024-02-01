import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CreateWeeklyPlanInformationBook from '@/components/features/Plan/weekly/create/common/sections/CreateWeeklyPlanInformationBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateWeeklyPlanInformationPage = () => {
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
        label: t('weeklyPlan.create'),
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
        <CreateWeeklyPlanInformationBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateWeeklyPlanInformationPage;
