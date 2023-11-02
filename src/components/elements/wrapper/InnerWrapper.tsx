import {
  Box,
  Container,
  ContainerProps,
  TextProps,
  Title,
} from '@mantine/core';
import * as React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IInnerWrapperProps {
  titleProps?: {
    title: string;
  } & TextProps;
  containerProps?: ContainerProps;
}

const InnerWrapper: React.FC<IInnerWrapperProps> = ({
  children,
  titleProps,
  containerProps,
}) => {
  const { title, ...rest } = titleProps || {};
  const {
    size = 'xl',
    pt = 'md',
    pb = 'md',
    px = 0,
    ...restContainerProps
  } = containerProps || {};
  return (
    <Box component="section" w="100%" px={32}>
      <Container size={size} pt={pt} pb={pb} px={px} {...restContainerProps}>
        {titleProps && (
          <Title order={1} size="h2" fw={500} {...rest}>
            {title}
          </Title>
        )}
        {children}
      </Container>
    </Box>
  );
};

export default InnerWrapper;
