import { ScrollArea, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CreateMaterialMasterBook from '@/components/features/MasterData/material/create/common/sections/CreateMaterialMasterBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateMaterialMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.material'),
        path: '/master-data/material',
      },
      {
        label: t('material.createMaterial'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('material.formMaterial'),
          mb: 'md',
        }}
        alertProps={{
          mb: 'md',
          fz: 14,
          fw: 400,
          description:
            'Jika ingin menambahkan jenis material, isi jenis material saja dan kosongkan sub jenis material',
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
            <CreateMaterialMasterBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateMaterialMasterPage;
