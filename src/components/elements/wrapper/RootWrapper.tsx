import { Stack, StackProps } from '@mantine/core';
import * as React from 'react';

interface IRootWrapperProps {
  children: React.ReactNode;
  stackProps?: StackProps;
}

const RootWrapper: React.FC<IRootWrapperProps> = ({ children, stackProps }) => {
  const { spacing = 'md', pb = 'lg' } = stackProps || {};
  return (
    <Stack
      w="100%"
      pb={pb}
      spacing={spacing}
      sx={{ position: 'relative' }}
      {...stackProps}
    >
      {children}
    </Stack>
  );
};

export default RootWrapper;
