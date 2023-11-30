import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { GlobalTabs, InnerWrapper, RootWrapper } from '@/components/elements';
import ListDataOreRitageBook from '@/components/features/InputData/Productions/data-ritage/common/sections/ListDataOreRitageBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const DataRitagePage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.dataRitage'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('commonTypography.dataRitage'),
          mb: 'md',
        }}
      >
        <GlobalTabs
          tabsData={[
            {
              label: 'Ore',
              value: 'ore',
              component: <ListDataOreRitageBook />,
            },
          ]}
        />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default DataRitagePage;
