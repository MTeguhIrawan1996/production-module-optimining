// import { gql } from '@apollo/client';
import { gql } from 'graphql-request';

export const LOGIN_USER = gql`
  mutation LoginUser($usernameOrEmail: String!, $password: String!) {
    login(
      loginInput: { usernameOrEmail: $usernameOrEmail, password: $password }
    ) {
      accessToken {
        token
        exp
      }
      refreshToken {
        token
        exp
      }
    }
  }
`;

export interface LoginUserResponse {
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
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}
