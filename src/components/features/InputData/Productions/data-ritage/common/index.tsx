import { TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
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
import useStore from '@/utils/store/useStore';

const DataRitagePage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const [tabs, setTabs] = useQueryState(
    'tabs',
    queryTypes.string.withDefault('ore')
  );
  const [_, setPage] = useQueryState('rp', queryTypes.integer.withDefault(1));
  const [__, setHeavyEquipmentPage] = useQueryState(
    'hp',
    queryTypes.integer.withDefault(1)
  );
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );
  const isPremissionOre = permissions?.includes('read-ore-ritage');
  const isPremissionOb = permissions?.includes('read-overburden-ritage');
  const isPremissionQuarry = permissions?.includes('read-quarry-ritage');
  const isPremissionBarging = permissions?.includes('read-barging-ritage');
  const isPremissionMoving = permissions?.includes('read-moving-ritage');
  const isPremissionTopsoil = permissions?.includes('read-topsoil-ritage');

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
    setTabs(tabs);
    setPage(1);
    setHeavyEquipmentPage(1);
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
            defaultValue: 'ore',
            keepMounted: false,
            value: tabs,
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
