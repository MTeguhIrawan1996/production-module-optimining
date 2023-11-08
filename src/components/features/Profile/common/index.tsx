import { useRouter } from 'next/router';
import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ProfileBook from '@/components/features/Profile/common/sections/ProfileBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ProfilePage = () => {
  const router = useRouter();
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ProfileBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ProfilePage;
