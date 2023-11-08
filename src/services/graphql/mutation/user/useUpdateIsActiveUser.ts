import { ApolloError, gql, useMutation } from '@apollo/client';

export const UPDATE_STATUS_USER = gql`
  mutation UpdateStatusUser($id: String!, $status: Boolean) {
    updateStatusUser(id: $id, status: $status) {
      id
      isActive
    }
  }
`;

export interface IUpdateStatusUserRequest {
  id: string;
  status: boolean;
}

interface IUpdateStatusUserResponse {
  updateStatusUser: {
    id: string;
    isActive: boolean;
  };
}

export const useUpdateStatusUser = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateStatusUserResponse) => void;
}) => {
  return useMutation<IUpdateStatusUserResponse, IUpdateStatusUserRequest>(
    UPDATE_STATUS_USER,
    {
      onError,
      onCompleted,
    }
  );
};
