import { ApolloProvider } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from 'mantine';
import { SessionProvider } from 'next-auth/react';
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
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const { client } = getClient();
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={false}>
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
      <GoogleAnalytics gaId={GA_ID || ''} />
      <GoogleTagManager gtmId={GA_ID || ''} />
    </SessionProvider>
  );
}
