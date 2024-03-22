import {
  Checkbox,
  createStyles,
  Flex,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
} from '@mantine/core';
import { Box } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import * as React from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormController,
  ModalConfirmation,
  NextImageFill,
  PrimaryButton,
} from '@/components/elements';
import { IPrimaryButtonProps } from '@/components/elements/button/PrimaryButton';
import { IModalConfirmationProps } from '@/components/elements/modal/ModalConfirmation';

import { EmptyStateImage } from '@/utils/constants/image';

import { ControllerGroup } from '@/types/global';

interface IEmptyStateProps {
  actionButton?: IPrimaryButtonProps;
  title: string;
}
export interface ISteps {
  name: string;
  fields: ControllerGroup[];
  submitButton?: Partial<IPrimaryButtonProps>;
  outerButton?: Partial<IPrimaryButtonProps>;
  nextButton?: Partial<IPrimaryButtonProps>;
  prevButton?: Partial<IPrimaryButtonProps>;
  validationButton?: Partial<IPrimaryButtonProps>;
  backButton?: Partial<IPrimaryButtonProps>;
  emptyStateProps?: IEmptyStateProps;
}

interface ISteperFormGroupProps {
  methods: UseFormReturn<any>;
  submitForm: SubmitHandler<any>;
  steps: ISteps[];
  modalConfirmation?: IModalConfirmationProps;
  active: number;
  setActive: (value: React.SetStateAction<number>) => void;
}

const useStyles = createStyles((theme) => ({
  figure: {
    width: 280,
    height: 280,
    borderRadius: theme.radius.xs,
    overflow: 'hidden',
  },
  image: {
    backgroundPosition: 'center',
  },
}));

const SteperFormGroup: React.FC<ISteperFormGroupProps> = ({
  methods,
  submitForm,
  modalConfirmation,
  steps,
  active,
  setActive,
}) => {
  const { t } = useTranslation('default');
  const { classes } = useStyles();

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
            const {
              label: outerButtonLabel = t('commonTypography.create'),
              ...restOuterButtonLabel
            } = val.outerButton || {};
            return (
              <Stepper.Step label={val.name} key={i}>
                <Flex
                  gap={32}
                  direction="column"
                  align="flex-end"
                  p={22}
                  // bg="red"
                >
                  {val.outerButton ? (
                    <PrimaryButton
                      label={outerButtonLabel}
                      // leftIcon={<IconPlus size="20px" />}
                      {...restOuterButtonLabel}
                    />
                  ) : null}
                  {val.fields.length >= 1 ? (
                    val.fields.map(
                      (
                        {
                          formControllers,
                          groupCheckbox,
                          group,
                          enableGroupLabel,
                          actionGroup,
                          actionOuterGroup,
                          actionOuterGroupBottom,
                          renderItem,
                          paperProps,
                        },
                        key
                      ) => {
                        const { addButton, deleteButton } = actionGroup || {};
                        const {
                          addButton: addButtonOuter,
                          deleteButton: deleteButtonOuter,
                        } = actionOuterGroup || {};
                        const {
                          addButton: addButtonOuterBottom,
                          deleteButton: deleteButtonOuterBottom,
                        } = actionOuterGroupBottom || {};
                        const {
                          withBorder = true,
                          p: pPaper = 24,
                          w: wPaper = '100%',
                          ...restPaperProps
                        } = paperProps || {};
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
                                    // leftIcon={<IconPlus size="20px" />}
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
                            <Paper
                              p={pPaper}
                              withBorder={withBorder}
                              w={wPaper}
                              {...restPaperProps}
                            >
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
                                            // leftIcon={<IconPlus size="20px" />}
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
                                    (
                                      { colSpan = 12, key, name, ...rest },
                                      index
                                    ) => {
                                      const indexName = `${index + 1}.${name}`;
                                      return (
                                        <Grid.Col
                                          span={colSpan}
                                          key={key ? `${key}` : indexName}
                                        >
                                          <FormController
                                            name={name}
                                            {...rest}
                                          />
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
                            {addButtonOuterBottom || deleteButtonOuterBottom ? (
                              <Group spacing="xs" position="right">
                                {addButtonOuterBottom ? (
                                  <PrimaryButton
                                    // leftIcon={<IconPlus size="20px" />}
                                    {...addButtonOuterBottom}
                                  />
                                ) : null}
                                {deleteButtonOuterBottom ? (
                                  <PrimaryButton
                                    color="red.5"
                                    variant="light"
                                    styles={(theme) => ({
                                      root: {
                                        border: `1px solid ${theme.colors.red[3]}`,
                                      },
                                    })}
                                    {...deleteButtonOuterBottom}
                                  />
                                ) : null}
                              </Group>
                            ) : null}
                          </Flex>
                        );
                      }
                    )
                  ) : (
                    <Stack
                      align="center"
                      spacing="xs"
                      py="md"
                      w="100%"
                      sx={{ zIndex: 10 }}
                    >
                      <NextImageFill
                        alt="EmptyState"
                        src={EmptyStateImage}
                        figureClassName={classes.figure}
                      />
                      <Stack spacing="xs" align="center">
                        <Text fw={700} fz={26} color="dark.4" align="center">
                          {val.emptyStateProps?.title}
                        </Text>
                        {val.emptyStateProps &&
                        val.emptyStateProps?.actionButton ? (
                          <Box
                            sx={{
                              pointerEvents: 'auto',
                            }}
                          >
                            <PrimaryButton
                              // leftIcon={<IconPlus size="20px" />}
                              {...val.emptyStateProps?.actionButton}
                            />
                          </Box>
                        ) : null}
                      </Stack>
                    </Stack>
                  )}
                  <Group
                    w="100%"
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
        </Stepper>
        {modalConfirmation ? (
          <ModalConfirmation {...modalConfirmation} />
        ) : null}
      </form>
    </FormProvider>
  );
};

export default SteperFormGroup;
