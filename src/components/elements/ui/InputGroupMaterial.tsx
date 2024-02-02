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
import { DataTableColumnGroup } from 'mantine-datatable';
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

export type IInputGroupMaterialProps = {
  addButtonOuter?: Partial<IPrimaryButtonProps>;
  deleteButtonInner?: Partial<IPrimaryButtonProps>;
  label?: string;
  unitCapacityPlanIndex: number;
  materialIndex: number;
  uniqKey?: string | null;
  tabs?: string;
};

const table = [
  {
    id: 'productionPlan',
    activity: 'Target Produksi',
  },
];

const InputGroupMaterial: React.FunctionComponent<IInputGroupMaterialProps> = ({
  addButtonOuter,
  deleteButtonInner,
  label = 'material',
  unitCapacityPlanIndex,
  materialIndex,
  tabs,
}) => {
  const { t } = useTranslation('default');

  const {
    label: addButtonOuterLabel = t('commonTypography.createMaterial'),
    ...restAddButtonOuter
  } = addButtonOuter || {};
  const {
    label: deleteButtonOuterLabel = t('commonTypography.delete'),
    ...restDeleteButtonOuter
  } = deleteButtonInner || {};

  const { fields } = useFieldArray({
    name: `unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.targetPlans`,
    keyName: 'targetPlanRhfId',
  });

  const renderOtherColumnCallback = React.useCallback(
    (obj: Record<'targetPlanRhfId', string>, i: number) => {
      const group: DataTableColumnGroup<any> = {
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
            render: () => {
              return (
                <FormController
                  control="number-input-table-rhf"
                  name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.targetPlans.${i}.rate`}
                  precision={0}
                />
              );
            },
          },
          {
            accessor: `ton.${i}`,
            title: 'Ton',
            width: 100,
            render: () => {
              return (
                <FormController
                  control="number-input-table-rhf"
                  name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.targetPlans.${i}.ton`}
                />
              );
            },
          },
        ],
      };
      return group;
    },
    [unitCapacityPlanIndex, materialIndex]
  );

  const renderOtherGroup = fields?.map(renderOtherColumnCallback);

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
                control="material-select-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.materialId`}
                label="material"
                withAsterisk
                clearable
                skipQuery={tabs !== 'unitCapacityPlan'}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="text-input"
                label="fleetName"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.fleet`}
                withAsterisk
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="class-select-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.classId`}
                label="heavyEquipmentClass"
                withAsterisk
                clearable
                searchable
                limit={null}
                skipQuery={tabs !== 'unitCapacityPlan'}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="location-select-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.frontId`}
                label="front"
                categoryId={`${process.env.NEXT_PUBLIC_FRONT_ID}`}
                withAsterisk
                clearable
                searchable
                limit={null}
                skipQuery={tabs !== 'unitCapacityPlan'}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="number-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.physicalAvailability`}
                label="physicalAvailability"
                withAsterisk
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="number-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.useOfAvailability`}
                label="useOfAvailability"
                withAsterisk
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="number-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.effectiveWorkingHour`}
                label="effectiveWorkingHour"
                withAsterisk
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="number-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.distance`}
                label="distance"
                withAsterisk
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="number-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.dumpTruckCount`}
                label="dumpTruckCount"
                withAsterisk
                precision={0}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <MantineDataTable
                tableProps={{
                  highlightOnHover: true,
                  withColumnBorders: true,
                  groups: [
                    {
                      id: 'day',
                      title: 'Hari',
                      style: { textAlign: 'center' },
                      columns: [
                        { accessor: 'activity', width: 300, title: '' },
                      ],
                    },
                    ...(renderOtherGroup ?? []),
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

export default InputGroupMaterial;
