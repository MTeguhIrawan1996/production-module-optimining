import { ApolloError, gql, useQuery } from '@apollo/client';

import { IFile } from '@/types/global';

export const PROFILE_USER = gql`
  query ProfileUser {
    authUser {
      id
      name
      username
      email
      phoneNumber
      photo {
        fileName
        originalFileName
        url
      }
      role {
        id
        name
      }
    }
  }
`;

export interface IUserAuthResponse {
  authUser: IAuthUserData;
}

export interface IAuthUserData {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  photo: Pick<IFile, 'url' | 'originalFilename' | 'filename'> | null;
  role: {
    id: string;
    name: string;
  };
}

export const useReadAuthUser = ({
  onCompleted,
}: {
  onCompleted?: (data: IUserAuthResponse) => void;
}) => {
  const {
    data: userAuthData,
    loading: userAuthDataLoading,
    refetch,
  } = useQuery<IUserAuthResponse>(PROFILE_USER, {
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  return {
    userAuthData: userAuthData?.authUser,
    userAuthDataLoading,
    refetch,
  };
};
