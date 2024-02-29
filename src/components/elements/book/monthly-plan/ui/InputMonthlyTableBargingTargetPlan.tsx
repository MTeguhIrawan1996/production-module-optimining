import { DataTableColumnGroup } from 'mantine-datatable';
import * as React from 'react';
import { FieldArrayWithId, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormController, MantineDataTable } from '@/components/elements';

import {
  IMonthlyBargingTarget,
  IMonthlyBargingTargetPlanValue,
} from '@/services/graphql/mutation/plan/monthly/useCreateMonthlyBargingTargetPlan';
import { IBargingTargetPlan } from '@/services/graphql/mutation/plan/weekly/useCreateBargingTargetPlan';

const InputMonthlyTableBargingTargetPlan = () => {
  const { t } = useTranslation('default');

  const { fields } = useFieldArray({
    name: `bargingTargetPlans`,
    keyName: 'bargingTargetPlanId',
  });

  const renderOtherColumnCallback = React.useCallback(
    (obj: IMonthlyBargingTarget, i: number) => {
      const group: DataTableColumnGroup<IBargingTargetPlan> = {
        id: `${obj['week']}`,
        title: `${t('commonTypography.week')} ${obj.week}`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const renderOtherGroup = (
    fields as FieldArrayWithId<
      IMonthlyBargingTargetPlanValue,
      'bargingTargetPlans',
      'bargingTargetPlanId'
    >[]
  )[0].weeklyBargingTargets.map(renderOtherColumnCallback);

  return (
    <MantineDataTable
      tableProps={{
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

export default InputMonthlyTableBargingTargetPlan;
