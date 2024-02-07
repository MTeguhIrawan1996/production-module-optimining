import { ApolloProvider } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from 'mantine';
import React from 'react';

import getClient from '@/services/graphql/apollo-client';

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function WithProviders({ children }: Props) {
  const { client } = getClient();
  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            ...theme,
            colorScheme: 'light',
          }}
        >
          {children}
        </MantineProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
