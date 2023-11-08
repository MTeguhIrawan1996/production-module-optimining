import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import HeavyEquipmentMasterBook from '@/components/features/MasterData/heavy-equipment/common/sections/HeavyEquipmentMasterBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const HeavyEquipmentMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.heavyEquipment'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('commonTypography.heavyEquipment'), mb: 'md' }}
      >
        <HeavyEquipmentMasterBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default HeavyEquipmentMasterPage;
