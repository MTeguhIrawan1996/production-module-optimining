import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadCompanyHeavyEquipmentBook from '@/components/features/MasterData/company/read-company/read-heavy-equipment/common/sections/ReadCompanyHeavyEquipmentBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadCompanyHeavyEquipmentPage = () => {
  const router = useRouter();
  const companyId = router.query?.id?.[0] as string;
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
        path: `/master-data/company/read/${companyId}`,
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
        <ReadCompanyHeavyEquipmentBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadCompanyHeavyEquipmentPage;
