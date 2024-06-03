import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateHeavyEquipmentProductionBook from '@/components/features/InputData/Productions/heavy-equipment/update/common/sections/UpdateHeavyEquipmentProductionBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateHeavyEquipmentProductionPage = () => {
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
        label: t('heavyEquipmentProd.updateHeavyEquipmentProd'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('heavyEquipmentProd.formHeavyEquipmentProd'),
          mb: 'md',
        }}
      >
        <Tabs defaultValue="information" radius={4}>
          <Tabs.List>
            <Tabs.Tab value="information" fz={14} fw={500}>
              {t('commonTypography.information')}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="information">
            <UpdateHeavyEquipmentProductionBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateHeavyEquipmentProductionPage;
