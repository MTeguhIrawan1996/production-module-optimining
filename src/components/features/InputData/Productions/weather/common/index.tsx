import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import WeatherProductionProductionBook from '@/components/features/InputData/Productions/weather/common/sections/WeatherProductionProductionBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const WeatherProductionProductionPage = () => {
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
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('weatherProd.weatherProdTitle'),
          mb: 'md',
        }}
      >
        <WeatherProductionProductionBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default WeatherProductionProductionPage;
