import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

import ReadMapWeeklyProductionBook from './sections/ReadMapWeeklyProductionBook';

const ReadMapWeeklyProductionPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.map'),
        path: '/input-data/production/map?tabs=weekly',
      },
      {
        label: `${t('mapProduction.readMapProd')} ${t(
          'commonTypography.weekly'
        )}`,
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadMapWeeklyProductionBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadMapWeeklyProductionPage;
