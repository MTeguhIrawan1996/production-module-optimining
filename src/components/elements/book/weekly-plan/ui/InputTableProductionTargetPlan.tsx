import { Text } from '@mantine/core';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DataTableColumnGroup } from 'mantine-datatable';
import * as React from 'react';
import { FieldArrayWithId, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormController, MantineDataTable } from '@/components/elements';

import {
  IWeeklyProductionTarget,
  IWeeklyProductionTargetPlanData,
  IWeeklyProductionTargetPlanValues,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyProductionTargetPlan';
import { productionTarget } from '@/utils/constants/DefaultValues/production-target-plan';

dayjs.extend(isoWeek);

interface IInputTableProductionProps {
  productionTargetPlanIndex?: number;
}

const InputTableProductionPlan = ({
  // eslint-disable-next-line unused-imports/no-unused-vars
  productionTargetPlanIndex,
}: IInputTableProductionProps) => {
  const { t } = useTranslation('default');

  const { fields: productionTargetPlanFields } = useFieldArray({
    name: 'productionTargetPlans',
    keyName: 'productionTargetPlanId',
  });

  const materialPerent = (
    productionTargetPlanFields as FieldArrayWithId<
      IWeeklyProductionTargetPlanValues,
      'productionTargetPlans',
      'productionTargetPlanId'
    >[]
  ).filter((val) => val.isPerent);
  const subMaterialOre = (
    productionTargetPlanFields as FieldArrayWithId<
      IWeeklyProductionTargetPlanValues,
      'productionTargetPlans',
      'productionTargetPlanId'
    >[]
  ).filter((val) => !val.isPerent);

  const renderOtherGroupMaterialCallback = React.useCallback(
    (obj: IWeeklyProductionTarget, i: number) => {
      const group: DataTableColumnGroup<IWeeklyProductionTargetPlanData> = {
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
            render: ({ id }, index) => {
              if (id === 'SR') {
                return (
                  <FormController
                    control="number-input-table-rhf"
                    name={`productionTargetPlans.${
                      productionTargetPlanFields.length - 1
                    }.weeklyProductionTargets.${i}.rate`}
                    precision={0}
                    label={`${productionTargetPlanFields.length - 1}.${i}`}
                    labelWithTranslate={false}
                    styles={{
                      input: {
                        textAlign: 'center',
                      },
                    }}
                  />
                );
              }

              return (
                <FormController
                  control="number-input-table-rhf"
                  name={`productionTargetPlans.${index}.weeklyProductionTargets.${i}.rate`}
                  precision={0}
                  label={`${index}.${i}`}
                  labelWithTranslate={false}
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
            render: ({ id }, index) => {
              if (id === 'SR') {
                return (
                  <FormController
                    control="number-input-table-rhf"
                    name={`productionTargetPlans.${
                      productionTargetPlanFields.length - 1
                    }.weeklyProductionTargets.${i}.ton`}
                    precision={0}
                    label={`${productionTargetPlanFields.length - 1}.${i}`}
                    labelWithTranslate={false}
                    styles={{
                      input: {
                        textAlign: 'center',
                      },
                    }}
                  />
                );
              }
              return (
                <FormController
                  control="number-input-table-rhf"
                  name={`productionTargetPlans.${index}.weeklyProductionTargets.${i}.ton`}
                  label={`${index}.${i}`}
                  labelWithTranslate={false}
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
    [productionTargetPlanFields]
  );
  const renderOtherGroupMaterialDay = productionTarget?.map(
    renderOtherGroupMaterialCallback
  );

  const renderOtherGroupSubMaterialCallback = React.useCallback(
    (obj: IWeeklyProductionTarget, i: number) => {
      const group: DataTableColumnGroup<IWeeklyProductionTargetPlanData> = {
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
              const materialValue = materialPerent.filter(
                (val) => val.id !== 'SR'
              );
              const materialValueLength = materialValue?.length || 0;
              return (
                <FormController
                  control="number-input-table-rhf"
                  name={`productionTargetPlans.${
                    index + materialValueLength
                  }.weeklyProductionTargets.${i}.rate`}
                  precision={0}
                  label={`${index + materialValueLength}.${i}`}
                  labelWithTranslate={false}
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
              const materialValue = materialPerent.filter(
                (val) => val.id !== 'SR'
              );
              const materialValueLength = materialValue?.length || 0;
              return (
                <FormController
                  control="number-input-table-rhf"
                  name={`productionTargetPlans.${
                    index + materialValueLength
                  }.weeklyProductionTargets.${i}.ton`}
                  label={`${index + materialValueLength}.${i}`}
                  labelWithTranslate={false}
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
    [materialPerent]
  );

  const renderOtherGroupSubMaterialDay = productionTarget?.map(
    renderOtherGroupSubMaterialCallback
  );

  return (
    <MantineDataTable
      tableProps={{
        highlightOnHover: true,
        withColumnBorders: true,
        idAccessor: (record) => {
          return record.materialId
            ? record.materialId
            : record.productionTargetPlanId;
        },
        groups: [
          {
            id: 'material',
            title: t('commonTypography.material'),
            columns: [
              {
                accessor: 'materialName',
                title: '',
                width: 260,
                textAlignment: 'left',
              },
            ],
          },
          ...(renderOtherGroupMaterialDay ?? []),
        ],
        rowExpansion: {
          allowMultiple: true,
          expanded: {
            recordIds: [`${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`],
          },
          content: () => (
            <MantineDataTable
              tableProps={{
                noHeader: true,
                shadow: '0',
                withBorder: false,
                borderRadius: 0,
                idAccessor: (record) => {
                  return record.materialId
                    ? record.materialId
                    : record.productionTargetPlanId;
                },
                groups: [
                  {
                    id: 'material',
                    title: t('commonTypography.material'),
                    columns: [
                      {
                        accessor: 'materialName',
                        title: '',
                        width: 260,
                        textAlignment: 'left',
                        render: ({ materialName }) => {
                          return (
                            <Text pl="sm">
                              <Text component="span">•</Text>
                              {materialName}
                            </Text>
                          );
                        },
                      },
                    ],
                  },
                  ...(renderOtherGroupSubMaterialDay ?? []),
                ],
                records: subMaterialOre ?? [],
                emptyState: undefined,
              }}
            />
          ),
        },
        records: materialPerent ?? [],
      }}
      emptyStateProps={{
        title: t('commonTypography.dataNotfound'),
      }}
    />
  );
};

export default InputTableProductionPlan;
