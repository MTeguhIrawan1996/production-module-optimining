import { Tabs, TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  DashboardCard,
  InnerWrapper,
  RootWrapper,
} from '@/components/elements';
import ReadCompanyEmployeBook from '@/components/features/MasterData/company/read-company/read-human-resources/common/sections/ReadCompanyEmployeData';
import ReadCompanyHumanResourcesBook from '@/components/features/MasterData/company/read-company/read-human-resources/common/sections/ReadCompanyHumanResourcesBook';
import ReadCompanyPositionHistoryBook from '@/components/features/MasterData/company/read-company/read-human-resources/common/sections/ReadCompanyPositionHistory';

import {
  IEmployeeData,
  useReadOneEmployee,
} from '@/services/graphql/query/master-data-company/useReadOneCompanyHumanResource';
import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadCompanyHumanResourcesPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const companyId = router.query?.id?.[0];
  const employeId = router.query?.id?.[1];
  const [employeDateState, setEmployeDateState] = React.useState<
    IEmployeeData | undefined
  >(undefined);
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
        path: `/master-data/company/read/${companyId}`,
      },
      {
        label: t('humanResources.readHumanResources'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleChangeTab = (tabs: TabsValue) => {
    const idSegment = employeId
      ? `/${companyId}/${employeId}`
      : `/${companyId}`;
    const url = `/master-data/company/read/human-resources${idSegment}/?tabs=${tabs}`;
    router.push(url, undefined, { shallow: true });
  };

  /* #   /**=========== Query =========== */
  const { employeeDataLoading } = useReadOneEmployee({
    variables: {
      id: employeId ?? '',
    },
    skip: !router.isReady || !employeDateState ? false : true,
    onCompleted: (data) => {
      setEmployeDateState(data.employee);
    },
  });
  /* #endregion  /**======== Query =========== */

  return (
    <RootWrapper>
      <InnerWrapper>
        <DashboardCard
          title={t('commonTypography.humanResources2')}
          updateButton={{
            label: 'Edit',
            onClick: () =>
              router.push(
                `/master-data/company/update/human-resources/${companyId}/${employeId}`
              ),
          }}
          titleStyle={{
            fw: 700,
            fz: 30,
          }}
          isLoading={employeeDataLoading}
          withBorder
          enebleBackBottomOuter={{
            onClick: () =>
              router.push(`/master-data/company/read/${companyId}`),
          }}
          shadow="xs"
          paperStackProps={{
            spacing: 'sm',
          }}
        >
          <Tabs
            defaultValue="human-resources-profil"
            value={router.query.tabs as string}
            onTabChange={(value) => handleChangeTab(value)}
            radius={4}
            styles={{
              tabsList: {
                flexWrap: 'nowrap',
              },
            }}
          >
            <Tabs.List>
              <Tabs.Tab value="human-resources-profil" fz={14} fw={500}>
                {t('commonTypography.profile')}
              </Tabs.Tab>
              <Tabs.Tab
                value="employe-data"
                fz={14}
                fw={500}
                disabled={!router.query?.id?.[1]}
              >
                {t('commonTypography.employeData')}
              </Tabs.Tab>
              <Tabs.Tab
                value="position-history"
                fz={14}
                fw={500}
                disabled={!router.query?.id?.[1]}
              >
                {t('commonTypography.positionHistory')}
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="human-resources-profil">
              <ReadCompanyHumanResourcesBook
                humanResource={employeDateState?.humanResource}
                isLoading={employeeDataLoading}
              />
            </Tabs.Panel>
            <Tabs.Panel value="employe-data">
              <ReadCompanyEmployeBook employe={employeDateState} />
            </Tabs.Panel>
            <Tabs.Panel value="position-history">
              <ReadCompanyPositionHistoryBook employe={employeDateState} />
            </Tabs.Panel>
          </Tabs>
        </DashboardCard>
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadCompanyHumanResourcesPage;
