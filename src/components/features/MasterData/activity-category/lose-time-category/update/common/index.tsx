import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateLoseTimeActivityBook from '@/components/features/MasterData/activity-category/lose-time-category/update/common/sections/UpdateLoseTimeActivityBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateLoseTimeActivityPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.activityCategory'),
        path: '/master-data/activity-category?tab=lose-time-category',
      },
      {
        label: t('activityCategory.updateLoseTimeCategory'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('activityCategory.formUpdateLoseTimeCategory'),
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
            <UpdateLoseTimeActivityBook tab="lose-time-category" />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateLoseTimeActivityPage;
