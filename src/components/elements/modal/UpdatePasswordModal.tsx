import { Group, Modal, Stack } from '@mantine/core';
import * as React from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormController, PrimaryButton } from '@/components/elements';

import { ControllerProps } from '@/types/global';

interface IModalProps {
  isOpen: boolean;
  onActionUpdatePassword: () => void;
  methods: UseFormReturn<any>;
  submitForm: SubmitHandler<any>;
  field: ControllerProps[];
  isLoading?: boolean;
}

const UpdatePasswordModal: React.FC<IModalProps> = ({
  isOpen,
  onActionUpdatePassword,
  submitForm,
  methods,
  field,
  isLoading,
}) => {
  const { t } = useTranslation('allComponents');
  return (
    <Modal.Root opened={isOpen} onClose={onActionUpdatePassword} radius="md">
      <Modal.Overlay opacity={0.2} />
      <Modal.Content px="sm" py="xs">
        <Modal.Header>
          <Modal.Title
            fw={600}
            fz={16}
            sx={(theme) => ({
              color: theme.colors.brand[6],
            })}
            w="100%"
          >
            {t('components.modal.updatePasswordModal.title')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(submitForm)}>
              <Stack spacing="sm">
                {field.map(({ name, ...value }, i) => {
                  return <FormController key={i} name={name} {...value} />;
                })}
              </Stack>
              <Group
                mt="md"
                align="center"
                position="center"
                w="100%"
                spacing="sm"
              >
                <PrimaryButton
                  label="Kembali"
                  variant="light"
                  sx={{
                    flex: 1,
                  }}
                  onClick={onActionUpdatePassword}
                />
                <PrimaryButton
                  label="Simpan"
                  type="submit"
                  sx={{
                    flex: 1,
                  }}
                  loading={isLoading}
                />
              </Group>
            </form>
          </FormProvider>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default UpdatePasswordModal;
