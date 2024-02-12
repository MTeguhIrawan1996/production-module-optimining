import { Modal, ModalProps, rem } from '@mantine/core';
import React from 'react';

type DefaultModalProps = ModalProps & {
  centeredTitle?: boolean;
};

export const DefaultModal = ({
  size,
  withCloseButton = false,
  centeredTitle,
  ...rest
}: DefaultModalProps) => {
  const modalSize = React.useMemo(() => {
    switch (size) {
      case 'lg':
        return 1140;
      case 'md':
        return 800;
      case 'sm':
        return 500;
      case 'xs':
        return 400;
      case undefined:
        return 800;
      default:
        return size;
    }
  }, [size]);

  return (
    <Modal
      size={modalSize}
      withCloseButton={withCloseButton}
      radius="md"
      padding="xl"
      transitionProps={{ duration: 150, timingFunction: 'ease' }}
      overlayProps={{
        opacity: 0.2,
      }}
      styles={(theme) => ({
        header: {
          paddingBottom: '1.5rem',
          justifyContent: centeredTitle ? 'center' : undefined,
        },
        title: {
          fontSize: rem(16),
          lineHeight: 1.5,
          fontWeight: 600,
          color: theme.colors.dark[8],
          [theme.fn.largerThan('sm')]: {
            fontSize: rem(18),
          },
        },
      })}
      {...rest}
    ></Modal>
  );
};
