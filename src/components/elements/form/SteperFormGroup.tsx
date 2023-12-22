import {
  Checkbox,
  Flex,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
} from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from '@tabler/icons-react';
import * as React from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormController,
  ModalConfirmation,
  PrimaryButton,
} from '@/components/elements';
import { IPrimaryButtonProps } from '@/components/elements/button/PrimaryButton';
import { IModalConfirmationProps } from '@/components/elements/modal/ModalConfirmation';

import { ControllerGroup } from '@/types/global';

export interface ISteps {
  name: string;
  fields: ControllerGroup[];
  submitButton?: Partial<IPrimaryButtonProps>;
  nextButton?: Partial<IPrimaryButtonProps>;
  prevButton?: Partial<IPrimaryButtonProps>;
  validationButton?: Partial<IPrimaryButtonProps>;
  backButton?: Partial<IPrimaryButtonProps>;
}

interface ISteperFormGroupProps {
  methods: UseFormReturn<any>;
  submitForm: SubmitHandler<any>;
  steps: ISteps[];
  modalConfirmation?: IModalConfirmationProps;
  active: number;
  setActive: (value: React.SetStateAction<number>) => void;
}

const SteperFormGroup: React.FC<ISteperFormGroupProps> = ({
  methods,
  submitForm,
  modalConfirmation,
  steps,
  active,
  setActive,
}) => {
  const { t } = useTranslation('default');

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitForm)}>
        <Stepper
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          allowNextStepsSelect={false}
          size="xs"
          w="100%"
          pt={32}
          styles={() => ({
            steps: {
              width: '60%',
              marginRight: 'auto',
              marginLeft: 'auto',
            },
          })}
        >
          {steps.map((val, i) => {
            return (
              <Stepper.Step label={val.name} key={i}>
                <Flex
                  gap={32}
                  direction="column"
                  align="flex-end"
                  pb={32}
                  px={32}
                >
                  {val.fields.map(
                    (
                      {
                        formControllers,
                        groupCheckbox,
                        group,
                        enableGroupLabel,
                        actionGroup,
                        actionOuterGroup,
                      },
                      key
                    ) => {
                      const { addButton, deleteButton } = actionGroup || {};
                      const {
                        addButton: addButtonOuter,
                        deleteButton: deleteButtonOuter,
                      } = actionOuterGroup || {};
                      return (
                        <Flex
                          key={`${key}${group}`}
                          gap={32}
                          direction="column"
                          align="flex-end"
                          w="100%"
                        >
                          {addButtonOuter || deleteButtonOuter ? (
                            <Group spacing="xs" position="right">
                              {addButtonOuter ? (
                                <PrimaryButton
                                  leftIcon={<IconPlus size="20px" />}
                                  {...addButtonOuter}
                                />
                              ) : null}
                              {deleteButtonOuter ? (
                                <PrimaryButton
                                  color="red.5"
                                  variant="light"
                                  styles={(theme) => ({
                                    root: {
                                      border: `1px solid ${theme.colors.red[3]}`,
                                    },
                                  })}
                                  {...deleteButtonOuter}
                                />
                              ) : null}
                            </Group>
                          ) : null}
                          <Paper p={24} withBorder w="100%">
                            <Stack spacing={8}>
                              {enableGroupLabel || actionGroup ? (
                                <SimpleGrid cols={2} mb="sm">
                                  {enableGroupLabel && (
                                    <Text
                                      component="span"
                                      fw={500}
                                      fz={16}
                                      sx={{ alignSelf: 'center' }}
                                    >
                                      {group}
                                    </Text>
                                  )}
                                  {actionGroup ? (
                                    <Group spacing="xs" position="right">
                                      {addButton ? (
                                        <PrimaryButton
                                          leftIcon={<IconPlus size="20px" />}
                                          {...addButton}
                                        />
                                      ) : null}
                                      {deleteButton ? (
                                        <PrimaryButton
                                          color="red.5"
                                          variant="light"
                                          styles={(theme) => ({
                                            root: {
                                              border: `1px solid ${theme.colors.red[3]}`,
                                            },
                                          })}
                                          {...deleteButton}
                                        />
                                      ) : null}
                                    </Group>
                                  ) : null}
                                </SimpleGrid>
                              ) : null}
                              <Grid gutter="md">
                                {formControllers.map(
                                  ({ colSpan = 12, name, ...rest }, index) => {
                                    return (
                                      <Grid.Col
                                        span={colSpan}
                                        key={`${index}${name}`}
                                      >
                                        <FormController name={name} {...rest} />
                                      </Grid.Col>
                                    );
                                  }
                                )}
                              </Grid>
                              {groupCheckbox && (
                                <Checkbox
                                  styles={(theme) => ({
                                    label: {
                                      paddingLeft: theme.spacing.xs,
                                    },
                                  })}
                                  size="xs"
                                  fz={14}
                                  fw={400}
                                  radius={2}
                                  mt={22}
                                  {...groupCheckbox}
                                />
                              )}
                            </Stack>
                          </Paper>
                        </Flex>
                      );
                    }
                  )}
                  <Group
                    w="100%"
                    mt="lg"
                    position={
                      val.backButton || val.prevButton ? 'apart' : 'right'
                    }
                  >
                    {val.backButton ? (
                      <PrimaryButton
                        label={t('commonTypography.back')}
                        type="button"
                        variant="outline"
                        leftIcon={<IconChevronLeft size="1rem" />}
                        {...val.backButton}
                      />
                    ) : null}
                    {val.prevButton ? (
                      <PrimaryButton
                        label={t('commonTypography.prev')}
                        type="button"
                        variant="outline"
                        leftIcon={<IconChevronLeft size="1rem" />}
                        {...val.prevButton}
                      />
                    ) : null}
                    <Group spacing="xs">
                      {val.validationButton ? (
                        <PrimaryButton
                          label={t('commonTypography.validation')}
                          type="button"
                          variant="outline"
                          {...val.validationButton}
                        />
                      ) : null}
                      {val.nextButton ? (
                        <PrimaryButton
                          label={t('commonTypography.next')}
                          type="button"
                          variant="outline"
                          rightIcon={<IconChevronRight size="1rem" />}
                          {...val.nextButton}
                        />
                      ) : null}
                      {val.submitButton ? (
                        <PrimaryButton
                          label={t('commonTypography.save')}
                          type="submit"
                          {...val.submitButton}
                        />
                      ) : null}
                    </Group>
                  </Group>
                </Flex>
              </Stepper.Step>
            );
          })}
          {modalConfirmation ? (
            <ModalConfirmation {...modalConfirmation} />
          ) : null}
        </Stepper>
      </form>
    </FormProvider>
  );
};

export default SteperFormGroup;
