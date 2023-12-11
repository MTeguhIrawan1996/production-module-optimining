import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_OB_RITAGE = gql`
  mutation DeleteOverburdenRitage($id: String!) {
    deleteOverburdenRitage(id: $id)
  }
`;

export interface IDeleteOverburdenRitageRequest {
  id: string;
}

interface IDeleteOverburdenRitageResponse {
  deleteOverburdenRitage: boolean;
}

export const useDeleteOverburdenRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteOverburdenRitageResponse) => void;
}) => {
  return useMutation<
    IDeleteOverburdenRitageResponse,
    IDeleteOverburdenRitageRequest
  >(DELETE_OB_RITAGE, {
    onError,
    onCompleted,
  });
};
