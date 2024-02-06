import {
  Checkbox,
  Flex,
  FlexProps,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Switch,
  SwitchProps,
  Text,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
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

interface IGlobalFormGroupProps {
  methods: UseFormReturn<any>;
  submitForm: SubmitHandler<any>;
  field: ControllerGroup[];
  submitButton?: Partial<IPrimaryButtonProps>;
  outerButton?: Partial<IPrimaryButtonProps>;
  nextButton?: Partial<IPrimaryButtonProps>;
  validationButton?: Partial<IPrimaryButtonProps>;
  backButton?: Partial<IPrimaryButtonProps>;
  modalConfirmation?: IModalConfirmationProps;
  switchProps?: {
    switchItem: SwitchProps;
    label: string;
  };
  children?: React.ReactNode;
  flexProps?: FlexProps;
}

const GlobalFormGroup: React.FC<IGlobalFormGroupProps> = ({
  methods,
  field,
  submitForm,
  submitButton,
  outerButton,
  nextButton,
  validationButton,
  backButton,
  modalConfirmation,
  switchProps,
  children,
  flexProps,
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
  const {
    label: outerButtonLabel = t('commonTypography.create'),
    ...restOuterButtonLabel
  } = outerButton || {};

  const { p = 22, ...restFlexProps } = flexProps || {};

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitForm)}>
        <Flex
          gap={32}
          direction="column"
          align="flex-end"
          p={p}
          {...restFlexProps}
        >
          {switchProps ? (
            <Stack justify="flex-start" align="flex-start" w="100%" spacing={8}>
              <Text component="label" fw={400} fz={16}>
                {t(`components.field.${switchProps.label}`, {
                  ns: 'allComponents',
                })}
              </Text>
              <Switch
                size="md"
                styles={{
                  trackLabel: {
                    cursor: 'pointer',
                  },
                  thumb: {
                    cursor: 'pointer',
                  },
                }}
                {...switchProps.switchItem}
              />
            </Stack>
          ) : null}
          {outerButton ? (
            <PrimaryButton
              label={outerButtonLabel}
              // leftIcon={<IconPlus size="20px" />}
              {...restOuterButtonLabel}
            />
          ) : null}
          {field.map(
            (
              {
                formControllers,
                groupCheckbox,
                group,
                enableGroupLabel,
                actionGroup,
                actionOuterGroup,
                renderItem,
              },
              i
            ) => {
              const { addButton, deleteButton } = actionGroup || {};
              const {
                addButton: addButtonOuter,
                deleteButton: deleteButtonOuter,
                updateButton: updateButtonOuter,
              } = actionOuterGroup || {};
              return (
                <Flex
                  key={`${i}${group}`}
                  gap={22}
                  direction="column"
                  align="flex-end"
                  w="100%"
                >
                  {addButtonOuter || deleteButtonOuter || updateButtonOuter ? (
                    <Group spacing="xs" position="right">
                      {addButtonOuter ? (
                        <PrimaryButton
                          // leftIcon={<IconPlus size="20px" />}
                          {...addButtonOuter}
                        />
                      ) : null}
                      {updateButtonOuter ? (
                        <PrimaryButton
                          // leftIcon={<IconPencil size="20px" />}
                          {...updateButtonOuter}
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
                    <Stack spacing="md">
                      {enableGroupLabel || actionGroup ? (
                        <SimpleGrid cols={enableGroupLabel ? 2 : 1}>
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
                          ({ colSpan = 12, key, name, ...rest }, index) => {
                            const indexName = `${index + 1}.${name}`;
                            return (
                              <Grid.Col
                                span={colSpan}
                                key={key ? `${key}` : indexName}
                              >
                                <FormController name={name} {...rest} />
                              </Grid.Col>
                            );
                          }
                        )}
                        {renderItem ? renderItem() : null}
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
          {children && (
            <Paper p={24} withBorder>
              {children}
            </Paper>
          )}
          {/* Submit Button */}
          <Group w="100%" position={backButton ? 'apart' : 'right'}>
            {backButton ? (
              <PrimaryButton
                label={backButtonLabel}
                type="button"
                variant="outline"
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
                  {...restNextButton}
                />
              ) : null}
              {submitButton ? (
                <PrimaryButton label={label} type={type} {...rest} />
              ) : null}
            </Group>
          </Group>
        </Flex>
        {modalConfirmation ? (
          <ModalConfirmation {...modalConfirmation} />
        ) : null}
      </form>
    </FormProvider>
  );
};

export default GlobalFormGroup;
