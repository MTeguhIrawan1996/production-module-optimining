import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ShippingMonitoringBook from '@/components/features/InputData/QualityControlManagement/shipping-monitoring/common/sections/ShippingMonitoringBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ShippingMonitoringPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.shippingMonitoring'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('shippingMonitoring.shippingMonitoringTitle'),
          mb: 'md',
        }}
      >
        <ShippingMonitoringBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ShippingMonitoringPage;
