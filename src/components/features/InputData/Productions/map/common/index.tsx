import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import MapProductionBook from '@/components/features/InputData/Productions/map/common/sections/MapProductionBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const MapProductionPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.map'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('mapProduction.title'),
          mb: 'md',
        }}
      >
        <MapProductionBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default MapProductionPage;
