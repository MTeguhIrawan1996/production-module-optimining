import { ApolloProvider } from '@apollo/client';
import type { ColorScheme } from '@mantine/core';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from 'mantine';
import { ContextMenuProvider } from 'mantine-contextmenu';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { RealViewportProvider } from 'next-real-viewport';

import '../styles/globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';

import getClient from '@/services/graphql/apollo-client';
import useScrollRestoration from '@/utils/hooks/detect-route/useScrollRestoration';
import useTheme from '@/utils/hooks/useTheme';

import type { DeepPartial } from '@/types/util';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout | any;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const { client } = getClient();

  useScrollRestoration();
  const { state } = useTheme();

  const getLayout = Component.getLayout ?? ((page) => page);

  const title = 'OneDev Starter Template';
  const description = 'OneDev';
  const url = `${process.env.NEXT_PUBLIC_URL}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="apple-touch-icon" sizes="57x57" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="60x60" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="114x114" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="144x144" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/meta-tag-img.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="/meta-tag-img.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider session={pageProps.session}>
        <ApolloProvider client={client}>
          <QueryClientProvider client={queryClient}>
            <RealViewportProvider>
              <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                  ...theme,
                  colorScheme: state.value as DeepPartial<ColorScheme>,
                }}
              >
                <ContextMenuProvider>
                  {getLayout(<Component {...pageProps} />)}
                </ContextMenuProvider>
                <Notifications
                  position="top-center"
                  notificationMaxHeight={400}
                />
              </MantineProvider>
            </RealViewportProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
