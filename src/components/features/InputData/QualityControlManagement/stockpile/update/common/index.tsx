import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateStockpileMonitoringBook from '@/components/features/InputData/QualityControlManagement/stockpile/update/common/sections/UpdateStockpileMonitoringBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateStockpileMonitoringPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.stockpileMonitoring'),
        path: '/input-data/quality-control-management/stockpile-monitoring',
      },
      {
        label: t('stockpileMonitoring.updateStockpileMonitoring'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('stockpileMonitoring.formUpdateStockpileMonitoring'),
          mb: 'xs',
        }}
      >
        <UpdateStockpileMonitoringBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateStockpileMonitoringPage;
