import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import HeavyEquipmentProductionBook from '@/components/features/InputData/Productions/heavy-equipment/common/sections/HeavyEquipmentProductionBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const HeavyEquipmentProductionPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.heavyEquipmentData'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('heavyEquipmentProd.heavyEquipmentProdTitle'),
          mb: 'md',
        }}
      >
        <HeavyEquipmentProductionBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default HeavyEquipmentProductionPage;
