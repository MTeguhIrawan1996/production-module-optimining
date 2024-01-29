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
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormController,
  MantineDataTable,
  PrimaryButton,
} from '@/components/elements';
import { IPrimaryButtonProps } from '@/components/elements/button/PrimaryButton';

dayjs.extend(isoWeek);

interface IInputGroupMaterialProps {
  addButtonOuter?: Partial<IPrimaryButtonProps>;
  deleteButtonInner?: Partial<IPrimaryButtonProps>;
  label?: string;
}

const table = [
  {
    id: '9d7b6df5-aa1e-4203-bfa8-7d9464e331cb',
    activity: 'Kegiatan',
  },
];

interface ITargetPlan {
  id: string;
  day: number | '';
  rate: number | '';
  ton: number | '';
}

interface IUnitCapacityPlanProps {
  unitCapacityPlans: {
    id: string;
    locationIds: string[];
    activityName: string;
    materials: {
      id: string;
      materialId: string;
      fleet: number | '';
      classId: string;
      frontId: string;
      physicalAvailability: number | '';
      useOfAvailability: number | '';
      effectiveWorkingHour: number | '';
      distance: number | '';
      dumpTruckCount: number | '';
      targetPlans: ITargetPlan[];
    }[];
  }[];
}

const InputGroupMaterial: React.FunctionComponent<IInputGroupMaterialProps> = ({
  addButtonOuter,
  deleteButtonInner,
  label = 'material',
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

  const methods = useForm<IUnitCapacityPlanProps>({
    defaultValues: {
      unitCapacityPlans: [
        {
          id: '',
          locationIds: [],
          activityName: '',
          materials: [
            {
              id: '',
              materialId: '',
              fleet: '',
              classId: '',
              frontId: '',
              physicalAvailability: '',
              useOfAvailability: '',
              effectiveWorkingHour: '',
              distance: '',
              dumpTruckCount: '',
              targetPlans: [
                {
                  id: '',
                  day: 0,
                  rate: '',
                  ton: '',
                },
                {
                  id: '',
                  day: 1,
                  rate: '',
                  ton: '',
                },
                {
                  id: '',
                  day: 2,
                  rate: '',
                  ton: '',
                },
                {
                  id: '',
                  day: 3,
                  rate: '',
                  ton: '',
                },
                {
                  id: '',
                  day: 4,
                  rate: '',
                  ton: '',
                },
                {
                  id: '',
                  day: 5,
                  rate: '',
                  ton: '',
                },
                {
                  id: '',
                  day: 6,
                  rate: '',
                  ton: '',
                },
              ],
            },
          ],
        },
      ],
    },
    mode: 'onBlur',
  });

  const data = useWatch({
    name: `unitCapacityPlans.${0}.materials.${0}.targetPlans`,
    control: methods.control,
  });

  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleSubmitForm: SubmitHandler<any> = async (data) => {};

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
                  name={`unitCapacityPlans.0.materials.0.targetPlans.${i}.rate`}
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
                  name={`unitCapacityPlans.0.materials.0.targetPlans.${i}.ton`}
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

  const renderOtherGroup = data?.map(renderOtherColumnCallback);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
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
                    name={`unitCapacityPlans.${0}.materials.${0}.materialId`}
                    label="material"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <FormController
                    control="text-input"
                    label="fleet"
                    name={`unitCapacityPlans.${0}.materials.${0}.fleet`}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <FormController
                    control="class-select-input"
                    name={`unitCapacityPlans.${0}.materials.${0}.classId`}
                    label="heavyEquipmentClass"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <FormController
                    control="location-select-input"
                    name={`unitCapacityPlans.${0}.materials.${0}.frontId`}
                    label="front"
                    categoryId={`${process.env.NEXT_PUBLIC_FRONT_ID}`}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <FormController
                    control="number-input"
                    name={`unitCapacityPlans.${0}.materials.${0}.physicalAvailability`}
                    label="physicalAvailability"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <FormController
                    control="number-input"
                    name={`unitCapacityPlans.${0}.materials.${0}.useOfAvailability`}
                    label="useOfAvailability"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <FormController
                    control="number-input"
                    name={`unitCapacityPlans.${0}.materials.${0}.effectiveWorkingHour`}
                    label="effectiveWorkingHour"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <FormController
                    control="number-input"
                    name={`unitCapacityPlans.${0}.materials.${0}.distance`}
                    label="distance"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <FormController
                    control="number-input"
                    name={`unitCapacityPlans.${0}.materials.${0}.dumpTruckCount`}
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
      </form>
    </FormProvider>
  );
};

export default InputGroupMaterial;
