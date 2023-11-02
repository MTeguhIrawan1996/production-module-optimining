import { ApolloError, gql, useMutation } from '@apollo/client';

export const UPDATE_PASSWORD_AUTH_USER = gql`
  mutation UpdateAuthUserPassword(
    $oldPassword: String!
    $newPassword: String!
    $confirmPassword: String!
  ) {
    updateAuthUserPassword(
      updateAuthUserPasswordInput: {
        oldPassword: $oldPassword
        newPassword: $newPassword
        confirmPassword: $confirmPassword
      }
    )
  }
`;

export interface IUpdateAuthUserPasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface IUpdateAuthUserPasswordResponse {
  updateAuthUserPassword: boolean;
}

export const useUpdateAuthUserPassword = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateAuthUserPasswordResponse) => void;
}) => {
  return useMutation<
    IUpdateAuthUserPasswordResponse,
    IUpdateAuthUserPasswordRequest
  >(UPDATE_PASSWORD_AUTH_USER, {
    onError,
    onCompleted,
  });
};
