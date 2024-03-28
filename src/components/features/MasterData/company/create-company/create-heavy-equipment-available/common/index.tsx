import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CreateHeavyEquipmentAvailableBook from '@/components/features/MasterData/company/create-company/create-heavy-equipment-available/common/sections/CreateHeavyEquipmentAvailableBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateHeavyEquipmentAvailablePage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.company'),
        path: '/master-data/company',
      },
      {
        label: 'Overview',
        path: `/master-data/company/read/${router.query?.id}`,
      },
      {
        label: t('heavyEquipment.chooseHeavyEquipment'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
      // titleProps={{
      //   title: t('heavyEquipment.chooseAvailableHeavyEquipment'),
      //   mb: 'md',
      // }}
      >
        <CreateHeavyEquipmentAvailableBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateHeavyEquipmentAvailablePage;
