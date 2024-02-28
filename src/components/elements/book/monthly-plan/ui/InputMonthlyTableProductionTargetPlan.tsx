import { Text } from '@mantine/core';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DataTableColumnGroup } from 'mantine-datatable';
import * as React from 'react';
import { FieldArrayWithId, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormController, MantineDataTable } from '@/components/elements';
import InputOreCalculation from '@/components/elements/book/weekly-plan/input/InputOreCalculation';
import InputSRCalculation from '@/components/elements/book/weekly-plan/input/InputSRCalculation';

import {
  IMonthlyProductionTarget,
  IMonthlyProductionTargetPlanData,
  IMonthlyProductionTargetPlanValues,
} from '@/services/graphql/mutation/plan/monthly/useCreateMonthlyProductionTargetPlan';

dayjs.extend(isoWeek);

interface IInputMonthlyTableProductionTargetPlanProps {
  mutationType?: 'create' | 'update' | 'read';
}

const InputMonthlyTableProductionTargetPlan = ({
  mutationType,
}: IInputMonthlyTableProductionTargetPlanProps) => {
  const { t } = useTranslation('default');

  const { fields: productionTargetPlanFields } = useFieldArray({
    name: 'productionTargetPlans',
    keyName: 'productionTargetPlanId',
  });

  const materialPerent = (
    productionTargetPlanFields as FieldArrayWithId<
      IMonthlyProductionTargetPlanValues,
      'productionTargetPlans',
      'productionTargetPlanId'
    >[]
  ).filter((val) => val.isPerent);
  const subMaterialOre = (
    productionTargetPlanFields as FieldArrayWithId<
      IMonthlyProductionTargetPlanValues,
      'productionTargetPlans',
      'productionTargetPlanId'
    >[]
  ).filter((val) => !val.isPerent);

  const renderOtherGroupMaterialCallback = React.useCallback(
    (obj: IMonthlyProductionTarget, i: number) => {
      const group: DataTableColumnGroup<IMonthlyProductionTargetPlanData> = {
        id: `${obj['week']}`,
        title: `${t('commonTypography.week')} ${obj.week}`,
        style: { textAlign: 'center' },
        columns: [
          {
            accessor: `rate.${i}`,
            title: 'Rate',
            width: 100,
            render: ({ materialId }, index) => {
              if (materialId === 'sr') {
                return (
                  <InputSRCalculation
                    indexOfValue={i}
                    calculationSelected="rate"
                    name={`productionTargetPlans.${
                      productionTargetPlanFields.length - 1
                    }.weeklyProductionTargets.${i}.rate`}
                    precision={2}
                    variant="unstyled"
                    readOnly
                    mutationType={mutationType}
                    styles={{
                      root: {
                        display: 'none',
                      },
                      input: {
                        textAlign: 'center',
                      },
                    }}
                  />
                );
              }
              if (materialId === `${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`) {
                return (
                  <InputOreCalculation
                    name={`productionTargetPlans.${index}.weeklyProductionTargets.${i}.rate`}
                    indexOfValue={i}
                    calculationSelected="rate"
                    precision={0}
                    variant="unstyled"
                    readOnly
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
                  readOnly={mutationType === 'read' ? true : false}
                  variant={mutationType === 'read' ? 'unstyled' : 'default'}
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
            render: ({ materialId }, index) => {
              if (materialId === 'sr') {
                return (
                  <InputSRCalculation
                    indexOfValue={i}
                    calculationSelected="ton"
                    name={`productionTargetPlans.${
                      productionTargetPlanFields.length - 1
                    }.weeklyProductionTargets.${i}.ton`}
                    precision={2}
                    variant="unstyled"
                    readOnly
                    mutationType={mutationType}
                    styles={{
                      input: {
                        textAlign: 'center',
                      },
                    }}
                  />
                );
              }
              if (materialId === `${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`) {
                return (
                  <InputOreCalculation
                    name={`productionTargetPlans.${index}.weeklyProductionTargets.${i}.ton`}
                    indexOfValue={i}
                    calculationSelected="ton"
                    precision={2}
                    variant="unstyled"
                    readOnly
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
                  readOnly={mutationType === 'read' ? true : false}
                  variant={mutationType === 'read' ? 'unstyled' : 'default'}
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
    [productionTargetPlanFields, mutationType]
  );
  const renderOtherGroupMaterialDay = (
    productionTargetPlanFields as FieldArrayWithId<
      IMonthlyProductionTargetPlanValues,
      'productionTargetPlans',
      'productionTargetPlanId'
    >[]
  )[0].weeklyProductionTargets.map(renderOtherGroupMaterialCallback);

  const renderOtherGroupSubMaterialCallback = React.useCallback(
    (obj: IMonthlyProductionTarget, i: number) => {
      const group: DataTableColumnGroup<IMonthlyProductionTargetPlanData> = {
        id: `${obj['week']}`,
        title: `${t('commonTypography.week')} ${obj.week}`,

        style: { textAlign: 'center' },
        columns: [
          {
            accessor: `rate.${i}`,
            title: 'Rate',
            width: 100,
            render: ({ index: indexRhf }) => {
              return (
                <FormController
                  control="number-input-table-rhf"
                  name={`productionTargetPlans.${indexRhf}.weeklyProductionTargets.${i}.rate`}
                  precision={0}
                  labelWithTranslate={false}
                  readOnly={mutationType === 'read' ? true : false}
                  variant={mutationType === 'read' ? 'unstyled' : 'default'}
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
            render: ({ index: indexRhf }) => {
              return (
                <FormController
                  control="number-input-table-rhf"
                  name={`productionTargetPlans.${indexRhf}.weeklyProductionTargets.${i}.ton`}
                  labelWithTranslate={false}
                  readOnly={mutationType === 'read' ? true : false}
                  variant={mutationType === 'read' ? 'unstyled' : 'default'}
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
    [mutationType]
  );

  const renderOtherGroupSubMaterialDay = (
    productionTargetPlanFields as FieldArrayWithId<
      IMonthlyProductionTargetPlanValues,
      'productionTargetPlans',
      'productionTargetPlanId'
    >[]
  )[0].weeklyProductionTargets.map(renderOtherGroupSubMaterialCallback);

  return (
    <MantineDataTable
      tableProps={{
        highlightOnHover: true,
        withColumnBorders: true,
        idAccessor: (record) => {
          return record.materialId || record.materialName;
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
                  return record.materialId || record.materialName;
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

export default InputMonthlyTableProductionTargetPlan;
