// eslint-disable-next-line unused-imports/no-unused-imports
import { JWT } from 'next-auth/jwt';

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
      permission: string;
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
    permission: string;
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
    permission: string;
  }
}
