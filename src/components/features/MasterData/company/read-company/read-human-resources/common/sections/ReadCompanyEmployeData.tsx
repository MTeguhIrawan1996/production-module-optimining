import { Stack, Text } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { KeyValueList } from '@/components/elements';

import { IEmployeeData } from '@/services/graphql/query/master-data-company/useReadOneCompanyHumanResource';
import { dateFromat } from '@/utils/helper/dateFormat';

interface IProps {
  employe?: IEmployeeData;
}

const ReadCompanyEmployeBook: React.FC<IProps> = ({ employe }) => {
  const { t } = useTranslation('default');

  return (
    <Stack spacing="sm" mt="md">
      <Text fz={24} fw={600} color="brand">
        {t('commonTypography.employeDetail')}
      </Text>
      <KeyValueList
        data={[
          {
            dataKey: t('commonTypography.nip2'),
            value: employe?.nip,
          },
          {
            dataKey: t('commonTypography.employeStatus'),
            value: employe?.status?.name,
          },
          {
            dataKey: t('commonTypography.entryDate'),
            value: dateFromat(employe?.entryDate ?? ''),
          },
          {
            dataKey: t('commonTypography.quitDate'),
            value: dateFromat(employe?.quitDate ?? ''),
          },
        ]}
        type="grid"
        keyStyleText={{
          fw: 400,
          fz: 20,
        }}
        valueStyleText={{
          fw: 600,
          fz: 20,
        }}
      />
    </Stack>
  );
};

export default ReadCompanyEmployeBook;
