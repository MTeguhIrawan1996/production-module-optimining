import { useRouter } from 'next/router';
import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

import UpdateUserBook from './sections/UpdateUserBook';

const UpdateUserPage = () => {
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
        <UpdateUserBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateUserPage;
