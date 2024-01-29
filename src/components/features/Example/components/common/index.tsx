import { useRouter } from 'next/router';
import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import EmptyStateTable from '@/components/features/Example/components/common/sections/EmptyStateTableBook';
import InputGroupMaterial from '@/components/features/Example/components/common/sections/InputGroupMaterial';
import ModalComponentsBook from '@/components/features/Example/components/common/sections/ModalComponentsBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ComponentsPage = () => {
  const router = useRouter();

  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([{ label: 'Komponen', path: router.asPath }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper stackProps={{ spacing: 'xs' }}>
      <InnerWrapper titleProps={{ title: 'Komponen', mb: 'md' }}>
        <ModalComponentsBook />
      </InnerWrapper>
      <InnerWrapper titleProps={{ title: 'Komponen', mb: 'md' }}>
        <EmptyStateTable />
      </InnerWrapper>
      <InnerWrapper titleProps={{ title: 'Material Input', mb: 'md' }}>
        <InputGroupMaterial />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ComponentsPage;
