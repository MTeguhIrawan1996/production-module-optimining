import {
  Flex,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DataTableColumnGroup } from 'mantine-datatable';
import * as React from 'react';
import {
  FieldArrayWithId,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';

import {
  FormController,
  MantineDataTable,
  NumberInputTableRhf,
  PrimaryButton,
} from '@/components/elements';

dayjs.extend(isoWeek);

interface IInputGroupMaterialProps {}

const table = [
  {
    id: '9d7b6df5-aa1e-4203-bfa8-7d9464e331cb',
    activity: 'Kegiatan',
  },
];

interface IFooProps {
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
      targetPlans: {
        id: string;
        day: number | '';
        rate: number | '';
        ton: number | '';
      }[];
    }[];
  }[];
}

const InputGroupMaterial: React.FunctionComponent<
  IInputGroupMaterialProps
> = () => {
  const methods = useForm<IFooProps>({
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

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { fields, replace, update } = useFieldArray({
    name: `unitCapacityPlans.${0}.materials.${0}.targetPlans`,
    control: methods.control,
    keyName: 'targetPlanId',
  });

  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleSubmitForm: SubmitHandler<any> = async (data) => {};

  const renderOtherColumnCallback = React.useCallback(
    (
      obj: FieldArrayWithId<
        IFooProps,
        'unitCapacityPlans.0.materials.0.targetPlans',
        'targetPlanId'
      >,
      i: number
    ) => {
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
                <Tooltip
                  label={`${i}`}
                  hidden={false}
                  color="red"
                  position="right"
                >
                  <NumberInputTableRhf
                    control="number-input-table-rhf"
                    name={`unitCapacityPlans.0.materials.0.targetPlans.${i}.rate`}
                  />
                </Tooltip>
              );
            },
          },
          {
            accessor: `ton.${i}`,
            title: 'Ton',
            width: 100,
            render: () => {
              return (
                <Tooltip
                  label={`${i}`}
                  hidden={false}
                  color="red"
                  position="right"
                >
                  <NumberInputTableRhf
                    control="number-input-table-rhf"
                    name={`unitCapacityPlans.0.materials.0.targetPlans.${i}.ton`}
                  />
                </Tooltip>
              );
            },
          },
        ],
      };
      return group;
    },
    []
  );

  const renderOtherGroup = fields?.map(renderOtherColumnCallback);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
        <Flex gap={22} direction="column" align="flex-end" w="100%">
          <Group spacing="xs" position="right">
            <PrimaryButton leftIcon={<IconPlus size="20px" />} label="Add" />
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
                  Label group
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
                    label="Delete"
                  />
                </Group>
              </SimpleGrid>
              <Grid gutter="md">
                <Grid.Col span={6}>
                  <FormController
                    control="text-input"
                    name="text"
                    label="Contoh"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <FormController
                    control="text-input"
                    name="text"
                    label="Contoh"
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
