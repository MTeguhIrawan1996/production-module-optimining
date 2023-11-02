import { IPermission } from '@/types/global';

declare module 'next-auth' {
  interface Session {
    user: {
      login: {
        accessToken: {
          token: string;
          exp: number;
        };
        refreshToken: {
          token: string;
          exp: number;
        };
      };
      role: string;
      permission: IPermission[];
    };
  }
  interface User {
    login: {
      accessToken: {
        token: string;
        exp: number;
      };
      refreshToken: {
        token: string;
        exp: number;
      };
    };
    role: string;
    permission: IPermission[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    login: {
      accessToken: {
        token: string;
        exp: number;
      };
      refreshToken: {
        token: string;
        exp: number;
      };
    };
    role: string;
    permission: IPermission[];
  }
}
