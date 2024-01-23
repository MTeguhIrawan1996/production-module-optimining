import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UploadHeavyEquipmentProductionBook from '@/components/features/InputData/Productions/heavy-equipment/upload/common/sections/UploadHeavyEquipmentProductionBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UploadHeavyEquipmentProductionPage = () => {
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
        path: '/input-data/production/data-heavy-equipment',
      },
      {
        label: t('heavyEquipmentProd.uploadHeavyEquipmentProd'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('heavyEquipmentProd.formUploadHeavyEquipmentProd'),
          mb: 'md',
        }}
      >
        <UploadHeavyEquipmentProductionBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UploadHeavyEquipmentProductionPage;
