import { ScrollArea, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CreateStockpileDomeMasterBook from '@/components/features/MasterData/stockpile/create/dome/common/sections/CreateStockpileDomeMasterBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateStockpileDomeMasterPage = () => {
  const router = useRouter();
  const stockpileId = router.query?.id as string;
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.stockpile'),
        path: '/master-data/stockpile',
      },
      {
        label: t('stockpile.readStockpile'),
        path: `/master-data/stockpile/read/${stockpileId}`,
      },
      {
        label: t('stockpile.createStockpileDome'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('stockpile.formStockpileDome'),
          mb: 'md',
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
            <CreateStockpileDomeMasterBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateStockpileDomeMasterPage;
