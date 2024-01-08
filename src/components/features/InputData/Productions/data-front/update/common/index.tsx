import { Tabs } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateFrontProductionBook from '@/components/features/InputData/Productions/data-front/update/common/sections/UpdateFrontProductionBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateFrontProductionPage = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const segment = pageParams.get('segment') || 'pit';
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('frontProduction.frontProductionTitle'),
        path: `/input-data/production/data-front?page=1&segment=${segment}`,
      },
      {
        label: t('frontProduction.createFrontProduction'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('frontProduction.formFrontProduction'),
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
            <UpdateFrontProductionBook />
          </Tabs.Panel>
        </Tabs>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateFrontProductionPage;
