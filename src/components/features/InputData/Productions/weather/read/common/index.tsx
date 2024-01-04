import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadWeatherProductionBook from '@/components/features/InputData/Productions/weather/read/common/sections/ReadWeatherProductionBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadWeatherProductionPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.weatherData'),
        path: '/input-data/production/weather',
      },
      {
        label: t('weatherProd.readWeatherProd'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadWeatherProductionBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadWeatherProductionPage;
