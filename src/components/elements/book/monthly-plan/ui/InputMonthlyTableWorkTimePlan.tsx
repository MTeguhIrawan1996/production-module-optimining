import { Text } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import * as React from 'react';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import DisplayLoseTimeAndEffectiveWork from '@/components/elements/book/weekly-plan/input/DisplayLoseTimeAndEffectiveWork';
import MantineDataTable from '@/components/elements/dataTable/MantineDataTable';
import FormController from '@/components/elements/form/FormController';

interface IInputTableWorkTimePlanProps {
  mutationType?: 'create' | 'update' | 'read';
}

// eslint-disable-next-line unused-imports/no-unused-vars
const InputMonthlyTableWorkTimePlan = ({
  mutationType,
}: IInputTableWorkTimePlanProps) => {
  const { t } = useTranslation('default');

  const { fields: workTimePlanActivityFields } = useFieldArray({
    name: 'workTimePlanActivities',
    keyName: 'workTimePlanActivityId',
  });

  const recordsWithoutLoseTime = (workTimePlanActivityFields as any).filter(
    (val) => !val.isLoseTime
  );
  const recordsWithLoseTime = (workTimePlanActivityFields as any).filter(
    (val) => val.isLoseTime
  );

  const renderOtherColumnActivityCallback = React.useCallback(
    (obj: any, index: number) => {
      const group: DataTableColumn<any> = {
        accessor: `${obj['week']}.activity`,
        width: 100,
        title: `${t('commonTypography.week')} ${obj.week}`,
        render: ({ activityId }, i: number) => {
          if (activityId === 'loseTime') {
            return (
              <DisplayLoseTimeAndEffectiveWork
                name="workTimePlanActivities"
                indexOfHour={index}
                variant="unstyled"
                disabled={false}
                readOnly
                calculationType="loseTime"
                styles={{
                  input: {
                    textAlign: 'center',
                  },
                }}
              />
            );
          }
          if (activityId === 'amountEffectiveWorkingHours') {
            return (
              <DisplayLoseTimeAndEffectiveWork
                name="workTimePlanActivities"
                indexOfHour={index}
                variant="unstyled"
                disabled={false}
                readOnly
                calculationType="amountEffectiveWorkingHours"
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
              name={`workTimePlanActivities.${i}.weeklyWorkTimes.${index}.hour`}
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
      };
      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutationType]
  );

  const renderOtherColumnActivityWeek = (
    workTimePlanActivityFields[0] as any
  ).weeklyWorkTimes?.map(renderOtherColumnActivityCallback);

  const renderOtherColumnLosetimeCallback = React.useCallback(
    (obj: any, index: number) => {
      const group: DataTableColumn<any> = {
        accessor: `${obj['week']}.loseTime`,
        width: 100,
        title: `${t('commonTypography.week')} ${obj.week}`,
        render: (_, i) => {
          const activityWorkTimePlan = recordsWithoutLoseTime.filter(
            (val) =>
              val.activityId !== 'loseTime' &&
              val.activityId !== 'amountEffectiveWorkingHours'
          );
          const activityWorkTImePlanLength = activityWorkTimePlan?.length || 0;

          return (
            <FormController
              control="number-input-table-rhf"
              name={`workTimePlanActivities.${
                i + activityWorkTImePlanLength
              }.weeklyWorkTimes.${index}.hour`}
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
      };
      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recordsWithoutLoseTime, mutationType]
  );

  const renderOtherColumnLosetimeWeek = (
    workTimePlanActivityFields[0] as any
  ).weeklyWorkTimes?.map(renderOtherColumnLosetimeCallback);

  return (
    <MantineDataTable
      tableProps={{
        highlightOnHover: true,
        withColumnBorders: true,
        idAccessor: (record: any) => {
          return record.activityId || record.workTimePlanActivityId;
        },
        groups: [
          {
            id: 'no',
            title: 'No',
            style: { textAlign: 'center' },
            columns: [
              {
                accessor: 'index',
                title: '',
                render: (record) => {
                  return (
                    recordsWithoutLoseTime &&
                    recordsWithoutLoseTime.indexOf(record) + 1
                  );
                },
                width: 60,
              },
            ],
          },
          {
            id: 'activity',
            title: t('commonTypography.activity'),
            columns: [
              {
                accessor: 'name',
                title: '',
                width: 260,
                textAlignment: 'left',
                render: ({ name, activityId }) => {
                  if (
                    activityId === `${process.env.NEXT_PUBLIC_WORKING_TIME_ID}`
                  ) {
                    return (
                      <Text component="label">
                        {name}
                        <Text component="span" color="red" aria-hidden="true">
                          {' '}
                          *
                        </Text>
                      </Text>
                    );
                  }
                  return name;
                },
              },
            ],
          },
          {
            id: 'week',
            title: t('commonTypography.week'),
            style: { textAlign: 'center' },
            columns: renderOtherColumnActivityWeek || [],
          },
          {
            id: 'amount',
            title: 'Total',
            style: { textAlign: 'center' },
            columns: [
              {
                accessor: 'amount',
                title: '',
                render: ({ activityId }, index) => {
                  if (activityId === 'loseTime') {
                    return (
                      <FormController
                        control="number-input"
                        name="totalLoseTimeWeek"
                        variant="unstyled"
                        disabled={false}
                        readOnly
                        styles={{
                          input: {
                            textAlign: 'center',
                          },
                        }}
                      />
                    );
                  }
                  if (activityId === 'amountEffectiveWorkingHours') {
                    return (
                      <FormController
                        control="number-input"
                        name="totalEffectiveWorkHourWeek"
                        variant="unstyled"
                        disabled={false}
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
                      control="input-sum-array"
                      name={`workTimePlanActivities.${index}.weeklyWorkTimes`}
                      keyObj="value"
                      variant="unstyled"
                      disabled={false}
                      readOnly
                      styles={{
                        input: {
                          textAlign: 'center',
                        },
                      }}
                    />
                  );
                },
                width: 100,
              },
            ],
          },
          {
            id: 'unit',
            title: 'Unit',
            style: { textAlign: 'center' },
            columns: [
              {
                accessor: 'unit',
                title: '',
                render: (_, index) => {
                  return <Text>{index === 0 ? 'Jam/Hari' : 'Jam'}</Text>;
                },
                width: 100,
              },
            ],
          },
        ],
        rowExpansion: {
          allowMultiple: true,
          expanded: {
            recordIds: ['loseTime'],
          },
          content: () => (
            <MantineDataTable
              tableProps={{
                noHeader: true,
                shadow: '0',
                withBorder: false,
                borderRadius: 0,
                idAccessor: (record: any) => {
                  return record.activityId || record.workTimePlanActivityId;
                },
                groups: [
                  {
                    id: 'no',
                    title: 'No',
                    style: { textAlign: 'center' },
                    columns: [
                      {
                        accessor: 'index',
                        title: '',
                        render: () => null,
                        width: 60,
                      },
                    ],
                  },
                  {
                    id: 'activity',
                    title: t('commonTypography.activity'),
                    columns: [
                      {
                        accessor: 'name',
                        title: '',
                        textAlignment: 'left',
                        render: ({ name }, index) => {
                          const indextoAlphabet = String.fromCharCode(
                            65 + index
                          );
                          return <Text>{`${indextoAlphabet}. ${name}`}</Text>;
                        },
                        width: 260,
                      },
                    ],
                  },
                  {
                    id: 'week',
                    title: t('commonTypography.week'),
                    style: { textAlign: 'center' },
                    columns: renderOtherColumnLosetimeWeek || [],
                  },
                  {
                    id: 'amount',
                    title: 'Total',
                    style: { textAlign: 'center' },
                    columns: [
                      {
                        accessor: 'amount',
                        title: '',
                        render: (_, index) => {
                          const activityWorkTimePlan =
                            recordsWithoutLoseTime.filter(
                              (val) =>
                                val.activityId !== 'loseTime' &&
                                val.activityId !== 'amountEffectiveWorkingHours'
                            );
                          const activityWorkTimePlanLength =
                            activityWorkTimePlan?.length || 0;
                          return (
                            <FormController
                              control="input-sum-array"
                              name={`workTimePlanActivities.${
                                index + activityWorkTimePlanLength
                              }.weeklyWorkTimes`}
                              keyObj="value"
                              variant="unstyled"
                              disabled={false}
                              readOnly
                              styles={{
                                input: {
                                  textAlign: 'center',
                                },
                              }}
                            />
                          );
                        },
                        width: 100,
                      },
                    ],
                  },
                  {
                    id: 'unit',
                    title: 'Unit',
                    style: { textAlign: 'center' },
                    columns: [
                      {
                        accessor: 'unit',
                        title: '',
                        render: () => {
                          return <Text>Jam</Text>;
                        },
                        width: 100,
                      },
                    ],
                  },
                ],
                records: recordsWithLoseTime ?? [],
                emptyState: undefined,
              }}
            />
          ),
        },
        records: recordsWithoutLoseTime ?? [],
      }}
      emptyStateProps={{
        title: t('commonTypography.dataNotfound'),
      }}
    />
  );
};

export default InputMonthlyTableWorkTimePlan;
