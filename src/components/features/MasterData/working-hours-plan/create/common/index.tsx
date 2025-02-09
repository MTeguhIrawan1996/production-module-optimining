import { ScrollArea, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CreateWorkingHoursPlanBook from '@/components/features/MasterData/working-hours-plan/create/common/sections/CreateWorkingHoursPlanBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateWorkingHoursPlanMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.workingHoursPlan'),
        path: '/master-data/working-hours-plan',
      },
      {
        label: t('workingHoursPlan.createWorkingHoursPlan'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('workingHoursPlan.formWorkingHoursPlan'),
          mb: 'sm',
        }}
        alertProps={{
          mb: 'md',
          fz: 14,
          fw: 400,
          description: t('workingHoursPlan.workingHoursPlanDescription'),
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
            <CreateWorkingHoursPlanBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateWorkingHoursPlanMasterPage;
