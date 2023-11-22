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
  validationButton?: Partial<IPrimaryButtonProps>;
  backButton?: Partial<IPrimaryButtonProps>;
}

interface ISteperFormGroupProps {
  methods: UseFormReturn<any>;
  submitForm: SubmitHandler<any>;
  steps: ISteps[];
  outerButton?: Partial<IPrimaryButtonProps>;
  modalConfirmation?: IModalConfirmationProps;
}

const SteperFormGroup: React.FC<ISteperFormGroupProps> = ({
  methods,
  submitForm,
  outerButton,
  modalConfirmation,
  steps,
}) => {
  const { t } = useTranslation('default');
  const [active, setActive] = React.useState(0);

  const {
    label: outerButtonLabel = t('commonTypography.create'),
    ...restOuterButtonLabel
  } = outerButton || {};

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitForm)}>
        <Flex gap={32} direction="column" align="flex-end" p={32}>
          {outerButton ? (
            <PrimaryButton
              label={outerButtonLabel}
              leftIcon={<IconPlus size="20px" />}
              {...restOuterButtonLabel}
            />
          ) : null}
          <Stepper
            active={active}
            onStepClick={setActive}
            breakpoint="sm"
            allowNextStepsSelect={false}
            size="xs"
            w="100%"
            styles={() => ({
              steps: {
                width: '60%',
                marginRight: 'auto',
                marginLeft: 'auto',
              },
            })}
          >
            {steps.map((val, i) => (
              <Stepper.Step label={val.name} key={i}>
                {val.fields.map(
                  (
                    {
                      formControllers,
                      groupCheckbox,
                      group,
                      enableGroupLabel,
                      actionGroup,
                    },
                    i
                  ) => {
                    const { addButton, deleteButton } = actionGroup || {};
                    return (
                      <Paper p={24} key={i} withBorder w="100%">
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
                                  <Grid.Col span={colSpan} key={index}>
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
                    );
                  }
                )}
                <Group
                  w="100%"
                  mt="lg"
                  position={val.backButton ? 'apart' : 'right'}
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
              </Stepper.Step>
            ))}
          </Stepper>
          {/* Submit Button */}
        </Flex>
        {modalConfirmation ? (
          <ModalConfirmation {...modalConfirmation} />
        ) : null}
      </form>
    </FormProvider>
  );
};

export default SteperFormGroup;
