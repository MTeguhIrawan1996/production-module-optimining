import { Button, ButtonProps } from '@mantine/core';
import * as React from 'react';

export type IPrimaryButtonProps = {
  label: string;
} & ButtonProps &
  Omit<React.ComponentPropsWithRef<'button'>, 'color'>;

const PrimaryButton: React.FC<IPrimaryButtonProps> = (props) => {
  const { label, fz = 14, radius = 8, fw = 400, ref, ...rest } = props;
  return (
    <Button radius={radius} fw={fw} fz={fz} ref={ref} {...rest}>
      {label}
    </Button>
  );
};

export default PrimaryButton;
