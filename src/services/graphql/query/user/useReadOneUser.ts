import { ApolloError, gql, useQuery } from '@apollo/client';

import { IFile } from '@/types/global';

export const READ_ONE_USER = gql`
  query ReadUser($id: String!) {
    user(id: $id) {
      id
      name
      username
      email
      isActive
      phoneNumber
      photo {
        originalFileName
        url
      }
      role {
        id
        name
        slug
      }
    }
  }
`;

export interface IUserData {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  isActive: boolean;
  photo: Pick<IFile, 'url' | 'originalFilename'> | null;
  role: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface IUserResponse {
  user: IUserData;
}

export interface IUserRequest {
  id: string;
}

export const useReadOneUser = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IUserRequest;
  skip?: boolean;
  onCompleted?: (data: IUserResponse) => void;
}) => {
  const {
    data: userData,
    loading: userDataLoading,
    refetch,
  } = useQuery<IUserResponse, IUserRequest>(READ_ONE_USER, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    userData: userData?.user,
    userDataLoading,
    userDataRefetch: refetch,
  };
};
