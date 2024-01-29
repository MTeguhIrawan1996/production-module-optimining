import {
  Flex,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DataTableColumnGroup } from 'mantine-datatable';
import * as React from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormController,
  MantineDataTable,
  PrimaryButton,
} from '@/components/elements';
import { IPrimaryButtonProps } from '@/components/elements/button/PrimaryButton';

dayjs.extend(isoWeek);

interface ITargetPlan {
  id: string;
  day: number | '';
  rate: number | '';
  ton: number | '';
}

export type IInputGroupMaterialProps = {
  addButtonOuter?: Partial<IPrimaryButtonProps>;
  deleteButtonInner?: Partial<IPrimaryButtonProps>;
  label?: string;
  methods: UseFormReturn<any, any, undefined>;
  unitCapacityPlanIndex: number;
  materialIndex: number;
  name: string;
};

const table = [
  {
    id: '9d7b6df5-aa1e-4203-bfa8-7d9464e331cb',
    activity: 'Kegiatan',
  },
];

const InputGroupMaterial: React.FunctionComponent<IInputGroupMaterialProps> = ({
  addButtonOuter,
  deleteButtonInner,
  label = 'material',
  methods,
  unitCapacityPlanIndex,
  materialIndex,
}) => {
  const { t } = useTranslation('default');

  const {
    label: addButtonOuterLabel = t('commonTypography.create'),
    ...restAddButtonOuter
  } = addButtonOuter || {};
  const {
    label: deleteButtonOuterLabel = t('commonTypography.delete'),
    ...restDeleteButtonOuter
  } = deleteButtonInner || {};

  const data = useWatch({
    name: `unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.targetPlans`,
    control: methods.control,
  });

  const renderOtherColumnCallback = React.useCallback(
    (obj: ITargetPlan, i: number) => {
      const group: DataTableColumnGroup<any> = {
        id: `${obj.day}`,
        title: dayjs()
          .isoWeekday(obj.day || 0)
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

  const renderOtherGroup = data?.map(renderOtherColumnCallback);

  return (
    <Flex gap={22} direction="column" align="flex-end" w="100%">
      <Group spacing="xs" position="right">
        <PrimaryButton
          leftIcon={<IconPlus size="20px" />}
          label={addButtonOuterLabel}
          {...restAddButtonOuter}
        />
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
            </Group>
          </SimpleGrid>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <FormController
                control="material-select-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.materialId`}
                label="material"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="text-input"
                label="fleet"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.fleet`}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="class-select-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.classId`}
                label="heavyEquipmentClass"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="location-select-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.frontId`}
                label="front"
                categoryId={`${process.env.NEXT_PUBLIC_FRONT_ID}`}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="number-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.physicalAvailability`}
                label="physicalAvailability"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="number-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.useOfAvailability`}
                label="useOfAvailability"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="number-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.effectiveWorkingHour`}
                label="effectiveWorkingHour"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="number-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.distance`}
                label="distance"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <FormController
                control="number-input"
                name={`unitCapacityPlans.${unitCapacityPlanIndex}.materials.${materialIndex}.dumpTruckCount`}
                label="dumpTruckCount"
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
                        { accessor: 'activity', width: 350, title: '' },
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
