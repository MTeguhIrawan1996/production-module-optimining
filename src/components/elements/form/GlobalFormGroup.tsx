import {
  Checkbox,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
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

import { FormController, PrimaryButton } from '@/components/elements';
import { IPrimaryButtonProps } from '@/components/elements/button/PrimaryButton';

import { ControllerGroup } from '@/types/global';

interface IGlobalFormGroupProps {
  methods: UseFormReturn<any>;
  submitForm: SubmitHandler<any>;
  field: ControllerGroup[];
  submitButton?: Partial<IPrimaryButtonProps>;
  nextButton?: Partial<IPrimaryButtonProps>;
  validationButton?: Partial<IPrimaryButtonProps>;
  backButton?: Partial<IPrimaryButtonProps>;
  children?: React.ReactNode;
}

const GlobalFormGroup: React.FC<IGlobalFormGroupProps> = ({
  methods,
  field,
  submitForm,
  submitButton,
  nextButton,
  validationButton,
  backButton,
  children,
}) => {
  const { t } = useTranslation('default');
  const {
    label = t('commonTypography.save'),
    type = 'submit',
    ...rest
  } = submitButton || {};
  const {
    label: backButtonLabel = t('commonTypography.back'),
    ...restBackButton
  } = backButton || {};
  const {
    label: validationButtonLabel = t('commonTypography.validation'),
    ...restValidationButton
  } = validationButton || {};
  const {
    label: nextButtonLabel = t('commonTypography.next'),
    ...restNextButton
  } = nextButton || {};

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitForm)}>
        <Stack spacing={32} p={32}>
          {field.map(
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
                <Paper p={24} key={i} withBorder>
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
          {children && (
            <Paper p={24} withBorder>
              {children}
            </Paper>
          )}
          {/* Submit Button */}
          <Group position={backButton ? 'apart' : 'right'}>
            {backButton ? (
              <PrimaryButton
                label={backButtonLabel}
                type="button"
                variant="outline"
                leftIcon={<IconChevronLeft size="1rem" />}
                {...restBackButton}
              />
            ) : null}
            <Group spacing="xs">
              {validationButton ? (
                <PrimaryButton
                  label={validationButtonLabel}
                  type="button"
                  variant="outline"
                  {...restValidationButton}
                />
              ) : null}
              {nextButton ? (
                <PrimaryButton
                  label={nextButtonLabel}
                  type="button"
                  variant="outline"
                  rightIcon={<IconChevronRight size="1rem" />}
                  {...restNextButton}
                />
              ) : null}
              {submitButton ? (
                <PrimaryButton label={label} type={type} {...rest} />
              ) : null}
            </Group>
          </Group>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default GlobalFormGroup;
