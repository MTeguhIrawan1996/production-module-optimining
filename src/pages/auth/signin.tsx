import * as React from 'react';

import { AuthPage } from '@/components/features';
import { AuthLayout } from '@/components/layouts';

const Auth = () => {
  return <AuthPage />;
};

export default Auth;

Auth.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
