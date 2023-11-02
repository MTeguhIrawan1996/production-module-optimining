import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadManagementRoleBook from '@/components/features/Setting/management-role/read-management-role/common/sections/ReadManagementRoleBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadManagementRolePage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('managementRole.managementRoleTitle'),
        path: '/setting/management-role',
      },
      {
        label: t('managementRole.readRole'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadManagementRoleBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadManagementRolePage;
