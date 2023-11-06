import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadHEavyEquipmentBook from '@/components/features/Reference/heavy-equipment/read-heavy-equipment/common/sections/ReadHeavyEquipmentBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadHeavyEquipmentPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('heavyEquipment.heavyEquipmentTitle'),
        path: '/setting/management-role',
      },
      {
        label: t('heavyEquipment.readHeavyEquipment'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadHEavyEquipmentBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadHeavyEquipmentPage;
