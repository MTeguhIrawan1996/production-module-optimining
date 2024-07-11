import { DataTableColumnGroup } from 'mantine-datatable';
import * as React from 'react';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormController, MantineDataTable } from '@/components/elements';

import {
  IBargingTargetPlan,
  IWeeklyBargingTarget,
} from '@/services/graphql/mutation/plan/weekly/useCreateBargingTargetPlan';
import { bargingTarget } from '@/utils/constants/DefaultValues/barging-target-plan';
import dayjs from '@/utils/helper/dayjs.config';

type IInputBargingTargetPlanProps = {
  isLoading?: boolean;
};

const InputTableBargingTargetPlan = ({
  isLoading,
}: IInputBargingTargetPlanProps) => {
  const { t } = useTranslation('default');

  const { fields } = useFieldArray({
    name: `bargingTargetPlans`,
    keyName: 'bargingTargetPlanId',
  });

  const renderOtherColumnCallback = React.useCallback(
    (obj: IWeeklyBargingTarget, i: number) => {
      const group: DataTableColumnGroup<IBargingTargetPlan> = {
        id: `${obj['day']}`,
        title: dayjs()
          .isoWeekday(Number(obj['day'] || 0))
          .format('dddd'),
        style: { textAlign: 'center' },
        columns: [
          {
            accessor: `rate.${i}`,
            title: 'Rate',
            width: 100,
            render: (_, index) => {
              return (
                <FormController
                  control="number-input-table-rhf"
                  name={`bargingTargetPlans.${index}.weeklyBargingTargets.${i}.rate`}
                  precision={0}
                  styles={{
                    input: {
                      textAlign: 'center',
                    },
                  }}
                />
              );
            },
          },
          {
            accessor: `ton.${i}`,
            title: 'Ton',
            width: 100,
            render: (_, index) => {
              return (
                <FormController
                  control="number-input-table-rhf"
                  name={`bargingTargetPlans.${index}.weeklyBargingTargets.${i}.ton`}
                  styles={{
                    input: {
                      textAlign: 'center',
                    },
                  }}
                />
              );
            },
          },
        ],
      };
      return group;
    },
    []
  );

  const renderOtherGroup = bargingTarget.map(renderOtherColumnCallback);

  return (
    <MantineDataTable
      tableProps={{
        fetching: isLoading,
        highlightOnHover: true,
        withColumnBorders: true,
        idAccessor: (record) => {
          return record['bargingTargetPlanId'];
        },
        groups: [
          {
            id: 'material',
            title: t('commonTypography.material'),
            style: { textAlign: 'center' },
            columns: [{ accessor: 'materialName', width: 250, title: '' }],
          },
          ...(renderOtherGroup ?? []),
        ],
        records: (fields as unknown as IBargingTargetPlan[]) ?? [],
      }}
    />
  );
};

export default InputTableBargingTargetPlan;
