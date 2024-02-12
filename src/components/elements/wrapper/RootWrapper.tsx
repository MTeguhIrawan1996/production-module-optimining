import { Box, Stack, StackProps } from '@mantine/core';
import i18n from 'i18n';
import * as React from 'react';

import Breadcrumb from '@/components/elements/global/Breadcrumb';
interface IRootWrapperProps {
  children: React.ReactNode;
  stackProps?: StackProps;
}

const RootWrapper: React.FC<IRootWrapperProps> = ({ children, stackProps }) => {
  const { spacing = 'md', pb = 'lg' } = stackProps || {};
  React.useEffect(() => {
    // i18n.init();
    i18n.changeLanguage('id');
  }, []);
  return (
    <Stack
      w="100%"
      pb={pb}
      spacing={spacing}
      sx={{ position: 'relative' }}
      {...stackProps}
    >
      <Box px={22} py={8} sx={{ zIndex: 1 }}>
        <Breadcrumb />
      </Box>

      {children}
    </Stack>
  );
};

export default RootWrapper;
