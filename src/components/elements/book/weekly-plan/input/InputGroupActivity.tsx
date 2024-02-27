import {
  Flex,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DataTableColumn } from 'mantine-datatable';
import * as React from 'react';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormController,
  MantineDataTable,
  PrimaryButton,
} from '@/components/elements';
import { IPrimaryButtonProps } from '@/components/elements/button/PrimaryButton';

dayjs.extend(isoWeek);

export type IInputGroupActivityProps = {
  addButtonOuter?: Partial<IPrimaryButtonProps>;
  deleteButtonInner?: Partial<IPrimaryButtonProps>;
  label?: string;
  heavyEquipmentRequirementPlanIndex: number;
  activityIndex: number;
  uniqKey?: string | null;
  tabs?: string;
};

const table = [
  {
    id: 'numberOfHeavyEquipmentRequired',
    value: 'Jumlah Alat Berat yang dibutuhkan',
  },
];

const InputGroupActivity: React.FunctionComponent<IInputGroupActivityProps> = ({
  addButtonOuter,
  deleteButtonInner,
  label = 'formsOfActivity',
  heavyEquipmentRequirementPlanIndex,
  activityIndex,
  tabs,
}) => {
  const { t } = useTranslation('default');

  const {
    label: addButtonOuterLabel = t('commonTypography.createFormsOfActivity'),
    ...restAddButtonOuter
  } = addButtonOuter || {};
  const {
    label: deleteButtonOuterLabel = t('commonTypography.delete'),
    ...restDeleteButtonOuter
  } = deleteButtonInner || {};

  const { fields } = useFieldArray({
    name: `heavyEquipmentRequirementPlans.${heavyEquipmentRequirementPlanIndex}.activities.${activityIndex}.weeklyHeavyEquipmentRequirements`,
    keyName: 'weeklyHeavyEquipmentRequirementRhfId',
  });

  const renderOtherColumnCallback = React.useCallback(
    (
      obj: Record<'weeklyHeavyEquipmentRequirementRhfId', string>,
      i: number
    ) => {
      const group: DataTableColumn<any> = {
        accessor: `weeklyHeavyEquipmentRequirements.${i}`,
        title: dayjs()
          .isoWeekday(Number(obj['day'] || 0))
          .format('dddd'),
        width: 100,
        render: () => {
          return (
            <FormController
              control="number-input-table-rhf"
              name={`heavyEquipmentRequirementPlans.${heavyEquipmentRequirementPlanIndex}.activities.${activityIndex}.weeklyHeavyEquipmentRequirements.${i}.value`}
              precision={0}
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
    [heavyEquipmentRequirementPlanIndex, activityIndex]
  );

  const renderOtherColumn = fields?.map(renderOtherColumnCallback);

  return (
    <Flex gap={22} direction="column" align="flex-end" w="100%">
      <Group spacing="xs" position="right">
        {addButtonOuter ? (
          <PrimaryButton
            // leftIcon={<IconPlus size="20px" />}
            label={addButtonOuterLabel}
            {...restAddButtonOuter}
          />
        ) : null}
      </Group>
      <Paper p={24} withBorder w="100%">
        <Stack spacing={8}>
          <SimpleGrid cols={2} mb="sm">
            <Text
              component="span"
              fw={500}
              fz={16}
              sx={{ alignSelf: 'center' }}
            >
              {t(`commonTypography.${label}`)}
            </Text>
            <Group spacing="xs" position="right">
              {deleteButtonInner ? (
                <PrimaryButton
                  color="red.5"
                  variant="light"
                  styles={(theme) => ({
                    root: {
                      border: `1px solid ${theme.colors.red[3]}`,
                    },
                  })}
                  label={deleteButtonOuterLabel}
                  {...restDeleteButtonOuter}
                />
              ) : null}
            </Group>
          </SimpleGrid>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <FormController
                control="select-activity-form-rhf"
                name={`heavyEquipmentRequirementPlans.${heavyEquipmentRequirementPlanIndex}.activities.${activityIndex}.activityId`}
                label="formsOfActivity"
                withAsterisk
                clearable
                skipQuery={tabs !== 'heavyEquipmentReqPlan'}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="class-select-input"
                name={`heavyEquipmentRequirementPlans.${heavyEquipmentRequirementPlanIndex}.activities.${activityIndex}.classId`}
                label="heavyEquipmentClass"
                withAsterisk
                clearable
                searchable
                limit={null}
                skipQuery={tabs !== 'heavyEquipmentReqPlan'}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <MantineDataTable
                tableProps={{
                  highlightOnHover: true,
                  withColumnBorders: true,
                  columns: [
                    {
                      accessor: 'value',
                      width: 250,
                      title: t('commonTypography.information'),
                    },
                    ...(renderOtherColumn ?? []),
                  ],
                  records: table,
                }}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Paper>
    </Flex>
  );
};

export default InputGroupActivity;
