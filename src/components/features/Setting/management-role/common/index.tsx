import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ManagementRoleBook from '@/components/features/Setting/management-role/common/sections/ManagementRoleBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ManagementRolePage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      { label: t('managementRole.managementRoleTitle'), path: router.asPath },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('managementRole.managementRoleTitle'),
          mb: 'md',
        }}
      >
        <ManagementRoleBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ManagementRolePage;
