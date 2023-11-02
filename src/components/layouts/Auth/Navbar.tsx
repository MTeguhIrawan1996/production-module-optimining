import { Container, Header } from '@mantine/core';
import { IconAB } from '@tabler/icons-react';
import * as React from 'react';

const Navbar = () => {
  return (
    <Header
      height={70}
      px="md"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      withBorder={false}
    >
      <Container
        fluid
        w="100%"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconAB size={50} className="textPrimaryClr" />
      </Container>
    </Header>
  );
};

export default Navbar;
