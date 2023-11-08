import { AppShell, createStyles } from '@mantine/core';

import Navbar from './Navbar';

type LayoutProps = {
  children: React.ReactNode;
};

const useStyles = createStyles(() => ({
  root: {
    background: '#FFFFFF',
  },
}));

const AuthLayout = ({ children }: LayoutProps) => {
  const { classes } = useStyles();

  return (
    <AppShell classNames={classes} header={<Navbar />} padding={0}>
      {children}
    </AppShell>
  );
};

export default AuthLayout;
