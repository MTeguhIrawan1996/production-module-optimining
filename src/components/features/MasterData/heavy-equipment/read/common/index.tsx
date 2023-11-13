import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadHeavyEquipmentMasterBook from '@/components/features/MasterData/heavy-equipment/read/common/sections/ReadHeavyEquipmentMasterBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadHeavyEquipmentMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('heavyEquipment.heavyEquipmentMaster'),
        path: '/master-data/heavy-equipment',
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
        <ReadHeavyEquipmentMasterBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadHeavyEquipmentMasterPage;
