import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadStockpileMonitoringBook from '@/components/features/InputData/QualityControlManagement/stockpile/read/common/sections/ReadStockpileMonitoringBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadStockpileMonitoringPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('stockpileMonitoring.stockpileMonitoringTitle'),
        path: '/input-data/quality-control-management/stockpile-monitoring',
      },
      {
        label: t('stockpileMonitoring.readStockpileMonitoring'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadStockpileMonitoringBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadStockpileMonitoringPage;
