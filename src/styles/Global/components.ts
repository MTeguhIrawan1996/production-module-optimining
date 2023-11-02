import { createStyles } from '@mantine/core';

const useComponentsStyle = createStyles((theme) => ({
  primaryLink: {
    display: 'inline-flex',
    alignItems: 'center',
    '&:hover': {
      color: theme.colors.brand[3],
    },
  },
}));

export default useComponentsStyle;
