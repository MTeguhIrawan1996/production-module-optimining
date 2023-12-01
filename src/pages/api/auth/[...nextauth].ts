import dayjs from 'dayjs';
import { GraphQLClient } from 'graphql-request';
import Cookies from 'js-cookie';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import {
  LOGIN_USER,
  LoginUserResponse,
} from '@/services/graphql/mutation/auth/useLoginUser';
import {
  IRefreshToken,
  REFRESH_TOKEN,
} from '@/services/graphql/mutation/auth/useRefreshToken';

const storedLanguage = Cookies.get('language');
const initialLanguage = storedLanguage || 'id';

const client = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_API_URL || '',
  {
    headers: {
      'Accept-Language': initialLanguage,
    },
  }
);

// const graphQLClient = new GraphQLClient(
//   process.env.NEXT_PUBLIC_GRAPHQL_API_URL || '',
//   {
//     method: `GET`,
//     headers: {
//       'Accept-Language': initialLanguage,
//     },
//     jsonSerializer: {
//       parse: JSON.parse,
//       stringify: JSON.stringify,
//     },
//   }
// );

async function refreshToken(token: JWT) {
  const authorization = token ? `Bearer ${token.login.refreshToken.token}` : '';

  client.setHeaders({
    authorization,
  });
  const { refreshToken } = await client.request<IRefreshToken>(REFRESH_TOKEN);

  return refreshToken;
}
// async function permission(token: JWT) {
//   const authorization = token ? `Bearer ${token.login.accessToken.token}` : '';

//   graphQLClient.setHeaders({
//     authorization,
//   });
//   try {
//     const { authUser } = await graphQLClient.request<IGetPermissionResponse>(
//       PERMISSION_USER
//     );

//     return authUser;
//   } catch (error) {
//     return null;
//   }
// }

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/',
  },
  providers: [
    // Email & Password
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        usernameOrEmail: {
          label: 'UsernameOrEmail',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials): Promise<any> {
        try {
          const data = await client.request<LoginUserResponse>(LOGIN_USER, {
            usernameOrEmail: credentials?.usernameOrEmail,
            password: credentials?.password,
          });
          if (data) {
            return data;
          } else {
            return null;
          }
        } catch (err: any) {
          if (err.response)
            err.response.errors?.forEach(({ extensions }) => {
              throw new Error(JSON.stringify(extensions));
            });
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const now = dayjs().unix();

      if (trigger === 'update') {
        return { ...token, ...session.user };
      }

      if (user) {
        return {
          ...token,
          ...user,
        };
      }
      if (now < token.login?.accessToken?.exp - 10 * 60) {
        // if (token) {
        //   const permissionRes = await permission(token);
        //   if (permissionRes) {
        //     const arrayOfString = permissionRes.role.permissions.data.map(
        //       (val) => val.slug
        //     );
        //     const permission = await encodeFc(arrayOfString);
        //     return {
        //       ...token,
        //       permission: permission,
        //     };
        //   }
        //   return token;
        // }
        return token;
      }

      const res = await refreshToken(token);
      if (res) {
        return {
          ...token,
          login: {
            ...res,
          },
        };
      }
    },
    async session({ session, token }) {
      session.user = token;
      return session; // The return type will match the one returned in `useSession()`
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
