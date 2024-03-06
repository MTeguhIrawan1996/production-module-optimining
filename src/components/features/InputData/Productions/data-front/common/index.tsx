import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import FrontProductionBook from '@/components/features/InputData/Productions/data-front/common/sections/FrontProductionBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const FrontProductionPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('frontProduction.frontProductionTitle'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('frontProduction.frontProductionTitle'),
          mb: 'md',
        }}
      >
        <FrontProductionBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default FrontProductionPage;
