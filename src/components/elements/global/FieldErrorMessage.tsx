import { Icon } from '@iconify/react';
import { Box, Text } from '@mantine/core';
import * as React from 'react';

interface IFieldErrorMessageProps {
  children: React.ReactNode;
  color?: string;
}

const FieldErrorMessage: React.FC<IFieldErrorMessageProps> = ({
  children,
  color,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Icon
        icon="tabler:alert-circle"
        width={16}
        height={16}
        style={{ marginRight: 5 }}
        color={color}
      />
      <Text span fw={400} fz={12} color={color}>
        {children}
      </Text>
    </Box>
  );
};

export default FieldErrorMessage;
