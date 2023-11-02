import { Button, Flex, Paper, Stack, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';

interface IAuthCardProps {
  children: React.ReactNode;
  titleCard?: string;
  enableBack?: {
    href: string | null;
  };
}

const AuthCard: React.FC<IAuthCardProps> = ({
  titleCard,
  children,
  enableBack,
}) => {
  const router = useRouter();

  return (
    <Paper
      shadow="md"
      radius="sm"
      px="xl"
      py={{ base: 40, lg: 90 }}
      w={{ base: 400, lg: 550 }}
    >
      <Stack spacing="xl" align="center" w="100%">
        <Title
          order={1}
          fz={{ base: 24, lg: 34 }}
          align="center"
          fw={700}
          color="brand"
        >
          {titleCard ?? 'Masuk'}
        </Title>
        <Stack w="100%" spacing={8}>
          {children}
          {enableBack ? (
            <Flex align="center" w="100%">
              <Button
                variant="subtle"
                radius={8}
                onClick={() =>
                  enableBack.href ? router.push(enableBack.href) : router.back()
                }
                w="100%"
                fz={14}
                fw={400}
                color="dark.6"
              >
                Kembali
              </Button>
            </Flex>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AuthCard;
