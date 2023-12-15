import { Stack, Text } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { MantineDataTable } from '@/components/elements';

import { IEmployeeData } from '@/services/graphql/query/master-data-company/useReadOneCompanyHumanResource';
import { formatDate } from '@/utils/helper/dateFormat';

interface IProps {
  employe?: IEmployeeData;
}

const ReadCompanyPositionHistoryBook: React.FC<IProps> = ({ employe }) => {
  const { t } = useTranslation('default');

  return (
    <Stack spacing="sm" mt="md">
      <Text fz={24} fw={600} color="brand">
        {t('commonTypography.positionDetail')}
      </Text>
      <MantineDataTable
        tableProps={{
          records: employe?.positionHistories,
          defaultColumnProps: {
            titleStyle: {
              backgroundColor: 'transparent',
              border: 'none',
            },

            cellsStyle: {
              border: 'none',
            },
            noWrap: false,
          },
          columns: [
            {
              accessor: 'name',
              title: t('commonTypography.name'),
              render: ({ position }) => position.name,
              width: '20%',
            },
            {
              accessor: 'division',
              title: t('commonTypography.division'),
              render: ({ division }) => division.name,
              width: '20%',
            },
            {
              accessor: 'startdate',
              title: t('commonTypography.dateOfOffice'),
              render: ({ startDate }) => formatDate(startDate),
              width: '30%',
            },
            {
              accessor: 'endDate',
              title: t('commonTypography.dateComplateOffice'),
              render: ({ endDate }) => formatDate(endDate),
              width: '30%',
            },
          ],
          withBorder: false,
          shadow: 'none',
          emptyState: undefined,
          minHeight: 150,
          borderColor: 'none',
          rowBorderColor: 'none',
        }}
      />
    </Stack>
  );
};

export default ReadCompanyPositionHistoryBook;
