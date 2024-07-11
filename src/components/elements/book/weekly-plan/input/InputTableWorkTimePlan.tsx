import { Text } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import * as React from 'react';
import { FieldArrayWithId, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import DisplayLoseTimeAndEffectiveWork from '@/components/elements/book/weekly-plan/input/DisplayLoseTimeAndEffectiveWork';
import MantineDataTable from '@/components/elements/dataTable/MantineDataTable';
import FormController from '@/components/elements/form/FormController';

import {
  IWorkTimeDay,
  IWorkTimePlanActivities,
  IWorkTimePlanValues,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyWorkTimePlan';
import { workTimeDay } from '@/utils/constants/DefaultValues/work-time-plans';
import dayjs from '@/utils/helper/dayjs.config';

interface IInputTableWorkTimePlanProps {
  mutationType?: 'create' | 'update' | 'read';
  isLoading?: boolean;
}

const InputTableWorkTimePlan = ({
  mutationType,
  isLoading,
}: IInputTableWorkTimePlanProps) => {
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
  ).filter(
    (
      val: FieldArrayWithId<
        IWorkTimePlanValues,
        'workTimePlanActivities',
        'workTimePlanActivityId'
      >
    ) => !val.isLoseTime
  );
  const recordsWithLoseTime = (
    workTimePlanActivityFields as FieldArrayWithId<
      IWorkTimePlanValues,
      'workTimePlanActivities',
      'workTimePlanActivityId'
    >[]
  ).filter(
    (
      val: FieldArrayWithId<
        IWorkTimePlanValues,
        'workTimePlanActivities',
        'workTimePlanActivityId'
      >
    ) => val.isLoseTime
  );
  const renderOtherColumnActivityCallback = React.useCallback(
    (obj: IWorkTimeDay, index: number) => {
      const group: DataTableColumn<IWorkTimePlanActivities> = {
        accessor: `${obj['day']}.activity`,
        width: 100,
        title: dayjs()
          .isoWeekday(Number(obj['day'] || 0))
          .format('dddd'),
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
    [mutationType]
  );

  const renderOtherColumnActivityDay = workTimeDay?.map(
    renderOtherColumnActivityCallback
  );

  const renderOtherColumnLosetimeCallback = React.useCallback(
    (obj: IWorkTimeDay, index: number) => {
      const group: DataTableColumn<IWorkTimePlanActivities> = {
        accessor: `${obj['day']}.loseTime`,
        width: 100,
        title: dayjs()
          .isoWeekday(Number(obj['day'] || 0))
          .format('dddd'),
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
    [recordsWithoutLoseTime, mutationType]
  );

  const renderOtherColumnLosetimeDay = workTimeDay?.map(
    renderOtherColumnLosetimeCallback
  );

  return (
    <MantineDataTable
      tableProps={{
        highlightOnHover: true,
        withColumnBorders: true,
        fetching: isLoading,
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
            columns: renderOtherColumnActivityDay ?? [],
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
        rowExpansion:
          recordsWithLoseTime.length > 0
            ? {
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
                      minHeight: 0,
                      idAccessor: (record) => {
                        return (
                          record.activityId || record.workTimePlanActivityId
                        );
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
                                return (
                                  <Text>{`${indextoAlphabet}. ${name}`}</Text>
                                );
                              },
                              width: 260,
                            },
                          ],
                        },
                        {
                          id: 'day',
                          title: t('commonTypography.day'),
                          style: { textAlign: 'center' },
                          columns: renderOtherColumnLosetimeDay ?? [],
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
                                      val.activityId !==
                                        'amountEffectiveWorkingHours'
                                  );
                                const activityWorkTImePlanLength =
                                  activityWorkTimePlan?.length || 0;
                                return (
                                  <FormController
                                    control="input-sum-array"
                                    name={`workTimePlanActivities.${
                                      index + activityWorkTImePlanLength
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
              }
            : undefined,
        records: recordsWithoutLoseTime ?? [],
      }}
      emptyStateProps={{
        title: t('commonTypography.dataNotfound'),
      }}
    />
  );
};

export default InputTableWorkTimePlan;
