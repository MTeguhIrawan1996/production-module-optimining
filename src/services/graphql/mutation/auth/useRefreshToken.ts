import { gql } from '@apollo/client';

export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
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

export interface IRefreshToken {
  refreshToken: {
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
