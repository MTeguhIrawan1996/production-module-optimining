import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import CreateHumanResourcesAvailableBook from '@/components/features/MasterData/company/create-company/create-human-resources-available/common/sections/CreateHumanResourcesAvailableBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateHumanResourcesAvailablePage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.company'),
        path: '/master-data/company',
      },
      {
        label: 'Overview',
        path: `/master-data/company/read/${router.query?.id}`,
      },
      {
        label: t('humanResources.chooseSDM'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <CreateHumanResourcesAvailableBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateHumanResourcesAvailablePage;
