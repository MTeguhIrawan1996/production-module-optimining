import { Group, Paper, Text, useMantineTheme } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import * as React from 'react';

interface IPaperLinkProps {
  label: string;
  href?: string;
}

const PaperLink: React.FC<IPaperLinkProps> = ({ label, href }) => {
  const theme = useMantineTheme();

  return (
    <Link href={href ?? '/'}>
      <Paper
        radius="xs"
        p="md"
        withBorder
        className="hoverShadow transition-all"
      >
        <Group position="apart">
          <Text component="span" fz="md" fw={500} color="gray.7">
            {label}
          </Text>
          <IconChevronRight size="1.2rem" color={theme.colors.gray[7]} />
        </Group>
      </Paper>
    </Link>
  );
};

export default PaperLink;
