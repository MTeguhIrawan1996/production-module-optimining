import { Badge, BadgeProps } from '@mantine/core';
import * as React from 'react';

interface IGlobalBadgeStatusProps extends BadgeProps {
  label: string;
}

const GlobalBadgeStatus: React.FC<IGlobalBadgeStatusProps> = ({
  label,
  color = 'blue.6',
  radius = 'xs',
  ...rest
}) => {
  return (
    <Badge radius={radius} color={color} {...rest}>
      {label}
    </Badge>
  );
};

export default GlobalBadgeStatus;
