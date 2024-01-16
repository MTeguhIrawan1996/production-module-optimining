import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Divider,
  Flex,
  Group,
  Paper,
  ScrollArea,
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
  ModalConfirmation,
  PrimaryButton,
  SelectActivityCategoryRhf,
  SelectInputRhf,
  TextInputRhf,
} from '@/components/elements';

import {
  IMutationHeavyEquipmentFormulaValues,
  useUpdateHeavyEquipmentFormula,
} from '@/services/graphql/mutation/heavy-equipment-formula/useUpdateHeavyEquipmentFormula';
import { useReadOneHeavyEquipmentFormula } from '@/services/graphql/query/heavy-equipment-formula/useReadOneHeavyEquipmentFormula';
import { heavyEquipmentFormulaMutationValidation } from '@/utils/form-validation/activity-category/activity-category-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ITab } from '@/types/global';

interface IUpdateHeavyEquipmentFormulaBookProps {
  tab?: ITab;
}

const UpdateHeavyEquipmentFormulaBook: React.FC<
  IUpdateHeavyEquipmentFormulaBookProps
> = ({ tab: tabProps }) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationHeavyEquipmentFormulaValues>({
    resolver: zodResolver(heavyEquipmentFormulaMutationValidation),
    defaultValues: {
      name: '',
      topFormula: {
        parameters: [
          {
            categoryId: '',
            operator: null,
            order: 1,
          },
        ],
      },
      bottomFormula: {
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
  const {
    fields: topFormulaFields,
    remove: topFormulaRemove,
    append: topFormulaAppend,
    replace: topFormulaReplace,
  } = useFieldArray({
    name: 'topFormula.parameters',
    control: methods.control,
  });
  const {
    fields: bottomFormulaFields,
    remove: bottomFormulaRemove,
    append: bottomFormulaAppend,
    replace: bottomFormulaReplace,
  } = useFieldArray({
    name: 'bottomFormula.parameters',
    control: methods.control,
  });
  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const { readOneHeavyEquipmentFormulaDataLoading } =
    useReadOneHeavyEquipmentFormula({
      variables: {
        id: id,
      },
      skip: !router.isReady,
      onCompleted: ({ heavyEquipmentDataFormula }) => {
        const topFormulaParameterValue =
          heavyEquipmentDataFormula.topFormula?.parameters.map((val) => ({
            categoryId: val.category.id,
            operator: val.operator,
            order: val.order,
          }));
        const bottomFormulaParameterValue =
          heavyEquipmentDataFormula.bottomFormula?.parameters.map((val) => ({
            categoryId: val.category.id,
            operator: val.operator,
            order: val.order,
          }));
        methods.setValue('name', heavyEquipmentDataFormula.name);
        if (topFormulaParameterValue) {
          topFormulaReplace(topFormulaParameterValue);
        }
        if (bottomFormulaParameterValue) {
          bottomFormulaReplace(bottomFormulaParameterValue);
        }
      },
    });
  const [executeUpdate, { loading }] = useUpdateHeavyEquipmentFormula({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t(
          'activityCategory.heavyEquipmentFormulaSuccessUpdateMessage'
        ),
        icon: <IconCheck />,
      });
      methods.reset();
      router.push(`/master-data/activity-category?tab=${tabProps}`);
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        setIsOpenConfirmation((prev) => !prev);
        const errorArry =
          errorBadRequestField<IMutationHeavyEquipmentFormulaValues>(error);
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
  const handleSubmitForm: SubmitHandler<
    IMutationHeavyEquipmentFormulaValues
  > = async (data) => {
    await executeUpdate({
      variables: {
        id,
        name: data.name,
        topFormula: data.topFormula,
        bottomFormula: data.bottomFormula,
      },
    });
  };
  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0} isLoading={readOneHeavyEquipmentFormulaDataLoading}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
          <Flex gap={32} direction="column" align="flex-end" p={22}>
            <Paper p={24} withBorder w="100%">
              <Stack spacing="xs">
                <Text
                  component="span"
                  fw={500}
                  fz={16}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {t('commonTypography.calculation')}
                </Text>
                <Group align="center">
                  <TextInputRhf
                    control="text-input"
                    name="name"
                    label="formula"
                    disabled
                  />
                  <Text fz={22} fw="xl" component="span">
                    =
                  </Text>
                  <ScrollArea
                    sx={{
                      overflow: 'unset',
                    }}
                    maw={500}
                  >
                    <Stack spacing={6} sx={{ width: 'fit-content' }} p="xs">
                      <Group spacing={6} align="flex-end" noWrap>
                        {topFormulaFields.map((val, i) => {
                          return (
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
                                  name={`topFormula.parameters.${i}.operator`}
                                  label="operation"
                                />
                              ) : null}
                              <SelectActivityCategoryRhf
                                w={200}
                                control="select-activity-category-rhf"
                                name={`topFormula.parameters.${i}.categoryId`}
                                label="variable"
                                withAsterisk
                                clearable
                                searchable
                                types={null}
                              />
                              {i === topFormulaFields.length - 1 &&
                              topFormulaFields.length !== 1 ? (
                                <ActionIcon
                                  variant="light"
                                  color="red.6"
                                  radius={4}
                                  onClick={() => {
                                    topFormulaRemove(
                                      topFormulaFields.length - 1
                                    );
                                  }}
                                >
                                  <IconTrash size="1rem" />
                                </ActionIcon>
                              ) : null}
                              {i === topFormulaFields.length - 1 &&
                              topFormulaFields.length >= 1 ? (
                                <ActionIcon
                                  variant="light"
                                  color="brand"
                                  radius={4}
                                  onClick={() => {
                                    topFormulaAppend({
                                      operator: '+',
                                      categoryId: '',
                                      order: topFormulaFields.length + 1,
                                    });
                                  }}
                                >
                                  <IconPlus size="1rem" />
                                </ActionIcon>
                              ) : null}
                            </React.Fragment>
                          );
                        })}
                      </Group>
                      <Divider mt={4} size="sm" />
                      <Group spacing={6} align="flex-end" noWrap>
                        {bottomFormulaFields.map((val, i) => {
                          return (
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
                                  name={`bottomFormula.parameters.${i}.operator`}
                                  label="operation"
                                />
                              ) : null}
                              <SelectActivityCategoryRhf
                                w={200}
                                control="select-activity-category-rhf"
                                name={`bottomFormula.parameters.${i}.categoryId`}
                                label="variable"
                                withAsterisk
                                clearable
                                searchable
                                types={null}
                              />
                              {i === bottomFormulaFields.length - 1 &&
                              bottomFormulaFields.length !== 1 ? (
                                <ActionIcon
                                  variant="light"
                                  color="red.6"
                                  radius={4}
                                  onClick={() => {
                                    bottomFormulaRemove(
                                      bottomFormulaFields.length - 1
                                    );
                                  }}
                                >
                                  <IconTrash size="1rem" />
                                </ActionIcon>
                              ) : null}
                              {i === bottomFormulaFields.length - 1 &&
                              bottomFormulaFields.length >= 1 ? (
                                <ActionIcon
                                  variant="light"
                                  color="brand"
                                  radius={4}
                                  onClick={() => {
                                    bottomFormulaAppend({
                                      operator: '+',
                                      categoryId: '',
                                      order: bottomFormulaFields.length + 1,
                                    });
                                  }}
                                >
                                  <IconPlus size="1rem" />
                                </ActionIcon>
                              ) : null}
                            </React.Fragment>
                          );
                        })}
                      </Group>
                    </Stack>
                  </ScrollArea>
                  <Text fz={22} fw={500} component="span">
                    X 100%
                  </Text>
                </Group>
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
                type="button"
                onClick={async () => {
                  const output = await methods.trigger(undefined, {
                    shouldFocus: true,
                  });
                  if (output) setIsOpenConfirmation((prev) => !prev);
                }}
              />
            </Group>
          </Flex>
          <ModalConfirmation
            isOpenModalConfirmation={isOpenConfirmation}
            actionModalConfirmation={() =>
              setIsOpenConfirmation((prev) => !prev)
            }
            actionButton={{
              label: t('commonTypography.yes'),
              type: 'button',
              onClick: handleConfirmation,
              loading: loading,
            }}
            backButton={{
              label: 'Batal',
            }}
            modalType={{
              type: 'default',
              title: t('commonTypography.alertTitleConfirmUpdate'),
            }}
            withDivider={true}
          />
        </form>
      </FormProvider>
    </DashboardCard>
  );
};

export default UpdateHeavyEquipmentFormulaBook;
