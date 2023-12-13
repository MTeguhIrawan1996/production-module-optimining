import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_QUARRY_RITAGE = gql`
  mutation DeleteQuarryRitage($id: String!) {
    deleteQuarryRitage(id: $id)
  }
`;

export interface IDeleteQuarryRitageRequest {
  id: string;
}

interface IDeleteQuarryRitageResponse {
  deleteQuarryRitage: boolean;
}

export const useDeleteQuarryRitage = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteQuarryRitageResponse) => void;
}) => {
  return useMutation<IDeleteQuarryRitageResponse, IDeleteQuarryRitageRequest>(
    DELETE_QUARRY_RITAGE,
    {
      onError,
      onCompleted,
    }
  );
};
