import { Button, ButtonProps, Modal, ScrollArea, Stack } from '@mantine/core';
import * as React from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import PrimaryButton from '@/components/elements/button/PrimaryButton';
import TextAreaInput from '@/components/elements/input/TextAreaInputRhf';

export type IRejectButtonProps = {
  methods: UseFormReturn<any>;
  submitForm: SubmitHandler<any>;
  textAreaName: string;
  textAreaLabel?: string;
} & ButtonProps;

const RejectButton: React.FC<IRejectButtonProps> = (props) => {
  const { t } = useTranslation('default');
  const [isOpenRejectationConfirmation, setIsOpenRejectationConfirmation] =
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

  const handleIsReject = async () => {
    await methods.handleSubmit(submitForm)();
    setIsOpenRejectationConfirmation((prev) => !prev);
  };

  return (
    <>
      <Button
        radius={radius}
        fw={fw}
        fz={fz}
        onClick={() => setIsOpenRejectationConfirmation((prev) => !prev)}
        {...rest}
      >
        {t('commonTypography.reject')}
      </Button>
      <Modal.Root
        opened={isOpenRejectationConfirmation}
        onClose={() => setIsOpenRejectationConfirmation((prev) => !prev)}
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
                        label={t('commonTypography.reject')}
                        type="button"
                        color="red"
                        onClick={handleIsReject}
                        loading={loading}
                      />
                      <PrimaryButton
                        label={t('commonTypography.cancelled')}
                        variant="subtle"
                        fz={14}
                        color="dark"
                        fw={400}
                        onClick={() =>
                          setIsOpenRejectationConfirmation((prev) => !prev)
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

export default RejectButton;
