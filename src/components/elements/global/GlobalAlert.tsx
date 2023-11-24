import { Alert, AlertProps } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import * as React from 'react';

interface IGlobalAlertProps extends Omit<AlertProps, 'children'> {
  description: string;
}

const GlobalAlert: React.FunctionComponent<IGlobalAlertProps> = ({
  description,
  withCloseButton = false,
  radius = 4,
  ...rest
}) => {
  return (
    <Alert
      icon={<IconAlertCircle size="1rem" />}
      withCloseButton={withCloseButton}
      radius={radius}
      styles={(theme) => ({
        icon: {
          marginRight: theme.spacing.xs,
        },
        title: {
          marginBottom: 2,
        },
      })}
      {...rest}
    >
      {description}
    </Alert>
  );
};

export default GlobalAlert;
