import { useRouter } from 'next/router';
import * as React from 'react';

export const useRouterReady = () => {
  const [isReady, setIsReady] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setIsReady(router.isReady);
  }, [router.isReady]);

  return isReady;
};
