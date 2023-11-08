import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UserBook from '@/components/features/Setting/user/common/sections/UserBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UserPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([{ label: t('user.userTitle'), path: router.asPath }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper titleProps={{ title: t('user.userTitle'), mb: 'md' }}>
        <UserBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UserPage;
