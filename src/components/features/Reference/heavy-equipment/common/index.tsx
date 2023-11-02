import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import HeavyEquipmentBook from '@/components/features/Reference/heavy-equipment/common/sections/HeavyEquipmentBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const HeavyEquipmentPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      { label: t('heavyEquipment.heavyEquipmentTitle'), path: router.asPath },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('heavyEquipment.heavyEquipmentTitle'),
          mb: 'md',
        }}
      >
        <HeavyEquipmentBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default HeavyEquipmentPage;
