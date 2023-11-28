import { ScrollArea, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CreateBlockPitMasterBook from '@/components/features/MasterData/block/create/pit/common/sections/CreateBlockPitMasterBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateBlockPitMasterPage = () => {
  const router = useRouter();
  const blockId = router.query?.id as string;
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.block'),
        path: '/master-data/block',
      },
      {
        label: t('block.readBlock'),
        path: `/master-data/block/read/${blockId}`,
      },
      {
        label: t('block.createBlockPit'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('block.formBlockPit'),
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
            <CreateBlockPitMasterBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateBlockPitMasterPage;
