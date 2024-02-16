import { TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { GlobalTabs, InnerWrapper, RootWrapper } from '@/components/elements';
import ListDataBargingRitageBook from '@/components/features/InputData/Productions/data-ritage/common/sections/ListDataBargingRitageBook';
import ListDataMovingRitageBook from '@/components/features/InputData/Productions/data-ritage/common/sections/ListDataMovingRitageBook';
import ListDataObRitageBook from '@/components/features/InputData/Productions/data-ritage/common/sections/ListDataObRitageBook';
import ListDataOreRitageBook from '@/components/features/InputData/Productions/data-ritage/common/sections/ListDataOreRitageBook';
import ListDataQuarryRitageBook from '@/components/features/InputData/Productions/data-ritage/common/sections/ListDataQuarryRitageBook';
import ListDataTopsoilRitageBook from '@/components/features/InputData/Productions/data-ritage/common/sections/ListDataTopsoilRitageBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';
import { usePermissions } from '@/utils/store/usePermissions';

const DataRitagePage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [permission] = usePermissions((state) => [state.permissions], shallow);
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );
  const isPremissionOre = permission.includes('read-ore-ritage');
  const isPremissionOb = permission.includes('read-overburden-ritage');
  const isPremissionQuarry = permission.includes('read-quarry-ritage');
  const isPremissionBarging = permission.includes('read-barging-ritage');
  const isPremissionMoving = permission.includes('read-moving-ritage');
  const isPremissionTopsoil = permission.includes('read-topsoil-ritage');

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.dataRitage'),
        path: router.asPath,
      },
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleChangeTab = (tabs: TabsValue) => {
    const url = `/input-data/production/data-ritage?tabs=${tabs}`;
    router.push(url, undefined, { shallow: true });
  };

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('commonTypography.dataRitage'),
          mb: 'md',
        }}
      >
        <GlobalTabs
          tabs={{
            value: router.query.tabs as string,
            onTabChange: (value) => handleChangeTab(value),
          }}
          tabsData={[
            {
              label: 'Ore',
              value: 'ore',
              component: <ListDataOreRitageBook />,
              isShowItem: isPremissionOre,
            },
            {
              label: 'Overburden (OB)',
              value: 'ob',
              component: <ListDataObRitageBook />,
              isShowItem: isPremissionOb,
            },
            {
              label: 'Quarry',
              value: 'quarry',
              component: <ListDataQuarryRitageBook />,
              isShowItem: isPremissionQuarry,
            },
            {
              label: 'Barging',
              value: 'barging',
              component: <ListDataBargingRitageBook />,
              isShowItem: isPremissionBarging,
            },
            {
              label: 'Topsoil',
              value: 'topsoil',
              component: <ListDataTopsoilRitageBook />,
              isShowItem: isPremissionTopsoil,
            },
            {
              label: 'Moving',
              value: 'moving',
              component: <ListDataMovingRitageBook />,
              isShowItem: isPremissionMoving,
            },
          ]}
        />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default DataRitagePage;
