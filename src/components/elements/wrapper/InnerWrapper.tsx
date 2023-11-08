import {
  Box,
  Container,
  ContainerProps,
  Title,
  TitleProps,
} from '@mantine/core';
import * as React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IInnerWrapperProps {
  titleProps?: {
    title: string;
  } & TitleProps;
  containerProps?: ContainerProps;
}

const InnerWrapper: React.FC<IInnerWrapperProps> = ({
  children,
  titleProps,
  containerProps,
}) => {
  const {
    title,
    fw = 500,
    order = 1,
    size: sizeTitle = 'h2',
    ...rest
  } = titleProps || {};
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
          <Title order={order} size={sizeTitle} fw={fw} {...rest}>
            {title}
          </Title>
        )}
        {children}
      </Container>
    </Box>
  );
};

export default InnerWrapper;
