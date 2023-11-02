import { ScrollArea, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateManagementRoleBook from '@/components/features/Setting/management-role/update-management-role/common/sections/UpdateManagementRoleBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateManagementRolePage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('managementRole.managementRoleTitle'),
        path: '/setting/management-role',
      },
      {
        label: t('managementRole.editRole'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('managementRole.formManagementRole'), mb: 'xl' }}
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
          <ScrollArea w="100%" pb="xs" px={0}>
            <Tabs.List>
              <Tabs.Tab value="information" fz={14} fw={500}>
                {t('commonTypography.information')}
              </Tabs.Tab>
            </Tabs.List>
          </ScrollArea>
          <Tabs.Panel value="information">
            <UpdateManagementRoleBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateManagementRolePage;
