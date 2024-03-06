import {
  Alert,
  AlertProps,
  Divider,
  MantineNumberSize,
  Modal,
  ModalHeaderProps,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import * as React from 'react';

import { PrimaryButton } from '@/components/elements';
import { IPrimaryButtonProps } from '@/components/elements/button/PrimaryButton';

interface IAlertType extends Omit<AlertProps, 'children'> {
  type: 'alert';
  description: string;
}
interface IDefaultType {
  type: 'default';
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface IModalConfirmationProps {
  isOpenModalConfirmation: boolean;
  actionModalConfirmation: () => void;
  size?: MantineNumberSize;
  radius?: MantineNumberSize;
  actionButton: IPrimaryButtonProps;
  backButton?: IPrimaryButtonProps;
  withDivider?: boolean;
  modalType: IDefaultType | IAlertType;
  modalHeader?: ModalHeaderProps;
}

const ModalConfirmation: React.FC<IModalConfirmationProps> = ({
  modalType,
  isOpenModalConfirmation,
  actionModalConfirmation,
  size = 'lg',
  radius = 'md',
  actionButton,
  backButton,
  withDivider,
  modalHeader,
}) => {
  const {
    variant = 'subtle',
    fz = 14,
    label = 'Kembali',
    color = 'dark',
    onClick = actionModalConfirmation,
    fw = 400,
  } = backButton || {};

  const { p = 0, ...restModalHeader } = modalHeader || {};
  return (
    <Modal.Root
      opened={isOpenModalConfirmation}
      onClose={actionModalConfirmation}
      radius={radius}
      size={size}
    >
      <Modal.Overlay opacity={0.2} />
      <Modal.Content px="md" py="md">
        <Modal.Header p={p} {...restModalHeader}>
          {modalType.type === 'default' ? (
            <Stack w="100%" spacing={4}>
              {/* <Modal.CloseButton /> */}
              <Title fw={700} fz={18} w="100%" color="gray.8" align="center">
                {modalType.title}
              </Title>
              {modalType.description ? (
                <Text fw={400} fz={14} color="gray.6" align="center">
                  {modalType.description}
                </Text>
              ) : null}
            </Stack>
          ) : null}
          {modalType.type === 'alert' ? (
            <Alert
              w="100%"
              icon={modalType.icon ?? <IconAlertCircle size="1rem" />}
              title={modalType.title ?? 'title'}
              color={modalType.color ?? 'red'}
              withCloseButton
              onClick={actionModalConfirmation}
              radius="xs"
              styles={(theme) => ({
                icon: {
                  marginRight: theme.spacing.xs,
                },
                title: {
                  marginBottom: 2,
                },
              })}
              {...modalType}
            >
              {modalType.description ?? 'description'}
            </Alert>
          ) : null}
        </Modal.Header>
        {withDivider ? <Divider my="sm" /> : null}
        <Modal.Body p={0}>
          <Stack spacing="xs">
            <PrimaryButton {...actionButton} />
            <PrimaryButton
              label={label}
              variant={variant}
              fz={fz}
              color={color}
              fw={fw}
              onClick={onClick}
              styles={(theme) => ({
                root: {
                  '&:hover': {
                    backgroundColor: theme.colors.gray[1],
                  },
                },
              })}
            />
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ModalConfirmation;
