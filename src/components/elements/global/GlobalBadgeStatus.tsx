import { Badge, BadgeProps, Paper } from '@mantine/core';
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
  const Circle = ({ color }: { color: string }) => (
    <Paper
      component="span"
      bg={color}
      h={6}
      w={6}
      sx={{ borderRadius: '100%' }}
    />
  );
  return (
    <Badge
      radius={radius}
      color={color}
      leftSection={<Circle color={`${color}`} />}
      {...rest}
    >
      {label}
    </Badge>
  );
};

export default GlobalBadgeStatus;
