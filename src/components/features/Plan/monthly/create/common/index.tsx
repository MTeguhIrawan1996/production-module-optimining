import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CreateMonthlyPlanInformationBook from '@/components/features/Plan/monthly/create/common/sections/CreateMonthlyPlanInformationBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateMonthlyPlanInformationPage = () => {
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
        path: '/plan/monthly',
      },
      {
        label: t('monthlyPlan.create'),
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
        <CreateMonthlyPlanInformationBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateMonthlyPlanInformationPage;
