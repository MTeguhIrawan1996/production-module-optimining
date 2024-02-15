import {
  MantineNumberSize,
  Modal,
  ScrollArea,
  ScrollAreaProps,
  Text,
} from '@mantine/core';
import * as React from 'react';

interface IGlobalModalProps {
  children: React.ReactNode;
  scrollAreaProps?: ScrollAreaProps;
  isOpenModal: boolean;
  actionModal: () => void;
  label?: string;
  modalSize?: MantineNumberSize;
}

const GlobalModal: React.FunctionComponent<IGlobalModalProps> = ({
  children,
  scrollAreaProps,
  actionModal,
  isOpenModal,
  label,
  modalSize = '100%',
}) => {
  return (
    <Modal.Root
      opened={isOpenModal}
      onClose={actionModal}
      centered
      radius="xs"
      size={modalSize}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header py="sm">
          {label ? (
            <Text component="span" fz={18} fw={500}>
              {label}
            </Text>
          ) : null}
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <ScrollArea offsetScrollbars {...scrollAreaProps}>
            {children}
          </ScrollArea>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default GlobalModal;
