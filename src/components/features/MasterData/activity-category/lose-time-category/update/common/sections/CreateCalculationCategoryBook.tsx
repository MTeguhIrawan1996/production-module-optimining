import {
  ActionIcon,
  Flex,
  Grid,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconChevronLeft,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  PrimaryButton,
  SelectActivityCategoryRhf,
  SelectInputRhf,
  TextInputRhf,
} from '@/components/elements';

import { useCreateActivityCategory } from '@/services/graphql/mutation/activity-category/useCreateActivityCategory';
import { IMutationCalculationValues } from '@/services/graphql/mutation/activity-category/useUpdateActivityCategory';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ITab } from '@/types/global';

interface IUpdateLoseTimeCategoryBookProps {
  tab?: ITab;
}

const CreateCalculationCategoryBook: React.FC<
  IUpdateLoseTimeCategoryBookProps
> = ({ tab: tabProps }) => {
  const { t } = useTranslation('default');
  const router = useRouter();

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationCalculationValues>({
    // resolver: zodResolver(loseTimeMutationValidation),
    defaultValues: {
      name: '',
      countFormula: {
        parameters: [
          {
            categoryId: '',
            operator: null,
            order: 1,
          },
        ],
      },
    },
    mode: 'onBlur',
  });
  const { fields, remove, append } = useFieldArray({
    name: 'countFormula.parameters',
    control: methods.control,
  });
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */

  const [executeCreate, { loading }] = useCreateActivityCategory({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('activityCategory.calculationSuccessCreateMessage'),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push(`/master-data/activity-category?tab=${tabProps}`);
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IMutationCalculationValues>(error);
        if (errorArry.length) {
          errorArry.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: error.message,
          icon: <IconX />,
        });
      }
    },
  });
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationCalculationValues> = async (
    data
  ) => {
    await executeCreate({
      variables: {
        type: 'count_formula',
        name: data.name,
        countFormula: data.countFormula,
      },
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
          <Flex gap={32} direction="column" align="flex-end" p={22}>
            <Paper p={24} withBorder w="100%">
              <Grid gutter="md">
                <Grid.Col span={12}>
                  <TextInputRhf
                    control="text-input"
                    name="name"
                    label="category"
                    withAsterisk
                  />
                </Grid.Col>
              </Grid>
            </Paper>
            <Paper p={24} withBorder w="100%">
              <Stack spacing={8}>
                <SimpleGrid cols={2} mb="sm">
                  <Text
                    component="span"
                    fw={500}
                    fz={16}
                    sx={{ alignSelf: 'center' }}
                  >
                    {t('commonTypography.calculation')}
                  </Text>
                  <Group spacing="xs" position="right">
                    <PrimaryButton
                      leftIcon={<IconPlus size="20px" />}
                      label="Tambah Variable"
                      onClick={() => {
                        append({
                          operator: '+',
                          categoryId: '',
                          order: fields.length + 1,
                        });
                      }}
                    />
                  </Group>
                </SimpleGrid>
                <Grid gutter="md">
                  <Grid.Col span={12}>
                    <ScrollArea
                      sx={{
                        overflow: 'unset',
                      }}
                    >
                      <Group
                        align="flex-end"
                        w="100%"
                        noWrap
                        pb="xs"
                        spacing="xs"
                      >
                        {fields.map((val, i) => (
                          <React.Fragment key={val.id}>
                            {val.operator !== '' && val.operator ? (
                              <SelectInputRhf
                                control="select-input"
                                w={70}
                                data={[
                                  {
                                    label: '+',
                                    value: '+',
                                  },
                                  {
                                    label: '-',
                                    value: '-',
                                  },
                                  {
                                    label: '/',
                                    value: '/',
                                  },
                                  {
                                    label: 'x',
                                    value: '*',
                                  },
                                ]}
                                defaultValue="+"
                                name={`countFormula.parameters.${i}.operator`}
                                label="operation"
                              />
                            ) : null}
                            <SelectActivityCategoryRhf
                              w={250}
                              control="select-activity-category-rhf"
                              name={`countFormula.parameters.${i}.categoryId`}
                              label="variable"
                              withAsterisk
                            />
                            {i === fields.length - 1 && fields.length !== 1 ? (
                              <ActionIcon
                                variant="light"
                                color="red.6"
                                radius={4}
                                onClick={() => {
                                  remove(fields.length - 1);
                                }}
                              >
                                <IconTrash size="1rem" />
                              </ActionIcon>
                            ) : null}
                          </React.Fragment>
                        ))}
                      </Group>
                    </ScrollArea>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Paper>
            <Group w="100%" position="apart">
              <PrimaryButton
                label={t('commonTypography.back')}
                type="button"
                variant="outline"
                leftIcon={<IconChevronLeft size="1rem" />}
                onClick={() =>
                  router.push(`/master-data/activity-category?tab=${tabProps}`)
                }
              />
              <PrimaryButton
                label={t('commonTypography.save')}
                type="submit"
                loading={loading}
              />
            </Group>
          </Flex>
        </form>
      </FormProvider>
    </DashboardCard>
  );
};

export default CreateCalculationCategoryBook;
