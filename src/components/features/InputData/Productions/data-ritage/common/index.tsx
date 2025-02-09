import { TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import { queryTypes, useQueryStates } from 'next-usequerystate';
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

import { useRouterReady } from '@/utils/hooks/useRouterReady';
import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const DataRitagePage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const isRouterReady = useRouterReady();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const [params, setParams] = useQueryStates({
    tabs: queryTypes.string.withDefault('ore'),
  });
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

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(
      new Set<ISliceName>([
        'ritageOreSlice',
        'ritageOBSlice',
        'ritageBargingSlice',
        'ritageMovingSlice',
        'ritageQuarrySlice',
        'ritageTopSoilSlice',
      ] as ISliceName[])
    );
  }, []);

  const handleChangeTab = (tabs: TabsValue) => {
    setParams({
      tabs,
    });
  };

  if (!isRouterReady) return null;

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('commonTypography.dataRitage'),
          mb: 'md',
          px: 0,
        }}
      >
        <GlobalTabs
          tabs={{
            defaultValue: 'ore',
            keepMounted: false,
            value: params.tabs,
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
