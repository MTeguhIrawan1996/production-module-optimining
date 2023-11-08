import { Flex } from '@mantine/core';
import * as React from 'react';

interface IAuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<IAuthWrapperProps> = ({ children }) => {
  return (
    <Flex justify="center" align="center" h="100%">
      {children}
    </Flex>
  );
};

export default AuthWrapper;
