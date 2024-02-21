import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import DashboardBook from '@/components/features/Dashboard/common/sections/DashboardBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const DashboardPage = () => {
  const { setBreadcrumbs } = useBreadcrumbs((state) => state, shallow);
  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: 'Dashboard',
        path: '/dashboard',
      },
    ]);
  }, [setBreadcrumbs]);

  return (
    <RootWrapper>
      <InnerWrapper titleProps={{ title: 'Dashboard', mb: 'md' }}>
        <DashboardBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default DashboardPage;
