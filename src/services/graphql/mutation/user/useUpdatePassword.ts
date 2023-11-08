import { ApolloError, gql, useMutation } from '@apollo/client';

export const UPDATE_PASSWORD_USER = gql`
  mutation UpdateUserPassword(
    $id: String!
    $password: String!
    $confirmPassword: String!
  ) {
    updateUserPassword(
      updateUserPasswordInput: {
        id: $id
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
    }
  }
`;

export interface IUpdateUserPasswordRequest {
  id: string;
  password: string;
  confirmPassword: string;
}

interface IUpdateUserPasswordResponse {
  updateUserPassword: {
    id: string;
  };
}

export const useUpdateUserPassword = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateUserPasswordResponse) => void;
}) => {
  return useMutation<IUpdateUserPasswordResponse, IUpdateUserPasswordRequest>(
    UPDATE_PASSWORD_USER,
    {
      onError,
      onCompleted,
    }
  );
};
