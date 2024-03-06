import { Button, ButtonProps, Modal, ScrollArea, Stack } from '@mantine/core';
import * as React from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import PrimaryButton from '@/components/elements/button/PrimaryButton';
import TextAreaInput from '@/components/elements/input/TextAreaInputRhf';

export type INotValidButtonProps = {
  methods: UseFormReturn<any>;
  submitForm: SubmitHandler<any>;
  textAreaName: string;
  textAreaLabel?: string;
} & ButtonProps;

const NotValidButton: React.FC<INotValidButtonProps> = (props) => {
  const { t } = useTranslation('default');
  const [isOpenNotValidationConfirmation, setIsOpenNotValidationConfirmation] =
    React.useState<boolean>(false);
  const {
    fz = 14,
    radius = 8,
    fw = 400,
    loading,
    textAreaName = 'textarea',
    textAreaLabel = 'textarea',
    methods,
    submitForm,
    ...rest
  } = props;

  const handleIsNotValid = async () => {
    await methods.handleSubmit(submitForm)();
  };

  return (
    <>
      <Button
        radius={radius}
        fw={fw}
        fz={fz}
        onClick={() => setIsOpenNotValidationConfirmation((prev) => !prev)}
        {...rest}
      >
        {t('commonTypography.notValid')}
      </Button>
      <Modal.Root
        opened={isOpenNotValidationConfirmation}
        onClose={() => setIsOpenNotValidationConfirmation((prev) => !prev)}
        size="lg"
        radius="xs"
        centered
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Body>
            <ScrollArea h={260}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(submitForm)}>
                  <Stack>
                    <TextAreaInput
                      control="text-area-input"
                      name={textAreaName}
                      label={textAreaLabel}
                      withAsterisk
                    />
                    <Stack spacing="xs">
                      <PrimaryButton
                        label={t('commonTypography.invalidData')}
                        type="button"
                        color="red"
                        onClick={handleIsNotValid}
                        loading={loading}
                      />
                      <PrimaryButton
                        label={t('commonTypography.cancelled')}
                        variant="subtle"
                        fz={14}
                        color="dark"
                        fw={400}
                        onClick={() =>
                          setIsOpenNotValidationConfirmation((prev) => !prev)
                        }
                        styles={(theme) => ({
                          root: {
                            '&:hover': {
                              backgroundColor: theme.colors.gray[1],
                            },
                          },
                        })}
                      />
                    </Stack>
                  </Stack>
                </form>
              </FormProvider>
            </ScrollArea>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};

export default NotValidButton;
