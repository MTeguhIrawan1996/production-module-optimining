import { createStyles, Group, Modal, ScrollArea } from '@mantine/core';
import * as React from 'react';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';

interface ISelectionButtonModalProps {
  isOpenSelectionModal: boolean;
  actionSelectionModal: () => void;
  firstButton: IPrimaryButtonProps;
  secondButton?: IPrimaryButtonProps;
}

const useStyles = createStyles((theme) => ({
  root: {
    height: 200,
    width: 350,
    '&:hover': {
      backgroundColor: theme.colors.gray[1],
    },
  },
  label: {
    color: theme.colors.dark[5],
  },
}));

const SelectionButtonModal: React.FC<ISelectionButtonModalProps> = ({
  isOpenSelectionModal,
  actionSelectionModal,
  firstButton,
  secondButton,
}) => {
  const { classes } = useStyles();

  return (
    <Modal.Root
      opened={isOpenSelectionModal}
      onClose={actionSelectionModal}
      radius="md"
      size="auto"
    >
      <Modal.Overlay opacity={0.2} />
      <Modal.Content>
        <Modal.Header>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body p={0}>
          <ScrollArea>
            <Group
              spacing="lg"
              align="center"
              position="center"
              pb={90}
              pt={30}
              px={60}
            >
              <PrimaryButton
                variant="white"
                fz={18}
                className="drop-shadow-xl"
                classNames={classes}
                {...firstButton}
              />
              {secondButton ? (
                <PrimaryButton
                  fz={18}
                  variant="white"
                  className="drop-shadow-xl"
                  classNames={classes}
                  {...secondButton}
                />
              ) : null}
            </Group>
          </ScrollArea>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default SelectionButtonModal;
