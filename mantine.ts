import { keyframes, MantineProviderProps } from '@mantine/core';

export const pulse = keyframes({
  '50%': { opacity: 0.5 },
});

export const theme: MantineProviderProps['theme'] = {
  // fontFamily: 'Cooming soon, cursive',
  fontFamily: 'Inter, sans-serif',
  spacing: {
    xs: '0.75rem', // 12px
    sm: '1rem', // 16px
    md: '1.5rem', // 24px
    lg: '2rem', // 32px
    xl: '2.5rem', // 40px
  },
  radius: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    xl: '1.25rem', // 20px
  },
  // defaultRadius: 'sm',
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
  },
  components: {
    Container: {
      defaultProps: {
        sizes: {
          xs: 576,
          sm: 768,
          md: 992,
          lg: 1200,
          xl: 1400,
        },
      },
    },
    Badge: {
      defaultProps: {
        px: '0.5rem',
      },
    },
    // # Input Components
    TextInput: {
      defaultProps: {
        styles: (theme) => ({
          input: {
            '&[data-disabled="true"]': {
              backgroundColor: theme.colors.dark[0],
              color: theme.colors.dark[6],
              '::placeholder': {
                color: theme.colors.dark[5],
              },
            },
          },
        }),
      },
    },
    Select: {
      defaultProps: {
        radius: 'sm',
        styles: (theme) => ({
          item: {
            borderRadius: theme.spacing.xs,
          },
          dropdown: {
            borderRadius: theme.spacing.xs,
          },
          input: {
            '&[data-disabled="true"]': {
              backgroundColor: theme.colors.dark[0],
              color: theme.colors.dark[6],
              '::placeholder': {
                color: theme.colors.dark[5],
              },
            },
          },
        }),
      },
    },
    DatePickerInput: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Alert: {
      defaultProps: {
        p: 'sm',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
  },
  headings: {
    // properties for all headings\
    // fontFamily: 'Inter, sans-serif',
    fontWeight: 600,

    // properties for individual headings, all of them are optional
    sizes: {
      h1: { fontSize: '2.125rem' }, // 34px
      h2: { fontSize: '1.625rem' }, // 26px
      h3: { fontSize: '1.375rem' }, // 22px
      h4: { fontSize: '1.125rem' }, // 18px
      h5: { fontSize: '1rem' }, // 16px
      h6: { fontSize: '0.875rem' }, // 14px
    },
  },
  colors: {
    brand: [
      '#E6FCF5',
      '#C3FAE8',
      '#96F2D7',
      '#63E6BE',
      '#38D9A9',
      '#20C997',
      '#12B886',
      '#0CA678',
      '#099268',
      '#087F5B',
    ],
    dark: [
      '#f8f9fa',
      '#f1f3f5',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#868e96',
      '#495057',
      '#343a40',
      '#212529',
    ],
  },
  primaryColor: 'brand',
  primaryShade: 6,
  black: '#495057',
  white: '#fff',
  colorScheme: 'light',

  globalStyles: (theme) => ({
    '.primaryHover': {
      '&:hover': {
        backgroundColor: theme.colors.brand[3],
      },
    },
    '.textPrimaryHover': {
      '&:hover': {
        color: theme.colors.brand[5],
        fontWeight: 600,
      },
    },
    '.hoverShadow': {
      '&:hover': {
        boxShadow:
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
    },
    '.shadow': {
      boxShadow:
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
    '.shadow-md': {
      boxShadow:
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
    '.shadow-lg': {
      boxShadow:
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
    '.shadow-xl': {
      boxShadow:
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    '.shadow-2xl': {
      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    },
    '.drop-shadow': {
      filter:
        'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))',
    },
    '.drop-shadow-lg': {
      filter:
        'drop-shadow(0 0 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
    },
    '.drop-shadow-xl': {
      filter:
        'drop-shadow(0 0 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))',
    },
    '.drop-shadow-2xl': {
      filter: 'drop-shadow(0 0 25px rgb(0 0 0 / 0.15))',
    },
    '.animated-pulse': {
      animation: `${pulse} 3s ease-in-out infinite`,
    },
    '.figureBgAnimation': {
      backgroundColor: theme.colors.gray[3],
    },
    '.blur-none': {
      filter: 'blur(0)',
    },
    '.blur-xl': {
      filter: 'blur(24px)',
    },
    '.scale-100': {
      transform: 'scale(1)',
    },
    '.scale-105': {
      transform: 'scale(1.05)',
    },
    '.grayscale-0': {
      filter: 'grayscale(0)',
    },
    '.grayscale': {
      filter: 'grayscale(100%)',
    },
    '.ease-in-out': {
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '.duration-700': {
      transitionDuration: '700ms',
    },
    '.transition-all': {
      transitionProperty: 'all',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDuration: '150ms',
    },
  }),
};
