import {
  Text,
  TextProps,
  UnstyledButton,
  UnstyledButtonProps,
} from '@mantine/core';
import * as React from 'react';

import useComponentsStyle from '@/styles/Global/components';

export type ITextButtonProps = {
  label: string;
  className?: string;
  buttonProps?: UnstyledButtonProps & React.ComponentPropsWithRef<'button'>;
} & TextProps;

const TextButton: React.FC<ITextButtonProps> = ({
  label,
  className,
  color = 'brand.5',
  fz = 14,
  fw = 400,
  buttonProps,
  ...rest
}) => {
  const { classes, cx } = useComponentsStyle();

  return (
    <UnstyledButton ref={buttonProps?.ref} {...buttonProps}>
      <Text
        component="span"
        className={cx(classes.primaryLink, className)}
        color={color}
        fw={fw}
        fz={fz}
        {...rest}
      >
        {label}
      </Text>
    </UnstyledButton>
  );
};
export default TextButton;
