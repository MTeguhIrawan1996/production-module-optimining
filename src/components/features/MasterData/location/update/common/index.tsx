import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateLocationMasterBook from '@/components/features/MasterData/location/update/common/sections/UpdateLocationMasterBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateLocationMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      { label: t('commonTypography.location'), path: '/master-data/location' },
      {
        label: t('location.updateLocation'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('location.formUpdateLocation'), mb: 'md' }}
      >
        <Tabs defaultValue="information" radius={4}>
          <Tabs.List>
            <Tabs.Tab value="information" fz={14} fw={500}>
              {t('commonTypography.information')}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="information">
            <UpdateLocationMasterBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateLocationMasterPage;
