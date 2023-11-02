import { useMantineTheme } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, MantineDataTable } from '@/components/elements';

import { useReadAllCompanyTypes } from '@/services/graphql/query/company-type/useReadAllCompanyType';

const CompanyTypeBook = () => {
  const theme = useMantineTheme();
  const { t } = useTranslation('default');
  const { companyTypesdata, companyTypesLoading } = useReadAllCompanyTypes({
    variables: {
      limit: null,
      orderBy: null,
      orderDir: null,
      page: null,
      search: null,
    },
  });

  return (
    <DashboardCard withBorder shadow="xs">
      <MantineDataTable
        tableProps={{
          defaultColumnProps: {
            textAlignment: 'left',
            cellsStyle: {
              paddingTop: theme.spacing.xs,
              padding: theme.spacing.xs,
            },
          },
          fetching: companyTypesLoading,
          fontSize: 16,
          verticalSpacing: 'md',
          columns: [
            {
              accessor: 'name',
              title: t('companyType.companyTypeTitle'),
            },
          ],
          records: companyTypesdata,
        }}
      />
    </DashboardCard>
  );
};

export default CompanyTypeBook;
