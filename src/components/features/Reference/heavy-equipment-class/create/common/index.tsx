import { ScrollArea, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CreateHeavyEquipmentClassBook from '@/components/features/Reference/heavy-equipment-class/create/common/sections/CreateHeavyEquipmentClassBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateHeavyEquipmentClassPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('heavyEquipmentClass.heavyEquipmentClassTitle'),
        path: '/setting/management-role',
      },
      {
        label: t('heavyEquipmentClass.createHeavyEquipmentClass'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('heavyEquipmentClass.formHeavyEquipmentClass'),
          mb: 'xl',
        }}
      >
        <Tabs
          defaultValue="information"
          radius={4}
          styles={{
            tabsList: {
              flexWrap: 'nowrap',
            },
          }}
        >
          <ScrollArea w="100%" px={0} h={55}>
            <Tabs.List>
              <Tabs.Tab value="information" fz={14} fw={500}>
                {t('commonTypography.information')}
              </Tabs.Tab>
            </Tabs.List>
          </ScrollArea>
          <Tabs.Panel value="information">
            <CreateHeavyEquipmentClassBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateHeavyEquipmentClassPage;
