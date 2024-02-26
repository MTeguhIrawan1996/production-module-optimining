import { Text } from '@mantine/core';
import * as React from 'react';
import { FieldArrayWithId, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import MantineDataTable from '@/components/elements/dataTable/MantineDataTable';
import FormController from '@/components/elements/form/FormController';

import { IWorkTimePlanValues } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyWorkTimePlan';

interface IInputTableWorkTimePlanProps {}

// eslint-disable-next-line unused-imports/no-unused-vars
const InputMonthlyTableWorkTimePlan = (props: IInputTableWorkTimePlanProps) => {
  const { t } = useTranslation('default');

  const { fields: workTimePlanActivityFields } = useFieldArray({
    name: 'workTimePlanActivities',
    keyName: 'workTimePlanActivityId',
  });

  const recordsWithoutLoseTime = (
    workTimePlanActivityFields as FieldArrayWithId<
      IWorkTimePlanValues,
      'workTimePlanActivities',
      'workTimePlanActivityId'
    >[]
  ).filter((val) => !val.isLoseTime);
  const recordsWithLoseTime = (
    workTimePlanActivityFields as FieldArrayWithId<
      IWorkTimePlanValues,
      'workTimePlanActivities',
      'workTimePlanActivityId'
    >[]
  ).filter((val) => val.isLoseTime);

  return (
    <MantineDataTable
      tableProps={{
        highlightOnHover: true,
        withColumnBorders: true,
        idAccessor: (record) => {
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
            id: 'day',
            title: t('commonTypography.day'),
            style: { textAlign: 'center' },
            columns: [],
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
                      keyObj="hour"
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
                idAccessor: (record) => {
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
                    id: 'day',
                    title: t('commonTypography.day'),
                    style: { textAlign: 'center' },
                    columns: [],
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
                                val.id !== 'loseTime' &&
                                val.id !== 'amountEffectiveWorkingHours'
                            );
                          const activityWorkTimePlanLength =
                            activityWorkTimePlan?.length || 0;
                          return (
                            <FormController
                              control="input-sum-array"
                              name={`workTimePlanActivities.${
                                index + activityWorkTimePlanLength
                              }.weeklyWorkTimes`}
                              keyObj="hour"
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
