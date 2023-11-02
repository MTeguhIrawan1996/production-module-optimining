import { Group } from '@mantine/core';
import * as React from 'react';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';

interface IGlobalActionTableProps {
  actionRead?: Omit<IPrimaryButtonProps, 'label'>;
  actionUpdate?: Omit<IPrimaryButtonProps, 'label'>;
  actionDelete?: Omit<IPrimaryButtonProps, 'label'>;
}

const GlobalActionTable: React.FC<IGlobalActionTableProps> = ({
  actionDelete,
  actionRead,
  actionUpdate,
}) => {
  return (
    <Group spacing={4} align="center" position="center">
      {actionRead ? (
        <PrimaryButton
          label="Lihat"
          compact
          variant="light"
          color="blue.3"
          styles={(theme) => ({
            root: {
              border: `1px solid ${theme.colors.blue[2]}`,
            },
          })}
          {...actionRead}
        />
      ) : null}
      {actionUpdate ? (
        <PrimaryButton
          label="Edit"
          compact
          variant="light"
          color="brand.6"
          styles={(theme) => ({
            root: {
              border: `1px solid ${theme.colors.brand[3]}`,
            },
          })}
          {...actionUpdate}
        />
      ) : null}
      {actionDelete ? (
        <PrimaryButton
          label="Hapus"
          compact
          variant="light"
          color="red.6"
          styles={(theme) => ({
            root: {
              border: `1px solid ${theme.colors.red[3]}`,
            },
          })}
          {...actionDelete}
        />
      ) : null}
    </Group>
  );
};

export default GlobalActionTable;
