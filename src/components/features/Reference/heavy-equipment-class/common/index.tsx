import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import HeavyEquipmentClassBook from '@/components/features/Reference/heavy-equipment-class/common/sections/HeavyEquipmentClassBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const HeavyEquipmentClassPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      { label: t('companyType.companyTypeTitle'), path: router.asPath },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('companyType.companyTypeTitle'), mb: 'md' }}
      >
        <HeavyEquipmentClassBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default HeavyEquipmentClassPage;
