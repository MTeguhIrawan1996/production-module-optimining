import {
  Alert,
  AlertProps,
  Box,
  Container,
  ContainerProps,
  Title,
  TitleProps,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface IInnerWrapperProps {
  titleProps?: {
    title: string;
  } & TitleProps;
  containerProps?: ContainerProps;
  alertProps?: {
    description: string;
  } & Omit<AlertProps, 'children'>;
}

const InnerWrapper: React.FC<IInnerWrapperProps> = ({
  children,
  titleProps,
  containerProps,
  alertProps,
}) => {
  const { t } = useTranslation('default');
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
  const {
    title: titleAlert = t('commonTypography.information'),
    color = 'blue.6',
    radius = 4,
    withCloseButton = false,
    description,
    ...restAlertProps
  } = alertProps || {};
  return (
    <Box component="section" w="100%" px={32}>
      <Container size={size} pt={pt} pb={pb} px={px} {...restContainerProps}>
        {titleProps && (
          <Title order={order} size={sizeTitle} fw={fw} {...rest}>
            {title}
          </Title>
        )}
        {alertProps ? (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title={titleAlert}
            color={color}
            radius={radius}
            withCloseButton={withCloseButton}
            styles={(theme) => ({
              icon: {
                marginRight: theme.spacing.xs,
              },
              title: {
                marginBottom: 2,
              },
            })}
            {...restAlertProps}
          >
            {description}
          </Alert>
        ) : null}
        {children}
      </Container>
    </Box>
  );
};

export default InnerWrapper;
